import { State } from "ts-fsrs";
import { describe, expect, it } from "vitest";
import type { CardRecord } from "~/lib/db/db";
import { newCard } from "~/lib/srs/scheduler";
import { promoteToKnown, SEED_CONFIRMATIONS_PER_DAY } from "~/lib/study/levels";

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

  it("schedules a small batch entirely on tomorrow, under the daily cap", () => {
    const ids = ["w0", "w1", "w2", "w3", "w4"];
    const updated = promoteToKnown(
      ids.map((id) => record(id)),
      ids,
      now,
    );
    // All fit under the cap: everything confirms tomorrow, today stays clear.
    expect(updated.map(dueOffsetDays)).toEqual([1, 1, 1, 1, 1]);
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

  it("caps each day at the rate and rolls the overflow to later days", () => {
    const ids = Array.from(
      { length: SEED_CONFIRMATIONS_PER_DAY * 2 + 1 },
      (_, i) => `w${i}`,
    );
    const updated = promoteToKnown(
      ids.map((id) => record(id)),
      ids,
      now,
    );
    const offsets = updated.map(dueOffsetDays);
    // Exactly the cap on day 1 and day 2, then the remainder on day 3. The
    // window grows with the batch; no day ever exceeds the rate.
    expect(offsets.filter((o) => o === 1)).toHaveLength(
      SEED_CONFIRMATIONS_PER_DAY,
    );
    expect(offsets.filter((o) => o === 2)).toHaveLength(
      SEED_CONFIRMATIONS_PER_DAY,
    );
    expect(offsets.filter((o) => o === 3)).toHaveLength(1);
  });
});
