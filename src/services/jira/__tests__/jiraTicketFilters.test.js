import { describe, expect, it } from "vitest";
import {
  ALL_FILTER,
  buildTicketFilterOptions,
  filterJiraTickets,
  withTicketSearchIndex,
} from "../jiraTicketFilters";

const tickets = [
  {
    key: "REQ-1",
    summary: "Instalar Power BI",
    description: "Usuario solicita Power BI Desktop",
    reporter: "Mesa",
    assignee: "Agustin",
    status: "Abierto",
    priority: "Normal",
    detectedCategory: "Software",
    plainText: "",
  },
  {
    key: "REQ-2",
    summary: "No imprime",
    description: "Impresora con cola bloqueada",
    reporter: "Mesa",
    assignee: "Sin asignar",
    status: "Pendiente",
    priority: "Alta",
    detectedCategory: "Impresoras",
    plainText: "",
  },
].map(withTicketSearchIndex);

describe("jiraTicketFilters", () => {
  it("filtra por texto y opciones combinadas", () => {
    const result = filterJiraTickets(tickets, {
      query: "power bi",
      status: "Abierto",
      assignee: ALL_FILTER,
      priority: "Normal",
      category: "Software",
    });

    expect(result).toHaveLength(1);
    expect(result[0].key).toBe("REQ-1");
  });

  it("genera opciones de filtro con Todos al inicio", () => {
    const options = buildTicketFilterOptions(tickets);

    expect(options.statuses).toEqual([ALL_FILTER, "Abierto", "Pendiente"]);
    expect(options.categories).toEqual([ALL_FILTER, "Software", "Impresoras"]);
  });
});
