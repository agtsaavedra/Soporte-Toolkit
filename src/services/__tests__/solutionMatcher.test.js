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
    ["Instalacion Google Earth de Escritorio", "Instalacion Google Earth Pro"],
    ["Instalacion de software Fluke Connect Desktop para camara termografica", "Instalacion Fluke Connect Desktop"],
    ["Instalar AGSERVER viejo 7.1 no Java SI00000", "IBM i Access 7.1 / AGSERVER viejo (NO JAVA)"],
    ["Crear nueva sesion AGSERVER AS400", "AGSERVER / AS400 - Nueva sesion 5250"],
    ["Instalar Adobe Reader para PDF", "Instalacion Adobe Reader"],
    ["Instalar Acrobat Pro", "Acrobat Pro - instalacion con licencia"],
    ["Necesito ver archivo DWG", "DWG TrueView / Autodesk Viewer"],
    ["Instalar scanner HP ScanJet", "HP ScanJet / scanner HP"],
    ["Instalar tickeadora Epson TM-U220", "Epson TM-U220 / Tickeadora"],
    ["No imprime la impresora IGRO06", "Liberar impresora / cola bloqueada"],
    ["ROOTS error excepcion", "ROOTS / error de excepcion"],
  ])("sugiere una solucion especifica para %s", (summary, expectedTitle) => {
    const titles = getSuggestedSolutions(issue(summary), solutions, 5).map(
      (suggestion) => suggestion.solution.title
    );

    expect(titles).toContain(expectedTitle);
  });
});
