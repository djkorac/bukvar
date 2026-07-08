import { describe, expect, it } from "vitest";
import { safeJsonLd } from "./json-ld";

describe("safeJsonLd", () => {
  it("escapes `<` so a value can't terminate the script block early", () => {
    const out = safeJsonLd({
      description: "</script><script>alert(1)</script>",
    });
    expect(out).not.toContain("</script>");
    expect(out).toContain("\\u003c/script>");
  });

  it("is lossless: the escape round-trips back to the original via JSON.parse", () => {
    const data = { name: "a < b", nested: { x: "</script>" }, list: [1, "<"] };
    expect(JSON.parse(safeJsonLd(data))).toEqual(data);
  });

  it("leaves payloads with no `<` untouched", () => {
    const data = { "@type": "DefinedTerm", name: "књига" };
    expect(safeJsonLd(data)).toBe(JSON.stringify(data));
  });
});
