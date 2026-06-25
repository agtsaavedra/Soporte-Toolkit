import {
  CUSTOM_SOLUTIONS_STORAGE_KEY,
  normalizeSolution,
} from "../data/catalog";
import { validateSolutionShape } from "../data/solutionSchema";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_TABLE = import.meta.env.VITE_SUPABASE_TABLE ?? "solutions";
const AUTH_REDIRECT_URL = import.meta.env.VITE_AUTH_REDIRECT_URL;
const HISTORY_TABLE = "solution_history";
const SESSION_STORAGE_KEY = "support-toolkit-supabase-session";

export const isRemoteRepositoryConfigured = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY
);

const restEndpoint = (table) => `${SUPABASE_URL}/rest/v1/${table}`;
const authEndpoint = (path) => `${SUPABASE_URL}/auth/v1/${path}`;

export const readStoredSession = () => {
  try {
    const rawValue = localStorage.getItem(SESSION_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
};

const saveSession = (session) => {
  if (!session) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

const currentActor = () => readStoredSession()?.user?.email ?? "anon";

const supabaseHeaders = (options = {}) => {
  const session = readStoredSession();

  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${session?.access_token ?? SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    ...(options.prefer ? { Prefer: options.prefer } : {}),
  };
};

const solutionPayload = (solution) => ({
  ...solution,
  source: solution.source === "base" ? "shared" : solution.source,
});

const mergeSolutions = (items) => {
  const byId = new Map();
  items.forEach((item) => byId.set(item.id, normalizeSolution(item)));
  return [...byId.values()];
};

export const readLocalSolutions = () => {
  try {
    const rawValue = localStorage.getItem(CUSTOM_SOLUTIONS_STORAGE_KEY);
    if (!rawValue) return [];

    const parsedValue = JSON.parse(rawValue);
    if (!Array.isArray(parsedValue)) return [];

    return parsedValue.map(normalizeSolution);
  } catch {
    return [];
  }
};

export const saveLocalSolutions = (items) => {
  localStorage.setItem(CUSTOM_SOLUTIONS_STORAGE_KEY, JSON.stringify(items));
};

export const signIn = async ({ email, password }) => {
  const response = await fetch(authEndpoint("token?grant_type=password"), {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("No se pudo iniciar sesión.");

  const session = await response.json();
  saveSession(session);
  return session;
};

export const signUp = async ({ email, password }) => {
  const query = AUTH_REDIRECT_URL
    ? `?redirect_to=${encodeURIComponent(AUTH_REDIRECT_URL)}`
    : "";
  const response = await fetch(`${authEndpoint("signup")}${query}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("No se pudo crear el usuario.");

  const session = await response.json();
  if (session.access_token) saveSession(session);
  return session;
};

export const signOut = async () => {
  const session = readStoredSession();

  if (session?.access_token) {
    await fetch(authEndpoint("logout"), {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${session.access_token}`,
      },
    });
  }

  saveSession(null);
};

export const saveSessionFromCallbackUrl = async (url) => {
  const callbackUrl = new URL(url);
  const params = new URLSearchParams(callbackUrl.hash.replace("#", ""));
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const expiresIn = params.get("expires_in");
  const tokenType = params.get("token_type") ?? "bearer";

  if (!accessToken) return null;

  const userResponse = await fetch(authEndpoint("user"), {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const user = userResponse.ok ? await userResponse.json() : null;
  const session = {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: Number(expiresIn ?? 0),
    token_type: tokenType,
    user,
  };

  saveSession(session);
  return session;
};

const readRemoteSolutions = async () => {
  const response = await fetch(
    `${restEndpoint(SUPABASE_TABLE)}?select=id,payload&order=updated_at.desc`,
    {
      headers: supabaseHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo leer la base compartida de soluciones.");
  }

  const rows = await response.json();

  return rows.map((row) =>
    normalizeSolution({
      ...row.payload,
      id: row.id,
      source: "shared",
    })
  );
};

const writeHistory = async ({ action, solution }) => {
  if (!isRemoteRepositoryConfigured) return;

  await fetch(restEndpoint(HISTORY_TABLE), {
    method: "POST",
    headers: supabaseHeaders({ prefer: "return=minimal" }),
    body: JSON.stringify({
      solution_id: solution.id,
      action,
      actor: currentActor(),
      payload: solutionPayload(solution),
    }),
  });
};

const upsertRemoteSolutions = async (items, action = "upsert") => {
  const rows = items.map((solution) => ({
    id: solution.id,
    payload: solutionPayload(solution),
  }));

  const response = await fetch(
    `${restEndpoint(SUPABASE_TABLE)}?on_conflict=id`,
    {
      method: "POST",
      headers: supabaseHeaders({
        prefer: "return=representation,resolution=merge-duplicates",
      }),
      body: JSON.stringify(rows),
    }
  );

  if (!response.ok) {
    throw new Error("No se pudieron guardar las soluciones en la base compartida.");
  }

  const savedRows = await response.json();
  const savedSolutions = savedRows.map((row) =>
    normalizeSolution({
      ...row.payload,
      id: row.id,
      source: "shared",
    })
  );

  await Promise.all(
    savedSolutions.map((solution) => writeHistory({ action, solution }))
  );

  return savedSolutions;
};

const deleteRemoteSolution = async (solution) => {
  await writeHistory({ action: "delete", solution });

  const response = await fetch(
    `${restEndpoint(SUPABASE_TABLE)}?id=eq.${encodeURIComponent(solution.id)}`,
    {
      method: "DELETE",
      headers: supabaseHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo eliminar la solución de la base compartida.");
  }
};

export const loadUserSolutions = async () => {
  const localSolutions = readLocalSolutions();

  if (!isRemoteRepositoryConfigured) {
    return {
      items: localSolutions,
      mode: "local",
    };
  }

  try {
    const remoteSolutions = await readRemoteSolutions();
    saveLocalSolutions(remoteSolutions);

    return {
      items: remoteSolutions,
      mode: "shared",
    };
  } catch {
    return {
      items: localSolutions,
      mode: "local-fallback",
    };
  }
};

export const readSolutionHistory = async (solutionId) => {
  if (!isRemoteRepositoryConfigured || !solutionId) return [];

  const response = await fetch(
    `${restEndpoint(HISTORY_TABLE)}?solution_id=eq.${encodeURIComponent(
      solutionId
    )}&select=action,actor,created_at&order=created_at.desc&limit=8`,
    {
      headers: supabaseHeaders(),
    }
  );

  if (!response.ok) return [];
  return response.json();
};

export const addUserSolution = async (solution, currentSolutions) => {
  const localNext = mergeSolutions([...currentSolutions, solution]);
  saveLocalSolutions(localNext);

  if (!isRemoteRepositoryConfigured) {
    return {
      item: solution,
      items: localNext,
      mode: "local",
    };
  }

  try {
    const [remoteSolution] = await upsertRemoteSolutions([solution], "insert");
    const remoteNext = mergeSolutions([...currentSolutions, remoteSolution]);
    saveLocalSolutions(remoteNext);

    return {
      item: remoteSolution,
      items: remoteNext,
      mode: "shared",
    };
  } catch {
    return {
      item: solution,
      items: localNext,
      mode: "local-fallback",
    };
  }
};

export const updateUserSolution = async (solution, currentSolutions) => {
  const localNext = mergeSolutions(
    currentSolutions.map((currentSolution) =>
      currentSolution.id === solution.id ? solution : currentSolution
    )
  );
  saveLocalSolutions(localNext);

  if (!isRemoteRepositoryConfigured) {
    return {
      item: solution,
      items: localNext,
      mode: "local",
    };
  }

  try {
    const [remoteSolution] = await upsertRemoteSolutions([solution], "update");
    const remoteNext = mergeSolutions(
      currentSolutions.map((currentSolution) =>
        currentSolution.id === remoteSolution.id ? remoteSolution : currentSolution
      )
    );
    saveLocalSolutions(remoteNext);

    return {
      item: remoteSolution,
      items: remoteNext,
      mode: "shared",
    };
  } catch {
    return {
      item: solution,
      items: localNext,
      mode: "local-fallback",
    };
  }
};

export const deleteUserSolution = async (solution, currentSolutions) => {
  const localNext = currentSolutions.filter((item) => item.id !== solution.id);
  saveLocalSolutions(localNext);

  if (!isRemoteRepositoryConfigured) {
    return {
      items: localNext,
      mode: "local",
    };
  }

  try {
    await deleteRemoteSolution(solution);

    return {
      items: localNext,
      mode: "shared",
    };
  } catch {
    return {
      items: localNext,
      mode: "local-fallback",
    };
  }
};

export const importUserSolutions = async (items, currentSolutions) => {
  const invalidItem = items.find((item) => validateSolutionShape(item).length > 0);
  if (invalidItem) {
    throw new Error("El archivo contiene soluciones con formato inválido.");
  }

  const normalizedItems = items.map((item) =>
    normalizeSolution({
      ...item,
      id: item.id ?? `import-${Date.now()}-${crypto.randomUUID()}`,
      source: item.source ?? "custom",
    })
  );

  const localNext = mergeSolutions([...currentSolutions, ...normalizedItems]);
  saveLocalSolutions(localNext);

  if (!isRemoteRepositoryConfigured) {
    return {
      items: localNext,
      mode: "local",
    };
  }

  try {
    const remoteSolutions = await upsertRemoteSolutions(normalizedItems, "import");
    const remoteNext = mergeSolutions([...currentSolutions, ...remoteSolutions]);
    saveLocalSolutions(remoteNext);

    return {
      items: remoteNext,
      mode: "shared",
    };
  } catch {
    return {
      items: localNext,
      mode: "local-fallback",
    };
  }
};

export const publishSolutions = async (items, currentSolutions) => {
  if (!isRemoteRepositoryConfigured) {
    return {
      items: currentSolutions,
      mode: "local",
    };
  }

  const publishableItems = items.map((item) =>
    normalizeSolution({
      ...item,
      source: "shared",
    })
  );
  const remoteSolutions = await upsertRemoteSolutions(publishableItems, "publish");
  const remoteNext = mergeSolutions([...currentSolutions, ...remoteSolutions]);
  saveLocalSolutions(remoteNext);

  return {
    items: remoteNext,
    mode: "shared",
  };
};
