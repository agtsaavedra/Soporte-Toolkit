import { describe, expect, it } from "vitest";
import { validateSolutionShape } from "../solutionSchema";

describe("solutionSchema", () => {
  it("acepta una solucion minima valida", () => {
    expect(
      validateSolutionShape({
        title: "Diagnostico basico",
        category: "General",
        steps: ["Revisar contexto"],
      })
    ).toEqual([]);
  });

  it("rechaza campos requeridos faltantes", () => {
    expect(validateSolutionShape({ category: "General" })).toContain(
      "Falta el campo requerido: title."
    );
  });

  it("rechaza listas con formato incorrecto", () => {
    expect(
      validateSolutionShape({
        title: "Ficha rota",
        category: "General",
        steps: "No deberia ser texto",
      })
    ).toContain("El campo steps debe ser una lista.");
  });
});
