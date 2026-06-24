import { useState } from "react";
import "../styles/jira-suggested-solutions.css";

const commandText = (command) => command.command ?? command;

const copyText = async (text) => {
  await navigator.clipboard.writeText(text);
};

const numberedLines = (items) =>
  items.map((item, index) => `${index + 1}. ${item}`).join("\n");

const JiraSuggestedSolutions = ({ suggestions }) => {
  const [openSolutionId, setOpenSolutionId] = useState("");
  const hasUsefulSuggestions = suggestions.some((suggestion) => !suggestion.isFallback);

  return (
    <section className="jira-section jira-suggestions">
      <div className="jira-suggestions-heading">
        <h3>Soluciones sugeridas</h3>
        {!hasUsefulSuggestions && (
          <p>No hay una solucion confiable para este ticket. Usar diagnostico general o crear nueva ficha.</p>
        )}
      </div>

      <div className="jira-suggestion-list">
        {suggestions.map(({ solution, score, reason, isFallback }) => {
          const isOpen = openSolutionId === solution.id;
          const commandTextValue = solution.commands.map(commandText).join("\n");
          const stepsTextValue = numberedLines(solution.steps);

          return (
            <article key={solution.id} className={isFallback ? "fallback" : ""}>
              <div className="jira-suggestion-main">
                <div className="jira-suggestion-copy">
                  <strong>{solution.title}</strong>
                  <span className="jira-suggestion-category">{solution.category}</span>
                  <p>{reason}</p>
                </div>
                <div className="jira-suggestion-meta">
                  <small><span>Score</span>{score}</small>
                  <small><span>Tiempo</span>{solution.time}</small>
                  <small><span>Riesgo</span>{solution.risk}</small>
                </div>
              </div>

              <div className="jira-suggestion-actions">
                <button
                  className="secondary-action"
                  onClick={() => setOpenSolutionId(isOpen ? "" : solution.id)}
                >
                  {isOpen ? "Cerrar ficha" : "Abrir ficha"}
                </button>
                <button onClick={() => copyText(commandTextValue)} disabled={!commandTextValue}>
                  Copiar comandos
                </button>
                <button onClick={() => copyText(stepsTextValue)} disabled={!stepsTextValue}>
                  Copiar pasos
                </button>
              </div>

              {isOpen && (
                <div className="jira-inline-solution">
                  <div>
                    <h4>Pasos sugeridos</h4>
                    <ol>
                      {solution.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {solution.commands.length > 0 && (
                    <div>
                      <h4>Comandos</h4>
                      <div className="jira-inline-commands">
                        {solution.commands.map((command) => (
                          <div key={command.command}>
                            <code>{command.command}</code>
                            {command.description && <p>{command.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {solution.internalNotes && (
                    <div>
                      <h4>Notas internas</h4>
                      <p>{solution.internalNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default JiraSuggestedSolutions;
