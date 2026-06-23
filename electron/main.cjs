const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("node:path");

const APP_PROTOCOL = "soporte-toolkit";
const JIRA_BASE_URL = "https://camuzzigas.atlassian.net";
const APP_ICON = path.join(__dirname, "..", "public", "toolkit-icon.svg");

let mainWindow;
let jiraLoginWindow;

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

const hasJiraSession = async () => {
  const cookieHeader = await getJiraCookieHeader();
  if (!cookieHeader) return false;

  try {
    const response = await fetch(`${JIRA_BASE_URL}/rest/api/3/myself`, {
      headers: {
        Accept: "application/json",
        Cookie: cookieHeader,
      },
    });

    return response.ok;
  } catch {
    return false;
  }
};

const closeJiraLoginIfAuthenticated = async () => {
  if (!jiraLoginWindow || jiraLoginWindow.isDestroyed()) return;
  if (!(await hasJiraSession())) return;

  jiraLoginWindow.close();
  jiraLoginWindow = null;
  mainWindow?.webContents.send("jira-login-ready");
};

const createJiraLoginWindow = async () => {
  if (await hasJiraSession()) {
    mainWindow?.webContents.send("jira-login-ready");
    return { ok: true, alreadyAuthenticated: true };
  }

  if (jiraLoginWindow && !jiraLoginWindow.isDestroyed()) {
    jiraLoginWindow.focus();
    return { ok: true, alreadyOpen: true };
  }

  jiraLoginWindow = new BrowserWindow({
    width: 1040,
    height: 720,
    minWidth: 920,
    minHeight: 640,
    title: "Jira Login",
    parent: mainWindow,
    autoHideMenuBar: true,
    icon: APP_ICON,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  jiraLoginWindow.on("closed", () => {
    jiraLoginWindow = null;
  });

  jiraLoginWindow.webContents.on("did-finish-load", closeJiraLoginIfAuthenticated);
  jiraLoginWindow.webContents.on("did-navigate", closeJiraLoginIfAuthenticated);
  jiraLoginWindow.webContents.on("did-navigate-in-page", closeJiraLoginIfAuthenticated);

  jiraLoginWindow.loadURL(JIRA_BASE_URL);
  return { ok: true, alreadyAuthenticated: false };
};

ipcMain.handle("jira-open-login", () => createJiraLoginWindow());

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
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 980,
    minHeight: 680,
    backgroundColor: "#f2f7fa",
    autoHideMenuBar: true,
    icon: APP_ICON,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    return;
  }

  mainWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"));
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
