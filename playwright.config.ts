import { defineConfig, devices } from "@playwright/test";

// E2E runs the built app in real Chromium against real IndexedDB. The reviewer
// is a `client:only` island, so `astro build` can't catch a mount-time
// regression and the unit tests only have fake-indexeddb. `test:e2e` builds
// first so `dist/` is fresh; CI always rebuilds, locally an existing preview is
// reused.
//
// Deliberately off Astro's default 4321: `astro dev` binds that port, so a
// running dev server would answer the reuseExistingServer probe below and the
// suite would silently run against the dev bundle instead of the built one.
// On this dedicated port, only a real preview can be the reused server.
const PORT = 4323;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  // `list` for live console output; `html` (never auto-opened) so CI has a
  // report (with the on-retry trace embedded) to upload on failure.
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `yarn preview --port ${PORT}`,
    url: `${baseURL}/app`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
