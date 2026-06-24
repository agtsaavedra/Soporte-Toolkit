const DEFAULT_AI_ENDPOINT = "/api/ai/helpdesk";

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

export const buildHelpdeskAiPrompt = ({ ticket, suggestions, question }) => {
  const compactSuggestions = suggestions.slice(0, 4).map(({ solution, score, reason }) => ({
    title: solution.title,
    category: solution.category,
    intent: solution.intent,
    score,
    reason,
    steps: solution.steps,
    commands: solution.commands,
    jiraTemplate: solution.jiraTemplate || solution.userMessage,
  }));

  return [
    "Actua como asistente senior de Mesa de Ayuda IT.",
    "Objetivo: ayudar a resolver el ticket con pasos concretos, sin relleno y sin inventar datos.",
    "No pidas credenciales ni sugieras compartir contrasenas, tokens o datos sensibles.",
    "",
    `Consulta del tecnico: ${question}`,
    "",
    "Ticket Jira:",
    `Key: ${ticket.key}`,
    `Resumen: ${ticket.summary}`,
    `Estado: ${ticket.status}`,
    `Prioridad: ${ticket.priority}`,
    `Asignado: ${ticket.assignee}`,
    `Reporta: ${ticket.reporter}`,
    `Descripcion: ${ticket.description || "Sin descripcion."}`,
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
            `  Respuesta Jira sugerida: ${item.jiraTemplate}`,
          ].join("\n")
      )
      .join("\n\n") || "Sin soluciones confiables.",
    "",
    "Devolve una respuesta breve con este formato:",
    "Diagnostico probable:",
    "Acciones recomendadas:",
    "Respuesta para pegar en Jira:",
    "Datos faltantes si aplica:",
  ].join("\n");
};

export const requestAiAdvice = async ({ prompt, ticket, question }) => {
  const endpoint = import.meta.env.VITE_AI_ASSISTANT_ENDPOINT || DEFAULT_AI_ENDPOINT;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      question,
      ticket: {
        key: ticket.key,
        summary: ticket.summary,
        status: ticket.status,
        priority: ticket.priority,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`El asistente IA respondio ${response.status}`);
  }

  const data = await response.json();

  return (
    data.text ||
    data.answer ||
    data.message ||
    data.output_text ||
    data.choices?.[0]?.message?.content ||
    "La IA no devolvio contenido util."
  );
};
