export const INTENTS = {
  CLAVES_AGSERVER: {
    label: "AGSERVER + claves",
    category: "Claves y usuarios",
    products: ["agserver", "ag server", "ag", "as400", "call center", "callcenter", "buscafugas", "budi"],
    keywords: ["ag", "agserver", "ag server", "as400", "blanqueo ag", "desbloqueo ag", "contrasena ag", "clave ag", "usuario inhabilitado", "usuario bloqueado", "blanqueo call center", "callcenter", "buscafugas", "budi"],
  },
  CLAVES_SAP: {
    label: "SAP + claves",
    category: "Claves y usuarios",
    products: ["sap"],
    keywords: ["sap", "blanqueo sap", "usuario sap", "contrasena sap", "clave sap", "bloqueo sap"],
  },
  CLAVES_RED: {
    label: "red + claves",
    category: "Claves y usuarios",
    products: ["red", "dominio", "windows"],
    keywords: ["red", "dominio", "active directory", "contrasena de red", "usuario de red", "windows"],
  },
  PORTAL_AUTOGESTION: {
    label: "portal de autogestion",
    category: "Claves y usuarios",
    products: ["portal autogestion"],
    keywords: ["portal autogestion", "portal de autogestion", "autogestion", "asociar usuario", "registrar portal"],
  },
  INSTALACION_SOFTWARE: {
    label: "instalacion de software",
    category: "Instalacion de software",
    generic: true,
    products: ["software", "programa", "aplicacion", "gnat", "budi", "sic", "adobe", "afm", "buscafugas"],
    keywords: ["instalar", "instalacion", "software", "programa", "aplicacion", "setup", "instalador", "actualizacion", "actualizar", "licencia", "gnat", "budi", "sic", "adobe", "afm monitor"],
  },
  POWER_BI: {
    label: "Power BI + instalacion",
    category: "Instalacion de software",
    parent: "INSTALACION_SOFTWARE",
    products: ["power bi", "powerbi", "power bi desktop"],
    keywords: ["power bi", "powerbi", "power bi desktop"],
  },
  GOOGLE_EARTH: {
    label: "Google Earth + instalacion",
    category: "Instalacion de software",
    parent: "INSTALACION_SOFTWARE",
    products: ["google earth", "google earth pro", "earth"],
    keywords: ["google earth", "google earth pro", "earth"],
  },
  FLUKE: {
    label: "Fluke + instalacion",
    category: "Instalacion de software",
    parent: "INSTALACION_SOFTWARE",
    products: ["fluke", "fluke connect", "camara termografica"],
    keywords: ["fluke", "fluke connect", "camara termografica"],
  },
  GNAT: {
    label: "GNAT Escritorio",
    category: "Instalacion de software",
    parent: "INSTALACION_SOFTWARE",
    products: ["gnat", "gnat escritorio"],
    keywords: ["gnat", "gnat escritorio", "instalar gnat", "actualizar gnat"],
  },
  BUDI: {
    label: "BUDI",
    category: "Instalacion de software",
    parent: "INSTALACION_SOFTWARE",
    products: ["budi"],
    keywords: ["budi", "instalar budi", "actualizar budi", "clave budi"],
  },
  SIC: {
    label: "SIC",
    category: "Instalacion de software",
    parent: "INSTALACION_SOFTWARE",
    products: ["sic"],
    keywords: ["sic", "instalar sic"],
  },
  AFM: {
    label: "AFM Monitor",
    category: "Instalacion de software",
    parent: "INSTALACION_SOFTWARE",
    products: ["afm", "afm monitor"],
    keywords: ["afm", "afm monitor", "licencia afm", "instalar afm"],
  },
  ADOBE_READER: {
    label: "Adobe Reader/PDF",
    category: "Instalacion de software",
    parent: "INSTALACION_SOFTWARE",
    products: ["adobe reader", "acrobat reader", "reader", "pdf"],
    keywords: ["adobe reader", "acrobat reader", "reader", "abrir pdf", "instalar pdf"],
  },
  ADOBE_ACROBAT_PRO: {
    label: "Acrobat Pro + licencia",
    category: "Instalacion de software",
    parent: "INSTALACION_SOFTWARE",
    products: ["acrobat pro", "adobe pro", "adobe acrobat pro"],
    keywords: ["acrobat pro", "adobe pro", "licencia adobe", "editar pdf", "firmar pdf"],
  },
  CHROME: {
    label: "Google Chrome",
    category: "Instalacion de software",
    parent: "INSTALACION_SOFTWARE",
    products: ["chrome", "google chrome"],
    keywords: ["chrome", "google chrome", "navegador chrome"],
  },
  TEAMS: {
    label: "Microsoft Teams",
    category: "Instalacion de software",
    parent: "INSTALACION_SOFTWARE",
    products: ["teams", "microsoft teams"],
    keywords: ["teams", "microsoft teams", "instalar teams"],
  },
  SEVEN_ZIP: {
    label: "7-Zip",
    category: "Instalacion de software",
    parent: "INSTALACION_SOFTWARE",
    products: ["7zip", "7-zip", "7 zip"],
    keywords: ["7zip", "7-zip", "descomprimir", "comprimir", "archivo zip"],
  },
  WINRAR: {
    label: "WinRAR",
    category: "Instalacion de software",
    parent: "INSTALACION_SOFTWARE",
    products: ["winrar"],
    keywords: ["winrar", "archivo rar", "instalar winrar"],
  },
  AUTOCAD_LICENSE: {
    label: "AutoCAD + licencia",
    category: "Instalacion de software",
    parent: "INSTALACION_SOFTWARE",
    products: ["autocad", "autodesk"],
    keywords: ["autocad", "autodesk", "licencia autocad", "instalar autocad"],
  },
  DWG_TRUEVIEW: {
    label: "DWG TrueView/visor",
    category: "Instalacion de software",
    parent: "INSTALACION_SOFTWARE",
    products: ["dwg", "trueview", "autodesk viewer"],
    keywords: ["dwg", "trueview", "autodesk viewer", "ver planos", "abrir plano", "visor dwg"],
  },
  WPS: {
    label: "WPS Office",
    category: "Diagnostico PowerShell",
    products: ["wps", "wps office"],
    keywords: ["wps", "wps office", "documentos abren con wps"],
  },
  OUTLOOK: {
    label: "Outlook/correo",
    category: "Outlook / Office",
    products: ["outlook", "correo", "mail", "ost", "pst"],
    keywords: ["outlook", "correo", "mail", "ost", "pst", "bandeja", "casilla", "casilla compartida"],
  },
  EXCEL_OFFICE: {
    label: "Office/Excel",
    category: "Outlook / Office",
    products: ["excel", "word", "office", "teams", "onedrive", "microsoft 365"],
    keywords: ["excel", "word", "office", "teams", "onedrive", "microsoft 365"],
  },
  IMPRESORA: {
    label: "impresora/impresion",
    category: "Impresoras y scanners",
    products: ["impresora", "spooler", "cola", "9100"],
    keywords: ["impresora", "imprimir", "impresion", "cola", "spooler", "toner", "driver impresora", "liberar", "liberar impresora"],
  },
  SCANNER: {
    label: "scanner/digitalizacion",
    category: "Impresoras y scanners",
    products: ["scanner", "escaner", "hp scanjet", "kodak", "scanmate", "smarttouch", "twain", "wia"],
    keywords: ["scanner", "escaner", "scaner", "digitalizar", "hp scanjet", "kodak", "scanmate", "smarttouch", "twain", "wia"],
  },
  PLOTTER_AUTOCAD: {
    label: "plotter/AutoCAD",
    category: "Impresoras y scanners",
    products: ["plotter", "hp click", "autocad"],
    keywords: ["plotter", "hp click", "autocad", "plano", "rollo", "escala"],
  },
  FORTICLIENT: {
    label: "FortiClient/VPN",
    category: "Red / VPN / FortiClient",
    products: ["forticlient", "forti", "vpn", "remote access", "ems", "fortitoken"],
    keywords: ["forticlient", "forti", "vpn", "remote access", "ems", "telemetria", "fortitoken", "vpnconnection"],
  },
  RED_CONECTIVIDAD: {
    label: "red/conectividad",
    category: "Red / VPN / FortiClient",
    products: ["dns", "internet", "intranet", "red", "wifi", "dhcp", "pac", "certificado"],
    keywords: ["dns", "internet", "intranet", "red", "no conecta", "ping", "ethernet", "wifi", "wi-fi", "gateway", "dhcp", "no navega", "certificado", "no segura", "err_cert"],
  },
  SAP_CONFIG: {
    label: "SAP GUI/CGP",
    category: "SAP / AGSERVER / AS400",
    products: ["sap gui", "sap logon", "cgp", "produ_sap"],
    keywords: ["sap gui", "sap logon", "cgp", "produ_sap"],
  },
  AS400_SESION: {
    label: "AGSERVER/AS400 sesion",
    category: "SAP / AGSERVER / AS400",
    products: ["agserver", "as400", "ibm i access", "5250"],
    keywords: ["agserver", "as400", "ibm i access", "5250", "sesion"],
  },
  IBM_I_ACCESS_71: {
    label: "IBM i Access 7.1 viejo",
    category: "SAP / AGSERVER / AS400",
    products: ["ibm i access 7.1", "ibm i access", "access viejo", "si00000"],
    keywords: ["ibm i access 7.1", "access viejo", "no java", "si00000", "instalacion base", "actualizacion sps", "vcredist32", "vcredist64"],
  },
  IBM_ACS_JAVA: {
    label: "IBM ACS Java",
    category: "SAP / AGSERVER / AS400",
    products: ["ibm acs", "access client solutions", "acs java"],
    keywords: ["ibm acs", "access client solutions", "acs java", "java"],
  },
  TICKETEADORA: {
    label: "tickeadora Epson",
    category: "SAP / AGSERVER / AS400",
    products: ["tickeadora", "ticketera", "tiquetera", "epson", "bematech", "tm-u220", "pc5250"],
    keywords: ["tickeadora", "ticketera", "tiquetera", "epson", "bematech", "tm-u220", "ticket", "fiscal", "caja", "pc5250"],
  },
  SCANNER_HP: {
    label: "HP ScanJet",
    category: "Impresoras y scanners",
    products: ["hp scanjet", "scanner hp", "escaner hp"],
    keywords: ["hp scanjet", "scanner hp", "escaner hp", "digitalizar", "twain", "wia"],
  },
  KODAK_SCANMATE: {
    label: "Kodak ScanMate",
    category: "Impresoras y scanners",
    products: ["kodak", "scanmate", "smarttouch"],
    keywords: ["kodak", "scanmate", "scanner kodak", "smarttouch"],
  },
  IMPRESORA_LEXMARK: {
    label: "Lexmark",
    category: "Impresoras y scanners",
    products: ["lexmark"],
    keywords: ["lexmark", "driver lexmark", "impresora lexmark"],
  },
  IMPRESORA_RICOH: {
    label: "Ricoh",
    category: "Impresoras y scanners",
    products: ["ricoh"],
    keywords: ["ricoh", "driver ricoh", "impresora ricoh"],
  },
  BROTHER_PTOUCH: {
    label: "Brother P-touch",
    category: "Impresoras y scanners",
    products: ["brother", "p-touch", "ptouch"],
    keywords: ["brother", "p-touch", "ptouch", "etiquetadora", "label printer"],
  },
  DEBMEDIA: {
    label: "DebMedia",
    category: "Aplicaciones internas",
    products: ["debmedia", "player"],
    keywords: ["debmedia", "player", "turnos", "check-in", "dni", "pantalla"],
  },
  ROOTS: {
    label: "ROOTS excepcion",
    category: "Aplicaciones internas",
    products: ["roots", ".net"],
    keywords: ["roots", "excepcion", "exception", ".net"],
  },
  PROSERLINK: {
    label: "Proserlink",
    category: "Aplicaciones internas",
    products: ["proserlink", "proserlink 4.3.5"],
    keywords: ["proserlink", "proserlink 4.3.5"],
  },
  MODEL_5: {
    label: "Model 5",
    category: "Aplicaciones internas",
    products: ["model 5", "prover", "dresser", "digital controller", "com8"],
    keywords: ["model 5", "prover", "dresser", "digital controller", "com8"],
  },
  DISCO_PERFIL: {
    label: "disco/perfil",
    category: "Equipos / hardware",
    products: ["disco", "perfil", "c users", "appdata"],
    keywords: ["disco lleno", "c lleno", "espacio", "perfil", "perfiles", "c:\\users", "appdata", "papelera"],
  },
  EQUIPO_HARDWARE: {
    label: "equipo/hardware",
    category: "Equipos / hardware",
    products: ["notebook", "pc", "equipo", "hardware", "monitor", "teclado", "mouse", "audio"],
    keywords: ["notebook", "pc", "equipo", "cambio de equipo", "reemplazo", "hardware", "memoria", "ram", "disco", "bateria", "monitor", "teclado", "mouse", "parlante", "audio", "auricular", "lento", "formateo", "migracion"],
  },
  INV_GATE: {
    label: "InvGate",
    category: "Diagnostico PowerShell",
    products: ["invgate"],
    keywords: ["invgate", "inventario", "agente"],
  },
};

const MIN_SCORE = 30;
const SPECIFIC_HIGH_SCORE = 95;
const GENERIC_INTENTS = new Set(["INSTALACION_SOFTWARE", "SOLICITAR_DATOS", "ESCALAMIENTO"]);
const PRODUCT_ALIASES = {
  AGSERVER: ["ag", "agserver", "ag server", "as400"],
  "CALL CENTER / BUSCAFUGAS": ["call center", "callcenter", "buscafugas"],
  "PORTAL AUTOGESTION": ["portal autogestion", "portal de autogestion", "autogestion"],
  SAP: ["sap"],
  "POWER BI": ["power bi", "powerbi", "power bi desktop", "pbix"],
  "GOOGLE EARTH": ["google earth", "google earth pro", "earth"],
  "FLUKE": ["fluke", "fluke connect", "camara termografica"],
  "ADOBE READER": ["adobe reader", "acrobat reader", "reader", "pdf"],
  "ADOBE ACROBAT PRO": ["acrobat pro", "adobe acrobat pro", "adobe pro"],
  "GOOGLE CHROME": ["chrome", "google chrome"],
  "MICROSOFT TEAMS": ["teams", "microsoft teams"],
  "7-ZIP": ["7zip", "7-zip", "7 zip"],
  WINRAR: ["winrar"],
  AUTOCAD: ["autocad", "autodesk"],
  "DWG TRUEVIEW": ["dwg", "trueview", "autodesk viewer"],
  FORTICLIENT: ["forticlient", "forti", "vpn", "remote access"],
  FORTITOKEN: ["fortitoken"],
  WPS: ["wps", "wps office", "kingsoft"],
  BUDI: ["budi"],
  GNAT: ["gnat", "gnat escritorio"],
  SIC: ["sic"],
  "ADOBE ACROBAT": ["adobe", "acrobat"],
  "SCANNER KODAK / HP": ["scanner", "escaner", "scaner", "kodak", "scanmate", "hp scanjet"],
  "HP SCANJET": ["hp scanjet", "scanner hp", "escaner hp"],
  "KODAK SCANMATE": ["kodak", "scanmate", "smarttouch"],
  LEXMARK: ["lexmark"],
  RICOH: ["ricoh"],
  "BROTHER P-TOUCH": ["brother", "p-touch", "ptouch"],
  "TICKETERA FISCAL": ["ticketera", "tiquetera", "fiscal", "bematech", "epson"],
  "IBM I ACCESS 7.1": ["ibm i access 7.1", "access viejo", "si00000", "no java"],
  "IBM ACS JAVA": ["ibm acs", "access client solutions", "acs java"],
  "AFM MONITOR": ["afm", "afm monitor"],
  PAC: ["pac", "certificado", "err_cert", "no segura"],
  "AUDIO / PERIFERICOS": ["audio", "parlante", "parlantes", "auricular", "teclado", "mouse"],
};
const SOURCE_WEIGHTS = {
  summary: 5,
  description: 3,
  comments: 1,
  changelog: 0.35,
  metadata: 0.75,
};
const SOLUTION_MATCH_CACHE = new WeakMap();
const INTENT_MATCH_CACHE = new Map();

export const normalizeText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .toLocaleLowerCase("es-AR")
    .replace(/[^a-z0-9:\\/.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const extractADFText = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(extractADFText).filter(Boolean).join(" ");
  if (typeof value !== "object") return String(value);

  return [value.text, value.attrs?.text, extractADFText(value.content)]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
};

const getChangelogText = (issue) =>
  (issue.changelog ?? [])
    .flatMap((history) => history.items ?? [])
    .map((item) => `${item.field ?? ""} ${item.from ?? ""} ${item.to ?? ""}`)
    .join(" ");

const getIssueTextParts = (issue = {}) => {
  const fields = issue.fields ?? {};
  const comments = issue.comments ?? fields.comment?.comments ?? [];
  const changelog = issue.changelog?.histories ? { changelog: issue.changelog.histories } : issue;

  return {
    summary: [
      issue.key,
      issue.summary ?? fields.summary,
    ].filter(Boolean).join(" "),
    description: issue.description ?? extractADFText(fields.description),
    comments: comments.map((comment) => comment.body ?? extractADFText(comment.body)).join(" "),
    changelog: getChangelogText(changelog),
    metadata: [
      issue.status,
      issue.priority,
      issue.assignee,
      issue.reporter,
      issue.detectedCategory,
    ].filter(Boolean).join(" "),
  };
};

export const getIssuePlainText = (issue = {}) => {
  const parts = getIssueTextParts(issue);

  return Object.values(parts)
    .filter(Boolean)
    .join(" ");
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const hasNormalizedTerm = (text, term) => {
  if (!term) return false;

  if (/^[a-z0-9]{1,3}$/.test(term)) return new RegExp(`(^|[^a-z0-9])${escapeRegExp(term)}(?=$|[^a-z0-9])`).test(text);

  return text.includes(term);
};

const normalizeTerms = (values = []) =>
  values.map(normalizeText).filter(Boolean);

const firstNormalizedMatches = (text, values = [], limit = 3) =>
  values.filter((value) => hasNormalizedTerm(text, value)).slice(0, limit);

const countNormalizedMatches = (text, values = []) =>
  values.reduce((count, value) => (hasNormalizedTerm(text, value) ? count + 1 : count), 0);

const getIntentMatchData = (intent, config) => {
  const cached = INTENT_MATCH_CACHE.get(intent);
  if (cached) return cached;

  const data = {
    products: normalizeTerms(config.products),
    keywords: normalizeTerms(config.keywords),
  };

  INTENT_MATCH_CACHE.set(intent, data);
  return data;
};

const getProductTerms = (solution, config) => {
  const product = normalizeText(solution.product).toUpperCase();
  const aliased = Object.entries(PRODUCT_ALIASES)
    .filter(([key]) => product.includes(key))
    .flatMap(([, values]) => values);

  if (solution.product) return [...new Set([solution.product, ...aliased].filter(Boolean))];

  return [...new Set([...(config?.products ?? [])].filter(Boolean))];
};

const scoreIntentInText = ({ intent, config, text, weight }) => {
  const intentData = getIntentMatchData(intent, config);
  const keywordMatches = countNormalizedMatches(text, intentData.keywords);
  const productMatches = countNormalizedMatches(text, intentData.products);
  const installBoost =
    config.parent === "INSTALACION_SOFTWARE" &&
    countNormalizedMatches(text, getIntentMatchData("INSTALACION_SOFTWARE", INTENTS.INSTALACION_SOFTWARE).keywords) > 0
      ? 2
      : 0;
  const sessionBoost =
    intent === "AS400_SESION" &&
    (countNormalizedMatches(text, ["sesion", "nueva sesion", "5250"]) > 0 || text.includes("sesi"))
      ? 40
      : 0;

  return (productMatches * 5 + keywordMatches * 2 + installBoost + sessionBoost) * weight;
};

const detectIntentFromParts = (parts) => {
  const normalizedParts = Object.fromEntries(
    Object.entries(parts).map(([key, value]) => [key, normalizeText(value)])
  );
  const fullText = Object.values(normalizedParts).join(" ");
  const detected = Object.entries(INTENTS)
    .map(([intent, config]) => {
      const score = Object.entries(normalizedParts).reduce(
        (total, [source, text]) =>
          total + scoreIntentInText({ intent, config, text, weight: SOURCE_WEIGHTS[source] ?? 1 }),
        0
      );

      return {
        intent,
        label: config.label,
        category: config.category,
        products: firstNormalizedMatches(fullText, getIntentMatchData(intent, config).products),
        keywords: firstNormalizedMatches(fullText, getIntentMatchData(intent, config).keywords),
        summaryProducts: firstNormalizedMatches(normalizedParts.summary, getIntentMatchData(intent, config).products),
        summaryKeywords: firstNormalizedMatches(normalizedParts.summary, getIntentMatchData(intent, config).keywords),
        score,
        generic: Boolean(config.generic),
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return {
    primary: detected[0]?.intent ?? "UNKNOWN",
    label: detected[0]?.label ?? "sin intencion clara",
    category: detected[0]?.category ?? "Sin clasificar",
    products: detected.flatMap((item) => item.products),
    matches: detected,
    isSpecific: detected[0] ? !detected[0].generic : false,
  };
};

export const detectIntent = (issueText) =>
  detectIntentFromParts({ summary: issueText, description: "", comments: "", changelog: "", metadata: "" });

const inferSolutionIntent = (solution) => {
  if (solution.intent) return solution.intent;

  const text = normalizeText(
    [solution.title, solution.category, ...(solution.tags ?? []), ...(solution.jiraKeywords ?? [])].join(" ")
  );

  return detectIntent(text).primary;
};

const solutionText = (solution) =>
  normalizeText(
    [
      solution.title,
      solution.category,
      solution.intent,
      solution.product,
      ...(solution.tags ?? []),
      ...(solution.jiraKeywords ?? []),
      ...(solution.symptoms ?? []),
      ...(solution.causes ?? []),
      ...(solution.steps ?? []),
      ...(solution.commands ?? []).map((command) => command.command),
      ...(solution.commands ?? []).map((command) => command.description),
      ...(solution.installCommands ?? []).map((command) => command.command ?? command),
      ...(solution.installCommands ?? []).map((command) => command.description),
      ...(solution.verificationSteps ?? []),
      solution.officialDownloadUrl,
      solution.internalDownloadPath,
      solution.installerFile,
      solution.installerNotes,
      solution.jiraTemplate,
      solution.internalNotes,
    ].join(" ")
  );

const getSolutionMatchData = (solution) => {
  const cached = SOLUTION_MATCH_CACHE.get(solution);
  if (cached) return cached;

  const intent = inferSolutionIntent(solution);
  const config = INTENTS[intent];
  const commands = solution.commands ?? [];
  const data = {
    intent,
    config,
    isGeneric: GENERIC_INTENTS.has(intent),
    text: solutionText(solution),
    normalizedCategory: normalizeText(solution.category),
    normalizedProduct: normalizeText(solution.product),
    productTerms: normalizeTerms(getProductTerms(solution, config)),
    jiraKeywords: normalizeTerms(solution.jiraKeywords),
    tags: normalizeTerms(solution.tags),
    title: normalizeTerms([solution.title]),
    category: normalizeTerms([solution.category]),
    symptoms: normalizeTerms(solution.symptoms),
    causes: normalizeTerms(solution.causes),
    steps: normalizeTerms(solution.steps),
    commands: normalizeTerms(
      commands.flatMap((command) => [command.command, command.description])
    ),
    installCommands: normalizeTerms(
      (solution.installCommands ?? []).flatMap((command) => [command.command ?? command, command.description])
    ),
    verificationSteps: normalizeTerms(solution.verificationSteps),
  };

  SOLUTION_MATCH_CACHE.set(solution, data);
  return data;
};

const addWeightedFieldScore = ({ parts, values, points, reason, reasons }) => {
  const found = new Map();
  let score = 0;

  Object.entries(parts).forEach(([source, text]) => {
    const matches = firstNormalizedMatches(text, values, 4);
    if (matches.length === 0) return;

    matches.forEach((match) => found.set(match, source));
    score += matches.length * points * (SOURCE_WEIGHTS[source] ?? 1);
  });

  if (found.size > 0) {
    reasons.push(`${reason}: ${[...found.keys()].slice(0, 4).join(", ")}`);
  }

  return score;
};

const isRelatedCategory = (detectedIntent, solution) => {
  if (detectedIntent.primary === "UNKNOWN") return true;
  const category = INTENTS[detectedIntent.primary]?.category;
  const data = getSolutionMatchData(solution);
  return !category || data.normalizedCategory.includes(normalizeText(category));
};

const buildReason = ({ detectedIntent, solution, reasons, score }) => {
  const product = detectedIntent.products[0] || solution.product || solution.intent;
  const detected = product ? `${product} + ${detectedIntent.label}` : detectedIntent.label;
  const basis = reasons.slice(0, 3).join(". ");

  if (!basis) return `Detectado: ${detected}. Score ${score}.`;
  return `Detectado: ${detected}. ${basis}.`;
};

export const scoreSolutionsForIssue = (issue, solutions) => {
  const rawParts = getIssueTextParts(issue);
  const parts = Object.fromEntries(
    Object.entries(rawParts).map(([key, value]) => [key, normalizeText(value)])
  );
  const issueText = Object.values(parts).join(" ");
  const primaryText = [parts.summary, parts.description].join(" ");
  const detectedIntent = detectIntentFromParts(rawParts);

  const scored = solutions
    .map((solution) => {
      const data = getSolutionMatchData(solution);
      const intent = data.intent;
      const config = data.config;
      const productMatches = firstNormalizedMatches(primaryText, data.productTerms, 4).filter(Boolean);
      const hasSolutionProductMatch = productMatches.length > 0 && productMatches.some((product) => hasNormalizedTerm(data.text, product));
      const reasons = [];
      let score = 0;

      const directMatches = [
        ...firstNormalizedMatches(primaryText, data.jiraKeywords, 4),
        ...firstNormalizedMatches(primaryText, data.tags, 4),
        ...firstNormalizedMatches(primaryText, [...data.title, data.normalizedProduct], 4),
      ];

      if (detectedIntent.primary !== "UNKNOWN" && intent === detectedIntent.primary) {
        score += directMatches.length > 0 ? 80 : 35;
        reasons.push(`intencion exacta ${detectedIntent.label}`);
      }

      if (detectedIntent.primary !== "UNKNOWN" && INTENTS[detectedIntent.primary]?.parent === intent) {
        score += 45;
        reasons.push(`procedimiento general relacionado con ${detectedIntent.label}`);
      }

      if (config?.parent && config.parent === detectedIntent.primary) {
        score += 28;
        reasons.push(`especializacion de ${INTENTS[config.parent].label}`);
      }

      if (["CLAVES_AGSERVER", "CLAVES_SAP", "CLAVES_RED"].includes(detectedIntent.primary) && intent === "PORTAL_AUTOGESTION") {
        score += 75;
        reasons.push("portal de autogestion relacionado con gestion de claves");
      }

      if ((detectedIntent.primary === "AS400_SESION" || issueText.includes("sesi")) && solution.id === "hd-029") {
        score += 120;
        reasons.push("ticket pide crear nueva sesion AGSERVER/AS400");
      }

      const mentionsIbmAccess71 = countNormalizedMatches(issueText, [
        "si00000",
        "instalacion base",
        "actualizacion sps",
        "vcredist32",
        "vcredist64",
        "ibm i access 7.1",
        "access viejo",
        "no java",
      ]) > 0;

      if (mentionsIbmAccess71 && intent === "IBM_I_ACCESS_71") {
        score += 180;
        reasons.push("priorizada por IBM i Access 7.1 viejo / NO JAVA");
      }

      if (mentionsIbmAccess71 && intent === "IBM_ACS_JAVA") {
        score -= 220;
        reasons.push("penalizada porque el ticket indica viejo/7.1/no Java");
      }

      if (mentionsIbmAccess71 && intent === "AS400_SESION") {
        score -= 140;
        reasons.push("penalizada porque el ticket pide instalacion IBM i Access, no solo sesion");
      }

      if (!mentionsIbmAccess71 && detectedIntent.primary === "AS400_SESION" && intent === "IBM_I_ACCESS_71") {
        score -= 160;
        reasons.push("penalizada porque el ticket pide crear sesion, no instalar IBM i Access");
      }

      if (detectedIntent.primary === "DWG_TRUEVIEW" && intent === "AUTOCAD_LICENSE" && !issueText.includes("licencia")) {
        score -= 120;
        reasons.push("penalizada porque el ticket pide visualizar DWG, no AutoCAD completo");
      }

      if (detectedIntent.primary === "ADOBE_ACROBAT_PRO" && intent === "ADOBE_READER") {
        score -= 110;
        reasons.push("penalizada porque el ticket pide Acrobat Pro/licencia");
      }

      if (detectedIntent.primary === "ADOBE_READER" && intent === "ADOBE_ACROBAT_PRO" && !issueText.includes("pro")) {
        score -= 110;
        reasons.push("penalizada porque Reader alcanza para PDF sin licencia Pro");
      }

      if ((detectedIntent.primary === "AS400_SESION" || issueText.includes("sesi")) && ["CLAVES_AGSERVER", "PORTAL_AUTOGESTION"].includes(intent)) {
        score -= 90;
        reasons.push("penalizada porque el ticket pide sesion, no blanqueo de clave");
      }
      if (detectedIntent.primary === "OUTLOOK" && solution.id === "hd-014") {
        score += 25;
        reasons.push("reparacion Office relacionada con Outlook");
      }
      if (hasSolutionProductMatch) {
        score += 50;
        reasons.push(`producto/sistema exacto ${productMatches.join(", ")}`);
      }

      if (
        detectedIntent.primary === intent &&
        detectedIntent.products.length > 0 &&
        !hasSolutionProductMatch &&
        solution.product &&
        !(detectedIntent.primary === "OUTLOOK" && solution.id === "hd-014") &&
        !["AGSERVER", "Software"].includes(solution.product)
      ) {
        score -= 200;
        reasons.push("penalizada por no coincidir con el producto detectado");
      }

      if (
        intent === "PORTAL_AUTOGESTION" &&
        !["CLAVES_AGSERVER", "CLAVES_SAP", "CLAVES_RED", "PORTAL_AUTOGESTION"].includes(detectedIntent.primary)
      ) {
        score -= 200;
        reasons.push("penalizada porque autogestion solo aplica a gestion de claves");
      }

      score += addWeightedFieldScore({ parts, values: data.jiraKeywords, points: 15, reason: "keywords", reasons });
      score += addWeightedFieldScore({ parts, values: data.tags, points: 10, reason: "tags", reasons });
      score += addWeightedFieldScore({ parts, values: data.title, points: 20, reason: "titulo", reasons });
      score += addWeightedFieldScore({ parts, values: data.category, points: 6, reason: "categoria", reasons });
      score += addWeightedFieldScore({ parts, values: data.symptoms, points: 4, reason: "sintomas", reasons });
      score += addWeightedFieldScore({ parts, values: data.causes, points: 4, reason: "causas", reasons });
      score += addWeightedFieldScore({ parts, values: data.steps, points: 2, reason: "pasos", reasons });
      score += addWeightedFieldScore({
        parts,
        values: [...data.commands, ...data.installCommands],
        points: 1,
        reason: "comandos",
        reasons,
      });
      score += addWeightedFieldScore({ parts, values: data.verificationSteps, points: 2, reason: "validacion", reasons });

      if (
        detectedIntent.isSpecific &&
        GENERIC_INTENTS.has(intent) &&
        INTENTS[detectedIntent.primary]?.parent !== intent
      ) {
        score -= 65;
        reasons.push("penalizada por generica ante una intencion especifica");
      }

      if (detectedIntent.isSpecific && intent === "INSTALACION_SOFTWARE" && detectedIntent.primary !== "INSTALACION_SOFTWARE") {
        score -= 45;
        reasons.push("penalizada porque existe ficha especifica de producto");
      }

      if (!isRelatedCategory(detectedIntent, solution)) {
        score -= 70;
      }

      if (solution.internalOnly && !issueText.includes("interno")) score -= 8;

      return {
        solution: { ...solution, intent },
        score,
        reasons: [...new Set(reasons)],
        reason: buildReason({ detectedIntent, solution, reasons, score }),
        detectedIntent,
        isGeneric: data.isGeneric,
      };
    })
    .filter((item) => item.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score);

  const hasSpecificHigh = scored.some((item) => !item.isGeneric && item.score >= SPECIFIC_HIGH_SCORE);
  const filteredGenerics = hasSpecificHigh
    ? scored.filter((item, index) => !item.isGeneric || scored.slice(0, index).filter((candidate) => candidate.isGeneric).length < 1)
    : scored;

  const topScore = filteredGenerics[0]?.score ?? 0;
  if (topScore >= 300) {
    return filteredGenerics.filter((item) => {
      const isKeyPortal =
        item.solution.intent === "PORTAL_AUTOGESTION" &&
        ["CLAVES_AGSERVER", "CLAVES_SAP", "CLAVES_RED"].includes(item.detectedIntent.primary);
      const isParentGeneric = INTENTS[item.detectedIntent.primary]?.parent === item.solution.intent;

      return item.score >= Math.max(100, topScore * 0.35) || isKeyPortal || isParentGeneric;
    });
  }

  return filteredGenerics;
};

export const getSuggestedSolutions = (issue, solutions, limit = 5) => {
  const scored = scoreSolutionsForIssue(issue, solutions);

  if (scored.length > 0) {
    const topScore = scored[0].score;
    const useful = scored.filter((item) => item.score >= Math.max(MIN_SCORE, topScore * 0.42));
    const selected = [];
    let genericCount = 0;

    useful.forEach((item) => {
      if (selected.length >= limit) return;
      if (item.isGeneric) {
        if (genericCount >= 1) return;
        genericCount += 1;
      }
      selected.push(item);
    });

    return selected.length > 0 ? selected : scored.slice(0, Math.min(limit, 2));
  }

  const fallback = solutions
    .filter((solution) => ["EQUIPO_HARDWARE", "SOLICITAR_DATOS"].includes(solution.intent))
    .slice(0, 2)
    .map((solution) => ({
      solution,
      score: 0,
      reasons: ["fallback"],
      reason: "No hay una solucion confiable para este ticket. Usar diagnostico general o solicitar mas datos.",
      detectedIntent: { primary: "UNKNOWN", label: "sin intencion clara" },
      isFallback: true,
    }));

  return fallback;
};
