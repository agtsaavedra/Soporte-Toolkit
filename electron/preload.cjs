const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("soporteToolkit", {
  onAuthCallback(callback) {
    ipcRenderer.on("auth-callback-url", (_event, url) => callback(url));
  },
});
