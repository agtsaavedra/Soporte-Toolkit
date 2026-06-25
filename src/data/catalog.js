import { solutions as baseSolutions } from "./baseSolutions.js";
import { helpDeskSolutions } from "./helpDeskSolutions.js";

export const ALL_CATEGORIES = "Todas";
export const CUSTOM_SOLUTIONS_STORAGE_KEY = "support-toolkit-custom-solutions";

export const rawSolutions = [...baseSolutions, ...helpDeskSolutions];

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

  if (text === "outlook.exe /safe") return "Abre Outlook sin complementos para confirmar si un add-in provoca lentitud, cuelgues o cierres inesperados.";
  if (text === "control mlcfg32.cpl") return "Abre el panel clásico de perfiles de correo para crear, cambiar o reparar perfiles de Outlook.";
  if (text.includes("microsoft\\outlook") && text.includes("*.ost")) return "Busca archivos OST del usuario y calcula su tamaño en GB para detectar cachés locales demasiado grandes.";
  if (text.includes("displayname -like '*wps*'")) return "Busca WPS Office en las claves de desinstalación de Windows y muestra su UninstallString.";
  if (text.includes("get-appxpackage *wps* | remove-appxpackage")) return "Quita WPS cuando fue instalado como aplicación AppX/Microsoft Store para el usuario actual.";
  if (text.includes("get-appxpackage *wps*")) return "Verifica si WPS existe como paquete AppX antes de intentar quitarlo.";
  if (text.includes("$name = '*nombre*'")) return "Plantilla para buscar un programa por nombre y obtener versión, editor y comando de desinstalación.";
  if (text.includes("msiexec /x")) return "Desinstala un producto MSI usando su GUID. Validar el GUID antes de ejecutar.";
  if (text.includes("get-dnsclientserveraddress")) return "Muestra los DNS configurados por adaptador para detectar valores manuales o heredados.";
  if (text.includes("get-netadapter")) return "Lista adaptadores activos para identificar el alias exacto que debe usarse en comandos de red.";
  if (text.includes("set-dnsclientserveraddress") && text.includes("resetserveraddresses")) return "Vuelve el DNS del adaptador a automático por DHCP, quitando servidores configurados manualmente.";
  if (text.includes("ipconfig /flushdns")) return "Limpia la caché DNS local para forzar nuevas resoluciones de nombres.";
  if (text.includes("ipconfig /renew")) return "Renueva la concesión DHCP y puede corregir IP, gateway o DNS entregados por la red.";
  if (text.includes("resolve-dnsname")) return "Consulta DNS para confirmar si el nombre resuelve y a qué dirección apunta.";
  if (text === "get-psdrive c") return "Muestra capacidad, espacio usado y espacio libre de la unidad C.";
  if (text.includes("c:\\users") && text.includes("measure-object")) return "Calcula el tamaño aproximado de cada perfil en C:\\Users para priorizar limpieza de disco.";
  if (text.includes("$env:temp")) return "Elimina temporales del usuario actual. Conviene cerrar aplicaciones antes.";
  if (text.includes("c:\\$recycle.bin")) return "Vacía la papelera del sistema. Libera espacio, pero dificulta recuperar esos archivos.";
  if (text.includes("win32_userprofile") && text.includes("remove-ciminstance")) return "Elimina un perfil de Windows desde WMI/CIM, limpiando registro y carpeta asociada cuando corresponde.";
  if (text.includes("win32_userprofile")) return "Lista perfiles locales, última fecha de uso y si están cargados para evitar borrar usuarios activos.";
  if (text.includes("query user") || text === "quser") return "Lista sesiones abiertas en el equipo para identificar usuario, estado e ID de sesión.";
  if (text.includes("logoff id_sesion")) return "Cierra una sesión específica por ID. Confirmar el ID para no cerrar la sesión equivocada.";
  if (text.includes("shutdown /l")) return "Cierra la sesión interactiva actual del usuario.";
  if (text.includes("get-service spooler")) return "Muestra el estado del servicio de cola de impresión antes de reiniciarlo.";
  if (text.includes("stop-service spooler")) return "Detiene la cola de impresión para poder limpiar trabajos trabados.";
  if (text.includes("spool\\printers")) return "Borra archivos pendientes de la cola de impresión. Esto elimina trabajos atascados.";
  if (text.includes("start-service spooler")) return "Vuelve a iniciar el servicio de impresión después de limpiar la cola.";
  if (text === "get-printer") return "Lista impresoras instaladas para validar que exista la impresora esperada.";
  if (text.includes("printuientry")) return "Agrega una impresora compartida desde el servidor usando la utilidad clásica PrintUI.";
  if (text.includes("-port 445")) return "Prueba SMB/Admin Share contra el host. Útil para validar acceso a recursos compartidos.";
  if (text.includes("-port 135")) return "Prueba RPC/WMI contra el host para administración remota clásica de Windows.";
  if (text.includes("-port 3389")) return "Prueba RDP contra el host para confirmar si escritorio remoto responde.";
  if (text.includes("-port 5985")) return "Prueba WinRM contra el host para validar administración remota por PowerShell.";
  if (text.includes("forti")) return "Revisa instalación, servicios o diagnóstico de FortiClient para validar VPN, EMS o telemetría.";
  if (text.includes("invgate")) return "Revisa el agente de InvGate o su conectividad para confirmar si puede reportar inventario.";
  if (text === "hostname") return "Muestra el nombre del equipo para cargarlo en el ticket o validar inventario.";
  if (text === "whoami") return "Muestra el usuario actual con dominio o equipo local.";
  if (text.includes("win32_computersystem")) return "Obtiene fabricante, modelo, RAM y usuario activo del equipo.";
  if (text.includes("win32_bios")) return "Obtiene el número de serie del equipo desde BIOS.";
  if (text.includes("win32_operatingsystem")) return "Muestra versión de Windows y último inicio para contexto de diagnóstico.";
  if (text.includes("appwiz.cpl")) return "Abre Programas y características para reparar o desinstalar software instalado.";
  if (text.includes("excel.exe /safe")) return "Abre Excel sin complementos para descartar fallas causadas por add-ins.";
  if (text.includes("excel.exe") && text.includes("/regserver")) return "Re-registra Excel en Windows para corregir asociaciones o automatización COM.";
  if (text.includes("cleanmgr")) return "Abre el liberador de espacio de Windows para limpieza asistida.";
  if (text.includes("saplogon.exe")) return "Abre SAP Logon para crear o probar entradas de conexión SAP.";
  if (text.includes("eventvwr.msc")) return "Abre el Visor de eventos para capturar errores de aplicación, .NET o sistema.";
  if (text.includes("whoami /groups")) return "Lista grupos y privilegios del usuario para diagnosticar problemas de permisos.";
  if (text.includes("control printers")) return "Abre Dispositivos e impresoras para revisar estado, predeterminada y propiedades.";

  return "Comando auxiliar del procedimiento. Revisar el contexto de la ficha antes de ejecutarlo.";
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
    description:
      normalizeBrokenText(command.description ?? "") ||
      inferCommandDescription(command.command ?? ""),
  };
};

const normalizeList = (value) =>
  Array.isArray(value) ? value.map(normalizeBrokenText) : [];

export const normalizeSolution = (solution) => ({
  id: solution.id,
  title: normalizeBrokenText(solution.title ?? ""),
  category: normalizeBrokenText(solution.category ?? "General"),
  intent: normalizeBrokenText(solution.intent ?? ""),
  product: normalizeBrokenText(solution.product ?? ""),
  tags: normalizeList(solution.tags),
  risk: normalizeBrokenText(solution.risk ?? "Bajo"),
  time: normalizeBrokenText(solution.time ?? "5-10 min"),
  estimatedMinutes:
    Number(solution.estimatedMinutes) ||
    Number.parseInt(String(solution.time ?? "10"), 10) ||
    10,
  powershell: Boolean(solution.powershell),
  resolutionType:
    normalizeBrokenText(solution.resolutionType ?? "") ||
    (solution.powershell ? "powershell" : "procedimiento"),
  requiresApproval: Boolean(solution.requiresApproval),
  internalOnly: Boolean(solution.internalOnly),
  licenseRequired: Boolean(solution.licenseRequired),
  officialDownloadUrl: normalizeBrokenText(solution.officialDownloadUrl ?? ""),
  internalDownloadPath: normalizeBrokenText(solution.internalDownloadPath ?? ""),
  installerFile: normalizeBrokenText(solution.installerFile ?? ""),
  installerNotes: normalizeBrokenText(solution.installerNotes ?? ""),
  installCommands: Array.isArray(solution.installCommands)
    ? solution.installCommands.map(normalizeCommand)
    : [],
  verificationSteps: normalizeList(solution.verificationSteps),
  symptoms: normalizeList(solution.symptoms),
  causes: normalizeList(solution.causes),
  steps: normalizeList(solution.steps),
  commands: Array.isArray(solution.commands)
    ? solution.commands.map(normalizeCommand)
    : [],
  jiraKeywords: normalizeList(solution.jiraKeywords),
  userMessage: normalizeBrokenText(solution.userMessage ?? ""),
  jiraTemplate: normalizeBrokenText(solution.jiraTemplate ?? ""),
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
    solution.intent,
    solution.product,
    solution.risk,
    solution.time,
    solution.officialDownloadUrl,
    solution.internalDownloadPath,
    solution.installerFile,
    solution.installerNotes,
    ...solution.tags,
    ...solution.symptoms,
    ...solution.causes,
    ...solution.steps,
    ...solution.commands.map((command) => command.command),
    ...solution.commands.map((command) => command.description),
    ...solution.installCommands.map((command) => command.command),
    ...solution.installCommands.map((command) => command.description),
    ...solution.verificationSteps,
    ...solution.jiraKeywords,
    solution.resolutionType,
    solution.userMessage,
    solution.jiraTemplate,
    solution.internalNotes,
  ]
    .join(" ")
    .toLocaleLowerCase("es-AR");

export const createSolutionIndex = (items) =>
  items.map((solution) => ({
    ...solution,
    searchableText: toSearchableText(solution),
  }));

export const solutionIndex = createSolutionIndex(solutions);

export const filterSolutions = ({
  items = solutionIndex,
  search,
  category,
  onlyPowerShell,
}) => {
  const query = search.trim().toLocaleLowerCase("es-AR");

  return items.filter((solution) => {
    const matchesSearch = query === "" || solution.searchableText.includes(query);
    const matchesCategory =
      category === ALL_CATEGORIES || solution.category === category;
    const matchesPowerShell = !onlyPowerShell || solution.powershell;

    return matchesSearch && matchesCategory && matchesPowerShell;
  });
};

export const getFirstMatchingSolution = ({
  items = solutionIndex,
  category,
  onlyPowerShell,
}) =>
  items.find((solution) => {
    const matchesCategory =
      category === ALL_CATEGORIES || solution.category === category;
    const matchesPowerShell = !onlyPowerShell || solution.powershell;

    return matchesCategory && matchesPowerShell;
  });
