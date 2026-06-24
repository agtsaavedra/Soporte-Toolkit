const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const JIRA_BASE_URL = "https://camuzzigas.atlassian.net";
const PORT = Number(process.env.SUPPORT_TOOLKIT_PROXY_PORT || 5174);
const VITE_PORT = Number(process.env.VITE_PORT || 5173);

const loadEnvFile = () => {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;

    const [key, ...valueParts] = trimmed.split("=");
    if (process.env[key]) return;

    process.env[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
  });
};

loadEnvFile();

const jiraEmail = process.env.JIRA_EMAIL;
const jiraApiToken = process.env.JIRA_API_TOKEN;
const jiraBearerToken = process.env.JIRA_BEARER_TOKEN;

const buildJiraHeaders = () => {
  if (jiraBearerToken) {
    return {
      Accept: "application/json",
      Authorization: `Bearer ${jiraBearerToken}`,
    };
  }

  if (jiraEmail && jiraApiToken) {
    return {
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString("base64")}`,
    };
  }

  return null;
};

const sendJson = (response, status, body) => {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": `http://localhost:${VITE_PORT}`,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  });
  response.end(JSON.stringify(body));
};

const proxyJira = async (request, response) => {
  const headers = buildJiraHeaders();
  if (!headers) {
    sendJson(response, 500, {
      error:
        "Faltan JIRA_EMAIL + JIRA_API_TOKEN o JIRA_BEARER_TOKEN en .env.local. El navegador no puede usar la sesion Jira por CORS.",
    });
    return;
  }

  const incomingUrl = new URL(request.url, `http://localhost:${PORT}`);
  const jiraPath = incomingUrl.pathname.replace(/^\/api\/jira/, "");
  const jiraUrl = new URL(jiraPath, JIRA_BASE_URL);
  incomingUrl.searchParams.forEach((value, key) => jiraUrl.searchParams.set(key, value));

  try {
    const jiraResponse = await fetch(jiraUrl, { headers });
    const text = await jiraResponse.text();
    response.writeHead(jiraResponse.status, {
      "Content-Type": jiraResponse.headers.get("content-type") || "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": `http://localhost:${VITE_PORT}`,
    });
    response.end(text);
  } catch (error) {
    sendJson(response, 502, { error: error.message || "No se pudo consultar Jira." });
  }
};

const server = http.createServer((request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.url.startsWith("/api/jira/")) {
    proxyJira(request, response);
    return;
  }

  sendJson(response, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Jira proxy listo en http://localhost:${PORT}`);
});

const vite = spawn(
  process.platform === "win32" ? "npm.cmd" : "npm",
  ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(VITE_PORT)],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      VITE_JIRA_PROXY_URL: `http://localhost:${PORT}/api/jira`,
    },
  }
);

const shutdown = () => {
  vite.kill();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
vite.on("exit", (code) => {
  server.close(() => process.exit(code ?? 0));
});
