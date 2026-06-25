import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { fetchTicketByKey } from "../services/jiraService";
import {
  ALL_FILTER,
  buildTicketFilterOptions,
  filterJiraTickets,
  formatJiraDate,
  withTicketSearchIndex,
} from "../services/jira/jiraTicketFilters";
import { getSuggestedSolutions } from "../services/solutionMatcher";
import { EmptyState, ErrorState, LoadingState } from "../shared/ui/StateBlock";
import JiraTicketDetail from "./JiraTicketDetail";
import "../styles/features/jira/tickets.css";

const ROW_HEIGHT = 56;
const VISIBLE_ROWS = 20;
const OVERSCAN_ROWS = 8;

const hasCompleteTicketDetail = (ticket) =>
  Boolean(ticket.description || ticket.comments.length > 0 || ticket.changelog.length > 0);

const waitForNextFrame = () =>
  new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });

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
  const [status, setStatus] = useState(ALL_FILTER);
  const [assignee, setAssignee] = useState(ALL_FILTER);
  const [priority, setPriority] = useState(ALL_FILTER);
  const [category, setCategory] = useState(ALL_FILTER);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLoadingKey, setDetailLoadingKey] = useState("");
  const [detailError, setDetailError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
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

  useEffect(() => {
    let idleId = null;
    const setupId = window.setTimeout(() => {
      if (!isDetailOpen || !selectedTicket) {
        setSuggestions([]);
        setSuggestionsLoading(false);
        return;
      }

      setSuggestions([]);
      setSuggestionsLoading(true);

      const runMatcher = () => {
        setSuggestions(getSuggestedSolutions(selectedTicket, solutions, 6));
        setSuggestionsLoading(false);
      };

      idleId = window.requestIdleCallback
        ? window.requestIdleCallback(runMatcher, { timeout: 350 })
        : window.setTimeout(runMatcher, 0);
    }, 0);

    return () => {
      window.clearTimeout(setupId);
      if (idleId === null) return;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
    };
  }, [isDetailOpen, selectedTicket, solutions]);

  const indexedTickets = useMemo(() => tickets.map(withTicketSearchIndex), [tickets]);

  const filters = useMemo(() => buildTicketFilterOptions(indexedTickets), [indexedTickets]);

  const filteredTickets = useMemo(
    () =>
      filterJiraTickets(indexedTickets, {
        query: deferredQuery,
        status,
        assignee,
        priority,
        category,
      }),
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
      await waitForNextFrame();
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
            {tickets.length} ticket(s) · última sync {cacheMeta?.lastSync ? formatJiraDate(cacheMeta.lastSync) : "pendiente"}
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
            Cargar más
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
              <span>Acción</span>
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
                <time>{formatJiraDate(ticket.created)}</time>
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
          suggestionsLoading={suggestionsLoading}
          isLoading={Boolean(detailLoadingKey)}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </div>
  );
};

export default JiraTickets;
