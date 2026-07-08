import { State } from "ts-fsrs";
import { describe, expect, it } from "vitest";
import { dayKey } from "./day";
import { bucketForecast, type DueSnapshot, intradayOutlook } from "./forecast";

describe("bucketForecast", () => {
  // Local noon, so a same-day "later today" probe stays the same calendar day
  // and the day math never straddles midnight. No `Z` → parsed in local time,
  // matching the local-day logic the forecast uses.
  const now = new Date("2026-06-05T12:00:00");

  /** A due time `offsetDays` from today at `hour` (local). */
  const dueAt = (offsetDays: number, hour = 9): number => {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + offsetDays);
    d.setHours(hour);
    return d.getTime();
  };

  const snap = (
    due: number,
    opts: { reps?: number; state?: State } = {},
  ): DueSnapshot => ({
    due,
    reps: opts.reps ?? 1,
    state: opts.state ?? State.Review,
  });

  it("returns a full horizon of empty buckets for an empty deck", () => {
    const f = bucketForecast([], now);
    expect(f.days).toHaveLength(14);
    expect(f.days.every((d) => d.total === 0)).toBe(true);
    expect(f).toMatchObject({ later: 0, total: 0, max: 0 });
  });

  it("labels the first bucket as today", () => {
    const f = bucketForecast([], now);
    expect(f.days[0].offset).toBe(0);
    expect(f.days[0].key).toBe(dayKey(now));
  });

  it("excludes never-reviewed (new) cards", () => {
    const f = bucketForecast(
      [snap(dueAt(0), { reps: 0, state: State.New })],
      now,
    );
    expect(f.total).toBe(0);
    expect(f.days[0].total).toBe(0);
  });

  it("folds overdue cards into today", () => {
    const f = bucketForecast([snap(dueAt(-3))], now);
    expect(f.days[0].total).toBe(1);
    expect(f.total).toBe(1);
  });

  it("keeps a card due later today in today's bucket", () => {
    const f = bucketForecast([snap(dueAt(0, 15))], now); // 3pm > noon
    expect(f.days[0].total).toBe(1);
  });

  it("places a card due tomorrow in offset 1", () => {
    const f = bucketForecast([snap(dueAt(1))], now);
    expect(f.days[1].total).toBe(1);
    expect(f.days[0].total).toBe(0);
  });

  it("counts cards past the horizon in `later`", () => {
    const f = bucketForecast([snap(dueAt(20))], now);
    expect(f.later).toBe(1);
    expect(f.total).toBe(1);
    expect(f.days.every((d) => d.total === 0)).toBe(true);
  });

  it("treats the horizon edge correctly (last day in, +horizon out)", () => {
    const f = bucketForecast([snap(dueAt(13)), snap(dueAt(14))], now);
    expect(f.days[13].total).toBe(1);
    expect(f.later).toBe(1);
  });

  it("splits each day into known vs learning", () => {
    const f = bucketForecast(
      [
        snap(dueAt(2), { state: State.Review }), // known
        snap(dueAt(2), { state: State.Learning }), // learning
        snap(dueAt(2), { state: State.Relearning }), // learning
      ],
      now,
    );
    expect(f.days[2]).toMatchObject({ total: 3, known: 1, learning: 2 });
  });

  it("computes total and the peak day for bar scaling", () => {
    const f = bucketForecast(
      [
        snap(dueAt(1)),
        snap(dueAt(1)),
        snap(dueAt(1)), // 3 on day 1
        snap(dueAt(3)), // 1 on day 3
        snap(dueAt(30)), // later
      ],
      now,
    );
    expect(f.total).toBe(5);
    expect(f.max).toBe(3);
    expect(f.later).toBe(1);
    expect(f.days[1].total).toBe(3);
    expect(f.days[3].total).toBe(1);
  });

  it("respects a custom horizon", () => {
    const f = bucketForecast([snap(dueAt(5))], now, 3);
    expect(f.days).toHaveLength(3);
    expect(f.later).toBe(1); // day 5 is beyond a 3-day horizon
  });

  it("is DST-safe: a card N days out lands in bucket N", () => {
    // Spring-forward weekend in much of the EU/US is in March; check the day
    // delta still rounds to an integer offset across it.
    const march = new Date("2026-03-06T12:00:00");
    const due = new Date(march);
    due.setHours(0, 0, 0, 0);
    due.setDate(due.getDate() + 10);
    due.setHours(9);
    const f = bucketForecast([snap(due.getTime())], march);
    expect(f.days[10].total).toBe(1);
    expect(f.days.reduce((n, d) => n + d.total, 0)).toBe(1);
  });
});

describe("intradayOutlook", () => {
  // Local noon, so "later today" has hours of runway before local midnight.
  const now = new Date("2026-06-05T12:00:00");
  const MIN = 60_000;
  const at = (ms: number): number => now.getTime() + ms;

  const snap = (
    due: number,
    opts: { reps?: number; state?: State } = {},
  ): DueSnapshot => ({
    due,
    reps: opts.reps ?? 1,
    state: opts.state ?? State.Review,
  });

  it("returns nothing for an empty deck", () => {
    expect(intradayOutlook([], now)).toEqual({
      dueLaterToday: 0,
      nextDueAt: null,
    });
  });

  it("counts reviews due later today and reports the soonest", () => {
    const soon = at(10 * MIN);
    const later = at(90 * MIN);
    const o = intradayOutlook([snap(later), snap(soon)], now);
    expect(o.dueLaterToday).toBe(2);
    expect(o.nextDueAt).toBe(soon);
  });

  it("excludes cards due right now or overdue (those are in the live queue)", () => {
    const o = intradayOutlook([snap(now.getTime()), snap(at(-5 * MIN))], now);
    expect(o).toEqual({ dueLaterToday: 0, nextDueAt: null });
  });

  it("excludes never-reviewed new cards (paced by newPerDay, not a due date)", () => {
    const o = intradayOutlook(
      [snap(at(10 * MIN), { reps: 0, state: State.New })],
      now,
    );
    expect(o).toEqual({ dueLaterToday: 0, nextDueAt: null });
  });

  it("excludes cards that only fall due tomorrow", () => {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const o = intradayOutlook([snap(tomorrow.getTime())], now);
    expect(o).toEqual({ dueLaterToday: 0, nextDueAt: null });
  });

  it("counts a card due just before local midnight tonight", () => {
    const lateTonight = new Date(now);
    lateTonight.setHours(23, 59, 0, 0);
    const o = intradayOutlook([snap(lateTonight.getTime())], now);
    expect(o.dueLaterToday).toBe(1);
    expect(o.nextDueAt).toBe(lateTonight.getTime());
  });
});
