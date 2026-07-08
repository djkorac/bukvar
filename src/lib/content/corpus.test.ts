import { describe, expect, it } from "vitest";
import { alphabet } from "~/data/alphabet";
import type { WordEntry } from "~/lib/content/types";
import {
  cardHref,
  dictionaryGroups,
  getWordBySlug,
  letterSlug,
  lettersInWord,
  wordSlug,
  wordsWithLetter,
} from "./corpus";

const word = (cyrillic: string): WordEntry => ({
  id: `word-${cyrillic}`,
  cyrillic,
  latin: cyrillic,
  english: "",
  topic: "everyday",
  rank: 0,
});

describe("slugs", () => {
  it("strips the kind prefix", () => {
    expect(letterSlug("letter-be")).toBe("be");
    expect(wordSlug("word-zdravo")).toBe("zdravo");
  });
});

describe("cardHref", () => {
  it("routes a card to its kind's detail page", () => {
    expect(cardHref("letter", "letter-be")).toBe("/alphabet/be");
    expect(cardHref("word", "word-zdravo")).toBe("/words/zdravo");
  });
});

describe("lettersInWord", () => {
  it("maps each Cyrillic glyph to its letter, in reading order", () => {
    const latins = lettersInWord(word("здраво")).map((l) => l.latin);
    expect(latins).toEqual(["Z", "D", "R", "A", "V", "O"]);
  });

  it("de-duplicates repeated letters", () => {
    const latins = lettersInWord(word("мама")).map((l) => l.latin);
    expect(latins).toEqual(["M", "A"]);
  });

  it("treats a Cyrillic digraph glyph as one letter", () => {
    const latins = lettersInWord(word("љубав")).map((l) => l.latin);
    expect(latins).toEqual(["Lj", "U", "B", "A", "V"]);
  });
});

describe("wordsWithLetter", () => {
  it("finds starter words containing the letter", () => {
    const letterA = alphabet.find((l) => l.id === "letter-a");
    if (!letterA) throw new Error("missing letter-a");
    const hits = wordsWithLetter(letterA);
    expect(hits.some((w) => w.id === "word-majka")).toBe(true);
  });
});

describe("getWordBySlug", () => {
  it("resolves a known starter word", () => {
    expect(getWordBySlug("zdravo")?.english).toBe("hello / hi");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getWordBySlug("nope")).toBeUndefined();
  });
});

describe("dictionaryGroups", () => {
  const groups = dictionaryGroups();

  it("links each section to a distinct landing page", () => {
    // The guard: per-level grouping linked "Common verbs" and "More verbs" (and
    // the adjectives pair) to one page each, so a slug appeared twice.
    const slugs = groups
      .map((g) => g.slug)
      .filter((s): s is string => s !== undefined);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("merges the core/overflow pacing split into one section per page", () => {
    const verbs = groups.filter((g) => g.slug === "verbs");
    const adjectives = groups.filter((g) => g.slug === "adjectives");
    expect(verbs).toHaveLength(1);
    expect(adjectives).toHaveLength(1);
    // A neutral, page-derived heading covers both halves, not either per-level
    // name ("Common verbs"/"More verbs").
    expect(verbs[0].label).toBe("Verbs");
    expect(adjectives[0].label).toBe("Adjectives");
    expect(new Set(verbs[0].words.map((w) => w.topic))).toEqual(
      new Set<string>(["verbs-core", "verbs"]),
    );
  });

  it("omits the alphabet and any wordless section", () => {
    expect(groups.every((g) => g.words.length > 0)).toBe(true);
    expect(groups.some((g) => g.label === "Alphabet")).toBe(false);
  });
});
