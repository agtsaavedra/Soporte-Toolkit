export {
  fetchAllHelpdeskTickets,
  fetchHelpdeskTickets,
  fetchTicketByKey,
} from "./jira/jiraClient";

export {
  extractADFText,
  getIssuePlainText,
  normalizeJiraIssue,
} from "./jira/jiraNormalizer";

export {
  clearTicketCache,
  getTicketCacheMeta,
  loadCachedHelpdeskTickets,
  saveTicketsToCache,
} from "./jira/jiraCache";
