export const SOLUTION_REQUIRED_FIELDS = ["title", "category"];

export const SOLUTION_ARRAY_FIELDS = [
  "tags",
  "symptoms",
  "causes",
  "steps",
  "commands",
  "installCommands",
  "verificationSteps",
  "jiraKeywords",
];

export const SOLUTION_OPTIONAL_FIELDS = [
  "id",
  "title",
  "category",
  "intent",
  "product",
  "risk",
  "time",
  "estimatedMinutes",
  "powershell",
  "resolutionType",
  "requiresApproval",
  "internalOnly",
  "licenseRequired",
  "officialDownloadUrl",
  "internalDownloadPath",
  "installerFile",
  "installerNotes",
  "installCommands",
  "verificationSteps",
  "symptoms",
  "causes",
  "steps",
  "commands",
  "jiraKeywords",
  "userMessage",
  "jiraTemplate",
  "internalNotes",
];

// Validacion liviana para importaciones y futuras integraciones.
// No reemplaza normalizeSolution: solo detecta estructuras claramente invalidas.
export const validateSolutionShape = (solution) => {
  const errors = [];

  if (!solution || typeof solution !== "object") {
    return ["La solucion debe ser un objeto."];
  }

  SOLUTION_REQUIRED_FIELDS.forEach((field) => {
    if (!String(solution[field] ?? "").trim()) {
      errors.push(`Falta el campo requerido: ${field}.`);
    }
  });

  SOLUTION_ARRAY_FIELDS.forEach((field) => {
    if (solution[field] !== undefined && !Array.isArray(solution[field])) {
      errors.push(`El campo ${field} debe ser una lista.`);
    }
  });

  return errors;
};

export const isValidSolutionShape = (solution) =>
  validateSolutionShape(solution).length === 0;
