import { describe, expect, it } from "vitest";
import { State } from "~/lib/srs/scheduler";
import { dayKey } from "./day";
import {
  accuracyByDay,
  DURATION_CAP_MS,
  heatmapMonthLabels,
  heatmapSpan,
  heatmapWeeks,
  MAX_HEATMAP_WEEKS,
  MIN_HEATMAP_WEEKS,
  type ReviewEvent,
  SESSION_GAP_MS,
  sessionize,
  summarize,
} from "./history";

// No `Z` → parsed in local time, matching the local-day logic history uses.
const at = (iso: string): number => new Date(iso).getTime();
const ev = (
  iso: string,
  rating: number,
  durationMs?: number,
  state: number = State.Review,
): ReviewEvent => ({
  reviewedAt: at(iso),
  rating,
  state,
  durationMs,
});

describe("sessionize", () => {
  it("returns no blocks for an empty log", () => {
    expect(sessionize([])).toEqual([]);
  });

  it("keeps grades within the gap in one block", () => {
    const blocks = sessionize([
      ev("2026-06-05T10:00:00", 3),
      ev("2026-06-05T10:01:00", 4),
      ev("2026-06-05T10:02:00", 1),
    ]);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].count).toBe(3);
    expect(blocks[0].correct).toBe(2); // Good + Easy, not Again
    expect(blocks[0].byRating).toEqual([1, 0, 1, 1]); // Again, Hard, Good, Easy
  });

  it("splits on an idle gap longer than the threshold", () => {
    const blocks = sessionize([
      ev("2026-06-05T10:00:00", 3),
      ev("2026-06-05T10:31:00", 3), // 31 min later
    ]);
    expect(blocks).toHaveLength(2);
  });

  it("treats a gap of exactly the threshold as the same block", () => {
    const start = at("2026-06-05T10:00:00");
    const blocks = sessionize([
      { reviewedAt: start, rating: 3, state: State.Review },
      { reviewedAt: start + SESSION_GAP_MS, rating: 3, state: State.Review },
    ]);
    expect(blocks).toHaveLength(1);
  });

  it("sums per-card time, capping a walked-away card", () => {
    const blocks = sessionize([
      ev("2026-06-05T10:00:00", 3, DURATION_CAP_MS + 30_000), // capped
      ev("2026-06-05T10:01:00", 3, 5_000),
    ]);
    expect(blocks[0].durationMs).toBe(DURATION_CAP_MS + 5_000);
  });

  it("falls back to the start→end span when no card was timed", () => {
    const blocks = sessionize([
      ev("2026-06-05T10:00:00", 3),
      ev("2026-06-05T10:02:00", 3),
    ]);
    expect(blocks[0].durationMs).toBe(2 * 60 * 1000);
  });

  it("orders grades by time before bucketing", () => {
    const blocks = sessionize([
      ev("2026-06-05T10:02:00", 3),
      ev("2026-06-05T10:00:00", 3),
      ev("2026-06-05T10:01:00", 3),
    ]);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].startedAt).toBe(at("2026-06-05T10:00:00"));
    expect(blocks[0].endedAt).toBe(at("2026-06-05T10:02:00"));
  });
});

describe("summarize", () => {
  const now = new Date("2026-06-05T12:00:00");

  it("is all-zero for an empty log", () => {
    expect(summarize([], now)).toEqual({
      totalReviews: 0,
      daysStudied: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalDurationMs: 0,
      firstReviewAt: null,
      matureReviews: 0,
      matureCorrect: 0,
    });
  });

  it("counts reviews, distinct days, and the earliest review", () => {
    const s = summarize(
      [
        ev("2026-06-03T09:00:00", 3),
        ev("2026-06-03T09:05:00", 4),
        ev("2026-06-05T08:00:00", 1),
      ],
      now,
    );
    expect(s.totalReviews).toBe(3);
    expect(s.daysStudied).toBe(2);
    expect(s.firstReviewAt).toBe(at("2026-06-03T09:00:00"));
  });

  it("derives current and longest streak from the active days", () => {
    const s = summarize(
      [
        ev("2026-06-01T09:00:00", 3),
        ev("2026-06-02T09:00:00", 3),
        ev("2026-06-04T09:00:00", 3),
        ev("2026-06-05T09:00:00", 3),
      ],
      now,
    );
    expect(s.currentStreak).toBe(2); // 06-04, 06-05
    expect(s.longestStreak).toBe(2);
  });

  it("sums capped per-card time", () => {
    const s = summarize(
      [
        ev("2026-06-05T09:00:00", 3, DURATION_CAP_MS + 10_000), // capped
        ev("2026-06-05T09:01:00", 3, 4_000),
      ],
      now,
    );
    expect(s.totalDurationMs).toBe(DURATION_CAP_MS + 4_000);
  });

  it("counts true retention over graduated-card reviews only", () => {
    const s = summarize(
      [
        ev("2026-06-03T09:00:00", 3, undefined, State.New), // first sight
        ev("2026-06-03T09:01:00", 1, undefined, State.Learning), // learning slip
        ev("2026-06-04T09:00:00", 3, undefined, State.Review), // recalled
        ev("2026-06-04T09:01:00", 2, undefined, State.Review), // Hard = retained
        ev("2026-06-04T09:02:00", 1, undefined, State.Review), // lapse
        ev("2026-06-04T09:03:00", 4, undefined, State.Relearning), // relearning step
      ],
      now,
    );
    expect(s.totalReviews).toBe(6);
    expect(s.matureReviews).toBe(3);
    expect(s.matureCorrect).toBe(2); // Good + Hard retained; only the Again lapse misses
  });

  it("reports zero mature counts before anything graduates", () => {
    const s = summarize(
      [
        ev("2026-06-05T09:00:00", 3, undefined, State.New),
        ev("2026-06-05T09:01:00", 4, undefined, State.Learning),
      ],
      now,
    );
    expect(s.matureReviews).toBe(0);
    expect(s.matureCorrect).toBe(0);
  });
});

describe("accuracyByDay", () => {
  const now = new Date("2026-06-05T12:00:00");

  it("returns a contiguous zero-filled window ending today", () => {
    const days = accuracyByDay([], now, 7);
    expect(days.map((d) => d.key)).toEqual([
      "2026-05-30",
      "2026-05-31",
      "2026-06-01",
      "2026-06-02",
      "2026-06-03",
      "2026-06-04",
      "2026-06-05",
    ]);
    expect(days.every((d) => d.count === 0 && d.correct === 0)).toBe(true);
    // Offsets count back from today, for the view's today-highlight.
    expect(days[6].offset).toBe(0);
    expect(days[0].offset).toBe(6);
  });

  it("places recall counts on their local days, keeping idle days at zero", () => {
    const days = accuracyByDay(
      [
        ev("2026-06-05T09:00:00", 3),
        ev("2026-06-03T09:00:00", 1),
        ev("2026-06-03T09:05:00", 4),
      ],
      now,
      7,
    );
    const byKey = new Map(days.map((d) => [d.key, d]));
    expect(byKey.get("2026-06-03")).toMatchObject({ count: 2, correct: 1 });
    expect(byKey.get("2026-06-04")).toMatchObject({ count: 0, correct: 0 });
    expect(byKey.get("2026-06-05")).toMatchObject({ count: 1, correct: 1 });
  });

  it("drops events older than the window", () => {
    const days = accuracyByDay([ev("2026-05-20T09:00:00", 3)], now, 7);
    expect(days.every((d) => d.count === 0)).toBe(true);
  });
});

describe("heatmapWeeks", () => {
  const now = new Date("2026-06-05T12:00:00");

  it("builds week columns of seven contiguous days", () => {
    const weeks = heatmapWeeks([], now, 2);
    expect(weeks).toHaveLength(2);
    for (const week of weeks) expect(week).toHaveLength(7);
    // Each column starts on a Sunday.
    for (const week of weeks) expect(week[0].date.getDay()).toBe(0);
    // The grid is contiguous: every cell is one day after the previous.
    const flat = weeks.flat();
    for (let i = 1; i < flat.length; i += 1) {
      expect(flat[i].date.getTime() - flat[i - 1].date.getTime()).toBe(
        86_400_000,
      );
    }
  });

  it("places each day's review count on its cell", () => {
    const weeks = heatmapWeeks(
      [ev("2026-06-05T09:00:00", 3), ev("2026-06-05T10:00:00", 3)],
      now,
      2,
    );
    const today = weeks.flat().find((c) => c.key === dayKey(now));
    expect(today?.count).toBe(2);
    expect(today?.inRange).toBe(true);
  });

  it("marks future days of the current week out of range", () => {
    const weeks = heatmapWeeks([], now, 2);
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    for (const cell of weeks.flat()) {
      expect(cell.inRange).toBe(cell.date.getTime() <= startOfToday.getTime());
    }
  });

  it("defaults to the adaptive span, growing the grid to reach old reviews", () => {
    // A review 30 weeks back widens the default grid to 31 columns.
    const old = ev30WeeksBack;
    expect(heatmapWeeks([old], now)).toHaveLength(31);
    // A brand-new log keeps the dense minimum.
    expect(heatmapWeeks([ev("2026-06-05T09:00:00", 3)], now)).toHaveLength(
      MIN_HEATMAP_WEEKS,
    );
  });
});

// A review whose Sunday is exactly 30 weeks before now's; same local weekday
// keeps it DST-robust. now is Fri 2026-06-05, so this lands on a Friday too.
const WEEK = 7 * 24 * 60 * 60 * 1000;
const ev30WeeksBack: ReviewEvent = {
  reviewedAt: at("2026-06-05T09:00:00") - 30 * WEEK,
  rating: 3,
  state: State.Review,
};

describe("heatmapSpan", () => {
  const now = new Date("2026-06-05T12:00:00");

  it("returns the dense minimum for an empty log", () => {
    expect(heatmapSpan([], now)).toBe(MIN_HEATMAP_WEEKS);
  });

  it("floors a brand-new log at the minimum", () => {
    expect(heatmapSpan([ev("2026-06-05T09:00:00", 3)], now)).toBe(
      MIN_HEATMAP_WEEKS,
    );
  });

  it("grows to reach the earliest review, inclusive of both weeks", () => {
    expect(heatmapSpan([ev30WeeksBack], now)).toBe(31);
  });

  it("caps the span at one year", () => {
    const ancient: ReviewEvent = {
      reviewedAt: at("2026-06-05T09:00:00") - 80 * WEEK,
      rating: 3,
      state: State.Review,
    };
    expect(heatmapSpan([ancient], now)).toBe(MAX_HEATMAP_WEEKS);
  });
});

describe("heatmapMonthLabels", () => {
  const now = new Date("2026-06-05T12:00:00");

  it("labels the first column and each month boundary, else null", () => {
    // 13 weeks ending Sun 2026-05-31: columns open Mar 8 … May 31.
    const labels = heatmapMonthLabels(heatmapWeeks([], now, 13));
    // 0-based months: 2=Mar (first column), 3=Apr, 4=May.
    expect(labels).toEqual([
      2,
      null,
      null,
      null,
      3,
      null,
      null,
      null,
      4,
      null,
      null,
      null,
      null,
    ]);
  });
});
