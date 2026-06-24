import { JIRA_BASE_URL, JIRA_FIELDS, JIRA_PAGE_SIZE } from "../../config/jiraConfig";
import { normalizeJiraIssue } from "./jiraNormalizer";

const formatJiraDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const buildJql = (filters = {}) => {
  const clauses = ["cf[10212]=11239"];

  if (filters.createdAfter) {
    const jiraDate = formatJiraDate(filters.createdAfter);
    if (jiraDate) clauses.push(`created > "${jiraDate}"`);
  }

  return `${clauses.join(" AND ")} ORDER BY created DESC`;
};

const jiraRequest = async (path, params) => {
  const proxyUrl = import.meta.env.VITE_JIRA_PROXY_URL;
  const url = new URL(path, proxyUrl || JIRA_BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  if (window.soporteToolkit?.jiraRequest) {
    return window.soporteToolkit.jiraRequest({ path, params });
  }

  try {
    const response = await fetch(url.toString(), {
      credentials: proxyUrl ? "same-origin" : "include",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Jira respondio ${response.status}${detail ? `: ${detail}` : ""}`);
    }

    return response.json();
  } catch (error) {
    throw new Error(
      proxyUrl
        ? `${error.message}. Revisa el proxy local de Jira y las variables JIRA_EMAIL/JIRA_API_TOKEN.`
        : `${error.message}. El navegador bloquea Jira por CORS aunque tengas sesion iniciada. Usa npm run web:dev con proxy local, o npm run desktop:dev.`,
      { cause: error }
    );
  }
};

export const fetchHelpdeskTickets = async ({
  nextPageToken,
  maxResults = JIRA_PAGE_SIZE,
  filters = {},
} = {}) => {
  const payload = await jiraRequest("/rest/api/3/search/jql", {
    jql: buildJql(filters),
    maxResults,
    nextPageToken,
    fields: JIRA_FIELDS,
    expand: "changelog",
  });

  return {
    tickets: (payload.issues ?? []).map(normalizeJiraIssue),
    nextPageToken: payload.nextPageToken ?? "",
    isLast: Boolean(payload.isLast),
    total: payload.total,
  };
};

export const fetchTicketByKey = async (key) => {
  const payload = await jiraRequest(`/rest/api/3/issue/${encodeURIComponent(key)}`, {
    fields: JIRA_FIELDS,
    expand: "changelog",
  });

  return normalizeJiraIssue(payload);
};

export const fetchAllHelpdeskTickets = async () => {
  const allTickets = [];
  let nextPageToken = "";
  let isLast = false;

  while (!isLast) {
    const result = await fetchHelpdeskTickets({ nextPageToken, maxResults: JIRA_PAGE_SIZE });
    allTickets.push(...result.tickets);
    nextPageToken = result.nextPageToken;
    isLast = result.isLast || !nextPageToken;
  }

  return allTickets;
};
