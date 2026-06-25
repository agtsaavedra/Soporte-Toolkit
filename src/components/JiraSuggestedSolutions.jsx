import { useState } from "react";
import "../styles/features/jira/suggested-solutions.css";

const commandText = (command) => command.command ?? command;

const copyText = async (text) => {
  await navigator.clipboard.writeText(text);
};

const numberedLines = (items) =>
  items.map((item, index) => `${index + 1}. ${item}`).join("\n");

const JiraSuggestedSolutions = ({ suggestions, isLoading = false }) => {
  const [openSolutionId, setOpenSolutionId] = useState("");
  const hasUsefulSuggestions = suggestions.some((suggestion) => !suggestion.isFallback);

  return (
    <section className="jira-section jira-suggestions">
      <div className="jira-suggestions-heading">
        <h3>Soluciones sugeridas</h3>
        {isLoading && <p>Analizando ticket contra la base de soluciones...</p>}
        {!isLoading && !hasUsefulSuggestions && (
          <p>No hay una solucion confiable para este ticket. Usar diagnostico general o crear nueva ficha.</p>
        )}
      </div>

      {!isLoading && (
        <div className="jira-suggestion-list">
          {suggestions.map(({ solution, score, reason, isFallback }) => {
            const isOpen = openSolutionId === solution.id;
            const commandTextValue = solution.commands.map(commandText).join("\n");
            const installCommandsTextValue = solution.installCommands.map(commandText).join("\n");
            const stepsTextValue = numberedLines(solution.steps);
            const verificationTextValue = numberedLines(solution.verificationSteps);

            return (
              <article key={solution.id} className={isFallback ? "fallback" : ""}>
                <div className="jira-suggestion-main">
                  <div className="jira-suggestion-copy">
                    <strong>{solution.title}</strong>
                    <span className="jira-suggestion-category">{solution.category}</span>
                    <p>{reason}</p>

                    {(solution.officialDownloadUrl || solution.internalDownloadPath) && (
                      <div className="jira-suggestion-downloads">
                        {solution.officialDownloadUrl && (
                          <a href={solution.officialDownloadUrl} target="_blank" rel="noreferrer">
                            Descarga oficial
                          </a>
                        )}
                        {solution.internalDownloadPath && (
                          <code>{solution.internalDownloadPath}</code>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="jira-suggestion-meta">
                    <small><span>Score</span>{score}</small>
                    <small><span>Tiempo</span>{solution.time}</small>
                    <small><span>Riesgo</span>{solution.risk}</small>
                    {solution.requiresApproval && <small><span>Aprueba</span>Si</small>}
                    {solution.licenseRequired && <small><span>Licencia</span>Si</small>}
                  </div>
                </div>

                <div className="jira-suggestion-actions">
                  <button
                    className="secondary-action"
                    onClick={() => setOpenSolutionId(isOpen ? "" : solution.id)}
                  >
                    {isOpen ? "Cerrar ficha" : "Abrir ficha"}
                  </button>
                  {solution.officialDownloadUrl && (
                    <button
                      className="secondary-action"
                      onClick={() => window.open(solution.officialDownloadUrl, "_blank", "noreferrer")}
                    >
                      Abrir descarga oficial
                    </button>
                  )}
                  <button
                    onClick={() => copyText(solution.internalDownloadPath)}
                    disabled={!solution.internalDownloadPath}
                  >
                    Copiar ruta interna
                  </button>
                  <button
                    onClick={() => copyText(solution.jiraTemplate)}
                    disabled={!solution.jiraTemplate}
                  >
                    Copiar respuesta Jira
                  </button>
                  <button onClick={() => copyText(commandTextValue)} disabled={!commandTextValue}>
                    Copiar comandos
                  </button>
                  <button
                    onClick={() => copyText(installCommandsTextValue)}
                    disabled={!installCommandsTextValue}
                  >
                    Copiar instalacion
                  </button>
                  <button onClick={() => copyText(stepsTextValue)} disabled={!stepsTextValue}>
                    Copiar pasos
                  </button>
                  <button
                    onClick={() => copyText(verificationTextValue)}
                    disabled={!verificationTextValue}
                  >
                    Copiar validacion
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

                    {solution.verificationSteps.length > 0 && (
                      <div>
                        <h4>Validacion</h4>
                        <ol>
                          {solution.verificationSteps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {(solution.commands.length > 0 || solution.installCommands.length > 0) && (
                      <div>
                        <h4>Comandos</h4>
                        <div className="jira-inline-commands">
                          {[...solution.commands, ...solution.installCommands].map((command) => (
                            <div key={commandText(command)}>
                              <code>{commandText(command)}</code>
                              {command.description && <p>{command.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {solution.jiraTemplate && (
                      <div>
                        <h4>Template Jira</h4>
                        <p>{solution.jiraTemplate}</p>
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
      )}
    </section>
  );
};

export default JiraSuggestedSolutions;
