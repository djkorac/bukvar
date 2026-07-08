import { describe, expect, it } from "vitest";
import { word } from "./word";

describe("word() helper", () => {
  it("derives id, Latin, and IPA from the Cyrillic", () => {
    const w = word({ cyrillic: "љубав", english: "love", topic: "feelings" });
    expect(w.id).toBe("word-ljubav");
    expect(w.latin).toBe("ljubav");
    expect(w.ipa).toMatch(/^\/.*\/$/);
  });

  it("derives each example's Latin 1:1 from its Cyrillic", () => {
    const w = word({
      cyrillic: "срећа",
      english: "happiness",
      topic: "feelings",
      examples: [{ cyrillic: "Срећа не зависи од новца.", english: "..." }],
    });
    expect(w.examples?.[0].latin).toBe("Sreća ne zavisi od novca.");
  });
});
