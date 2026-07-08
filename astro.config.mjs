import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import AstroPWA from "@vite-pwa/astro";
import { defineConfig } from "astro/config";
import { isNoindex } from "./src/lib/seo/noindex";

const site = "https://bukvar.app";

export default defineConfig({
  site,
  integrations: [
    svelte(),
    // Keep the noindex app routes out of the sitemap. The route list lives in
    // lib/seo/noindex (shared with BaseLayout's robots meta) so the sitemap can
    // never advertise a page the meta tag tells crawlers to ignore.
    sitemap({
      filter: (page) => !isNoindex(new URL(page).pathname),
    }),
    AstroPWA({
      registerType: "autoUpdate",
      // Registration + manifest link are injected manually in BaseLayout.astro
      // because @vite-pwa/astro 1.x doesn't auto-inject under Astro 6.
      injectRegister: false,
      manifest: {
        name: "Bukvar — Learn Serbian Cyrillic & vocabulary",
        short_name: "Bukvar",
        description:
          "Learn the Serbian Cyrillic alphabet and high-frequency vocabulary with spaced repetition — five minutes a day, fully offline.",
        lang: "en",
        theme_color: "#16213a",
        background_color: "#faf6ef",
        display: "standalone",
        // Pin the install identity. `id` is how the browser tells "same app,
        // update it" from "different app, install a fork"; unset, it defaults to
        // `start_url`, which couples identity to an editable URL. Pinning keeps it
        // stable. Never change it once shipped: a different value forks every
        // existing install.
        id: "/app",
        start_url: "/app",
        icons: [
          { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Precache the app shell only (code, styles, fonts, icons, and the
        // small set of top-level nav/content pages), so daily reviews work
        // offline. The ~1000 dictionary pages under /words are runtime-cached
        // on visit instead (see runtimeCaching below): precaching them put
        // ~11 MB / 998 entries into the install for content the reviewer never
        // reads (it runs off IndexedDB), and a shared-chrome edit re-stamped
        // every page's revision, re-precaching the whole corpus on each deploy.
        // Audio runtime-caching is handled in a later phase.
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        globIgnores: [
          "words/**", // dictionary pages, runtime-cached on visit, not precached
          "og.png", // social-card image, never shown in-app
          // Font subsets we don't precache: Vietnamese never renders; Greek only as a
          // few analogy glyphs (Γ/Π/δ in mnemonics), left to fall back to a system
          // font offline rather than precache the whole subset.
          "**/*greek*.woff2",
          "**/*vietnamese*.woff2",
        ],
        // AstroPWA defaults navigateFallback to "/", which registers a catch-all
        // NavigationRoute (served from the precached homepage) ahead of the
        // runtimeCaching routes below. The /words pages aren't precached, so
        // without this denylist a hard navigation to one would match that
        // fallback and render the homepage instead. Deny-listing the /words
        // section lets those navigations fall through to the NetworkFirst route.
        // The boundary is (\/|$), not a bare slash, so it covers the section
        // index /words (which has no trailing slash) as well as /words/* pages.
        navigateFallbackDenylist: [/^\/words(\/|$)/],
        runtimeCaching: [
          {
            // The /words dictionary pages (the index and every detail page)
            // aren't precached; cache them on visit so they work offline
            // afterwards (fresh when online, last-seen when offline). Match on
            // the URL path, not request.mode === "navigate": in-app links go
            // through Astro's ClientRouter, which fetches pages (mode
            // "same-origin"), so a navigate-only matcher would miss them. The
            // index is /words with no trailing slash, so it takes an equality
            // check alongside the /words/ prefix that covers the detail pages.
            urlPattern: ({ url }) =>
              url.pathname === "/words" || url.pathname.startsWith("/words/"),
            handler: "NetworkFirst",
            options: {
              cacheName: "pages",
              networkTimeoutSeconds: 3, // fall back to cache on lie-fi, don't hang
              expiration: {
                // Bounds a user's browse working set, NOT the corpus. These
                // /words pages are runtime-cached on visit (see globIgnores) and
                // the study loop runs off IndexedDB, so this is a best-effort
                // recency cache, not a completeness guarantee. 2000 is generous
                // headroom over any realistic browse session; do NOT scale it
                // with the corpus (that just re-creates the precache bloat we
                // avoid). maxAgeSeconds keeps it near the active set; only
                // pages actually visited are ever stored.
                maxEntries: 2000,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    // `astro preview` is a local-only command (the production site is static
    // files on a CDN, with no Vite server), so relaxing its host check has no
    // production effect. The leading-dot wildcard lets a tunnel (cloudflared's
    // random *.trycloudflare.com subdomains) reach the preview for PWA testing
    // on a real device over HTTPS.
    preview: {
      allowedHosts: [".trycloudflare.com"],
    },
  },
});
