/**
 * Persist the workspace directory handle in IndexedDB so reattaching on a
 * revisit is one permission click (§3.9). Only the handle is stored —
 * never file content: files stay the single source of truth.
 */
const DB_NAME = 'fixbuilder';
const STORE = 'workspace';
const KEY = 'directoryHandle';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error as Error);
  });
}

export async function storeHandle(handle: unknown): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(handle, KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error as Error);
    });
    db.close();
  } catch {
    // IndexedDB unavailable (private browsing…) — reattach stays manual.
  }
}

export async function loadStoredHandle(): Promise<unknown | undefined> {
  try {
    const db = await openDb();
    const handle = await new Promise<unknown>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const request = tx.objectStore(STORE).get(KEY);
      request.onsuccess = () => resolve(request.result as unknown);
      request.onerror = () => reject(request.error as Error);
    });
    db.close();
    return handle ?? undefined;
  } catch {
    return undefined;
  }
}

export async function clearStoredHandle(): Promise<void> {
  await storeHandle(undefined);
}
