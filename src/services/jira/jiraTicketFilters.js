export const ALL_FILTER = "Todos";

export const formatJiraDate = (value, emptyValue = "-") => {
  if (!value) return emptyValue;
  return new Date(value).toLocaleString("es-AR");
};

export const uniqueTicketValues = (tickets, field) => [
  ALL_FILTER,
  ...new Set(tickets.map((ticket) => ticket[field]).filter(Boolean)),
];

export const buildTicketSearchText = (ticket) =>
  [
    ticket.key,
    ticket.summary,
    ticket.description,
    ticket.reporter,
    ticket.assignee,
    ticket.status,
    ticket.priority,
    ticket.detectedCategory,
    ticket.plainText,
  ]
    .join(" ")
    .toLocaleLowerCase("es-AR");

export const withTicketSearchIndex = (ticket) => {
  if (ticket.searchText) return ticket;
  return {
    ...ticket,
    searchText: buildTicketSearchText(ticket),
  };
};

const matchesQuery = (ticket, query) => {
  if (!query) return true;
  return ticket.searchText.includes(query.toLocaleLowerCase("es-AR"));
};

export const filterJiraTickets = (tickets, filters) =>
  tickets.filter(
    (ticket) =>
      matchesQuery(ticket, filters.query) &&
      (filters.status === ALL_FILTER || ticket.status === filters.status) &&
      (filters.assignee === ALL_FILTER || ticket.assignee === filters.assignee) &&
      (filters.priority === ALL_FILTER || ticket.priority === filters.priority) &&
      (filters.category === ALL_FILTER || ticket.detectedCategory === filters.category)
  );

export const buildTicketFilterOptions = (tickets) => ({
  statuses: uniqueTicketValues(tickets, "status"),
  assignees: uniqueTicketValues(tickets, "assignee"),
  priorities: uniqueTicketValues(tickets, "priority"),
  categories: uniqueTicketValues(tickets, "detectedCategory"),
});
