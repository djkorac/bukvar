import { describe, expect, it } from "vitest";
import { parseThemePreference, resolveTheme } from "~/lib/theme";

// The DOM/localStorage half of lib/theme is exercised by the browser; these
// cover the pure resolution rules the inline script and the settings control
// both rely on.

describe("parseThemePreference", () => {
  it("accepts the three valid preferences", () => {
    expect(parseThemePreference("device")).toBe("device");
    expect(parseThemePreference("light")).toBe("light");
    expect(parseThemePreference("dark")).toBe("dark");
  });

  it("falls back to device for missing or unknown values", () => {
    expect(parseThemePreference(null)).toBe("device");
    expect(parseThemePreference("")).toBe("device");
    expect(parseThemePreference("DARK")).toBe("device");
    expect(parseThemePreference("solarized")).toBe("device");
  });
});

describe("resolveTheme", () => {
  it("follows the device when the preference is device", () => {
    expect(resolveTheme("device", true)).toBe("dark");
    expect(resolveTheme("device", false)).toBe("light");
  });

  it("ignores the device for an explicit override", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
});
