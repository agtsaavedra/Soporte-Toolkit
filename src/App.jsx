import { useEffect, useMemo, useRef, useState } from "react";
import AppSidebar from "./components/AppSidebar";
import JiraTickets from "./components/JiraTickets";
import LoginScreen from "./components/LoginScreen";
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

// App coordina estado global y delega UI pesada a componentes especializados.
function App() {
  const importInputRef = useRef(null);
  const [search, setSearch] = useState("");
  const [customSolutions, setCustomSolutions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [onlyPowerShell, setOnlyPowerShell] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const [view, setView] = useState("catalog");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    window.soporteToolkit?.onJiraLoginReady?.(() => {
      showToast("Sesion Jira lista. Ya podes actualizar tickets.");
    });
  }, []);
  // Recupera tickets cacheados para que Jira sea util apenas abre la app.
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
  // El tema vive en localStorage porque es una preferencia por equipo.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("support-toolkit-theme", theme);
  }, [theme]);

  // Supabase puede devolver tokens por callback web o por protocolo de Electron.
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

  // Cuando hay sesion autenticada, intenta usar la base compartida.
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

  // El historial se carga por ficha seleccionada para evitar traer todo de entrada.
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
      showToast("Jira abierto en el navegador. En localhost puede haber bloqueo por CORS.");
      return;
    }

    const result = await window.soporteToolkit.openJiraLogin();
    if (result?.alreadyAuthenticated) {
      showToast("Sesion Jira activa. Ya podes actualizar tickets.");
      return;
    }

    if (result?.alreadyOpen) {
      showToast("La ventana de Jira ya esta abierta para validar sesion.");
      return;
    }

    showToast("Completa el login de Jira; la ventana se cierra sola al detectar sesion.");
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
      setJiraError(error.message || "No se pudo consultar Jira.");
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
      setJiraError(error.message || "No se pudo cargar mas desde Jira.");
      showToast(error.message || "No se pudo cargar mas");
    } finally {
      setJiraLoading(false);
    }
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

  const updateAuthForm = (field, value) => {
    setAuthForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  if (!authSession?.access_token) {
    return (
      <LoginScreen
        authForm={authForm}
        onAuthSubmit={handleAuthSubmit}
        onUpdateAuthForm={updateAuthForm}
        toast={toast}
      />
    );
  }

  return (
    <main className={sidebarCollapsed ? "app sidebar-collapsed" : "app"}>
      <AppSidebar
        authSession={authSession}
        categories={categories}
        filteredSolutions={filteredSolutions}
        importInputRef={importInputRef}
        onlyPowerShell={onlyPowerShell}
        onCategoryChange={handleCategoryChange}
        onExport={handleExport}
        onImport={handleImport}
        onNavigate={(nextView) => {
          if (nextView === "catalog") setSelectedCategory(ALL_CATEGORIES);
          setView(nextView);
        }}
        onNewSolution={() => setView("new")}
        onOpenTemplates={openTemplates}
        onPublishBase={handlePublishBase}
        onSelectSolution={(solution, nextView = "catalog") => {
          if (solution) setSelected(solution);
          setView(nextView);
        }}
        onSignOut={handleSignOut}
        onSyncSolutions={syncSolutions}
        onThemeToggle={toggleTheme}
        onTogglePowerShell={handleOnlyPowerShell}
        onToggleSidebar={() => setSidebarCollapsed((current) => !current)}
        repositoryLabel={REPOSITORY_LABELS[repositoryMode]}
        repositoryMode={repositoryMode}
        search={search}
        selected={selected}
        selectedCategory={selectedCategory}
        setSearch={setSearch}
        sidebarCollapsed={sidebarCollapsed}
        theme={theme}
        view={view}
      />

      <section className="content">
        {view === "jira" ? (
          <JiraTickets
            tickets={jiraTickets}
            selectedTicket={selectedTicket}
            onSelectTicket={setSelectedTicket}
            onRefresh={refreshJiraTickets}
            onLoadMore={loadMoreJiraTickets}
            onOpenJiraLogin={openJiraLogin}
            isLoading={jiraLoading}
            hasMore={jiraHasMore}
            cacheMeta={jiraCacheMeta}
            error={jiraError}
            solutions={solutionIndex}
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
