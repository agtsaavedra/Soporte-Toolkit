import { useRef, useState } from "react";
import AppSidebar from "./components/AppSidebar";
import JiraTickets from "./components/JiraTickets";
import LoginScreen from "./components/LoginScreen";
import SolutionCard from "./components/SolutionCard";
import SolutionForm from "./components/SolutionForm";
import { DEFAULT_CATEGORY, REPOSITORY_LABELS, VIEWS } from "./config/appConfig";
import { useAuthSession } from "./hooks/useAuthSession";
import { useJiraTickets } from "./hooks/useJiraTickets";
import { useSolutionsCatalog } from "./hooks/useSolutionsCatalog";
import { useTheme } from "./hooks/useTheme";
import { useToast } from "./hooks/useToast";
import "./styles/layout/app.css";

// App queda como composicion de alto nivel: layout + vistas + conexion entre hooks.
function App() {
  const importInputRef = useRef(null);
  const [view, setView] = useState(VIEWS.CATALOG);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { toast, showToast } = useToast();

  const auth = useAuthSession({ showToast });

  const catalog = useSolutionsCatalog({
    authSession: auth.authSession,
    showToast,
  });

  const jira = useJiraTickets({ showToast });

  const isAuthenticated = Boolean(auth.authSession?.access_token);

  const goToCatalog = () => {
    catalog.setSelectedCategory(DEFAULT_CATEGORY);
    setView(VIEWS.CATALOG);
  };

  const handleSignOut = async () => {
    await auth.handleSignOut();
    catalog.resetAfterSignOut();
  };

  const handleOpenTemplates = () => {
    setView(catalog.openTemplates());
  };

  const handleAddSolution = async (solution) => {
    setView(await catalog.handleAddSolution(solution));
  };

  const handleUpdateSolution = async (solution) => {
    setView(await catalog.handleUpdateSolution(solution));
  };

  const handleDeleteSolution = async () => {
    const nextView = await catalog.handleDeleteSelectedSolution();
    if (nextView) setView(nextView);
  };

  if (!isAuthenticated) {
    return (
      <LoginScreen
        authForm={auth.authForm}
        onAuthSubmit={auth.handleAuthSubmit}
        onUpdateAuthForm={auth.updateAuthForm}
        toast={toast}
      />
    );
  }

  return (
    <main className={sidebarCollapsed ? "app sidebar-collapsed" : "app"}>
      <AppSidebar
        authSession={auth.authSession}
        categories={catalog.categories}
        filteredSolutions={catalog.filteredSolutions}
        importInputRef={importInputRef}
        onlyPowerShell={catalog.onlyPowerShell}
        onCategoryChange={catalog.handleCategoryChange}
        onExport={catalog.handleExport}
        onImport={catalog.handleImport}
        onNavigate={(nextView) => {
          if (nextView === VIEWS.CATALOG) goToCatalog();
          else setView(nextView);
        }}
        onNewSolution={() => setView(VIEWS.NEW)}
        onOpenTemplates={handleOpenTemplates}
        onPublishBase={catalog.handlePublishBase}
        onSelectSolution={(solution, nextView = VIEWS.CATALOG) => {
          if (solution) catalog.setSelected(solution);
          setView(nextView);
        }}
        onSignOut={handleSignOut}
        onSyncSolutions={catalog.syncSolutions}
        onThemeToggle={toggleTheme}
        onTogglePowerShell={catalog.handleOnlyPowerShell}
        onToggleSidebar={() => setSidebarCollapsed((current) => !current)}
        repositoryLabel={REPOSITORY_LABELS[catalog.repositoryMode]}
        repositoryMode={catalog.repositoryMode}
        search={catalog.search}
        selected={catalog.selected}
        selectedCategory={catalog.selectedCategory}
        setSearch={catalog.setSearch}
        sidebarCollapsed={sidebarCollapsed}
        theme={theme}
        view={view}
      />

      <section className={view === VIEWS.JIRA ? "content content-jira" : "content"}>
        {view === VIEWS.JIRA ? (
          <JiraTickets
            tickets={jira.jiraTickets}
            selectedTicket={jira.selectedTicket}
            onSelectTicket={jira.setSelectedTicket}
            onRefresh={jira.refreshJiraTickets}
            onLoadMore={jira.loadMoreJiraTickets}
            onOpenJiraLogin={jira.openJiraLogin}
            onTicketLoaded={jira.replaceTicket}
            isLoading={jira.jiraLoading}
            hasMore={jira.jiraHasMore}
            cacheMeta={jira.jiraCacheMeta}
            error={jira.jiraError}
            solutions={catalog.solutionIndex}
          />
        ) : view === VIEWS.TEMPLATES && catalog.selected ? (
          <SolutionCard
            history={catalog.history}
            solution={catalog.selected}
            onDelete={handleDeleteSolution}
            onEdit={() => setView(VIEWS.EDIT)}
            onPromote={catalog.handlePromoteSelected}
          />
        ) : view === VIEWS.NEW ? (
          <div className="form-shell">
            <div className="form-heading">
              <p className="eyebrow">Base de conocimiento</p>
              <h2>Nueva solucion</h2>
            </div>
            <SolutionForm key="new-solution" onSubmit={handleAddSolution} />
          </div>
        ) : view === VIEWS.EDIT && catalog.selected ? (
          <div className="form-shell">
            <div className="form-heading">
              <p className="eyebrow">Base de conocimiento</p>
              <h2>Editar solucion</h2>
            </div>
            <SolutionForm
              key={catalog.selected.id}
              initialSolution={catalog.selected}
              onCancel={() => setView(VIEWS.CATALOG)}
              onSubmit={handleUpdateSolution}
            />
          </div>
        ) : catalog.selected ? (
          <SolutionCard
            history={catalog.history}
            solution={catalog.selected}
            onDelete={handleDeleteSolution}
            onEdit={() => setView(VIEWS.EDIT)}
            onPromote={catalog.handlePromoteSelected}
          />
        ) : (
          <div className="empty-card">Selecciona una solucion.</div>
        )}
      </section>

      {toast && <div className="toast-message">{toast}</div>}
    </main>
  );
}

export default App;
