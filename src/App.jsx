import { useEffect, useMemo, useRef, useState } from "react";
import JiraTickets from "./components/JiraTickets";
import SolutionCard from "./components/SolutionCard";
import SolutionForm from "./components/SolutionForm";
import {
  ALL_CATEGORIES,
  createSolutionIndex,
  filterSolutions,
  getCategories,
  getFirstMatchingSolution,
  solutions,
} from "./data/catalog";
import {
  addUserSolution,
  deleteUserSolution,
  importUserSolutions,
  loadUserSolutions,
  publishSolutions,
  readSolutionHistory,
  saveSessionFromCallbackUrl,
  readStoredSession,
  signIn,
  signOut,
  signUp,
  updateUserSolution,
} from "./services/solutionsRepository";
import {
  fetchHelpdeskTickets,
  getTicketCacheMeta,
  loadCachedHelpdeskTickets,
  saveTicketsToCache,
} from "./services/jiraService";
import "./styles/app.css";

const getInitialTheme = () => {
  const storedTheme = localStorage.getItem("support-toolkit-theme");
  if (storedTheme) return storedTheme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const REPOSITORY_LABELS = {
  local: "Local",
  shared: "Compartida",
  "local-fallback": "Local sin conexión",
};

function App() {
  const importInputRef = useRef(null);
  const [search, setSearch] = useState("");
  const [customSolutions, setCustomSolutions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [onlyPowerShell, setOnlyPowerShell] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const [view, setView] = useState("catalog");
  const [repositoryMode, setRepositoryMode] = useState("local");
  const [authSession, setAuthSession] = useState(readStoredSession);
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState("");
  const [jiraTickets, setJiraTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [jiraNextPageToken, setJiraNextPageToken] = useState("");
  const [jiraHasMore, setJiraHasMore] = useState(false);
  const [jiraLoading, setJiraLoading] = useState(false);
  const [jiraCacheMeta, setJiraCacheMeta] = useState(null);
  const [jiraError, setJiraError] = useState("");
  const canOpenJiraLogin = Boolean(window.soporteToolkit?.openJiraLogin);

  const solutionIndex = useMemo(
    () => createSolutionIndex([...solutions, ...customSolutions]),
    [customSolutions]
  );
  const categories = useMemo(() => getCategories(solutionIndex), [solutionIndex]);
  const [selected, setSelected] = useState(solutionIndex[0]);

  const filteredSolutions = useMemo(
    () =>
      filterSolutions({
        items: solutionIndex,
        search,
        category: selectedCategory,
        onlyPowerShell,
      }),
    [solutionIndex, search, selectedCategory, onlyPowerShell]
  );


  const templateSolutions = useMemo(
    () => solutionIndex.filter((solution) => solution.category === "Plantillas Jira"),
    [solutionIndex]
  );
  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const applyRepositoryResult = (result) => {
    setCustomSolutions(result.items);
    setRepositoryMode(result.mode);
  };

  const syncSolutions = async () => {
    const result = await loadUserSolutions();
    applyRepositoryResult(result);
    showToast(
      result.mode === "shared"
        ? "Base compartida sincronizada"
        : "No se pudo sincronizar; usando copia local"
    );
  };

  useEffect(() => {
    let isMounted = true;

    Promise.all([loadCachedHelpdeskTickets(), getTicketCacheMeta()]).then(
      ([cachedTickets, meta]) => {
        if (!isMounted) return;

        setJiraTickets(cachedTickets);
        setJiraCacheMeta(meta);
        setSelectedTicket(cachedTickets[0] ?? null);
        setJiraNextPageToken(meta.nextPageToken ?? "");
        setJiraHasMore(Boolean(meta.nextPageToken) && !meta.isLastPage);
      }
    );

    return () => {
      isMounted = false;
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("support-toolkit-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleAuthCallback = async (url) => {
      try {
        const session = await saveSessionFromCallbackUrl(url);
        if (!session) return;

        setAuthSession(session);
        showToast("Email confirmado. Sesión iniciada.");
      } catch {
        showToast("No se pudo completar el callback de autenticación");
      }
    };

    if (window.location.hash.includes("access_token")) {
      handleAuthCallback(window.location.href);
      window.history.replaceState({}, "", window.location.pathname);
    }

    window.soporteToolkit?.onAuthCallback?.(handleAuthCallback);
  }, []);

  useEffect(() => {
    if (!authSession?.access_token) return undefined;

    let isMounted = true;

    loadUserSolutions().then((result) => {
      if (!isMounted) return;

      applyRepositoryResult(result);
      if (result.mode === "shared") showToast("Base compartida sincronizada");
    });

    return () => {
      isMounted = false;
    };
  }, [authSession?.access_token]);

  useEffect(() => {
    let isMounted = true;

    readSolutionHistory(selected?.id).then((rows) => {
      if (isMounted) setHistory(rows);
    });

    return () => {
      isMounted = false;
    };
  }, [selected?.id, repositoryMode]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    const firstMatch = getFirstMatchingSolution({
      items: solutionIndex,
      category,
      onlyPowerShell,
    });

    if (firstMatch) setSelected(firstMatch);
  };

  const handleOnlyPowerShell = () => {
    const newValue = !onlyPowerShell;
    setOnlyPowerShell(newValue);

    const firstMatch = getFirstMatchingSolution({
      items: solutionIndex,
      category: selectedCategory,
      onlyPowerShell: newValue,
    });

    if (firstMatch) setSelected(firstMatch);
  };

  const handleAddSolution = async (solution) => {
    const result = await addUserSolution(solution, customSolutions);

    applyRepositoryResult(result);
    setSelected(result.item);
    setView("catalog");
    showToast("Solución guardada");
  };

  const handleUpdateSolution = async (solution) => {
    const result = await updateUserSolution(solution, customSolutions);

    applyRepositoryResult(result);
    setSelected(result.item);
    setView("catalog");
    showToast("Solución actualizada");
  };

  const handleDeleteSolution = async () => {
    if (!selected || selected.source === "base") return;

    const confirmed = window.confirm(
      `¿Eliminar la solución "${selected.title}" de la base compartida?`
    );

    if (!confirmed) return;

    const result = await deleteUserSolution(selected, customSolutions);
    const nextSelected =
      getFirstMatchingSolution({
        items: createSolutionIndex([...solutions, ...result.items]),
        category: selectedCategory,
        onlyPowerShell,
      }) ?? solutions[0];

    applyRepositoryResult(result);
    setSelected(nextSelected);
    setView("catalog");
    showToast("Solución eliminada");
  };

  const handlePromoteSelected = async () => {
    if (!selected || selected.source === "base") return;

    const result = await publishSolutions([selected], customSolutions);
    applyRepositoryResult(result);
    setSelected(result.items.find((item) => item.id === selected.id) ?? selected);
    showToast("Solución publicada en la base compartida");
  };

  const handlePublishBase = async () => {
    const result = await publishSolutions(solutions, customSolutions);
    applyRepositoryResult(result);
    showToast("Base inicial publicada en Supabase");
  };

  const handleExport = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      solutions: solutionIndex.map((solution) => {
        const exportableSolution = { ...solution };
        delete exportableSolution.searchableText;
        return exportableSolution;
      }),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `soporte-toolkit-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Exportación generada");
  };

  const mergeJiraTickets = async (incomingTickets, cacheOptions = {}) => {
    const mergedTickets = await saveTicketsToCache(incomingTickets, cacheOptions);
    const meta = await getTicketCacheMeta();

    setJiraTickets(mergedTickets);
    setJiraCacheMeta(meta);
    setSelectedTicket((currentTicket) => currentTicket ?? mergedTickets[0] ?? null);

    return mergedTickets;
  };

  const openJiraLogin = async () => {
    if (!window.soporteToolkit?.openJiraLogin) {
      window.open("https://camuzzigas.atlassian.net", "_blank", "noreferrer");
      return;
    }

    await window.soporteToolkit.openJiraLogin();
    showToast("Inicia sesion en Jira y luego actualiza tickets");
  };
  const refreshJiraTickets = async () => {
    setJiraLoading(true);
    setJiraError("");

    try {
      const meta = await getTicketCacheMeta();
      const result = await fetchHelpdeskTickets({
        maxResults: 100,
        filters: meta.latestCreated ? { createdAfter: meta.latestCreated } : {},
      });

      const mergedTickets = await mergeJiraTickets(result.tickets, {
        nextPageToken: meta.latestCreated ? undefined : result.nextPageToken,
        isLastPage: meta.latestCreated ? undefined : result.isLast,
      });
      if (!meta.latestCreated) {
        setJiraNextPageToken(result.nextPageToken);
        setJiraHasMore(!result.isLast && Boolean(result.nextPageToken));
      }

      showToast(`${result.tickets.length} ticket(s) nuevos. Cache: ${mergedTickets.length}`);
    } catch (error) {
      setJiraError(
        "No se pudo consultar Jira. Verifica que tengas sesion abierta en camuzzigas.atlassian.net y que el navegador permita la consulta."
      );
      showToast(error.message || "No se pudo consultar Jira");
    } finally {
      setJiraLoading(false);
    }
  };

  const loadMoreJiraTickets = async () => {
    if (!jiraHasMore || jiraLoading) return;

    setJiraLoading(true);
    setJiraError("");

    try {
      const result = await fetchHelpdeskTickets({
        nextPageToken: jiraNextPageToken,
        maxResults: 100,
      });

      await mergeJiraTickets(result.tickets, {
        nextPageToken: result.nextPageToken,
        isLastPage: result.isLast,
      });
      setJiraNextPageToken(result.nextPageToken);
      setJiraHasMore(!result.isLast && Boolean(result.nextPageToken));
      showToast(`${result.tickets.length} ticket(s) cargados`);
    } catch (error) {
      setJiraError("No se pudo cargar mas desde Jira.");
      showToast(error.message || "No se pudo cargar mas");
    } finally {
      setJiraLoading(false);
    }
  };

  const handleOpenSuggestedSolution = (solution) => {
    setSelected(solution);
    setSelectedCategory(solution.category);
    setView("catalog");
  };

  const openTemplates = () => {
    const firstTemplate = templateSolutions[0];
    if (firstTemplate) setSelected(firstTemplate);
    setSelectedCategory("Plantillas Jira");
    setView("templates");
  };
  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text());
      const items = Array.isArray(parsed) ? parsed : parsed.solutions;

      if (!Array.isArray(items)) throw new Error("Formato inválido");

      const result = await importUserSolutions(items, customSolutions);
      applyRepositoryResult(result);
      showToast(`${items.length} solución(es) importadas`);
    } catch {
      showToast("No se pudo importar el archivo");
    } finally {
      event.target.value = "";
    }
  };

  const handleAuthSubmit = async (mode) => {
    try {
      const session =
        mode === "signup" ? await signUp(authForm) : await signIn(authForm);

      setAuthSession(session);
      if (session.access_token) {
        showToast(mode === "signup" ? "Usuario creado" : "Sesión iniciada");
        syncSolutions();
      } else {
        showToast("Usuario creado. Confirmá el email antes de entrar.");
      }
    } catch {
      showToast("No se pudo completar la autenticación");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setAuthSession(null);
    setCustomSolutions([]);
    setHistory([]);
    showToast("Sesión cerrada");
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  if (!authSession?.access_token) {
    return (
      <main className="login-screen">
        <section className="login-card">
          <img className="login-icon" src="/toolkit-icon.svg" alt="" />
          <p className="eyebrow">Soporte Toolkit</p>
          <h1>Acceso requerido</h1>
          <p>
            Iniciá sesión para consultar, editar y sincronizar la base de
            soluciones.
          </p>

          <div className="login-form">
            <input
              type="email"
              placeholder="Email"
              value={authForm.email}
              onChange={(event) =>
                setAuthForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={authForm.password}
              onChange={(event) =>
                setAuthForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
            />
            <div>
              <button onClick={() => handleAuthSubmit("signin")}>Entrar</button>
              <button className="secondary-login" onClick={() => handleAuthSubmit("signup")}>
                Crear usuario
              </button>
            </div>
          </div>
        </section>

        {toast && <div className="toast-message">{toast}</div>}
      </main>
    );
  }

  return (
    <main className="app">
      <aside className="sidebar">
        <div className="brand">
          <img className="brand-icon" src="/toolkit-icon.svg" alt="" />
          <div>
            <h1>Soporte Toolkit</h1>
            <p>Base de soluciones y comandos rápidos</p>
          </div>
        </div>
        <div className="view-tabs app-nav" aria-label="Vista">
          <button
            className={view === "catalog" ? "active" : ""}
            onClick={() => {
              setSelectedCategory(ALL_CATEGORIES);
              setView("catalog");
            }}
          >
            Soluciones
          </button>
          <button
            className={view === "jira" ? "active" : ""}
            onClick={() => setView("jira")}
          >
            Jira Help Desk
          </button>
          <button
            className={view === "templates" ? "active" : ""}
            onClick={openTemplates}
          >
            Plantillas
          </button>
        </div>
        <div className="auth-panel">
          {authSession?.user ? (
            <>
              <span>{authSession.user.email}</span>
              <button onClick={handleSignOut}>Salir</button>
            </>
          ) : (
            <>
              <input
                type="email"
                placeholder="Email"
                value={authForm.email}
                onChange={(event) =>
                  setAuthForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={authForm.password}
                onChange={(event) =>
                  setAuthForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
              />
              <div>
                <button onClick={() => handleAuthSubmit("signin")}>
                  Entrar
                </button>
                <button onClick={() => handleAuthSubmit("signup")}>
                  Crear
                </button>
              </div>
            </>
          )}
        </div>

        <div className="search-panel">
          <input
            type="text"
            placeholder="Buscar problema, síntoma, comando..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            disabled={view !== "catalog"}
          />

          <select
            value={selectedCategory}
            onChange={(event) => handleCategoryChange(event.target.value)}
            disabled={view !== "catalog"}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button
            className={onlyPowerShell ? "filter-btn active" : "filter-btn"}
            onClick={handleOnlyPowerShell}
            disabled={view !== "catalog"}
          >
            {onlyPowerShell ? "✓ Solo PowerShell" : "Solo PowerShell"}
          </button>
        </div>

        <div className="sidebar-tools">
          <p className="result-count">{filteredSolutions.length} resultado(s)</p>
          <span className={`repository-mode repository-${repositoryMode}`}>
            {REPOSITORY_LABELS[repositoryMode]}
          </span>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "Modo claro" : "Modo oscuro"}
          </button>
        </div>

        <div className="data-actions">
          <button onClick={syncSolutions}>Sincronizar</button>
          <button onClick={handleExport}>Exportar</button>
          <button onClick={() => importInputRef.current?.click()}>Importar</button>
          <button onClick={() => setView("new")}>Nueva solucion</button>
          <button onClick={handlePublishBase}>Publicar base inicial</button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json"
            hidden
            onChange={handleImport}
          />
        </div>

        <div className="solution-list">
          {filteredSolutions.map((solution) => (
            <button
              key={solution.id}
              className={
                selected?.id === solution.id
                  ? "solution-item active"
                  : "solution-item"
              }
              onClick={() => {
                setSelected(solution);
                setView(view === "templates" ? "templates" : "catalog");
              }}
            >
              <strong>{solution.title}</strong>
              <span>{solution.category}</span>

              <div className="mini-tags">
                {solution.powershell && <small>PowerShell</small>}
                {solution.source !== "base" && <small>Agregada</small>}
                {solution.tags.slice(0, 3).map((tag) => (
                  <small key={tag}>{tag}</small>
                ))}
              </div>
            </button>
          ))}

          {filteredSolutions.length === 0 && (
            <p className="empty-results">No encontré soluciones.</p>
          )}
        </div>
      </aside>

      <section className="content">
        {view === "jira" ? (
          <JiraTickets
            tickets={jiraTickets}
            selectedTicket={selectedTicket}
            onSelectTicket={setSelectedTicket}
            onRefresh={refreshJiraTickets}
            onLoadMore={loadMoreJiraTickets}
            onOpenJiraLogin={openJiraLogin}
            canOpenJiraLogin={canOpenJiraLogin}
            isLoading={jiraLoading}
            hasMore={jiraHasMore}
            cacheMeta={jiraCacheMeta}
            error={jiraError}
            solutions={solutionIndex}
            onOpenSolution={handleOpenSuggestedSolution}
          />
        ) : view === "templates" && selected ? (
          <SolutionCard
            history={history}
            solution={selected}
            onDelete={handleDeleteSolution}
            onEdit={() => setView("edit")}
            onPromote={handlePromoteSelected}
          />
        ) : view === "new" ? (
          <div className="form-shell">
            <div className="form-heading">
              <p className="eyebrow">Base de conocimiento</p>
              <h2>Nueva solución</h2>
            </div>
            <SolutionForm key="new-solution" onSubmit={handleAddSolution} />
          </div>
        ) : view === "edit" && selected ? (
          <div className="form-shell">
            <div className="form-heading">
              <p className="eyebrow">Base de conocimiento</p>
              <h2>Editar solución</h2>
            </div>
            <SolutionForm
              key={selected.id}
              initialSolution={selected}
              onCancel={() => setView("catalog")}
              onSubmit={handleUpdateSolution}
            />
          </div>
        ) : selected ? (
          <SolutionCard
            history={history}
            solution={selected}
            onDelete={handleDeleteSolution}
            onEdit={() => setView("edit")}
            onPromote={handlePromoteSelected}
          />
        ) : (
          <div className="empty-card">Seleccioná una solución.</div>
        )}
      </section>

      {toast && <div className="toast-message">{toast}</div>}
    </main>
  );
}

export default App;
