import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTapLock } from "./tap-lock";

// createTapLock reads two browser globals: window.matchMedia (coarse-pointer
// detection) and performance.now (the clock). The Vitest env is Node, so stub
// matchMedia per test and drive the clock by hand: the timing window is tested
// deterministically, with no real waiting.
let now = 0;

const usePointer = (coarse: boolean) =>
  vi.stubGlobal("window", {
    matchMedia: (query: string) => ({
      matches: coarse && query === "(pointer: coarse)",
    }),
  });

beforeEach(() => {
  now = 0;
  vi.spyOn(performance, "now").mockImplementation(() => now);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("createTapLock on a coarse (touch) pointer", () => {
  it("is unlocked until armed", () => {
    usePointer(true);
    expect(createTapLock().locked()).toBe(false);
  });

  it("swallows taps for the 350 ms window after lock()", () => {
    usePointer(true);
    const tap = createTapLock();
    tap.lock();
    expect(tap.locked()).toBe(true); // same instant
    now = 349;
    expect(tap.locked()).toBe(true); // just inside the window
    now = 350;
    expect(tap.locked()).toBe(false); // window elapsed (strict <)
    now = 5000;
    expect(tap.locked()).toBe(false);
  });

  it("re-arming extends the window from the new instant", () => {
    usePointer(true);
    const tap = createTapLock();
    tap.lock(); // locked until 350
    now = 300;
    tap.lock(); // re-armed: locked until 650
    now = 400;
    expect(tap.locked()).toBe(true); // would have expired under the first lock
    now = 650;
    expect(tap.locked()).toBe(false);
  });
});

describe("createTapLock on a fine (mouse/keyboard) pointer", () => {
  it("never locks, so the desktop flow is never throttled", () => {
    usePointer(false);
    const tap = createTapLock();
    tap.lock();
    expect(tap.locked()).toBe(false);
    now = 10;
    expect(tap.locked()).toBe(false);
  });
});
