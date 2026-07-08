export const normalizePath = (p: string) => p.replace(/\/$/, "") || "/";

// A nav entry is active on its own page and on any page beneath it, so a section
// link (e.g. /words) stays highlighted on detail routes like /words/zdravo.
// Matching on a trailing-slash boundary keeps /word from matching /words; the
// root "/" is exact-only, since every path descends from it.
export const isActive = (here: string, href: string) => {
  const path = normalizePath(here);
  const target = normalizePath(href);
  if (target === "/") return path === "/";
  return path === target || path.startsWith(`${target}/`);
};
