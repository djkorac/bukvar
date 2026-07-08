/**
 * Best-effort durable storage. In a local-first app with no server, IndexedDB
 * is the learner's entire investment, but by default the browser treats an
 * origin's storage as "best-effort" and may evict it under storage pressure,
 * and iOS Safari clears script-writable storage (IndexedDB included) after ~7
 * days of non-use for a PWA that isn't installed to the Home Screen.
 *
 * `navigator.storage.persist()` asks the browser to exempt this origin from
 * automatic eviction. It is a *request*, not a guarantee: Chromium grants it
 * from engagement heuristics (often without a prompt), Firefox prompts, and the
 * answer can be a silent `false`. So everything here is best-effort and never
 * throws. Durability is a layer over seeding, not a precondition for the app.
 */

/** True if this origin already has persistent storage. False if unknown. */
export const isStoragePersisted = async (): Promise<boolean> => {
  if (!globalThis.navigator?.storage?.persisted) return false;
  try {
    return await navigator.storage.persisted();
  } catch {
    return false;
  }
};

/**
 * Request persistent storage, idempotent and best-effort: short-circuits if the
 * origin is already persisted (so Firefox isn't re-prompted), and swallows any
 * error. Returns whether the origin is persisted afterwards.
 */
export const requestPersistentStorage = async (): Promise<boolean> => {
  if (!globalThis.navigator?.storage?.persist) return false;
  try {
    if (await isStoragePersisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
};

/** How much storage this origin uses, and the browser's soft ceiling, in bytes. */
export interface StorageUsage {
  usage: number;
  quota: number;
}

/**
 * Best-effort read of `navigator.storage.estimate()`. Returns null when the API
 * is unavailable, errors, or reports no figures. The caller treats that as
 * "unknown" rather than zero. Both fields are coarse browser estimates, not
 * exact byte counts.
 */
export const getStorageUsage = async (): Promise<StorageUsage | null> => {
  if (!globalThis.navigator?.storage?.estimate) return null;
  try {
    const { usage, quota } = await navigator.storage.estimate();
    if (usage === undefined || quota === undefined) return null;
    return { usage, quota };
  } catch {
    return null;
  }
};
