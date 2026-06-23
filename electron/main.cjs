const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("node:path");

const APP_PROTOCOL = "soporte-toolkit";
const JIRA_BASE_URL = "https://camuzzigas.atlassian.net";

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(APP_PROTOCOL, process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient(APP_PROTOCOL);
}

const buildJiraUrl = (requestPath, params = {}) => {
  const url = new URL(requestPath, JIRA_BASE_URL);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url;
};

const getJiraCookieHeader = async () => {
  const cookies = await session.defaultSession.cookies.get({ url: JIRA_BASE_URL });
  return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
};

const createJiraLoginWindow = () => {
  const loginWindow = new BrowserWindow({
    width: 1180,
    height: 780,
    minWidth: 980,
    minHeight: 680,
    title: "Jira Login",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  loginWindow.loadURL(JIRA_BASE_URL);
};

ipcMain.handle("jira-open-login", () => {
  createJiraLoginWindow();
  return { ok: true };
});

ipcMain.handle("jira-request", async (_event, { path: requestPath, params }) => {
  const url = buildJiraUrl(requestPath, params);
  const cookieHeader = await getJiraCookieHeader();

  if (!cookieHeader) {
    throw new Error("No hay sesion de Jira en Electron. Abri el login Jira desde la app.");
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      Cookie: cookieHeader,
    },
  });

  if (!response.ok) {
    throw new Error(`Jira respondio ${response.status}`);
  }

  return response.json();
});
const createWindow = () => {
  const window = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 980,
    minHeight: 680,
    backgroundColor: "#f2f7fa",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    window.loadURL(process.env.VITE_DEV_SERVER_URL);
    return;
  }

  window.loadFile(path.join(__dirname, "..", "dist", "index.html"));
};

const handleProtocolUrl = (url) => {
  const windows = BrowserWindow.getAllWindows();
  const targetWindow = windows[0];

  if (!targetWindow || !url) return;

  targetWindow.focus();
  targetWindow.webContents.send("auth-callback-url", url);
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("open-url", (event, url) => {
  event.preventDefault();
  handleProtocolUrl(url);
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (_event, argv) => {
    const protocolUrl = argv.find((arg) => arg.startsWith(`${APP_PROTOCOL}://`));
    handleProtocolUrl(protocolUrl);
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
