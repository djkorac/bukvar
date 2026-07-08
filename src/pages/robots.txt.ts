import type { APIRoute } from "astro";

// Generated from the `site` config (astro.config.mjs) so the Sitemap host can't
// drift from the canonical/OG/sitemap URLs: the documented @astrojs/sitemap
// pattern (https://docs.astro.build/en/guides/integrations-guide/sitemap/).
const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL));
};
