import { describe, expect, it } from "vitest";
import { MAX_NUMBER, numberToCyrillic } from "~/lib/content/number-name";
import {
  buildNumberQuestion,
  buildNumberRound,
  NUMBER_OPTION_COUNT,
  NUMBER_RANGES,
  NUMBER_ROUND_SIZE,
} from "./number-drill";

// Seeded PRNG (mulberry32): a long, well-distributed, fully deterministic
// stream. Unlike a short cyclic sequence, it can supply the many distinct
// draws a round needs while still being repeatable from the same seed.
const prng = (seed: number): (() => number) => {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

describe("NUMBER_RANGES", () => {
  it("are ascending ceilings topping out at MAX_NUMBER", () => {
    const maxes = NUMBER_RANGES.map((r) => r.max);
    expect(maxes).toEqual([...maxes].sort((a, b) => a - b));
    expect(maxes.at(-1)).toBe(MAX_NUMBER);
  });
});

describe("buildNumberQuestion", () => {
  it("names the value and offers it among distinct plausible options", () => {
    const q = buildNumberQuestion(73, 100, prng(1));
    expect(q.value).toBe(73);
    expect(q.answer).toBe("седамдесет три");
    expect(q.latin).toBe("sedamdeset tri");
    expect(q.options).toContain(q.answer);
    expect(q.options).toHaveLength(NUMBER_OPTION_COUNT);
    expect(new Set(q.options).size).toBe(NUMBER_OPTION_COUNT);
  });

  it("offers only real Serbian number names as options", () => {
    // Every option must be the name of *some* number in range. Distractors
    // are generated, never hand-typos. Build the inverse map once.
    const nameToValue = new Map<string, number>();
    for (let n = 0; n <= 1000; n++) nameToValue.set(numberToCyrillic(n), n);
    const q = buildNumberQuestion(365, 1000, prng(2));
    for (const option of q.options) {
      expect(nameToValue.has(option)).toBe(true);
    }
  });

  it("is deterministic for a given RNG sequence", () => {
    const run = () => buildNumberQuestion(42, 100, prng(3)).options;
    expect(run()).toEqual(run());
  });
});

describe("buildNumberRound", () => {
  it("asks NUMBER_ROUND_SIZE distinct, in-range questions", () => {
    const round = buildNumberRound(MAX_NUMBER, prng(4));
    expect(round).toHaveLength(NUMBER_ROUND_SIZE);
    expect(new Set(round.map((q) => q.value)).size).toBe(NUMBER_ROUND_SIZE);
    for (const q of round) {
      expect(q.value).toBeGreaterThanOrEqual(0);
      expect(q.value).toBeLessThanOrEqual(MAX_NUMBER);
      expect(q.answer).toBe(numberToCyrillic(q.value));
      expect(q.options).toContain(q.answer);
      expect(q.options).toHaveLength(NUMBER_OPTION_COUNT);
    }
  });

  it("keeps every value within the chosen ceiling", () => {
    const round = buildNumberRound(100, prng(5));
    for (const q of round) expect(q.value).toBeLessThanOrEqual(100);
  });

  it("never spins on a range smaller than the round size", () => {
    // "Up to 9" has only ten distinct values; the bounded loop must still
    // return promptly with as many distinct questions as it could find.
    const round = buildNumberRound(9, prng(6));
    expect(round.length).toBeGreaterThan(0);
    expect(round.length).toBeLessThanOrEqual(NUMBER_ROUND_SIZE);
    expect(new Set(round.map((q) => q.value)).size).toBe(round.length);
  });

  it("is deterministic for a given RNG sequence", () => {
    const run = () =>
      buildNumberRound(1000, prng(7)).map((q) => ({
        value: q.value,
        options: q.options,
      }));
    expect(run()).toEqual(run());
  });
});
