import { solutions } from "../src/data/catalog.js";
import { getSuggestedSolutions } from "../src/services/solutionMatcher.js";

const cases = [
  ["Instalacion Power BI Desktop", ["Instalacion Power BI Desktop"]],
  ["Blanqueo contraseña AG usuario inhabilitado", ["Blanqueo / desbloqueo AGSERVER"]],
  ["FortiClient no muestra Remote Access", ["FortiClient no muestra Remote Access"]],
  ["No imprime la impresora IGRO06", ["Liberar impresora / cola bloqueada"]],
  ["Outlook lento, se cuelga al abrir correo", ["Outlook lento / OST grande"]],
  ["Quitar WPS, los documentos abren con WPS", ["Quitar WPS Office por PowerShell"]],
  ["Configurar SAP GUI CGP", ["SAP GUI - Configuracion CGP"]],
  ["Crear nueva sesion AGSERVER AS400", ["AGSERVER / AS400 - Nueva sesion"]],
  ["DebMedia no muestra pantalla de DNI", ["DebMedia Player - Configuracion"]],
  ["ROOTS error excepcion", ["ROOTS / error de excepcion"]],
];

const toIssue = (summary) => ({
  key: "TEST-1",
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

let failures = 0;

cases.forEach(([summary, expectedTitles]) => {
  const suggestions = getSuggestedSolutions(toIssue(summary), solutions, 5);
  const titles = suggestions.map((suggestion) => suggestion.solution.title);
  const missingTitles = expectedTitles.filter((title) => !titles.includes(title));

  if (missingTitles.length > 0) {
    failures += 1;
    console.error(`Fallo: ${summary}`);
    console.error(`  Esperado: ${expectedTitles.join(", ")}`);
    console.error(`  Recibido:  ${titles.join(", ") || "sin sugerencias"}`);
  }
});

if (failures > 0) {
  process.exitCode = 1;
} else {
  console.log("Matcher OK: casos principales cubiertos.");
}
