import {
  CUSTOM_SOLUTIONS_STORAGE_KEY,
  normalizeSolution,
} from "../data/catalog";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_TABLE = import.meta.env.VITE_SUPABASE_TABLE ?? "solutions";

export const isRemoteRepositoryConfigured = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY
);

const supabaseEndpoint = `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`;

const supabaseHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
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

const readRemoteSolutions = async () => {
  const response = await fetch(`${supabaseEndpoint}?select=id,payload&order=created_at.desc`, {
    headers: supabaseHeaders,
  });

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

const insertRemoteSolution = async (solution) => {
  const response = await fetch(supabaseEndpoint, {
    method: "POST",
    headers: supabaseHeaders,
    body: JSON.stringify({
      id: solution.id,
      payload: solution,
    }),
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar la solución en la base compartida.");
  }

  const [row] = await response.json();

  return normalizeSolution({
    ...row.payload,
    id: row.id,
    source: "shared",
  });
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

export const addUserSolution = async (solution, currentSolutions) => {
  const localNext = [...currentSolutions, solution];
  saveLocalSolutions(localNext);

  if (!isRemoteRepositoryConfigured) {
    return {
      item: solution,
      items: localNext,
      mode: "local",
    };
  }

  try {
    const remoteSolution = await insertRemoteSolution(solution);
    const remoteNext = [...currentSolutions, remoteSolution];
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
