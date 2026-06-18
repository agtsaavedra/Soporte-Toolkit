import { solutions as rawSolutions } from "./baseSolutions";

export const ALL_CATEGORIES = "Todas";
export const CUSTOM_SOLUTIONS_STORAGE_KEY = "support-toolkit-custom-solutions";

const BROKEN_TEXT_REPLACEMENTS = [
  ["Ã¡", "á"],
  ["Ã©", "é"],
  ["Ã­", "í"],
  ["Ã³", "ó"],
  ["Ãº", "ú"],
  ["Ã±", "ñ"],
  ["Ã", "Á"],
  ["Ã‰", "É"],
  ["Ã", "Í"],
  ["Ã“", "Ó"],
  ["Ãš", "Ú"],
  ["Ã‘", "Ñ"],
  ["âœ“", "✓"],
  ["â±", "⏱"],
  ["ðŸ› ï¸", "Soporte"],
];

const normalizeBrokenText = (value) => {
  if (typeof value !== "string") return value;

  return BROKEN_TEXT_REPLACEMENTS.reduce(
    (text, [broken, fixed]) => text.replaceAll(broken, fixed),
    value
  );
};

const inferCommandDescription = (command) => {
  const text = command.toLowerCase();

  if (text.includes("get-service")) return "Lista servicios para validar estado, nombre y disponibilidad.";
  if (text.includes("test-netconnection")) return "Prueba conectividad contra un host y puerto específico.";
  if (text.includes("get-itemproperty")) return "Consulta claves del registro para detectar software instalado.";
  if (text.includes("get-appxpackage")) return "Busca paquetes instalados desde Microsoft Store/AppX.";
  if (text.includes("remove-appxpackage")) return "Desinstala un paquete AppX para el usuario actual.";
  if (text.includes("get-childitem")) return "Lista archivos o carpetas para inspección y diagnóstico.";
  if (text.includes("remove-item")) return "Elimina archivos o carpetas indicados; revisar alcance antes de ejecutar.";
  if (text.includes("ipconfig /flushdns")) return "Limpia la caché DNS local del equipo.";
  if (text.includes("ipconfig /renew")) return "Renueva la concesión DHCP del adaptador de red.";
  if (text.includes("resolve-dnsname")) return "Valida resolución DNS para un nombre de equipo o dominio.";
  if (text.includes("outlook.exe /safe")) return "Abre Outlook sin complementos para descartar conflictos.";
  if (text.includes("control printers")) return "Abre la consola clásica de impresoras de Windows.";
  if (text.includes("eventvwr.msc")) return "Abre el Visor de eventos para revisar errores del sistema o aplicación.";
  if (text.includes("hostname")) return "Muestra el nombre del equipo.";
  if (text.includes("whoami")) return "Muestra el usuario actual o sus grupos según el parámetro usado.";
  if (text.includes("msiexec")) return "Ejecuta instalación o desinstalación MSI con parámetros controlados.";

  return "Comando de apoyo para ejecutar o abrir la herramienta indicada en el procedimiento.";
};

export const normalizeCommand = (command) => {
  if (typeof command === "string") {
    const normalizedCommand = normalizeBrokenText(command);

    return {
      command: normalizedCommand,
      description: inferCommandDescription(normalizedCommand),
    };
  }

  return {
    command: normalizeBrokenText(command.command ?? ""),
    description: normalizeBrokenText(command.description ?? ""),
  };
};

const normalizeList = (value) =>
  Array.isArray(value) ? value.map(normalizeBrokenText) : [];

export const normalizeSolution = (solution) => ({
  id: solution.id,
  title: normalizeBrokenText(solution.title ?? ""),
  category: normalizeBrokenText(solution.category ?? "General"),
  tags: normalizeList(solution.tags),
  risk: normalizeBrokenText(solution.risk ?? "Bajo"),
  time: normalizeBrokenText(solution.time ?? "5-10 min"),
  powershell: Boolean(solution.powershell),
  symptoms: normalizeList(solution.symptoms),
  causes: normalizeList(solution.causes),
  steps: normalizeList(solution.steps),
  commands: Array.isArray(solution.commands)
    ? solution.commands.map(normalizeCommand)
    : [],
  userMessage: normalizeBrokenText(solution.userMessage ?? ""),
  internalNotes: normalizeBrokenText(solution.internalNotes ?? ""),
  source: solution.source ?? "base",
});

export const solutions = rawSolutions.map(normalizeSolution);

export const getCategories = (items) => [
  ALL_CATEGORIES,
  ...new Set(items.map((solution) => solution.category)),
];

export const categories = getCategories(solutions);

const toSearchableText = (solution) =>
  [
    solution.title,
    solution.category,
    solution.risk,
    solution.time,
    ...solution.tags,
    ...solution.symptoms,
    ...solution.causes,
    ...solution.steps,
    ...solution.commands.map((command) => command.command),
    ...solution.commands.map((command) => command.description),
    solution.userMessage,
    solution.internalNotes,
  ]
    .join(" ")
    .toLocaleLowerCase("es-AR");

export const createSolutionIndex = (items) => items.map((solution) => ({
  ...solution,
  searchableText: toSearchableText(solution),
}));

export const solutionIndex = createSolutionIndex(solutions);

export const filterSolutions = ({ items = solutionIndex, search, category, onlyPowerShell }) => {
  const query = search.trim().toLocaleLowerCase("es-AR");

  return items.filter((solution) => {
    const matchesSearch = query === "" || solution.searchableText.includes(query);
    const matchesCategory =
      category === ALL_CATEGORIES || solution.category === category;
    const matchesPowerShell = !onlyPowerShell || solution.powershell;

    return matchesSearch && matchesCategory && matchesPowerShell;
  });
};

export const getFirstMatchingSolution = ({ items = solutionIndex, category, onlyPowerShell }) =>
  items.find((solution) => {
    const matchesCategory =
      category === ALL_CATEGORIES || solution.category === category;
    const matchesPowerShell = !onlyPowerShell || solution.powershell;

    return matchesCategory && matchesPowerShell;
  });

export const readCustomSolutions = () => {
  try {
    const rawValue = localStorage.getItem(CUSTOM_SOLUTIONS_STORAGE_KEY);
    if (!rawValue) return [];

    const parsedValue = JSON.parse(rawValue);
    if (!Array.isArray(parsedValue)) return [];

    return parsedValue.map(normalizeSolution);
  } catch {
    return [];
  }
};

export const saveCustomSolutions = (items) => {
  localStorage.setItem(CUSTOM_SOLUTIONS_STORAGE_KEY, JSON.stringify(items));
};
