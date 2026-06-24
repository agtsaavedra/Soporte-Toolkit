import { useEffect, useState } from "react";
import {
  fetchHelpdeskTickets,
  getTicketCacheMeta,
  loadCachedHelpdeskTickets,
  saveTicketsToCache,
} from "../services/jiraService";

// Maneja Jira live + cache IndexedDB. La UI solo consume estado y acciones.
export const useJiraTickets = ({ showToast }) => {
  const [jiraTickets, setJiraTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [jiraNextPageToken, setJiraNextPageToken] = useState("");
  const [jiraHasMore, setJiraHasMore] = useState(false);
  const [jiraLoading, setJiraLoading] = useState(false);
  const [jiraCacheMeta, setJiraCacheMeta] = useState(null);
  const [jiraError, setJiraError] = useState("");

  useEffect(() => {
    window.soporteToolkit?.onJiraLoginReady?.(() => {
      showToast("Sesion Jira lista. Ya podes actualizar tickets.");
    });
  }, [showToast]);

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

  const replaceTicket = async (ticket) => {
    setJiraTickets((currentTickets) =>
      currentTickets.map((currentTicket) =>
        currentTicket.key === ticket.key ? ticket : currentTicket
      )
    );
    setSelectedTicket(ticket);
    await saveTicketsToCache([ticket], {
      nextPageToken: jiraNextPageToken,
      isLastPage: !jiraHasMore,
    });
  };

  return {
    jiraCacheMeta,
    jiraError,
    jiraHasMore,
    jiraLoading,
    jiraTickets,
    loadMoreJiraTickets,
    openJiraLogin,
    refreshJiraTickets,
    replaceTicket,
    selectedTicket,
    setSelectedTicket,
  };
};
