import { useMemo, useState } from "react";
import { getSuggestedSolutions } from "../services/solutionMatcher";
import JiraImport from "./JiraImport";
import JiraTicketDetail from "./JiraTicketDetail";
import "../styles/jira-tickets.css";

const ALL = "Todos";

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
  onImport,
  onClear,
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
      <JiraImport
        onImport={onImport}
        onClear={onClear}
        ticketCount={tickets.length}
      />

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
            <select value={assignee} onChange={(event) => setAssignee(event.target.value)}>
              {filters.assignees.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              {filters.priorities.map((item) => (
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

          <div className="jira-ticket-list">
            {filteredTickets.map((ticket) => (
              <button
                key={ticket.key}
                className={selectedTicket?.key === ticket.key ? "active" : ""}
                onClick={() => onSelectTicket(ticket)}
              >
                <span>{ticket.key}</span>
                <strong>{ticket.summary}</strong>
                <small>{ticket.status} · {ticket.assignee}</small>
              </button>
            ))}

            {filteredTickets.length === 0 && (
              <p className="jira-empty">Importa exportaciones JSON de Jira o cambia los filtros.</p>
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
