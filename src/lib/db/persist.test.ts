import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getStorageUsage,
  isStoragePersisted,
  requestPersistentStorage,
} from "~/lib/db/persist";

/**
 * The persist layer is thin glue over `navigator.storage`, but its contract
 * (idempotent, best-effort, never throws) is what keeps it safe to call on
 * every island mount. These stub the API to pin that contract down.
 */

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("requestPersistentStorage", () => {
  it("returns false when the Storage API is unavailable", async () => {
    vi.stubGlobal("navigator", {});
    expect(await requestPersistentStorage()).toBe(false);
  });

  it("short-circuits without re-requesting when already persisted", async () => {
    const persist = vi.fn();
    vi.stubGlobal("navigator", {
      storage: { persisted: async () => true, persist },
    });
    expect(await requestPersistentStorage()).toBe(true);
    expect(persist).not.toHaveBeenCalled();
  });

  it("requests persistence and returns the result when not yet persisted", async () => {
    const persist = vi.fn(async () => true);
    vi.stubGlobal("navigator", {
      storage: { persisted: async () => false, persist },
    });
    expect(await requestPersistentStorage()).toBe(true);
    expect(persist).toHaveBeenCalledOnce();
  });

  it("never throws when the browser denies or errors", async () => {
    vi.stubGlobal("navigator", {
      storage: {
        persisted: async () => false,
        persist: async () => {
          throw new Error("denied");
        },
      },
    });
    expect(await requestPersistentStorage()).toBe(false);
  });
});

describe("isStoragePersisted", () => {
  it("returns false when the API is unavailable", async () => {
    vi.stubGlobal("navigator", {});
    expect(await isStoragePersisted()).toBe(false);
  });

  it("reflects the browser's persisted() answer", async () => {
    vi.stubGlobal("navigator", { storage: { persisted: async () => true } });
    expect(await isStoragePersisted()).toBe(true);
  });
});

describe("getStorageUsage", () => {
  it("returns null when the API is unavailable", async () => {
    vi.stubGlobal("navigator", {});
    expect(await getStorageUsage()).toBeNull();
  });

  it("returns null when the browser reports no figures", async () => {
    vi.stubGlobal("navigator", { storage: { estimate: async () => ({}) } });
    expect(await getStorageUsage()).toBeNull();
  });

  it("returns the browser's usage and quota", async () => {
    vi.stubGlobal("navigator", {
      storage: { estimate: async () => ({ usage: 240_000, quota: 5e9 }) },
    });
    expect(await getStorageUsage()).toEqual({ usage: 240_000, quota: 5e9 });
  });
});
