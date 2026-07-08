import { State } from "ts-fsrs";
import { describe, expect, it } from "vitest";
import type { CardRecord } from "~/lib/db/db";
import { newCard } from "~/lib/srs/scheduler";
import { promoteToKnown, SEED_DISPERSAL_DAYS } from "~/lib/study/levels";

const now = new Date("2026-06-05T09:00:00Z");
const DAY_MS = 86_400_000;

/** Whole-day offset of a promoted card's due date from `now`. */
const dueOffsetDays = (r: CardRecord): number =>
  Math.round((r.fsrs.due.getTime() - now.getTime()) / DAY_MS);

const record = (itemId: string, card = newCard(now)): CardRecord => ({
  itemId,
  kind: "word",
  fsrs: card,
  addedAt: now.getTime(),
});

describe("promoteToKnown", () => {
  it("promotes only targeted cards that are still new", () => {
    const fresh = record("word-a");
    const untargeted = record("word-b");
    const studied = record("word-c");
    studied.fsrs = { ...studied.fsrs, reps: 3, state: State.Review };

    const updated = promoteToKnown(
      [fresh, untargeted, studied],
      ["word-a", "word-c"],
      now,
    );

    // word-b isn't targeted; word-c has real history → left untouched.
    expect(updated.map((r) => r.itemId)).toEqual(["word-a"]);
  });

  it("graduates promoted cards to Review, reps > 0, due in the future", () => {
    const updated = promoteToKnown([record("word-a")], ["word-a"], now);
    const promoted = updated[0];
    expect(promoted.fsrs.reps).toBeGreaterThan(0);
    expect(promoted.fsrs.state).toBe(State.Review);
    expect(promoted.fsrs.due.getTime()).toBeGreaterThan(now.getTime());
  });

  it("returns nothing when no targeted card is new", () => {
    const studied = record("word-c");
    studied.fsrs = { ...studied.fsrs, reps: 1, state: State.Review };
    expect(promoteToKnown([studied], ["word-c"], now)).toEqual([]);
  });

  it("disperses a batch across distinct, ascending days instead of clumping", () => {
    const ids = ["w0", "w1", "w2", "w3", "w4"];
    const updated = promoteToKnown(
      ids.map((id) => record(id)),
      ids,
      now,
    );
    // One per day, tomorrow onward, not all stacked on a single FSRS interval.
    expect(updated.map(dueOffsetDays)).toEqual([1, 2, 3, 4, 5]);
  });

  it("keeps fsrs scheduled_days in sync with the dispersed due date", () => {
    const ids = ["w0", "w1", "w2"];
    const updated = promoteToKnown(
      ids.map((id) => record(id)),
      ids,
      now,
    );
    for (const r of updated) {
      expect(r.fsrs.due.getTime()).toBeGreaterThan(now.getTime());
      expect(r.fsrs.scheduled_days).toBe(dueOffsetDays(r));
    }
  });

  it("wraps round-robin once the window is full, staying within it", () => {
    const ids = Array.from(
      { length: SEED_DISPERSAL_DAYS + 2 },
      (_, i) => `w${i}`,
    );
    const updated = promoteToKnown(
      ids.map((id) => record(id)),
      ids,
      now,
    );
    const offsets = updated.map(dueOffsetDays);
    // Days 1..N, then the overflow wraps back to days 1 and 2.
    expect(Math.min(...offsets)).toBe(1);
    expect(Math.max(...offsets)).toBe(SEED_DISPERSAL_DAYS);
    expect(offsets[SEED_DISPERSAL_DAYS]).toBe(1);
    expect(offsets[SEED_DISPERSAL_DAYS + 1]).toBe(2);
  });
});
