import { describe, expect, it } from "vitest";
import { paceNewCards, planQueue } from "./queue-plan";

describe("planQueue", () => {
  it("puts all due reviews before new cards", () => {
    expect(planQueue(["r1", "r2"], ["n1", "n2"], 5)).toEqual([
      "r1",
      "r2",
      "n1",
      "n2",
    ]);
  });

  it("caps new cards at the remaining allowance", () => {
    expect(planQueue([], ["n1", "n2", "n3", "n4"], 2)).toEqual(["n1", "n2"]);
  });

  it("never caps reviews, even when the new allowance is zero", () => {
    expect(planQueue(["r1", "r2", "r3"], ["n1"], 0)).toEqual([
      "r1",
      "r2",
      "r3",
    ]);
  });

  it("treats a negative allowance as zero new cards", () => {
    expect(planQueue(["r1"], ["n1", "n2"], -3)).toEqual(["r1"]);
  });
});

describe("paceNewCards", () => {
  it("caps a lesson at the batch size when the day has room to spare", () => {
    // 50 new available, none introduced, daily cap 10, batch 3.
    expect(paceNewCards(50, 0, 10, 3)).toEqual({
      allowance: 3, // the batch limits this lesson
      lockedNew: 40, // 50 − 10 daily cap, deferred to future days
      moreNewToday: true, // day not yet exhausted, more batches remain today
    });
  });

  it("lets the daily cap bind when it is below the batch size", () => {
    // 8 of today's 10 already introduced → only 2 left under the cap; batch is 5.
    expect(paceNewCards(50, 8, 10, 5)).toEqual({
      allowance: 2, // min(batch 5, daily remaining 2)
      lockedNew: 48, // 50 − 2 reachable today
      moreNewToday: false, // the day, not the batch, is the limit now
    });
  });

  it("falls back to the daily cap when the batch is non-binding", () => {
    // batch ≥ daily remaining → batching has no effect; the whole day's
    // allowance fits in one lesson, so there is no second lesson today.
    expect(paceNewCards(50, 0, 10, 100)).toEqual({
      allowance: 10,
      lockedNew: 40,
      moreNewToday: false,
    });
  });

  it("reports nothing more today once the daily cap is reached", () => {
    expect(paceNewCards(50, 10, 10, 5)).toEqual({
      allowance: 0,
      lockedNew: 50, // none reachable today; all remaining new are deferred
      moreNewToday: false,
    });
  });

  it("holds nothing back when fewer new cards remain than the cap", () => {
    // 2 new left, batch 5, daily cap 10: allowance is the cap (5), but the
    // queue introduces just the 2 available and nothing is deferred.
    expect(paceNewCards(2, 0, 10, 5)).toEqual({
      allowance: 5,
      lockedNew: 0,
      moreNewToday: false,
    });
  });
});
