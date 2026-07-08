import { describe, expect, it } from "vitest";
import {
  buildFreqIndex,
  lookupRank,
  normalizeLemma,
  toLatin,
} from "./freq-match";

describe("normalizeLemma / toLatin", () => {
  it("transliterates Cyrillic to lowercase Serbian Latin", () => {
    expect(normalizeLemma("Здраво")).toBe("zdravo");
    expect(normalizeLemma("ЂАК")).toBe("đak");
    expect(normalizeLemma("чаша")).toBe("čaša");
  });

  it("keeps Serbian-Latin diacritics (no ASCII folding)", () => {
    expect(toLatin("ђ")).toBe("đ");
    expect(toLatin("џ")).toBe("dž");
    expect(toLatin("њ")).toBe("nj");
  });

  it("passes Latin through and preserves word boundaries", () => {
    expect(normalizeLemma("Dobro Jutro")).toBe("dobro jutro");
    expect(normalizeLemma("добро јутро")).toBe("dobro jutro");
  });
});

describe("buildFreqIndex", () => {
  it("ranks by line position (most-frequent first) and parses the count off", () => {
    const index = buildFreqIndex(["da 100", "ne 50", "zdravo 10"]);
    expect(index.get("da")).toBe(1);
    expect(index.get("ne")).toBe(2);
    expect(index.get("zdravo")).toBe(3);
  });

  it("keeps the lowest rank when a normalized form repeats", () => {
    // A Latin and a Cyrillic spelling of the same word normalize together.
    const index = buildFreqIndex(["zdravo 100", "здраво 5"]);
    expect(index.get("zdravo")).toBe(1);
  });

  it("doesn't let a folded duplicate inflate a later form's rank", () => {
    // здраво folds onto the already-seen zdravo and is skipped without
    // consuming a rank slot, so hvala stays rank 2 rather than drifting to 3.
    const index = buildFreqIndex(["zdravo 100", "здраво 50", "hvala 10"]);
    expect(index.get("zdravo")).toBe(1);
    expect(index.get("hvala")).toBe(2);
  });

  it("transliterates Cyrillic list entries before indexing", () => {
    const index = buildFreqIndex(["ђак 7"]);
    expect(index.get("đak")).toBe(1);
  });

  it("skips blank lines without consuming a rank", () => {
    const index = buildFreqIndex(["da 100", "   ", "ne 50"]);
    expect(index.get("ne")).toBe(2);
  });
});

describe("lookupRank", () => {
  const index = buildFreqIndex(["dobro 100", "jutro 50", "hvala 10"]);

  it("returns the exact rank for a known single-word lemma", () => {
    expect(lookupRank(index, "хвала")).toBe(3);
  });

  it("returns null for an unknown lemma", () => {
    expect(lookupRank(index, "непостоји")).toBeNull();
  });

  it("proxies a multi-word phrase to its rarest matched constituent", () => {
    // dobro = rank 1, jutro = rank 2 → rarest (max) = 2.
    expect(lookupRank(index, "добро јутро")).toBe(2);
  });

  it("falls back to the found constituent when others are missing", () => {
    expect(lookupRank(index, "хвала пуно")).toBe(3); // only "hvala" is known
  });

  it("returns null when no constituent of a phrase is found", () => {
    expect(lookupRank(index, "ништа овде")).toBeNull();
  });
});
