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

const solutionPayload = (solution) => ({
  ...solution,
  source: solution.source === "base" ? "shared" : solution.source,
});

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
      payload: solutionPayload(solution),
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

const updateRemoteSolution = async (solution) => {
  const response = await fetch(
    `${supabaseEndpoint}?id=eq.${encodeURIComponent(solution.id)}`,
    {
      method: "PATCH",
      headers: supabaseHeaders,
      body: JSON.stringify({
        payload: solutionPayload(solution),
      }),
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo actualizar la solución en la base compartida.");
  }

  const [row] = await response.json();

  return normalizeSolution({
    ...row.payload,
    id: row.id,
    source: "shared",
  });
};

const deleteRemoteSolution = async (solutionId) => {
  const response = await fetch(
    `${supabaseEndpoint}?id=eq.${encodeURIComponent(solutionId)}`,
    {
      method: "DELETE",
      headers: supabaseHeaders,
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

export const updateUserSolution = async (solution, currentSolutions) => {
  const localNext = currentSolutions.map((currentSolution) =>
    currentSolution.id === solution.id ? solution : currentSolution
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
    const remoteSolution = await updateRemoteSolution(solution);
    const remoteNext = currentSolutions.map((currentSolution) =>
      currentSolution.id === remoteSolution.id ? remoteSolution : currentSolution
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

export const deleteUserSolution = async (solutionId, currentSolutions) => {
  const localNext = currentSolutions.filter((solution) => solution.id !== solutionId);
  saveLocalSolutions(localNext);

  if (!isRemoteRepositoryConfigured) {
    return {
      items: localNext,
      mode: "local",
    };
  }

  try {
    await deleteRemoteSolution(solutionId);

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
