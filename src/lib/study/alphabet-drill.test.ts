import { describe, expect, it } from "vitest";
import type { LetterEntry } from "~/lib/content/types";
import { buildDrill, buildQuestion } from "./alphabet-drill";

const letter = (id: string, latin: string): LetterEntry => ({
  id,
  order: 0,
  cyrillic: id.toUpperCase(),
  cyrillicLower: id,
  latin,
  latinLower: latin.toLowerCase(),
  ipa: "",
  example: "",
  exampleEn: "",
});

const pool: LetterEntry[] = [
  letter("a", "A"),
  letter("b", "B"),
  letter("v", "V"),
  letter("g", "G"),
  letter("d", "D"),
];

// Deterministic RNG cycling through fixed values, for repeatable tests.
const seqRng = (values: number[]): (() => number) => {
  let i = 0;
  return () => values[i++ % values.length];
};

describe("buildQuestion", () => {
  it("includes the correct answer among the options", () => {
    const q = buildQuestion(pool[0], pool, 4);
    expect(q.answer).toBe("A");
    expect(q.options).toContain("A");
  });

  it("produces the requested number of distinct options", () => {
    const q = buildQuestion(pool[0], pool, 4);
    expect(q.options).toHaveLength(4);
    expect(new Set(q.options).size).toBe(4);
  });

  it("never uses the answer as a distractor", () => {
    const q = buildQuestion(pool[2], pool, 4);
    const distractors = q.options.filter((o) => o !== q.answer);
    expect(distractors).not.toContain("V");
  });

  it("caps options at the pool size when asked for too many", () => {
    const q = buildQuestion(pool[0], pool, 10);
    expect(q.options).toHaveLength(pool.length);
  });
});

describe("buildQuestion glyph form", () => {
  it("rolls italic when the draw lands under the italic share", () => {
    expect(buildQuestion(pool[0], pool, 4, seqRng([0])).form).toBe("italic");
  });

  it("stays upright otherwise", () => {
    expect(buildQuestion(pool[0], pool, 4, seqRng([0.9])).form).toBe("upright");
  });
});

describe("buildDrill", () => {
  it("creates exactly one question per letter", () => {
    const drill = buildDrill(pool, 4);
    expect(drill).toHaveLength(pool.length);
    expect(new Set(drill.map((q) => q.letter.id)).size).toBe(pool.length);
  });
});
