export const JIRA_TICKETS_STORAGE_KEY = "support-toolkit-jira-tickets";

const JIRA_BASE_URL = "https://camuzzigas.atlassian.net/browse";

const DETECTED_CATEGORIES = [
  ["Claves y usuarios", ["clave", "password", "contrasena", "bloqueado", "usuario"]],
  ["Instalacion de software", ["instalar", "software", "programa", "power bi", "autocad", "google earth"]],
  ["Outlook / Office", ["outlook", "office", "excel", "word", "pst", "ost", "onedrive"]],
  ["Impresoras y scanners", ["impresora", "scanner", "escaner", "plotter", "spooler"]],
  ["Red / VPN / FortiClient", ["vpn", "forticlient", "dns", "red", "winrm", "remote access"]],
  ["SAP / AGSERVER / AS400", ["sap", "agserver", "as400", "cgp"]],
  ["Equipos / hardware", ["equipo", "notebook", "pc", "disco", "hardware", "perfil"]],
  ["Aplicaciones internas", ["debmedia", "roots", "proserlink", "model 5"]],
];

export const extractADFText = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(extractADFText).filter(Boolean).join(" ");
  if (typeof value !== "object") return String(value);

  const pieces = [];
  if (value.text) pieces.push(value.text);
  if (value.content) pieces.push(extractADFText(value.content));
  if (value.attrs?.text) pieces.push(value.attrs.text);

  return pieces.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
};

const normalizeUser = (user) => {
  if (!user) return "Sin asignar";
  return user.displayName || user.emailAddress || user.name || user.accountId || "Sin asignar";
};

const normalizeStatus = (status) => status?.name || status || "Sin estado";
const normalizePriority = (priority) => priority?.name || priority || "Sin prioridad";

const getComments = (fields = {}) =>
  (fields.comment?.comments ?? []).map((comment) => ({
    id: comment.id,
    author: normalizeUser(comment.author),
    created: comment.created,
    body: extractADFText(comment.body),
  }));

const getChangelog = (issue) =>
  (issue.changelog?.histories ?? []).map((history) => ({
    id: history.id,
    author: normalizeUser(history.author),
    created: history.created,
    items: (history.items ?? []).map((item) => ({
      field: item.field,
      from: item.fromString ?? item.from ?? "",
      to: item.toString ?? item.to ?? "",
    })),
  }));

const detectCategory = (text) => {
  const normalized = text.toLocaleLowerCase("es-AR");
  const match = DETECTED_CATEGORIES.find(([, keywords]) =>
    keywords.some((keyword) => normalized.includes(keyword))
  );

  return match?.[0] ?? "Sin clasificar";
};

export const getIssuePlainText = (issue) =>
  [
    issue.key,
    issue.summary,
    issue.description,
    issue.status,
    issue.priority,
    issue.assignee,
    issue.reporter,
    issue.detectedCategory,
    ...issue.comments.map((comment) => comment.body),
    ...issue.changelog.flatMap((history) =>
      history.items.map((item) => `${item.field} ${item.from} ${item.to}`)
    ),
  ]
    .filter(Boolean)
    .join(" ");

export const normalizeJiraIssue = (issue) => {
  const fields = issue.fields ?? {};
  const normalized = {
    id: issue.id ?? issue.key,
    key: issue.key ?? "SIN-KEY",
    url: issue.key ? `${JIRA_BASE_URL}/${issue.key}` : "",
    summary: fields.summary ?? "Sin resumen",
    description: extractADFText(fields.description),
    status: normalizeStatus(fields.status),
    resolution: fields.resolution?.name ?? "Sin resolucion",
    priority: normalizePriority(fields.priority),
    issueType: fields.issuetype?.name ?? "Sin tipo",
    created: fields.created ?? issue.created ?? "",
    resolutionDate: fields.resolutiondate ?? "",
    assignee: normalizeUser(fields.assignee),
    reporter: normalizeUser(fields.reporter),
    comments: getComments(fields),
    changelog: getChangelog(issue),
    raw: issue,
  };

  normalized.plainText = getIssuePlainText(normalized);
  normalized.detectedCategory = detectCategory(normalized.plainText);

  return normalized;
};

const readJsonFile = async (file) => {
  const text = await file.text();
  return JSON.parse(text);
};

const extractIssues = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.issues)) return payload.issues;
  if (Array.isArray(payload.data?.issues)) return payload.data.issues;
  return [];
};

export const parseJiraExportFiles = async (files) => {
  const parsedPayloads = await Promise.all([...files].map(readJsonFile));
  const byKey = new Map();

  parsedPayloads.flatMap(extractIssues).forEach((issue) => {
    const normalized = normalizeJiraIssue(issue);
    if (normalized.key !== "SIN-KEY") byKey.set(normalized.key, normalized);
  });

  return [...byKey.values()].sort((a, b) => new Date(b.created) - new Date(a.created));
};

export const saveTicketsToStorage = (tickets) => {
  localStorage.setItem(JIRA_TICKETS_STORAGE_KEY, JSON.stringify(tickets));
};

export const loadTicketsFromStorage = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(JIRA_TICKETS_STORAGE_KEY) ?? "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

export const clearTicketsFromStorage = () => {
  localStorage.removeItem(JIRA_TICKETS_STORAGE_KEY);
};
