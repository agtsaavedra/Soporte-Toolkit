import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { fetchTicketByKey } from "../services/jiraService";
import { getSuggestedSolutions } from "../services/solutionMatcher";
import { EmptyState, ErrorState, LoadingState } from "../shared/ui/StateBlock";
import JiraTicketDetail from "./JiraTicketDetail";
import "../styles/features/jira/tickets.css";

const ALL = "Todos";
const ROW_HEIGHT = 56;
const VISIBLE_ROWS = 20;
const OVERSCAN_ROWS = 8;

const hasCompleteTicketDetail = (ticket) =>
  Boolean(ticket.description || ticket.comments.length > 0 || ticket.changelog.length > 0);

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("es-AR");
};

const uniqueValues = (tickets, field) => [
  ALL,
  ...new Set(tickets.map((ticket) => ticket[field]).filter(Boolean)),
];

const buildTicketSearchText = (ticket) =>
  [
    ticket.key,
    ticket.summary,
    ticket.description,
    ticket.reporter,
    ticket.assignee,
    ticket.status,
    ticket.priority,
    ticket.detectedCategory,
    ticket.plainText,
  ]
    .join(" ")
    .toLocaleLowerCase("es-AR");

const matchesQuery = (ticket, query) => {
  if (!query) return true;
  return ticket.searchText.includes(query.toLocaleLowerCase("es-AR"));
};

const JiraTickets = ({
  tickets,
  selectedTicket,
  onSelectTicket,
  onRefresh,
  onLoadMore,
  onOpenJiraLogin,
  onTicketLoaded,
  isLoading,
  hasMore,
  cacheMeta,
  error,
  solutions,
}) => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(ALL);
  const [assignee, setAssignee] = useState(ALL);
  const [priority, setPriority] = useState(ALL);
  const [category, setCategory] = useState(ALL);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLoadingKey, setDetailLoadingKey] = useState("");
  const [detailError, setDetailError] = useState("");
  const [scrollTop, setScrollTop] = useState(0);
  const tableRef = useRef(null);
  const scrollFrameRef = useRef(0);
  const deferredQuery = useDeferredValue(query);

  useEffect(
    () => () => {
      if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current);
    },
    []
  );

  const indexedTickets = useMemo(
    () =>
      tickets.map((ticket) => {
        if (ticket.searchText) return ticket;
        return {
          ...ticket,
          searchText: buildTicketSearchText(ticket),
        };
      }),
    [tickets]
  );

  const filters = useMemo(
    () => ({
      statuses: uniqueValues(indexedTickets, "status"),
      assignees: uniqueValues(indexedTickets, "assignee"),
      priorities: uniqueValues(indexedTickets, "priority"),
      categories: uniqueValues(indexedTickets, "detectedCategory"),
    }),
    [indexedTickets]
  );

  const filteredTickets = useMemo(
    () =>
      indexedTickets.filter(
        (ticket) =>
          matchesQuery(ticket, deferredQuery) &&
          (status === ALL || ticket.status === status) &&
          (assignee === ALL || ticket.assignee === assignee) &&
          (priority === ALL || ticket.priority === priority) &&
          (category === ALL || ticket.detectedCategory === category)
      ),
    [assignee, category, deferredQuery, indexedTickets, priority, status]
  );

  const virtualRows = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN_ROWS);
    const end = Math.min(filteredTickets.length, start + VISIBLE_ROWS + OVERSCAN_ROWS * 2);

    return {
      start,
      end,
      tickets: filteredTickets.slice(start, end),
      topSpacer: start * ROW_HEIGHT,
      bottomSpacer: Math.max(0, (filteredTickets.length - end) * ROW_HEIGHT),
    };
  }, [filteredTickets, scrollTop]);

  const suggestions = useMemo(
    () => (selectedTicket ? getSuggestedSolutions(selectedTicket, solutions, 6) : []),
    [selectedTicket, solutions]
  );
  const hasSyncedTickets = tickets.length > 0 || Boolean(cacheMeta?.lastSync);

  const handleTableScroll = (event) => {
    const nextScrollTop = event.currentTarget.scrollTop;

    if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current);
    scrollFrameRef.current = requestAnimationFrame(() => {
      setScrollTop(nextScrollTop);
    });
  };

  const resetVirtualScroll = () => {
    setScrollTop(0);
    tableRef.current?.scrollTo({ top: 0 });
  };

  const openTicket = async (ticket) => {
    setDetailError("");
    setIsDetailOpen(true);
    onSelectTicket(ticket);

    if (hasCompleteTicketDetail(ticket)) return;

    setDetailLoadingKey(ticket.key);
    try {
      const detail = await fetchTicketByKey(ticket.key);
      if (onTicketLoaded) await onTicketLoaded(detail);
      else onSelectTicket(detail);
    } catch (fetchError) {
      setDetailError(fetchError.message || "No se pudo cargar el detalle del ticket.");
    } finally {
      setDetailLoadingKey("");
    }
  };

  return (
    <div className="jira-shell">
      <section className="jira-live-header">
        <div>
          <p className="eyebrow">Jira Help Desk</p>
          <h2>Consola viva de tickets</h2>
          <span>
            {tickets.length} ticket(s) · última sync {cacheMeta?.lastSync ? formatDate(cacheMeta.lastSync) : "pendiente"}
          </span>
          <small className={hasSyncedTickets ? "jira-session-ok" : "jira-session-pending"}>
            {hasSyncedTickets ? "Jira conectado" : "Sesión Jira sin validar"}
          </small>
          {cacheMeta?.lastDiff > 0 && <small>Último diff: {cacheMeta.lastDiff} ticket(s)</small>}
        </div>

        <div className="jira-live-actions">
          <button type="button" onClick={onOpenJiraLogin}>
            Verificar Jira
          </button>
          <button type="button" onClick={onRefresh} disabled={isLoading}>
            {isLoading ? "Actualizando..." : "Actualizar tickets"}
          </button>
          <button type="button" onClick={onLoadMore} disabled={isLoading || !hasMore}>
            Cargar mas
          </button>
        </div>
      </section>

      {error && <ErrorState title="No se pudo consultar Jira" description={error} />}
      {detailError && <ErrorState title="No se pudo cargar el detalle" description={detailError} />}

      <div className="jira-workspace">
        <section className="jira-list-panel">
          <div className="jira-filters">
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                resetVirtualScroll();
              }}
              placeholder="Buscar key, resumen, descripción, usuario..."
            />
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                resetVirtualScroll();
              }}
            >
              {filters.statuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={priority}
              onChange={(event) => {
                setPriority(event.target.value);
                resetVirtualScroll();
              }}
            >
              {filters.priorities.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={assignee}
              onChange={(event) => {
                setAssignee(event.target.value);
                resetVirtualScroll();
              }}
            >
              {filters.assignees.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                resetVirtualScroll();
              }}
            >
              {filters.categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="jira-count">{filteredTickets.length} resultado(s)</div>

          <div
            className="jira-ticket-table"
            ref={tableRef}
            role="table"
            aria-label="Tickets Jira Help Desk"
            onScroll={handleTableScroll}
          >
            <div className="jira-ticket-row jira-ticket-head" role="row">
              <span>Key</span>
              <span>Summary</span>
              <span>Status</span>
              <span>Priority</span>
              <span>Assignee</span>
              <span>Created</span>
              <span>Accion</span>
            </div>

            {isLoading && (
              <div className="jira-loader-row">
                <LoadingState
                  title="Cargando tickets"
                  description="Consultando Jira y actualizando cache local..."
                />
              </div>
            )}

            {virtualRows.topSpacer > 0 && (
              <div
                className="jira-ticket-spacer"
                style={{ "--ticket-spacer-height": `${virtualRows.topSpacer}px` }}
                aria-hidden="true"
              />
            )}

            {virtualRows.tickets.map((ticket) => (
              <button
                key={ticket.key}
                className={selectedTicket?.key === ticket.key ? "jira-ticket-row active" : "jira-ticket-row"}
                onClick={() => openTicket(ticket)}
                disabled={detailLoadingKey === ticket.key}
                role="row"
              >
                <span>{ticket.key}</span>
                <strong>{ticket.summary}</strong>
                <span>{ticket.status}</span>
                <span>{ticket.priority}</span>
                <span>{ticket.assignee}</span>
                <time>{formatDate(ticket.created)}</time>
                <span className="jira-row-action">
                  {detailLoadingKey === ticket.key ? "Cargando" : "Abrir"}
                </span>
              </button>
            ))}

            {virtualRows.bottomSpacer > 0 && (
              <div
                className="jira-ticket-spacer"
                style={{ "--ticket-spacer-height": `${virtualRows.bottomSpacer}px` }}
                aria-hidden="true"
              />
            )}

            {filteredTickets.length === 0 && (
              <div className="jira-empty">
                <EmptyState
                  title="Sin tickets para mostrar"
                  description="Actualiza tickets o cambia los filtros."
                />
              </div>
            )}
          </div>
        </section>
      </div>

      {isDetailOpen && selectedTicket && (
        <JiraTicketDetail
          ticket={selectedTicket}
          suggestions={suggestions}
          isLoading={Boolean(detailLoadingKey)}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </div>
  );
};

export default JiraTickets;
