const NAV_ITEMS = [
  { id: "catalog", label: "Soluciones", shortLabel: "S" },
  { id: "jira", label: "Jira Help Desk", shortLabel: "J" },
];

// La sidebar concentra navegación, filtros y acciones de la base de conocimiento.
// App.jsx queda enfocado en componer vistas y conectar hooks.
const AppSidebar = ({
  authSession,
  categories,
  filteredSolutions,
  importInputRef,
  onlyPowerShell,
  onCategoryChange,
  onExport,
  onImport,
  onNavigate,
  onNewSolution,
  onPublishBase,
  onSelectSolution,
  onSignOut,
  onSyncSolutions,
  onThemeToggle,
  onTogglePowerShell,
  onToggleSidebar,
  repositoryLabel,
  repositoryMode,
  search,
  selected,
  selectedCategory,
  setSearch,
  sidebarCollapsed,
  theme,
  view,
}) => {
  const shouldShowCatalogTools = view === "catalog";

  return (
    <aside className="sidebar">
      <button
        className="sidebar-toggle"
        onClick={onToggleSidebar}
        title={sidebarCollapsed ? "Expandir sidebar" : "Contraer sidebar"}
        aria-label={sidebarCollapsed ? "Expandir sidebar" : "Contraer sidebar"}
      >
        <span className="sidebar-toggle-icon" aria-hidden="true" />
      </button>

      <div className="brand">
        <img className="brand-icon" src="/toolkit-icon.svg" alt="" />
        <div>
          <h1>Soporte Toolkit</h1>
          <p>Consola de soluciones y tickets</p>
        </div>
      </div>

      <nav className="view-tabs app-nav" aria-label="Vista principal">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={view === item.id ? "active" : ""}
            data-short={item.shortLabel}
            title={item.label}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="auth-panel sidebar-card">
        <span>{authSession.user.email}</span>
        <button onClick={onSignOut}>Salir</button>
      </div>

      {shouldShowCatalogTools && (
        <>
          <div className="search-panel sidebar-card">
            <input
              type="text"
              placeholder="Buscar problema, síntoma, comando..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              value={selectedCategory}
              onChange={(event) => onCategoryChange(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button
              className={onlyPowerShell ? "filter-btn active" : "filter-btn"}
              onClick={onTogglePowerShell}
            >
              {onlyPowerShell ? "Solo PowerShell activo" : "Solo PowerShell"}
            </button>
          </div>

          <div className="sidebar-status">
            <p className="result-count">{filteredSolutions.length} resultado(s)</p>
            <span className={`repository-mode repository-${repositoryMode}`}>
              {repositoryLabel}
            </span>
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
                onClick={() => onSelectSolution(solution, "catalog")}
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
        </>
      )}

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={onThemeToggle}>
          {theme === "dark" ? "Modo claro" : "Modo oscuro"}
        </button>

        <details className="sidebar-actions">
          <summary>Acciones</summary>
          <div className="data-actions">
            <button onClick={onSyncSolutions}>Sincronizar</button>
            <button onClick={onExport}>Exportar</button>
            <button onClick={() => importInputRef.current?.click()}>Importar</button>
            <button onClick={onNewSolution}>Nueva solución</button>
            <button onClick={onPublishBase}>Publicar base</button>
            <input
              ref={importInputRef}
              type="file"
              accept="application/json"
              hidden
              onChange={onImport}
            />
          </div>
        </details>
      </div>
    </aside>
  );
};

export default AppSidebar;
