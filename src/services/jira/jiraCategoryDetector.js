const DETECTED_CATEGORIES = [
  ["Claves y usuarios", ["clave", "password", "contrasena", "bloqueado", "usuario"]],
  ["Instalacion de software", ["instalar", "software", "programa", "power bi", "autocad", "google earth"]],
  ["Outlook / Office", ["outlook", "office", "excel", "word", "pst", "ost", "onedrive"]],
  ["Impresoras y scanners", ["impresora", "scanner", "escaner", "plotter", "spooler"]],
  ["Red / VPN / FortiClient", ["vpn", "forticlient", "dns", "red", "winrm", "remote access"]],
  ["SAP / AGSERVER / AS400", ["sap", "agserver", "as400", "cgp"]],
  ["Equipos / hardware", ["equipo", "notebook", "pc", "disco", "hardware", "perfil"]],
  ["Aplicaciones internas", ["debmedia", "roots", "proserlink", "model 5"]],
];

// Clasificacion rapida para filtros de Jira; el matcher profundo vive aparte.
export const detectJiraCategory = (text) => {
  const normalized = text.toLocaleLowerCase("es-AR");
  const match = DETECTED_CATEGORIES.find(([, keywords]) =>
    keywords.some((keyword) => normalized.includes(keyword))
  );

  return match?.[0] ?? "Sin clasificar";
};
