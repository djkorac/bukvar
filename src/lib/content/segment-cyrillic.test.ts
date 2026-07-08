import { describe, expect, it } from "vitest";
import { type CyrillicSegment, segmentCyrillic } from "./segment-cyrillic";

// Reassemble the runs, the load-bearing invariant: a thin view emits each
// segment in order, so the rendered text must equal the input character-for-
// character, only wrapped, never altered.
const rejoin = (segments: CyrillicSegment[]): string =>
  segments.map((s) => s.text).join("");

describe("segmentCyrillic", () => {
  it("returns nothing for an empty string", () => {
    expect(segmentCyrillic("")).toEqual([]);
  });

  it("leaves a pure-English string as one untagged run", () => {
    expect(segmentCyrillic("Says B.")).toEqual([
      { text: "Says B.", sr: false },
    ]);
  });

  it("tags a pure-Cyrillic string as one Serbian run", () => {
    expect(segmentCyrillic("нула")).toEqual([{ text: "нула", sr: true }]);
  });

  it("splits a leading Cyrillic word from its English tail", () => {
    expect(segmentCyrillic("нула ↔ 'null'")).toEqual([
      { text: "нула", sr: true },
      { text: " ↔ 'null'", sr: false },
    ]);
  });

  it("isolates a Cyrillic letter embedded in English prose", () => {
    expect(segmentCyrillic("Don't confuse with В, which is V.")).toEqual([
      { text: "Don't confuse with ", sr: false },
      { text: "В", sr: true },
      { text: ", which is V.", sr: false },
    ]);
  });

  it("tags each Cyrillic run separately when split by ASCII", () => {
    // Affix markers and parentheses are ASCII, so they bound the runs.
    expect(segmentCyrillic("не- ('un-') + познат ('known')")).toEqual([
      { text: "не", sr: true },
      { text: "- ('un-') + ", sr: false },
      { text: "познат", sr: true },
      { text: " ('known')", sr: false },
    ]);
  });

  it("does NOT tag non-Cyrillic lookalikes (Greek, Latin)", () => {
    // The δ is Greek and `voda` is Latin; only the Cyrillic letter is Serbian.
    expect(segmentCyrillic("draw б like a Greek δ")).toEqual([
      { text: "draw ", sr: false },
      { text: "б", sr: true },
      { text: " like a Greek δ", sr: false },
    ]);
    expect(segmentCyrillic("Вода = voda")).toEqual([
      { text: "Вода", sr: true },
      { text: " = voda", sr: false },
    ]);
  });

  it("preserves the input exactly when reassembled (round-trip)", () => {
    const samples = [
      "он (he) + -а → она (she); add -о for оно (it).",
      "девет (9) and десет (10) rhyme — learn the pair together.",
      "The yes/no question particle: 'Да ли…?' or 'Говориш ли…?'",
      "Same as Latin A — says 'ah'.",
      "ћирилица",
    ];
    for (const sample of samples) {
      expect(rejoin(segmentCyrillic(sample))).toBe(sample);
    }
  });

  it("alternates run kinds, never two of the same in a row", () => {
    const segments = segmentCyrillic("он + она → оно");
    for (let i = 1; i < segments.length; i++) {
      expect(segments[i].sr).not.toBe(segments[i - 1].sr);
    }
  });
});
