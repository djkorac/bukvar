import { fileURLToPath } from "node:url";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { configDefaults, defineConfig } from "vitest/config";

const src = fileURLToPath(new URL("./src", import.meta.url));

// Astro owns astro.config.mjs; Vitest needs its own config to resolve the `~/`
// path alias (mirrors tsconfig `paths`).
export default defineConfig({
  // Compile Svelte rune modules (`*.svelte.ts`) so the shared DrillSession
  // engine can be unit-tested. Astro normally configures this via @astrojs/svelte.
  plugins: [svelte()],
  resolve: {
    alias: [{ find: /^~\//, replacement: `${src}/` }],
  },
  // Polyfill IndexedDB so the Dexie-backed layers can be integration-tested.
  test: {
    setupFiles: ["fake-indexeddb/auto"],
    // `e2e/` is Playwright's (`*.spec.ts` against a real browser); keep it out of
    // Vitest, whose default glob would otherwise try to run it under Node.
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
});
