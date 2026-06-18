const { app, BrowserWindow } = require("electron");
const path = require("node:path");

const APP_PROTOCOL = "soporte-toolkit";

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(APP_PROTOCOL, process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient(APP_PROTOCOL);
}

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
