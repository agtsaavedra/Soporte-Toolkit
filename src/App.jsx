import { useEffect, useMemo, useState } from "react";
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
  loadUserSolutions,
  updateUserSolution,
} from "./services/solutionsRepository";
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
  const [search, setSearch] = useState("");
  const [customSolutions, setCustomSolutions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [onlyPowerShell, setOnlyPowerShell] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const [view, setView] = useState("catalog");
  const [repositoryMode, setRepositoryMode] = useState("local");

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

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("support-toolkit-theme", theme);
  }, [theme]);

  useEffect(() => {
    let isMounted = true;

    loadUserSolutions().then((result) => {
      if (!isMounted) return;

      setCustomSolutions(result.items);
      setRepositoryMode(result.mode);
    });

    return () => {
      isMounted = false;
    };
  }, []);

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

    setCustomSolutions(result.items);
    setRepositoryMode(result.mode);
    setSelected(result.item);
    setView("catalog");
  };

  const handleUpdateSolution = async (solution) => {
    const result = await updateUserSolution(solution, customSolutions);

    setCustomSolutions(result.items);
    setRepositoryMode(result.mode);
    setSelected(result.item);
    setView("catalog");
  };

  const handleDeleteSolution = async () => {
    if (!selected || selected.source === "base") return;

    const confirmed = window.confirm(
      `¿Eliminar la solución "${selected.title}" de la base compartida?`
    );

    if (!confirmed) return;

    const result = await deleteUserSolution(selected.id, customSolutions);
    const nextSelected =
      getFirstMatchingSolution({
        items: createSolutionIndex([...solutions, ...result.items]),
        category: selectedCategory,
        onlyPowerShell,
      }) ?? solutions[0];

    setCustomSolutions(result.items);
    setRepositoryMode(result.mode);
    setSelected(nextSelected);
    setView("catalog");
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

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

        <div className="view-tabs" aria-label="Vista">
          <button
            className={view === "catalog" ? "active" : ""}
            onClick={() => setView("catalog")}
          >
            Catálogo
          </button>
          <button
            className={view === "new" ? "active" : ""}
            onClick={() => setView("new")}
          >
            Nueva
          </button>
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
                setView("catalog");
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
        {view === "new" ? (
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
            solution={selected}
            onDelete={handleDeleteSolution}
            onEdit={() => setView("edit")}
          />
        ) : (
          <div className="empty-card">Seleccioná una solución.</div>
        )}
      </section>
    </main>
  );
}

export default App;
