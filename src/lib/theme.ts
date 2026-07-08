/**
 * Color-theme preference: follow the device by default, with a manual
 * light/dark override.
 *
 * Unlike every other preference (Dexie, see `lib/db/settings.ts`), the theme
 * lives in localStorage. The inline script in `BaseLayout.astro` must read it
 * *synchronously* before first paint on every page (static pages included)
 * or each load would flash the wrong theme; IndexedDB is async and can't serve
 * that script. The resolved theme is applied as `data-theme` on `<html>`,
 * which switches the token override block in `styles/global.css`.
 */

export type ThemePreference = "device" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

/** localStorage key, shared with the BaseLayout inline script via `define:vars`. */
export const THEME_STORAGE_KEY = "bukvar-theme";

/**
 * Browser-chrome colors for the `theme-color` meta, per resolved theme. Light
 * keeps the navy brand chrome; dark matches the dark paper (`--color-bg` in
 * global.css). Shared with the BaseLayout inline script via `define:vars`.
 */
export const THEME_META_COLORS: Record<ResolvedTheme, string> = {
  light: "#16213a",
  dark: "#171310",
};

/** Parse a stored value, treating anything missing or unknown as "device". */
export const parseThemePreference = (raw: string | null): ThemePreference =>
  raw === "light" || raw === "dark" || raw === "device" ? raw : "device";

/** Resolve a preference against the device's prefers-color-scheme state. */
export const resolveTheme = (
  pref: ThemePreference,
  deviceDark: boolean,
): ResolvedTheme =>
  pref === "device" ? (deviceDark ? "dark" : "light") : pref;

// Everything below touches the DOM / localStorage and is browser-only (like
// `lib/db`); it's called from islands, never at build time.

export const getThemePreference = (): ThemePreference => {
  try {
    return parseThemePreference(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    // Storage can be unavailable (private mode, blocked cookies).
    return "device";
  }
};

/** Persist a preference and apply it to the open page immediately. */
export const setThemePreference = (pref: ThemePreference): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    // Can't persist, but still apply for the life of this page.
  }
  applyTheme(
    resolveTheme(pref, matchMedia("(prefers-color-scheme: dark)").matches),
  );
};

/**
 * Apply a resolved theme: `data-theme` drives the CSS token override, and the
 * `theme-color` meta keeps the browser chrome in step. Mirrors `apply()` in
 * the BaseLayout inline script, which owns first paint and OS-theme changes.
 */
export const applyTheme = (theme: ResolvedTheme): void => {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_META_COLORS[theme]);
};
