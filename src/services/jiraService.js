export const JIRA_BASE_URL = "https://camuzzigas.atlassian.net";
export const JIRA_HELPDESK_JQL = "cf[10212]=11239 ORDER BY created DESC";
export const JIRA_PAGE_SIZE = 100;

const DB_NAME = "soporte-toolkit-jira";
const DB_VERSION = 1;
const TICKETS_STORE = "tickets";
const META_STORE = "meta";
const META_KEY = "helpdesk";

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

const JIRA_FIELDS = [
  "summary",
  "description",
  "comment",
  "status",
  "resolution",
  "priority",
  "issuetype",
  "created",
  "resolutiondate",
  "assignee",
  "reporter",
].join(",");

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
  normalized.detectedCategory = detectCategory(normalized.plainText);

  return normalized;
};

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
  const url = new URL(path, JIRA_BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Jira respondio ${response.status}`);
  }

  return response.json();
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

const openDb = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(TICKETS_STORE)) {
        db.createObjectStore(TICKETS_STORE, { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const runStore = async (storeName, mode, callback) => {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const result = callback(store);

    tx.oncomplete = () => {
      db.close();
      resolve(result);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
};

export const loadCachedHelpdeskTickets = async () => {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(TICKETS_STORE, "readonly");
    const request = tx.objectStore(TICKETS_STORE).getAll();

    request.onsuccess = () => {
      db.close();
      resolve(
        request.result.sort((a, b) => new Date(b.created) - new Date(a.created))
      );
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
};

export const getTicketCacheMeta = async () => {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, "readonly");
    const request = tx.objectStore(META_STORE).get(META_KEY);

    request.onsuccess = () => {
      db.close();
      resolve(
        request.result ?? {
          id: META_KEY,
          lastSync: "",
          count: 0,
          latestCreated: "",
          nextPageToken: "",
          isLastPage: false,
        }
      );
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
};

export const saveTicketsToCache = async (
  tickets,
  {
    lastSync = new Date().toISOString(),
    nextPageToken,
    isLastPage,
  } = {}
) => {
  const currentTickets = await loadCachedHelpdeskTickets();
  const byKey = new Map(currentTickets.map((ticket) => [ticket.key, ticket]));
  tickets.forEach((ticket) => byKey.set(ticket.key, ticket));
  const mergedTickets = [...byKey.values()].sort(
    (a, b) => new Date(b.created) - new Date(a.created)
  );
  const latestCreated = mergedTickets[0]?.created ?? "";
  const currentMeta = await getTicketCacheMeta();

  await runStore(TICKETS_STORE, "readwrite", (store) => {
    mergedTickets.forEach((ticket) => store.put(ticket));
  });

  await runStore(META_STORE, "readwrite", (store) =>
    store.put({
      id: META_KEY,
      lastSync,
      count: mergedTickets.length,
      latestCreated,
      lastDiff: tickets.length,
      nextPageToken: nextPageToken ?? currentMeta.nextPageToken ?? "",
      isLastPage: isLastPage ?? currentMeta.isLastPage ?? false,
    })
  );

  return mergedTickets;
};

export const clearTicketCache = async () => {
  await runStore(TICKETS_STORE, "readwrite", (store) => store.clear());
  await runStore(META_STORE, "readwrite", (store) => store.delete(META_KEY));
};
