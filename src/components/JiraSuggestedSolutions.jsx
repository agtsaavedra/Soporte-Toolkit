import "../styles/jira-ticket-detail.css";

const commandText = (command) => command.command ?? command;

const copyText = async (text) => {
  await navigator.clipboard.writeText(text);
};

const buildJiraResponse = (ticket, solution) =>
  [
    `Hola, revisamos el ticket ${ticket.key} (${ticket.summary}).`,
    "",
    solution.jiraTemplate || solution.userMessage,
    "",
    `Solucion aplicada/sugerida: ${solution.title}`,
  ]
    .filter(Boolean)
    .join("\n");

const JiraSuggestedSolutions = ({ ticket, suggestions, onOpenSolution }) => (
  <section className="jira-section jira-suggestions">
    <h3>Soluciones sugeridas</h3>
    <div className="jira-suggestion-list">
      {suggestions.map(({ solution, score, reasons }) => (
        <article key={solution.id}>
          <div>
            <strong>{solution.title}</strong>
            <span>{solution.category} · score {score}</span>
            {reasons.length > 0 && <small>{reasons.join(", ")}</small>}
          </div>
          <div className="jira-suggestion-actions">
            <button onClick={() => onOpenSolution(solution)}>Abrir ficha</button>
            <button
              onClick={() => copyText(solution.commands.map(commandText).join("\n"))}
              disabled={solution.commands.length === 0}
            >
              Copiar comandos
            </button>
            <button onClick={() => copyText(buildJiraResponse(ticket, solution))}>
              Copiar respuesta Jira
            </button>
          </div>
        </article>
      ))}

      {suggestions.length === 0 && (
        <p>No hay sugerencias todavia. Ajusta keywords o agrega una ficha mas especifica.</p>
      )}
    </div>
  </section>
);

export default JiraSuggestedSolutions;
