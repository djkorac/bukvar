import { describe, expect, it } from "vitest";
import { LEVELS } from "~/data/levels";
import { words } from "~/data/words";
import type { Topic } from "~/lib/content/types";
import {
  buildScriptProbes,
  buildSectionProbes,
  canReadCyrillic,
  PLACEMENT_TOPICS,
  projectedStartLevel,
  reviewScript,
  reviewVocab,
  SCRIPT_PROBE_CYRILLIC,
  SECTION_PROBES,
  SKIP_LABEL,
  sectionPassed,
  VOCAB_OPTION_COUNT,
  wordsKnownFromSections,
} from "./placement";

// Deterministic RNG cycling through fixed values, for repeatable tests.
const seqRng = (values: number[]): (() => number) => {
  let i = 0;
  return () => values[i++ % values.length];
};

const topicWordIds = (topic: Topic): string[] =>
  words.filter((w) => w.topic === topic).map((w) => w.id);

describe("canReadCyrillic", () => {
  it("passes at or above the 80% bar and fails below it", () => {
    expect(canReadCyrillic(8, 8)).toBe(true);
    expect(canReadCyrillic(7, 8)).toBe(true); // 0.875
    expect(canReadCyrillic(6, 8)).toBe(false); // 0.75
  });

  it("treats no probes as not a reader", () => {
    expect(canReadCyrillic(0, 0)).toBe(false);
  });
});

describe("buildScriptProbes", () => {
  it("builds one recognition question per discriminating letter", () => {
    const probes = buildScriptProbes(seqRng([0.1, 0.6, 0.3, 0.8]));
    expect(probes).toHaveLength(SCRIPT_PROBE_CYRILLIC.length);
    for (const q of probes) {
      expect(q.options).toContain(q.answer);
      expect(q.options).toHaveLength(4);
    }
  });
});

describe("PLACEMENT_TOPICS", () => {
  it("is every level except the alphabet, in curriculum order", () => {
    expect(PLACEMENT_TOPICS).toEqual(
      LEVELS.filter((l) => l.topic !== "alphabet").map((l) => l.topic),
    );
    expect(PLACEMENT_TOPICS).not.toContain("alphabet");
  });
});

describe("buildSectionProbes", () => {
  it("samples in-topic words with the gloss among four options", () => {
    const probes = buildSectionProbes(
      "greetings",
      seqRng([0.2, 0.7, 0.4, 0.9, 0.1]),
    );
    expect(probes.length).toBeGreaterThan(0);
    expect(probes.length).toBeLessThanOrEqual(SECTION_PROBES);
    for (const p of probes) {
      expect(p.word.topic).toBe("greetings");
      expect(p.answer).toBe(p.word.english);
      expect(p.options).toContain(p.answer);
      expect(p.options).toHaveLength(VOCAB_OPTION_COUNT);
      expect(new Set(p.options).size).toBe(VOCAB_OPTION_COUNT);
    }
  });

  it("never repeats a word within a section", () => {
    const probes = buildSectionProbes(
      "verbs",
      seqRng([0.3, 0.6, 0.9, 0.2, 0.5]),
    );
    const ids = probes.map((p) => p.word.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("is deterministic for a given RNG sequence", () => {
    const run = () =>
      buildSectionProbes("food", seqRng([0.15, 0.55, 0.35, 0.75, 0.95])).map(
        (p) => ({ id: p.word.id, options: p.options }),
      );
    expect(run()).toEqual(run());
  });
});

describe("sectionPassed", () => {
  it("passes only on a clean sweep of a non-empty section", () => {
    expect(sectionPassed(3, 3)).toBe(true);
    expect(sectionPassed(2, 3)).toBe(false);
    expect(sectionPassed(0, 0)).toBe(false);
  });
});

describe("wordsKnownFromSections", () => {
  it("seeds nothing for no outcomes", () => {
    expect(wordsKnownFromSections([])).toEqual([]);
  });

  it("seeds only the correctly-answered words for an unpassed section", () => {
    const colours = topicWordIds("colours");
    const seeded = wordsKnownFromSections([
      { topic: "colours", correctIds: [colours[0], colours[1]], passed: false },
    ]);
    expect(new Set(seeded)).toEqual(new Set([colours[0], colours[1]]));
  });

  it("seeds the whole section when passed, but never another topic", () => {
    const colours = topicWordIds("colours");
    const seeded = new Set(
      wordsKnownFromSections([
        { topic: "colours", correctIds: [colours[0]], passed: true },
      ]),
    );
    for (const id of colours) expect(seeded.has(id)).toBe(true);
    // The headline bug: a passed section must not sweep in an unrelated topic.
    expect(seeded.has(topicWordIds("animals")[0])).toBe(false);
  });
});

describe("projectedStartLevel", () => {
  it("starts a non-reader at the alphabet level", () => {
    expect(projectedStartLevel(new Set(), false)).toBe(LEVELS[0]);
  });

  it("starts a reader who cleared nothing at the first word level", () => {
    expect(projectedStartLevel(new Set(), true)).toBe(LEVELS[1]);
  });

  it("skips cleared sections to the first unpassed one", () => {
    const passed = new Set<Topic>([LEVELS[1].topic]);
    expect(projectedStartLevel(passed, true)).toBe(LEVELS[2]);
  });

  it("falls back to the last level when every section is cleared", () => {
    const all = new Set<Topic>(PLACEMENT_TOPICS);
    expect(projectedStartLevel(all, true)).toBe(LEVELS[LEVELS.length - 1]);
  });
});

describe("answer review", () => {
  it("scores a script choice and treats a skip as wrong", () => {
    const [q] = buildScriptProbes(seqRng([0.1, 0.6, 0.3, 0.8]));
    expect(reviewScript(q, q.answer)).toEqual({
      id: q.letter.id,
      prompt: q.letter.cyrillic,
      chosen: q.answer,
      correct: q.answer,
      isCorrect: true,
    });
    expect(reviewScript(q, SKIP_LABEL).isCorrect).toBe(false);
  });

  it("carries the word's Latin form and treats a skip as wrong", () => {
    const [p] = buildSectionProbes(
      "greetings",
      seqRng([0.2, 0.7, 0.4, 0.9, 0.1]),
    );
    expect(reviewVocab(p, p.answer)).toEqual({
      id: p.word.id,
      prompt: p.word.cyrillic,
      promptSub: p.word.latin,
      chosen: p.answer,
      correct: p.answer,
      isCorrect: true,
    });
    expect(reviewVocab(p, SKIP_LABEL).isCorrect).toBe(false);
  });
});
