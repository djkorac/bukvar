import { describe, expect, it } from "vitest";
import { buildOptions, shuffle } from "./drill";

// Deterministic RNG cycling through fixed values, for repeatable tests.
const seqRng = (values: number[]): (() => number) => {
  let i = 0;
  return () => values[i++ % values.length];
};

describe("shuffle", () => {
  it("preserves the multiset of elements", () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input, seqRng([0.1, 0.9, 0.4, 0.7, 0.2]));
    expect([...out].sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("does not mutate the input", () => {
    const input = [1, 2, 3];
    shuffle(input, seqRng([0.5]));
    expect(input).toEqual([1, 2, 3]);
  });
});

describe("buildOptions", () => {
  const item = (id: string, value: string) => ({ id, value });
  const toValue = (i: { value: string }) => i.value;
  const rng = () => seqRng([0.3, 0.8, 0.1, 0.6, 0.4]);

  it("includes the answer among distinct options", () => {
    const pool = [
      item("a", "A"),
      item("b", "B"),
      item("c", "C"),
      item("d", "D"),
    ];
    const options = buildOptions("A", [pool], toValue, 4, rng());
    expect(options).toContain("A");
    expect(options).toHaveLength(4);
    expect(new Set(options).size).toBe(4);
  });

  it("dedupes distractors by value, including against the answer", () => {
    // Distinct items sharing a value (two words with the same gloss) must not
    // produce duplicate options, and the answer's value must not recur.
    const pool = [
      item("a1", "A"),
      item("a2", "A"),
      item("b1", "B"),
      item("b2", "B"),
      item("c", "C"),
    ];
    const options = buildOptions("A", [pool], toValue, 4, rng());
    expect([...options].sort()).toEqual(["A", "B", "C"]);
  });

  it("caps options at the distinct values available", () => {
    const pool = [item("a", "A"), item("b", "B")];
    const options = buildOptions("A", [pool], toValue, 10, rng());
    expect([...options].sort()).toEqual(["A", "B"]);
  });

  it("exhausts earlier pools before drawing from later ones", () => {
    const preferred = [item("b", "B"), item("c", "C")];
    const fallback = [item("d", "D"), item("e", "E"), item("f", "F")];
    const options = buildOptions("A", [preferred, fallback], toValue, 4, rng());
    // Both preferred values must be in; exactly one fallback value tops up.
    expect(options).toContain("B");
    expect(options).toContain("C");
    expect(options.filter((o) => ["D", "E", "F"].includes(o))).toHaveLength(1);
  });

  it("is deterministic for a given RNG sequence", () => {
    const pool = [
      item("a", "A"),
      item("b", "B"),
      item("c", "C"),
      item("d", "D"),
      item("e", "E"),
    ];
    const run = () => buildOptions("A", [pool], toValue, 4, rng());
    expect(run()).toEqual(run());
  });
});
