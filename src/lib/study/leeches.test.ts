import { describe, expect, it } from "vitest";
import {
  findLeeches,
  LEECH_LAPSES,
  type LeechSnapshot,
  MATURE_STABILITY_DAYS,
} from "./leeches";

describe("findLeeches", () => {
  const snap = (
    itemId: string,
    lapses: number,
    opts: { stability?: number; kind?: "letter" | "word" } = {},
  ): LeechSnapshot => ({
    itemId,
    kind: opts.kind ?? "word",
    lapses,
    // Default to a still-learning stability so lapses alone decide the case.
    stability: opts.stability ?? 1,
  });

  it("returns nothing for an empty deck", () => {
    expect(findLeeches([])).toEqual([]);
  });

  it("flags a card at the threshold but not one just below it", () => {
    const result = findLeeches([
      snap("word-a", LEECH_LAPSES - 1),
      snap("word-b", LEECH_LAPSES),
    ]);
    expect(result.map((l) => l.itemId)).toEqual(["word-b"]);
  });

  it("drops a matured card even when its lifetime lapses are high", () => {
    // Fought hard early, but now recalled after weeks, no longer fighting.
    const result = findLeeches([
      snap("word-mastered", 20, { stability: MATURE_STABILITY_DAYS }),
      snap("word-stuck", 9, { stability: 2 }),
    ]);
    expect(result.map((l) => l.itemId)).toEqual(["word-stuck"]);
  });

  it("orders worst-first, breaking ties by id for a stable order", () => {
    const result = findLeeches([
      snap("word-m", 9),
      snap("word-z", 12),
      snap("word-a", 12),
    ]);
    expect(result.map((l) => l.itemId)).toEqual(["word-a", "word-z", "word-m"]);
  });

  it("projects to the bare flag shape and honors overridden thresholds", () => {
    const result = findLeeches(
      [snap("letter-be", 4, { kind: "letter", stability: 5 })],
      3, // lower threshold
      10, // stricter maturity line
    );
    expect(result).toEqual([
      { itemId: "letter-be", kind: "letter", lapses: 4 },
    ]);
  });
});
