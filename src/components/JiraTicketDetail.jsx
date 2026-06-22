import JiraSuggestedSolutions from "./JiraSuggestedSolutions";
import "../styles/jira-ticket-detail.css";

const formatDate = (value) => {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleString("es-AR");
};

const copyText = async (text) => {
  await navigator.clipboard.writeText(text);
};

const buildJiraResponse = (ticket, suggestion) =>
  [
    `Ticket: ${ticket.key}`,
    `Resumen: ${ticket.summary}`,
    suggestion ? `Solucion sugerida: ${suggestion.solution.title}` : "Solucion sugerida: pendiente de analisis",
    "",
    suggestion?.solution.jiraTemplate || suggestion?.solution.userMessage || "Se reviso el caso y se aplicaron las acciones correspondientes.",
  ].join("\n");

const JiraTicketDetail = ({ ticket, suggestions, onOpenSolution }) => {
  if (!ticket) {
    return (
      <section className="jira-detail empty-card">
        Selecciona un ticket para ver detalle y sugerencias.
      </section>
    );
  }

  const bestSuggestion = suggestions[0];

  return (
    <section className="jira-detail">
      <div className="jira-detail-top">
        <div>
          <p className="eyebrow">{ticket.key}</p>
          <h2>{ticket.summary}</h2>
        </div>
        <div className="jira-detail-actions">
          {ticket.url && (
            <a href={ticket.url} target="_blank" rel="noreferrer">
              Abrir Jira
            </a>
          )}
          <button onClick={() => copyText(buildJiraResponse(ticket, bestSuggestion))}>
            Copiar respuesta Jira
          </button>
        </div>
      </div>

      <div className="jira-meta-grid">
        <span><strong>Estado</strong>{ticket.status}</span>
        <span><strong>Prioridad</strong>{ticket.priority}</span>
        <span><strong>Asignado</strong>{ticket.assignee}</span>
        <span><strong>Reporta</strong>{ticket.reporter}</span>
        <span><strong>Creado</strong>{formatDate(ticket.created)}</span>
        <span><strong>Resolucion</strong>{formatDate(ticket.resolutionDate)}</span>
        <span><strong>Categoria detectada</strong>{ticket.detectedCategory}</span>
      </div>

      <JiraSuggestedSolutions
        suggestions={suggestions}
        onOpenSolution={onOpenSolution}
      />

      <section className="jira-section">
        <h3>Descripcion</h3>
        <p>{ticket.description || "Sin descripcion."}</p>
      </section>

      <section className="jira-section">
        <h3>Comentarios</h3>
        <div className="jira-comments">
          {ticket.comments.map((comment) => (
            <article key={comment.id || `${comment.author}-${comment.created}`}>
              <strong>{comment.author}</strong>
              <time>{formatDate(comment.created)}</time>
              <p>{comment.body}</p>
            </article>
          ))}
          {ticket.comments.length === 0 && <p>Sin comentarios importados.</p>}
        </div>
      </section>

      <section className="jira-section">
        <h3>Resumen de cambios</h3>
        <div className="jira-changelog">
          {ticket.changelog.slice(0, 12).map((history) => (
            <article key={history.id || history.created}>
              <strong>{history.author}</strong>
              <time>{formatDate(history.created)}</time>
              {history.items.map((item) => (
                <span key={`${item.field}-${item.from}-${item.to}`}>
                  {item.field}: {item.from || "-"} → {item.to || "-"}
                </span>
              ))}
            </article>
          ))}
          {ticket.changelog.length === 0 && <p>Sin changelog importado.</p>}
        </div>
      </section>
    </section>
  );
};

export default JiraTicketDetail;
