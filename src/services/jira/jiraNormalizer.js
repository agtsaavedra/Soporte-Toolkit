import { JIRA_BASE_URL } from "../../config/jiraConfig";
import { detectJiraCategory } from "./jiraCategoryDetector";

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
    url: issue.key ? `${JIRA_BASE_URL}/browse/${issue.key}` : "",
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
  normalized.detectedCategory = detectJiraCategory(normalized.plainText);
  normalized.searchText = [
    normalized.key,
    normalized.summary,
    normalized.description,
    normalized.reporter,
    normalized.assignee,
    normalized.status,
    normalized.priority,
    normalized.detectedCategory,
    normalized.plainText,
  ]
    .join(" ")
    .toLocaleLowerCase("es-AR");

  return normalized;
};
