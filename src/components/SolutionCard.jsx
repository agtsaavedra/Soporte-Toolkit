import { useState } from "react";
import "../styles/features/solutions/card.css";

const COPY_MESSAGE_TIMEOUT = 1800;

const commandText = (command) =>
  typeof command === "string" ? command : command.command;

const commandDescription = (command) =>
  typeof command === "string" ? "" : command.description;

const sectionToText = (title, items, formatter = (item) => `- ${item}`) =>
  items.length > 0 ? `${title}:\n${items.map(formatter).join("\n")}` : "";

const numberedLines = (items) =>
  items.map((item, index) => `${index + 1}. ${item}`).join("\n");

const buildProcedure = (solution) =>
  [
    solution.title,
    `Categoría: ${solution.category}`,
    `Riesgo: ${solution.risk}`,
    `Tiempo estimado: ${solution.time}`,
    solution.requiresApproval ? "Requiere aprobación: sí" : "",
    solution.licenseRequired ? "Requiere licencia: sí" : "",
    solution.officialDownloadUrl ? `Descarga oficial: ${solution.officialDownloadUrl}` : "",
    solution.internalDownloadPath ? `Ruta interna: ${solution.internalDownloadPath}` : "",
    solution.installerFile ? `Instalador esperado: ${solution.installerFile}` : "",
    solution.installerNotes ? `Notas de instalación: ${solution.installerNotes}` : "",
    "",
    sectionToText("Síntomas", solution.symptoms),
    "",
    sectionToText("Causas posibles", solution.causes),
    "",
    sectionToText("Pasos sugeridos", solution.steps, (item, index) => `${index + 1}. ${item}`),
    "",
    sectionToText(
      "Comandos",
      solution.commands,
      (command) =>
        `- ${commandText(command)}${
          commandDescription(command) ? `\n  Descripción: ${commandDescription(command)}` : ""
        }`
    ),
    "",
    sectionToText("Comandos de instalación", solution.installCommands, commandText),
    "",
    sectionToText("Pasos de validación", solution.verificationSteps),
    "",
    solution.jiraTemplate ? `Nota Jira:\n${solution.jiraTemplate}` : "",
    "",
    "Notas internas:",
    solution.internalNotes,
  ]
    .filter(Boolean)
    .join("\n");

const SolutionCard = ({ history = [], solution, onDelete, onEdit, onPromote }) => {
  const [copiedLabel, setCopiedLabel] = useState("");
  const isEditable = solution.source !== "base";
  const canPromote = isEditable && solution.source !== "shared";
  const commandsText = solution.commands.map(commandText).join("\n");
  const installCommandsText = solution.installCommands.map(commandText).join("\n");
  const verificationText = numberedLines(solution.verificationSteps);

  const copyText = async (text, label) => {
    await navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), COPY_MESSAGE_TIMEOUT);
  };

  return (
    <article className="solution-card">
      <div className="solution-top">
        <div>
          <p className="eyebrow">{solution.category}</p>
          <h2>{solution.title}</h2>
        </div>

        <div className="quick-actions">
          {isEditable && (
            <>
              {canPromote && (
                <button className="secondary-action" onClick={onPromote}>
                  Publicar
                </button>
              )}
              <button className="secondary-action" onClick={onEdit}>
                Editar
              </button>
              <button className="danger-action" onClick={onDelete}>
                Eliminar
              </button>
            </>
          )}
          <button onClick={() => copyText(buildProcedure(solution), "Ficha")}>
            Copiar ficha
          </button>
        </div>
      </div>

      {copiedLabel && (
        <div className="copy-status" role="status">
          {copiedLabel} copiado al portapapeles
        </div>
      )}

      <div className="meta-row">
        <span className={`risk risk-${solution.risk.toLowerCase()}`}>
          Riesgo {solution.risk}
        </span>
        <span className="time">Tiempo {solution.time}</span>
        {solution.requiresApproval && <span className="source">Requiere aprobación</span>}
        {solution.licenseRequired && <span className="source">Requiere licencia</span>}
        {isEditable && <span className="source">Agregada</span>}
      </div>

      <div className="tags">
        {solution.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      {(solution.officialDownloadUrl ||
        solution.internalDownloadPath ||
        solution.installerFile ||
        solution.installerNotes) && (
        <section>
          <div className="section-heading">
            <h3>Descarga e instalador</h3>
            <div className="section-actions">
              {solution.officialDownloadUrl && (
                <button
                  className="secondary-action"
                  onClick={() => window.open(solution.officialDownloadUrl, "_blank", "noreferrer")}
                >
                  Abrir descarga oficial
                </button>
              )}
              {solution.internalDownloadPath && (
                <button
                  className="secondary-action"
                  onClick={() => copyText(solution.internalDownloadPath, "Ruta interna")}
                >
                  Copiar ruta interna
                </button>
              )}
            </div>
          </div>
          <div className="install-info-grid">
            {solution.officialDownloadUrl && (
              <div>
                <strong>Descarga oficial</strong>
                <a href={solution.officialDownloadUrl} target="_blank" rel="noreferrer">
                  {solution.officialDownloadUrl}
                </a>
              </div>
            )}
            {solution.internalDownloadPath && (
              <div>
                <strong>Ruta interna</strong>
                <code>{solution.internalDownloadPath}</code>
              </div>
            )}
            {solution.installerFile && (
              <div>
                <strong>Instalador esperado</strong>
                <span>{solution.installerFile}</span>
              </div>
            )}
            {solution.installerNotes && (
              <div>
                <strong>Notas de instalación</strong>
                <span>{solution.installerNotes}</span>
              </div>
            )}
          </div>
        </section>
      )}

      <section>
        <h3>Síntomas</h3>
        <ul>
          {solution.symptoms.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Causas posibles</h3>
        <ul>
          {solution.causes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Pasos sugeridos</h3>
        <ol>
          {solution.steps.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      {solution.installCommands.length > 0 && (
        <section>
          <div className="section-heading">
            <h3>Comandos de instalación</h3>
            <div className="section-actions">
              <button
                className="secondary-action"
                onClick={() => copyText(installCommandsText, "Comandos de instalación")}
              >
                Copiar comandos instalación
              </button>
            </div>
          </div>
          <div className="commands">
            {solution.installCommands.map((command) => (
              <div key={commandText(command)} className="command-box">
                <div className="command-content">
                  <code>{commandText(command)}</code>
                  {commandDescription(command) && (
                    <p>
                      <strong>Descripción:</strong> {commandDescription(command)}
                    </p>
                  )}
                </div>
                <button onClick={() => copyText(commandText(command), "Comando")}>
                  Copiar
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {solution.verificationSteps.length > 0 && (
        <section>
          <div className="section-heading">
            <h3>Pasos de validación</h3>
            <div className="section-actions">
              <button
                className="secondary-action"
                onClick={() => copyText(verificationText, "Pasos de validación")}
              >
                Copiar validación
              </button>
            </div>
          </div>
          <ol>
            {solution.verificationSteps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
      )}

      <section>
        <div className="section-heading">
          <h3>Comandos</h3>
          {commandsText && (
            <div className="section-actions">
              <button
                className="secondary-action"
                onClick={() => copyText(commandsText, "Comandos")}
              >
                Copiar comandos
              </button>
            </div>
          )}
        </div>
        <div className="commands">
          {solution.commands.map((command) => (
            <div key={command.command} className="command-box">
              <div className="command-content">
                <code>{command.command}</code>
                {command.description && (
                  <p>
                    <strong>Descripción:</strong> {command.description}
                  </p>
                )}
              </div>
              <button onClick={() => copyText(command.command, "Comando")}>
                Copiar
              </button>
            </div>
          ))}
          {solution.commands.length === 0 && (
            <p className="empty-results">Esta ficha no tiene comandos asociados.</p>
          )}
        </div>
      </section>

      {solution.jiraTemplate && (
        <section>
          <div className="section-heading">
            <h3>Nota Jira</h3>
            <div className="section-actions">
              <button
                className="secondary-action"
                onClick={() => copyText(solution.jiraTemplate, "Nota Jira")}
              >
                Copiar nota Jira
              </button>
            </div>
          </div>
          <div className="user-message">{solution.jiraTemplate}</div>
        </section>
      )}

      <section>
        <h3>Notas internas</h3>
        <div className="internal-notes">{solution.internalNotes}</div>
      </section>

      {history.length > 0 && (
        <section>
          <h3>Historial reciente</h3>
          <div className="history-list">
            {history.map((item) => (
              <div key={`${item.created_at}-${item.action}`}>
                <strong>{item.action}</strong>
                <span>{item.actor}</span>
                <time>{new Date(item.created_at).toLocaleString("es-AR")}</time>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};

export default SolutionCard;
