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
                        {solution.officialDownloadUrl && <span>Descarga oficial disponible</span>}
                        {solution.internalDownloadPath && <span>Ruta interna disponible</span>}
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
                </div>

                {isOpen && (
                  <div className="jira-inline-solution">
                    {(solution.officialDownloadUrl || solution.internalDownloadPath) && (
                      <div>
                        <div className="jira-inline-heading">
                          <h4>Descarga e instalador</h4>
                          <div className="jira-inline-actions">
                            {solution.officialDownloadUrl && (
                              <button
                                className="secondary-action"
                                onClick={() => window.open(solution.officialDownloadUrl, "_blank", "noreferrer")}
                              >
                                Abrir descarga oficial
                              </button>
                            )}
                            {solution.internalDownloadPath && (
                              <button onClick={() => copyText(solution.internalDownloadPath)}>
                                Copiar ruta interna
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="jira-inline-downloads">
                          {solution.officialDownloadUrl && (
                            <a href={solution.officialDownloadUrl} target="_blank" rel="noreferrer">
                              {solution.officialDownloadUrl}
                            </a>
                          )}
                          {solution.internalDownloadPath && <code>{solution.internalDownloadPath}</code>}
                          {solution.installerFile && <span>Instalador: {solution.installerFile}</span>}
                          {solution.installerNotes && <p>{solution.installerNotes}</p>}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="jira-inline-heading">
                        <h4>Pasos sugeridos</h4>
                        {stepsTextValue && (
                          <div className="jira-inline-actions">
                            <button onClick={() => copyText(stepsTextValue)}>Copiar pasos</button>
                          </div>
                        )}
                      </div>
                      <ol>
                        {solution.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {solution.verificationSteps.length > 0 && (
                      <div>
                        <div className="jira-inline-heading">
                          <h4>Validacion</h4>
                          <div className="jira-inline-actions">
                            <button onClick={() => copyText(verificationTextValue)}>
                              Copiar validacion
                            </button>
                          </div>
                        </div>
                        <ol>
                          {solution.verificationSteps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {(solution.commands.length > 0 || solution.installCommands.length > 0) && (
                      <div>
                        <div className="jira-inline-heading">
                          <h4>Comandos</h4>
                          <div className="jira-inline-actions">
                            {commandTextValue && (
                              <button onClick={() => copyText(commandTextValue)}>
                                Copiar comandos
                              </button>
                            )}
                            {installCommandsTextValue && (
                              <button onClick={() => copyText(installCommandsTextValue)}>
                                Copiar instalacion
                              </button>
                            )}
                          </div>
                        </div>
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
                        <div className="jira-inline-heading">
                          <h4>Template Jira</h4>
                          <div className="jira-inline-actions">
                            <button onClick={() => copyText(solution.jiraTemplate)}>
                              Copiar respuesta Jira
                            </button>
                          </div>
                        </div>
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
