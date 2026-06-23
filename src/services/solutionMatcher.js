export const INTENTS = {
  CLAVES_AGSERVER: {
    label: "AGSERVER + claves",
    category: "Claves y usuarios",
    products: ["agserver", "ag", "as400"],
    keywords: ["ag", "agserver", "as400", "blanqueo", "desbloqueo", "contrasena", "clave", "usuario inhabilitado", "usuario bloqueado"],
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
    products: ["software", "programa", "aplicacion"],
    keywords: ["instalar", "instalacion", "software", "programa", "aplicacion", "setup", "instalador"],
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
    keywords: ["impresora", "imprimir", "impresion", "cola", "spooler", "toner", "driver impresora"],
  },
  SCANNER: {
    label: "scanner/digitalizacion",
    category: "Impresoras y scanners",
    products: ["scanner", "escaner", "hp scanjet", "twain", "wia"],
    keywords: ["scanner", "escaner", "digitalizar", "hp scanjet", "twain", "wia"],
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
    products: ["forticlient", "forti", "vpn", "remote access", "ems"],
    keywords: ["forticlient", "forti", "vpn", "remote access", "ems", "telemetria"],
  },
  RED_CONECTIVIDAD: {
    label: "red/conectividad",
    category: "Red / VPN / FortiClient",
    products: ["dns", "internet", "red", "wifi", "dhcp"],
    keywords: ["dns", "internet", "red", "no conecta", "ping", "ethernet", "wifi", "wi-fi", "gateway", "dhcp"],
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
  TICKETEADORA: {
    label: "tickeadora Epson",
    category: "SAP / AGSERVER / AS400",
    products: ["tickeadora", "epson", "tm-u220", "pc5250"],
    keywords: ["tickeadora", "epson", "tm-u220", "ticket", "pc5250"],
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
    products: ["notebook", "pc", "equipo", "hardware"],
    keywords: ["notebook", "pc", "equipo", "cambio de equipo", "reemplazo", "hardware", "memoria", "ram", "disco", "bateria"],
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

export const getIssuePlainText = (issue = {}) => {
  const fields = issue.fields ?? {};
  const comments = issue.comments ?? fields.comment?.comments ?? [];
  const changelog = issue.changelog?.histories ? { changelog: issue.changelog.histories } : issue;

  return [
    issue.key,
    issue.summary ?? fields.summary,
    issue.description ?? extractADFText(fields.description),
    issue.status,
    issue.priority,
    issue.assignee,
    issue.reporter,
    issue.detectedCategory,
    ...comments.map((comment) => comment.body ?? extractADFText(comment.body)),
    getChangelogText(changelog),
  ]
    .filter(Boolean)
    .join(" ");
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const hasTerm = (text, value) => {
  const term = normalizeText(value);
  if (!term) return false;

  if (/^[a-z0-9]{1,3}$/.test(term)) {
    return new RegExp(`(^|\\s)${escapeRegExp(term)}($|\\s)`).test(text);
  }

  return text.includes(term);
};
const countMatches = (text, values = []) =>
  values.reduce((count, value) => {
    const normalized = normalizeText(value);
    return hasTerm(text, normalized) ? count + 1 : count;
  }, 0);

const firstMatches = (text, values = [], limit = 3) =>
  values
    .map(normalizeText)
    .filter((value) => hasTerm(text, value))
    .slice(0, limit);

export const detectIntent = (issueText) => {
  const text = normalizeText(issueText);
  const detected = Object.entries(INTENTS)
    .map(([intent, config]) => {
      const keywordMatches = countMatches(text, config.keywords);
      const productMatches = countMatches(text, config.products);
      const installBoost =
        config.parent === "INSTALACION_SOFTWARE" && countMatches(text, INTENTS.INSTALACION_SOFTWARE.keywords) > 0
          ? 2
          : 0;

      const sessionBoost =
        intent === "AS400_SESION" && (countMatches(text, ["sesion", "nueva sesion", "5250"]) > 0 || text.includes("sesi"))
          ? 40
          : 0;

      return {
        intent,
        label: config.label,
        category: config.category,
        products: firstMatches(text, config.products),
        keywords: firstMatches(text, config.keywords),
        score: productMatches * 5 + keywordMatches * 2 + installBoost + sessionBoost,
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
      solution.userMessage,
      solution.jiraTemplate,
      solution.internalNotes,
    ].join(" ")
  );

const addFieldScore = ({ text, values, points, reason, reasons }) => {
  const matches = firstMatches(text, values, 4);
  if (matches.length === 0) return 0;

  reasons.push(`${reason}: ${matches.join(", ")}`);
  return matches.length * points;
};

const isRelatedCategory = (detectedIntent, solution) => {
  if (detectedIntent.primary === "UNKNOWN") return true;
  const category = INTENTS[detectedIntent.primary]?.category;
  return !category || normalizeText(solution.category).includes(normalizeText(category));
};

const buildReason = ({ detectedIntent, solution, reasons, score }) => {
  const product = detectedIntent.products[0] || solution.product || solution.intent;
  const detected = product ? `${product} + ${detectedIntent.label}` : detectedIntent.label;
  const basis = reasons.slice(0, 3).join(". ");

  if (!basis) return `Detectado: ${detected}. Score ${score}.`;
  return `Detectado: ${detected}. ${basis}.`;
};

export const scoreSolutionsForIssue = (issue, solutions) => {
  const issueText = normalizeText(issue.plainText || getIssuePlainText(issue));
  const detectedIntent = detectIntent(issueText);

  const scored = solutions
    .map((solution) => {
      const intent = inferSolutionIntent(solution);
      const config = INTENTS[intent];
      const text = solutionText(solution);
      const reasons = [];
      let score = 0;

      const directMatches = [
        ...firstMatches(issueText, solution.jiraKeywords, 4),
        ...firstMatches(issueText, solution.tags, 4),
        ...firstMatches(issueText, [solution.title, solution.product], 4),
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

      if ((detectedIntent.primary === "AS400_SESION" || issueText.includes("sesi")) && ["CLAVES_AGSERVER", "PORTAL_AUTOGESTION"].includes(intent)) {
        score -= 90;
        reasons.push("penalizada porque el ticket pide sesion, no blanqueo de clave");
      }
      if (detectedIntent.primary === "OUTLOOK" && solution.id === "hd-014") {
        score += 25;
        reasons.push("reparacion Office relacionada con Outlook");
      }
      const productMatches = firstMatches(issueText, [solution.product, ...(config?.products ?? [])], 3).filter(Boolean);
      if (productMatches.length > 0 && productMatches.some((product) => text.includes(product))) {
        score += 50;
        reasons.push(`producto/sistema exacto ${productMatches.join(", ")}`);
      }

      score += addFieldScore({ text: issueText, values: solution.jiraKeywords, points: 15, reason: "keywords", reasons });
      score += addFieldScore({ text: issueText, values: solution.tags, points: 10, reason: "tags", reasons });
      score += addFieldScore({ text: issueText, values: [solution.title], points: 20, reason: "titulo", reasons });
      score += addFieldScore({ text: issueText, values: [solution.category], points: 6, reason: "categoria", reasons });
      score += addFieldScore({ text: issueText, values: solution.symptoms, points: 4, reason: "sintomas", reasons });
      score += addFieldScore({ text: issueText, values: solution.causes, points: 4, reason: "causas", reasons });
      score += addFieldScore({ text: issueText, values: solution.steps, points: 2, reason: "pasos", reasons });
      score += addFieldScore({
        text: issueText,
        values: (solution.commands ?? []).flatMap((command) => [command.command, command.description]),
        points: 1,
        reason: "comandos",
        reasons,
      });

      if (
        detectedIntent.isSpecific &&
        GENERIC_INTENTS.has(intent) &&
        INTENTS[detectedIntent.primary]?.parent !== intent
      ) {
        score -= 35;
        reasons.push("penalizada por generica ante una intencion especifica");
      }

      if (!isRelatedCategory(detectedIntent, solution)) {
        score -= 20;
      }

      if (solution.internalOnly && !issueText.includes("interno")) score -= 8;

      return {
        solution: { ...solution, intent },
        score,
        reasons: [...new Set(reasons)],
        reason: buildReason({ detectedIntent, solution, reasons, score }),
        detectedIntent,
        isGeneric: GENERIC_INTENTS.has(intent),
      };
    })
    .filter((item) => item.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score);

  const hasSpecificHigh = scored.some((item) => !item.isGeneric && item.score >= SPECIFIC_HIGH_SCORE);
  const filtered = hasSpecificHigh
    ? scored.filter((item, index) => !item.isGeneric || scored.slice(0, index).filter((candidate) => candidate.isGeneric).length < 1)
    : scored;

  return filtered;
};

export const getSuggestedSolutions = (issue, solutions, limit = 5) => {
  const scored = scoreSolutionsForIssue(issue, solutions);

  if (scored.length > 0) return scored.slice(0, limit);

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
