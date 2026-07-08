/**
 * The one list of routes that must stay out of search: the stateful, app-like
 * pages that only render anything once IndexedDB is populated (the reviewer,
 * settings, history, levels, placement). They carry a `noindex` robots meta
 * *and* must be excluded from the sitemap: two facts that have to agree.
 *
 * This module is the single source for both. `BaseLayout.astro` derives each
 * page's `noindex` meta from `isNoindex(Astro.url.pathname)`, and the
 * `@astrojs/sitemap` filter in `astro.config.mjs` excludes the same routes. So
 * a new private route is one edit here, and the sitemap can never advertise a
 * page the meta tag tells crawlers to ignore. (The 404 page is noindex too, but
 * it's a virtual fallback that @astrojs/sitemap already omits, so it sets the
 * meta via BaseLayout's `noindex` prop override rather than living in this list.)
 */
export const NOINDEX_ROUTES = [
  "/app",
  "/settings",
  "/history",
  "/levels",
  "/placement",
] as const;

/**
 * Whether a pathname is (or sits under) a noindex route. Matches the route
 * exactly or as a path segment prefix, so `/app` covers `/app/` without a
 * hypothetical `/apple` ever matching. Pass `new URL(page).pathname` from the
 * sitemap filter, which receives a full URL.
 */
export const isNoindex = (pathname: string): boolean =>
  NOINDEX_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
