const DB_NAME = "soporte-toolkit-jira";
const DB_VERSION = 1;
const TICKETS_STORE = "tickets";
const META_STORE = "meta";
const META_KEY = "helpdesk";

const openDb = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(TICKETS_STORE)) {
        db.createObjectStore(TICKETS_STORE, { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const runStore = async (storeName, mode, callback) => {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const result = callback(store);

    tx.oncomplete = () => {
      db.close();
      resolve(result);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
};

export const loadCachedHelpdeskTickets = async () => {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(TICKETS_STORE, "readonly");
    const request = tx.objectStore(TICKETS_STORE).getAll();

    request.onsuccess = () => {
      db.close();
      resolve(
        request.result.sort((a, b) => new Date(b.created) - new Date(a.created))
      );
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
};

export const getTicketCacheMeta = async () => {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, "readonly");
    const request = tx.objectStore(META_STORE).get(META_KEY);

    request.onsuccess = () => {
      db.close();
      resolve(
        request.result ?? {
          id: META_KEY,
          lastSync: "",
          count: 0,
          latestCreated: "",
          nextPageToken: "",
          isLastPage: false,
        }
      );
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
};

export const saveTicketsToCache = async (
  tickets,
  {
    lastSync = new Date().toISOString(),
    nextPageToken,
    isLastPage,
  } = {}
) => {
  const currentTickets = await loadCachedHelpdeskTickets();
  const byKey = new Map(currentTickets.map((ticket) => [ticket.key, ticket]));
  tickets.forEach((ticket) => byKey.set(ticket.key, ticket));
  const mergedTickets = [...byKey.values()].sort(
    (a, b) => new Date(b.created) - new Date(a.created)
  );
  const latestCreated = mergedTickets[0]?.created ?? "";
  const currentMeta = await getTicketCacheMeta();

  await runStore(TICKETS_STORE, "readwrite", (store) => {
    mergedTickets.forEach((ticket) => store.put(ticket));
  });

  await runStore(META_STORE, "readwrite", (store) =>
    store.put({
      id: META_KEY,
      lastSync,
      count: mergedTickets.length,
      latestCreated,
      lastDiff: tickets.length,
      nextPageToken: nextPageToken ?? currentMeta.nextPageToken ?? "",
      isLastPage: isLastPage ?? currentMeta.isLastPage ?? false,
    })
  );

  return mergedTickets;
};

export const clearTicketCache = async () => {
  await runStore(TICKETS_STORE, "readwrite", (store) => store.clear());
  await runStore(META_STORE, "readwrite", (store) => store.delete(META_KEY));
};
