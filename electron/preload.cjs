const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("soporteToolkit", {
  onAuthCallback(callback) {
    ipcRenderer.on("auth-callback-url", (_event, url) => callback(url));
  },
  jiraRequest(request) {
    return ipcRenderer.invoke("jira-request", request);
  },
  openJiraLogin() {
    return ipcRenderer.invoke("jira-open-login");
  },
  askAi(request) {
    return ipcRenderer.invoke("ai-chat-request", request);
  },
  onJiraLoginReady(callback) {
    ipcRenderer.on("jira-login-ready", () => callback());
  },
});
