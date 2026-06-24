export const JIRA_BASE_URL = "https://camuzzigas.atlassian.net";
export const JIRA_HELPDESK_JQL = "cf[10212]=11239 ORDER BY created DESC";
export const JIRA_PAGE_SIZE = 100;

export const JIRA_LIST_FIELDS = [
  "summary",
  "status",
  "resolution",
  "priority",
  "issuetype",
  "created",
  "resolutiondate",
  "assignee",
  "reporter",
].join(",");

export const JIRA_DETAIL_FIELDS = [
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
