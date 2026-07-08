import { describe, expect, it } from "vitest";
import { LEVELS } from "~/data/levels";
import { wordsForTopics } from "~/lib/content/corpus";
import {
  buildPracticeQuestion,
  buildPracticeRound,
  PRACTICE_LEVELS,
  PRACTICE_OPTION_COUNT,
  PRACTICE_ROUND_SIZE,
  parsePracticeTopics,
} from "./practice";

// Deterministic RNG cycling through fixed values, for repeatable tests.
const seqRng = (values: number[]): (() => number) => {
  let i = 0;
  return () => values[i++ % values.length];
};

describe("PRACTICE_LEVELS", () => {
  it("is every level except the alphabet, in curriculum order", () => {
    expect(PRACTICE_LEVELS).toEqual(
      LEVELS.filter((l) => l.topic !== "alphabet"),
    );
  });
});

describe("parsePracticeTopics", () => {
  it("returns no topics for a missing or empty value", () => {
    expect(parsePracticeTopics(null)).toEqual([]);
    expect(parsePracticeTopics("")).toEqual([]);
  });

  it("parses a single topic and a comma-separated list", () => {
    expect(parsePracticeTopics("travel")).toEqual(["travel"]);
    expect(parsePracticeTopics("verbs-core,verbs")).toEqual([
      "verbs-core",
      "verbs",
    ]);
  });

  it("drops unknown ids and the alphabet, and trims whitespace", () => {
    expect(parsePracticeTopics("alphabet,bogus, food ")).toEqual(["food"]);
  });
});

describe("buildPracticeRound", () => {
  const rng = () => seqRng([0.3, 0.8, 0.1, 0.6, 0.4, 0.9, 0.2, 0.7]);

  it("asks one question per word for a topic under the round cap", () => {
    const pool = wordsForTopics(["colours"]);
    expect(pool.length).toBeLessThanOrEqual(PRACTICE_ROUND_SIZE);
    const round = buildPracticeRound(["colours"], rng());
    expect(round).toHaveLength(pool.length);
    expect(new Set(round.map((q) => q.word.id)).size).toBe(pool.length);
    for (const q of round) {
      expect(q.word.topic).toBe("colours");
      expect(q.answer).toBe(q.word.english);
      expect(q.options).toContain(q.answer);
      expect(q.options).toHaveLength(PRACTICE_OPTION_COUNT);
      expect(new Set(q.options).size).toBe(PRACTICE_OPTION_COUNT);
    }
  });

  it("caps a large multi-topic pool at the round size, without repeats", () => {
    const round = buildPracticeRound(["verbs-core", "verbs"], rng());
    expect(round).toHaveLength(PRACTICE_ROUND_SIZE);
    expect(new Set(round.map((q) => q.word.id)).size).toBe(PRACTICE_ROUND_SIZE);
    for (const q of round) {
      expect(["verbs-core", "verbs"]).toContain(q.word.topic);
    }
  });

  it("prefers same-topic distractors when the topic can supply them", () => {
    const glosses = new Set(wordsForTopics(["colours"]).map((w) => w.english));
    const round = buildPracticeRound(["colours"], rng());
    for (const q of round) {
      for (const option of q.options) {
        expect(glosses.has(option)).toBe(true);
      }
    }
  });

  it("is empty for no topics", () => {
    expect(buildPracticeRound([], rng())).toEqual([]);
  });

  it("is deterministic for a given RNG sequence", () => {
    const run = () =>
      buildPracticeRound(["food"], rng()).map((q) => ({
        id: q.word.id,
        options: q.options,
      }));
    expect(run()).toEqual(run());
  });
});

describe("buildPracticeQuestion", () => {
  it("tops distractors up from the whole corpus when the topic runs dry", () => {
    // A two-word pool supplies only one distinct distractor; the rest must
    // come from the corpus so the learner still gets a full set of options.
    const [first, second] = wordsForTopics(["colours"]);
    const q = buildPracticeQuestion(first, [first, second], seqRng([0.5, 0.2]));
    expect(q.options).toHaveLength(PRACTICE_OPTION_COUNT);
    expect(new Set(q.options).size).toBe(PRACTICE_OPTION_COUNT);
    expect(q.options).toContain(first.english);
    expect(q.options).toContain(second.english);
  });
});
