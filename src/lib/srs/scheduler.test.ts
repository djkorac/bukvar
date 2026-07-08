import { State } from "ts-fsrs";
import { describe, expect, it } from "vitest";
import {
  isDue,
  knownSeedCard,
  MAX_REQUEST_RETENTION,
  MIN_REQUEST_RETENTION,
  newCard,
  Rating,
  review,
  schedulerFor,
} from "./scheduler";

describe("scheduler", () => {
  const now = new Date("2026-01-01T00:00:00Z");

  it("creates a new card that is due immediately", () => {
    const card = newCard(now);
    expect(card.reps).toBe(0);
    expect(isDue(card, now)).toBe(true);
  });

  it("increments reps after a review", () => {
    const { card } = review(newCard(now), Rating.Good, now);
    expect(card.reps).toBe(1);
  });

  it("schedules Easy further out than Again", () => {
    const card = newCard(now);
    const again = review(card, Rating.Again, now).card.due.getTime();
    const easy = review(card, Rating.Easy, now).card.due.getTime();
    expect(easy).toBeGreaterThan(again);
  });

  it("records the grade in the review log", () => {
    const { log } = review(newCard(now), Rating.Hard, now);
    expect(log.rating).toBe(Rating.Hard);
  });

  it("seeds a known card in the Review state, due in the future for one confirming review", () => {
    const card = knownSeedCard(now);
    expect(card.reps).toBeGreaterThan(0);
    expect(card.state).toBe(State.Review);
    expect(card.due.getTime()).toBeGreaterThan(now.getTime());
    expect(isDue(card, now)).toBe(false);
  });
});

describe("schedulerFor", () => {
  const now = new Date("2026-01-01T00:00:00Z");

  it("reuses one instance per distinct retention", () => {
    expect(schedulerFor(0.9)).toBe(schedulerFor(0.9));
    expect(schedulerFor(0.9)).not.toBe(schedulerFor(0.8));
  });

  it("clamps out-of-range retention to the valid band (sharing the instance)", () => {
    expect(schedulerFor(2)).toBe(schedulerFor(MAX_REQUEST_RETENTION));
    expect(schedulerFor(0)).toBe(schedulerFor(MIN_REQUEST_RETENTION));
  });

  it("schedules a passing review further out at lower desired retention", () => {
    // Lower retention accepts more forgetting, so intervals lengthen. Start from
    // a matured card (Review state, ~week stability) so the multi-day retention
    // gap clearly dominates the scheduler's fuzz rather than risking a tie.
    const mature = knownSeedCard(now);
    const lax = review(mature, Rating.Good, now, MIN_REQUEST_RETENTION).card;
    const strict = review(mature, Rating.Good, now, MAX_REQUEST_RETENTION).card;
    expect(lax.due.getTime()).toBeGreaterThan(strict.due.getTime());
  });
});
