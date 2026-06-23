import JiraSuggestedSolutions from "./JiraSuggestedSolutions";
import "../styles/jira-ticket-detail.css";

const formatDate = (value) => {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleString("es-AR");
};

const copyText = async (text) => {
  await navigator.clipboard.writeText(text);
};

const buildTicketSummary = (ticket) =>
  [
    `${ticket.key} - ${ticket.summary}`,
    `Estado: ${ticket.status}`,
    `Prioridad: ${ticket.priority}`,
    `Asignado: ${ticket.assignee}`,
    `Reporta: ${ticket.reporter}`,
    `Creado: ${formatDate(ticket.created)}`,
    ticket.url,
  ]
    .filter(Boolean)
    .join("\n");

const JiraTicketDetail = ({ ticket, suggestions }) => {
  if (!ticket) {
    return (
      <section className="jira-detail empty-card">
        Selecciona un ticket para ver detalle y sugerencias.
      </section>
    );
  }

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
              Abrir en Jira
            </a>
          )}
          <button onClick={() => copyText(ticket.url)}>Copiar link</button>
          <button onClick={() => copyText(buildTicketSummary(ticket))}>
            Copiar resumen
          </button>
        </div>
      </div>

      <div className="jira-meta-grid">
        <span><strong>Estado</strong>{ticket.status}</span>
        <span><strong>Prioridad</strong>{ticket.priority}</span>
        <span><strong>Asignado</strong>{ticket.assignee}</span>
        <span><strong>Reporta</strong>{ticket.reporter}</span>
        <span><strong>Creado</strong>{formatDate(ticket.created)}</span>
        <span><strong>Resolution date</strong>{formatDate(ticket.resolutionDate)}</span>
        <span><strong>Categoria detectada</strong>{ticket.detectedCategory}</span>
      </div>

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
          {ticket.comments.length === 0 && <p>Sin comentarios cargados.</p>}
        </div>
      </section>

      <section className="jira-section">
        <h3>Changelog resumido</h3>
        <div className="jira-changelog">
          {ticket.changelog.slice(0, 12).map((history) => (
            <article key={history.id || history.created}>
              <strong>{history.author}</strong>
              <time>{formatDate(history.created)}</time>
              {history.items.map((item) => (
                <span key={`${item.field}-${item.from}-${item.to}`}>
                  {item.field}: {item.from || "-"} -&gt; {item.to || "-"}
                </span>
              ))}
            </article>
          ))}
          {ticket.changelog.length === 0 && <p>Sin changelog cargado.</p>}
        </div>
      </section>

      <JiraSuggestedSolutions
        ticket={ticket}
        suggestions={suggestions}

      />
    </section>
  );
};

export default JiraTicketDetail;
