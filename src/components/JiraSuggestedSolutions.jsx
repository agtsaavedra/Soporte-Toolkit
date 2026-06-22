import "../styles/jira-ticket-detail.css";

const commandText = (command) => command.command ?? command;

const copyCommands = async (solution) => {
  await navigator.clipboard.writeText(solution.commands.map(commandText).join("\n"));
};

const copyTemplate = async (solution) => {
  await navigator.clipboard.writeText(solution.jiraTemplate || solution.userMessage);
};

const JiraSuggestedSolutions = ({ suggestions, onOpenSolution }) => (
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
            <button onClick={() => copyCommands(solution)} disabled={solution.commands.length === 0}>
              Copiar comandos
            </button>
            <button onClick={() => copyTemplate(solution)}>Copiar plantilla</button>
          </div>
        </article>
      ))}

      {suggestions.length === 0 && (
        <p>No hay sugerencias todavia. Revisa keywords o agrega una ficha mas especifica.</p>
      )}
    </div>
  </section>
);

export default JiraSuggestedSolutions;
