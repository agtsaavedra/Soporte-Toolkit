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
  TICKETEADORA: {
    label: "tickeadora Epson",
    category: "SAP / AGSERVER / AS400",
    products: ["tickeadora", "ticketera", "tiquetera", "epson", "bematech", "tm-u220", "pc5250"],
    keywords: ["tickeadora", "ticketera", "tiquetera", "epson", "bematech", "tm-u220", "ticket", "fiscal", "caja", "pc5250"],
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
  FORTICLIENT: ["forticlient", "forti", "vpn", "remote access"],
  FORTITOKEN: ["fortitoken"],
  WPS: ["wps", "wps office", "kingsoft"],
  BUDI: ["budi"],
  GNAT: ["gnat", "gnat escritorio"],
  SIC: ["sic"],
  "ADOBE ACROBAT": ["adobe", "acrobat"],
  "SCANNER KODAK / HP": ["scanner", "escaner", "scaner", "kodak", "scanmate", "hp scanjet"],
  "TICKETERA FISCAL": ["ticketera", "tiquetera", "fiscal", "bematech", "epson"],
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

const hasTerm = (text, value) => {
  const term = normalizeText(value);
  if (!term) return false;

  if (/^[a-z0-9]{1,3}$/.test(term)) return new RegExp(`(^|[^a-z0-9])${escapeRegExp(term)}(?=$|[^a-z0-9])`).test(text);

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

const getProductTerms = (solution, config) => {
  const product = normalizeText(solution.product).toUpperCase();
  const aliased = Object.entries(PRODUCT_ALIASES)
    .filter(([key]) => product.includes(key))
    .flatMap(([, values]) => values);

  if (solution.product) return [...new Set([solution.product, ...aliased].filter(Boolean))];

  return [...new Set([...(config?.products ?? [])].filter(Boolean))];
};

const scoreIntentInText = ({ intent, config, text, weight }) => {
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
        products: firstMatches(fullText, config.products),
        keywords: firstMatches(fullText, config.keywords),
        summaryProducts: firstMatches(normalizedParts.summary, config.products),
        summaryKeywords: firstMatches(normalizedParts.summary, config.keywords),
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
      solution.internalNotes,
    ].join(" ")
  );

const addWeightedFieldScore = ({ parts, values, points, reason, reasons }) => {
  const found = new Map();
  let score = 0;

  Object.entries(parts).forEach(([source, text]) => {
    const matches = firstMatches(text, values, 4);
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
  const rawParts = getIssueTextParts(issue);
  const parts = Object.fromEntries(
    Object.entries(rawParts).map(([key, value]) => [key, normalizeText(value)])
  );
  const issueText = Object.values(parts).join(" ");
  const primaryText = [parts.summary, parts.description].join(" ");
  const detectedIntent = detectIntentFromParts(rawParts);

  const scored = solutions
    .map((solution) => {
      const intent = inferSolutionIntent(solution);
      const config = INTENTS[intent];
      const text = solutionText(solution);
      const productTerms = getProductTerms(solution, config);
      const productMatches = firstMatches(primaryText, productTerms, 4).filter(Boolean);
      const hasSolutionProductMatch = productMatches.length > 0 && productMatches.some((product) => hasTerm(text, product));
      const reasons = [];
      let score = 0;

      const directMatches = [
        ...firstMatches(primaryText, solution.jiraKeywords, 4),
        ...firstMatches(primaryText, solution.tags, 4),
        ...firstMatches(primaryText, [solution.title, solution.product], 4),
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

      score += addWeightedFieldScore({ parts, values: solution.jiraKeywords, points: 15, reason: "keywords", reasons });
      score += addWeightedFieldScore({ parts, values: solution.tags, points: 10, reason: "tags", reasons });
      score += addWeightedFieldScore({ parts, values: [solution.title], points: 20, reason: "titulo", reasons });
      score += addWeightedFieldScore({ parts, values: [solution.category], points: 6, reason: "categoria", reasons });
      score += addWeightedFieldScore({ parts, values: solution.symptoms, points: 4, reason: "sintomas", reasons });
      score += addWeightedFieldScore({ parts, values: solution.causes, points: 4, reason: "causas", reasons });
      score += addWeightedFieldScore({ parts, values: solution.steps, points: 2, reason: "pasos", reasons });
      score += addWeightedFieldScore({
        parts,
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
        score -= 70;
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
