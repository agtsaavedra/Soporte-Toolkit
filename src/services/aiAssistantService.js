const formatList = (items = []) =>
  items
    .filter(Boolean)
    .map((item, index) => `${index + 1}. ${item}`)
    .join("\n");

const formatCommands = (commands = []) =>
  commands
    .map((command) => {
      const value = command.command ?? command;
      const description = command.description ? ` - ${command.description}` : "";
      return `${value}${description}`;
    })
    .join("\n");

// Construye un prompt técnico y autocontenido para pegar en ChatGPT.
// No genera mensajes para el solicitante: solo pide diagnóstico, acciones y riesgos.
export const buildHelpdeskAiPrompt = ({ ticket, suggestions, question }) => {
  const compactSuggestions = suggestions.slice(0, 4).map(({ solution, score, reason }) => ({
    title: solution.title,
    category: solution.category,
    intent: solution.intent,
    score,
    reason,
    steps: solution.steps,
    commands: solution.commands,
  }));

  return [
    "Actuá como asistente senior de Mesa de Ayuda IT.",
    "Objetivo: ayudar a resolver el ticket con pasos concretos, sin relleno y sin inventar datos.",
    "No pidas credenciales ni sugieras compartir contraseñas, tokens o datos sensibles.",
    "",
    `Consulta del técnico: ${question}`,
    "",
    "Ticket Jira:",
    `Key: ${ticket.key}`,
    `Resumen: ${ticket.summary}`,
    `Estado: ${ticket.status}`,
    `Prioridad: ${ticket.priority}`,
    `Asignado: ${ticket.assignee}`,
    `Reporta: ${ticket.reporter}`,
    `Descripción: ${ticket.description || "Sin descripción."}`,
    "",
    "Comentarios recientes:",
    ticket.comments.slice(-3).map((comment) => `- ${comment.author}: ${comment.body}`).join("\n") || "- Sin comentarios.",
    "",
    "Soluciones sugeridas por el toolkit:",
    compactSuggestions
      .map(
        (item) =>
          [
            `- ${item.title} (${item.category})`,
            `  Score: ${item.score}`,
            `  Motivo: ${item.reason}`,
            `  Pasos:\n${formatList(item.steps)}`,
            `  Comandos:\n${formatCommands(item.commands) || "Sin comandos."}`,
          ].join("\n")
      )
      .join("\n\n") || "Sin soluciones confiables.",
    "",
    "Devolvé una salida breve con este formato:",
    "Diagnóstico probable:",
    "Acciones recomendadas:",
    "Datos faltantes si aplica:",
    "Riesgos o validaciones antes de ejecutar:",
  ].join("\n");
};
