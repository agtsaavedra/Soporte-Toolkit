export const DOWNLOAD_REGISTRY = {
  POWER_BI_DESKTOP: {
    product: "Power BI Desktop",
    officialDownloadUrl: "https://www.microsoft.com/en-us/download/details.aspx?id=58494",
    wingetId: "Microsoft.PowerBI",
    installerFile: "PBIDesktopSetup_x64.exe",
    installCommands: ["winget install Microsoft.PowerBI"],
    verificationSteps: ["Abrir Power BI Desktop.", "Validar que inicia correctamente."],
  },
  GOOGLE_EARTH_PRO: {
    product: "Google Earth Pro",
    officialDownloadUrl: "https://www.google.com/earth/about/versions/",
    installerFile: "GoogleEarthProSetup.exe",
    verificationSteps: ["Abrir Google Earth Pro.", "Validar carga de mapas."],
  },
  FLUKE_CONNECT_DESKTOP: {
    product: "Fluke Connect Desktop",
    officialDownloadUrl: "https://www.fluke.com/en-us/support/software-downloads/software-for-fluke-infrared-cameras",
    installerFile: "FlukeConnectDesktop.exe",
    verificationSteps: [
      "Abrir Fluke Connect Desktop.",
      "Conectar camara termografica si corresponde.",
      "Validar deteccion del dispositivo.",
    ],
  },
  CHROME: {
    product: "Google Chrome",
    officialDownloadUrl: "https://www.google.com/chrome/",
    wingetId: "Google.Chrome",
    installCommands: ["winget install Google.Chrome"],
    verificationSteps: ["Abrir Google Chrome.", "Validar navegacion a un sitio interno o publico."],
  },
  TEAMS: {
    product: "Microsoft Teams",
    officialDownloadUrl: "https://www.microsoft.com/en-us/microsoft-teams/download-app",
    wingetId: "Microsoft.Teams",
    installCommands: ["winget install Microsoft.Teams"],
    verificationSteps: ["Abrir Teams.", "Validar inicio de sesion del usuario."],
  },
  SEVEN_ZIP: {
    product: "7-Zip",
    officialDownloadUrl: "https://www.7-zip.org/download.html",
    wingetId: "7zip.7zip",
    installCommands: ["winget install 7zip.7zip"],
    verificationSteps: ["Abrir 7-Zip File Manager.", "Validar que permite comprimir o abrir un archivo."],
  },
  ADOBE_READER: {
    product: "Adobe Acrobat Reader",
    officialDownloadUrl: "https://get.adobe.com/reader/",
    wingetId: "Adobe.Acrobat.Reader.64-bit",
    installCommands: ["winget install Adobe.Acrobat.Reader.64-bit"],
    verificationSteps: ["Abrir Adobe Acrobat Reader.", "Validar apertura de un PDF."],
  },
  AUTOCAD: {
    product: "AutoCAD",
    officialDownloadUrl: "https://www.autodesk.com/products/autocad/overview",
    licenseRequired: true,
    requiresApproval: true,
    verificationSteps: ["Validar instalacion.", "Validar licencia asignada antes de entregar."],
  },
  DWG_TRUEVIEW: {
    product: "DWG TrueView / Autodesk Viewer",
    officialDownloadUrl: "https://www.autodesk.com/products/dwg-trueview/overview",
    verificationSteps: ["Abrir DWG TrueView o Autodesk Viewer.", "Validar apertura del archivo DWG."],
  },
  BROTHER_SUPPORT: {
    product: "Brother",
    officialDownloadUrl: "https://support.brother.com/g/b/productsearch.aspx?c=us&content=dl&lang=en",
  },
  LEXMARK_SUPPORT: {
    product: "Lexmark",
    officialDownloadUrl: "https://support.lexmark.com/en_us/drivers-downloads.html",
  },
  RICOH_SUPPORT: {
    product: "Ricoh",
    officialDownloadUrl: "https://www.ricoh.com/support",
  },
  HP_SUPPORT: {
    product: "HP",
    officialDownloadUrl: "https://support.hp.com/us-en/drivers",
  },
  EPSON_SUPPORT: {
    product: "Epson",
    officialDownloadUrl: "https://epson.com/Support/Point-of-Sale/Impact-Printers-%28Dot-Matrix%29/Epson-TM-U220/s/SPT_C31C514103",
  },
  GNAT: {
    product: "GNAT Escritorio",
    officialDownloadUrl: "",
    internalDownloadPath: "[RUTA_INTERNA]/GNAT",
    verificationSteps: ["Abrir GNAT Escritorio.", "Validar ingreso o pantalla inicial."],
  },
  BUDI: {
    product: "BUDI",
    officialDownloadUrl: "",
    internalDownloadPath: "[RUTA_INTERNA]/BUDI",
    verificationSteps: ["Abrir BUDI.", "Validar acceso inicial o actualizacion requerida."],
  },
  SIC: {
    product: "SIC",
    officialDownloadUrl: "",
    internalDownloadPath: "[RUTA_INTERNA]/SIC",
    verificationSteps: ["Abrir SIC.", "Validar pantalla inicial con el usuario."],
  },
  AFM_MONITOR: {
    product: "AFM Monitor",
    officialDownloadUrl: "",
    internalDownloadPath: "[RUTA_INTERNA]/AFM Monitor",
    verificationSteps: ["Abrir AFM Monitor.", "Validar que inicia sin error de licencia."],
  },
  DEBMEDIA: {
    product: "DebMedia",
    officialDownloadUrl: "",
    internalDownloadPath: "[RUTA_INTERNA]/DebMedia",
  },
  PROSERLINK: {
    product: "Proserlink",
    officialDownloadUrl: "",
    internalDownloadPath: "[RUTA_INTERNA]/Proserlink",
  },
  ROOTS: {
    product: "ROOTS",
    officialDownloadUrl: "",
    internalDownloadPath: "[RUTA_INTERNA]/ROOTS",
  },
  MODEL_5_PROVER: {
    product: "Model 5 Prover",
    officialDownloadUrl: "",
    internalDownloadPath: "[RUTA_INTERNA]/Model 5 Prover",
  },
  IBM_I_ACCESS_71: {
    product: "IBM i Access 7.1",
    officialDownloadUrl: "",
    internalDownloadPath: "[RUTA_INTERNA]/Instalacion Base y Actualizacion SPs",
    installerFile: "Instalacion Base + Actualizacion SPs",
    installerNotes:
      "Este procedimiento corresponde a IBM i Access viejo 7.1, no a IBM i Access Client Solutions Java.",
    verificationSteps: [
      "Abrir IBM i Access / Personal Communications.",
      "Confirmar que abre sesion 5250.",
      "Validar acceso a AGSERVER.",
    ],
  },
};
