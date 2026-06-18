import { useState } from "react";
import "../styles/solution-card.css";

const COPY_MESSAGE_TIMEOUT = 1800;

const commandText = (command) =>
  typeof command === "string" ? command : command.command;

const sectionToText = (title, items, formatter = (item) => `- ${item}`) =>
  `${title}:\n${items.map(formatter).join("\n")}`;

const buildProcedure = (solution) =>
  [
    solution.title,
    `Categoría: ${solution.category}`,
    `Riesgo: ${solution.risk}`,
    `Tiempo estimado: ${solution.time}`,
    "",
    sectionToText("Síntomas", solution.symptoms),
    "",
    sectionToText("Causas posibles", solution.causes),
    "",
    sectionToText(
      "Pasos sugeridos",
      solution.steps,
      (item, index) => `${index + 1}. ${item}`
    ),
    "",
    sectionToText(
      "Comandos",
      solution.commands,
      (command) =>
        `- ${commandText(command)}${
          command.description ? `\n  Descripción: ${command.description}` : ""
        }`
    ),
    "",
    "Mensaje para usuario:",
    solution.userMessage,
    "",
    "Notas internas:",
    solution.internalNotes,
  ].join("\n");

const SolutionCard = ({ solution, onDelete, onEdit }) => {
  const [copiedLabel, setCopiedLabel] = useState("");
  const isEditable = solution.source !== "base";

  const copyText = async (text, label) => {
    await navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), COPY_MESSAGE_TIMEOUT);
  };

  const commandsText = solution.commands.map(commandText).join("\n");

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
              <button className="secondary-action" onClick={onEdit}>
                Editar
              </button>
              <button className="danger-action" onClick={onDelete}>
                Eliminar
              </button>
            </>
          )}
          <button
            className="secondary-action"
            onClick={() => copyText(commandsText, "Comandos")}
          >
            Copiar comandos
          </button>
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
        {isEditable && <span className="source">Agregada</span>}
      </div>

      <div className="tags">
        {solution.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

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

      <section>
        <h3>Comandos</h3>
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
        </div>
      </section>

      <section>
        <h3>Mensaje para usuario</h3>
        <div className="user-message">
          <p>{solution.userMessage}</p>
          <button onClick={() => copyText(solution.userMessage, "Mensaje")}>
            Copiar mensaje
          </button>
        </div>
      </section>

      <section>
        <h3>Notas internas</h3>
        <div className="internal-notes">{solution.internalNotes}</div>
      </section>
    </article>
  );
};

export default SolutionCard;
