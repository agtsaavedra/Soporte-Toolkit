import { describe, expect, it } from "vitest";
import { solutions } from "../../data/catalog";
import { getSuggestedSolutions } from "../solutionMatcher";

const issue = (summary) => ({
  key: "REQ-TEST",
  summary,
  description: "",
  status: "Nuevo",
  priority: "Normal",
  assignee: "Sin asignar",
  reporter: "Tester",
  detectedCategory: "",
  comments: [],
  changelog: [],
});

describe("solutionMatcher", () => {
  it.each([
    ["Instalacion Power BI Desktop", "Instalacion Power BI Desktop"],
    ["Blanqueo contraseña AG usuario inhabilitado", "Blanqueo / desbloqueo AGSERVER"],
    ["FortiClient no muestra Remote Access", "FortiClient no muestra Remote Access"],
    ["No imprime la impresora IGRO06", "Liberar impresora / cola bloqueada"],
    ["ROOTS error excepcion", "ROOTS / error de excepcion"],
  ])("sugiere una solucion especifica para %s", (summary, expectedTitle) => {
    const titles = getSuggestedSolutions(issue(summary), solutions, 5).map(
      (suggestion) => suggestion.solution.title
    );

    expect(titles).toContain(expectedTitle);
  });
});
