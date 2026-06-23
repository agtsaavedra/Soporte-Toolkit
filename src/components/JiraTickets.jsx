import { useMemo, useState } from "react";
import { getSuggestedSolutions } from "../services/solutionMatcher";
import JiraTicketDetail from "./JiraTicketDetail";
import "../styles/jira-tickets.css";

const ALL = "Todos";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("es-AR");
};

const uniqueValues = (tickets, field) => [
  ALL,
  ...new Set(tickets.map((ticket) => ticket[field]).filter(Boolean)),
];

const matchesQuery = (ticket, query) => {
  if (!query) return true;
  const text = [
    ticket.key,
    ticket.summary,
    ticket.description,
    ticket.reporter,
    ticket.assignee,
    ticket.status,
    ticket.priority,
    ticket.detectedCategory,
  ]
    .join(" ")
    .toLocaleLowerCase("es-AR");

  return text.includes(query.toLocaleLowerCase("es-AR"));
};

const JiraTickets = ({
  tickets,
  selectedTicket,
  onSelectTicket,
  onRefresh,
  onLoadMore,
  isLoading,
  hasMore,
  cacheMeta,
  error,
  solutions,
  onOpenSolution,
}) => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(ALL);
  const [assignee, setAssignee] = useState(ALL);
  const [priority, setPriority] = useState(ALL);
  const [category, setCategory] = useState(ALL);

  const filters = useMemo(
    () => ({
      statuses: uniqueValues(tickets, "status"),
      assignees: uniqueValues(tickets, "assignee"),
      priorities: uniqueValues(tickets, "priority"),
      categories: uniqueValues(tickets, "detectedCategory"),
    }),
    [tickets]
  );

  const filteredTickets = useMemo(
    () =>
      tickets.filter(
        (ticket) =>
          matchesQuery(ticket, query) &&
          (status === ALL || ticket.status === status) &&
          (assignee === ALL || ticket.assignee === assignee) &&
          (priority === ALL || ticket.priority === priority) &&
          (category === ALL || ticket.detectedCategory === category)
      ),
    [assignee, category, priority, query, status, tickets]
  );

  const suggestions = selectedTicket
    ? getSuggestedSolutions(selectedTicket, solutions, 6)
    : [];

  return (
    <div className="jira-shell">
      <section className="jira-live-header">
        <div>
          <p className="eyebrow">Jira Help Desk</p>
          <h2>Consola viva de tickets</h2>
          <span>
            {tickets.length} ticket(s) · ultima sync {cacheMeta?.lastSync ? formatDate(cacheMeta.lastSync) : "pendiente"}
          </span>
          {cacheMeta?.lastDiff > 0 && <small>Ultimo diff: {cacheMeta.lastDiff} ticket(s)</small>}
        </div>

        <div className="jira-live-actions">
          <button type="button" onClick={onRefresh} disabled={isLoading}>
            {isLoading ? "Actualizando..." : "Actualizar tickets"}
          </button>
          <button type="button" onClick={onLoadMore} disabled={isLoading || !hasMore}>
            Cargar mas
          </button>
        </div>
      </section>

      {error && <div className="jira-error">{error}</div>}

      <div className="jira-workspace">
        <section className="jira-list-panel">
          <div className="jira-filters">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar key, resumen, descripcion, usuario..."
            />
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              {filters.statuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              {filters.priorities.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select value={assignee} onChange={(event) => setAssignee(event.target.value)}>
              {filters.assignees.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {filters.categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="jira-count">{filteredTickets.length} resultado(s)</div>

          <div className="jira-ticket-table" role="table" aria-label="Tickets Jira Help Desk">
            <div className="jira-ticket-row jira-ticket-head" role="row">
              <span>Key</span>
              <span>Summary</span>
              <span>Status</span>
              <span>Priority</span>
              <span>Assignee</span>
              <span>Reporter</span>
              <span>Created</span>
            </div>

            {filteredTickets.map((ticket) => (
              <button
                key={ticket.key}
                className={selectedTicket?.key === ticket.key ? "jira-ticket-row active" : "jira-ticket-row"}
                onClick={() => onSelectTicket(ticket)}
                role="row"
              >
                <span>{ticket.key}</span>
                <strong>{ticket.summary}</strong>
                <span>{ticket.status}</span>
                <span>{ticket.priority}</span>
                <span>{ticket.assignee}</span>
                <span>{ticket.reporter}</span>
                <time>{formatDate(ticket.created)}</time>
              </button>
            ))}

            {filteredTickets.length === 0 && (
              <p className="jira-empty">Actualiza tickets o cambia los filtros.</p>
            )}
          </div>
        </section>

        <JiraTicketDetail
          ticket={selectedTicket}
          suggestions={suggestions}
          onOpenSolution={onOpenSolution}
        />
      </div>
    </div>
  );
};

export default JiraTickets;
