import { db } from "~/lib/db/db";
import { isRetained, State } from "~/lib/srs/scheduler";
import { dayKey, startOfDay, startOfWeek, WEEK_MS } from "~/lib/study/day";
import { computeStreak, longestStreak } from "~/lib/study/progress";

/**
 * Read-only study history derived from the append-only review log. Like
 * `forecast.ts`/`progress.ts`, the shaping is pure functions over plain
 * snapshots ({@link sessionize}, {@link summarize}, {@link heatmapWeeks},
 * {@link accuracyByDay}); {@link getHistory} is the thin IndexedDB wrapper that
 * composes them for the history island.
 *
 * "Sessions"/"blocks" are *not* stored. They're recovered by gap-bucketing the
 * timestamps, the same way Anki reconstructs study sessions for its time stats.
 * Persisting them would buy nothing and add mid-session edge cases.
 */

/**
 * A grade is a "clean recall" if it was Good or Easy (FSRS rating ≥ 3): the
 * accuracy metric behind the session blocks and the daily trend. Deliberately
 * *stricter* than FSRS retention, which counts `Hard` as recalled too (see
 * `isRetained` in the SRS core); "true retention" below uses that instead.
 */
const isRecalled = (rating: number): boolean => rating >= 3;

/** Idle gap that ends one block and starts the next. */
export const SESSION_GAP_MS = 30 * 60 * 1000;
/** Per-card time-on-card ceiling, so a walked-away card can't inflate totals. */
export const DURATION_CAP_MS = 60 * 1000;
/**
 * Span bounds of the contribution heatmap, in weeks. The grid starts at the
 * minimum so a new learner's history reads as dense rather than mostly-empty,
 * and grows with the log up to a full year as reviews accumulate
 * ({@link heatmapSpan}).
 */
export const MIN_HEATMAP_WEEKS = 13;
export const MAX_HEATMAP_WEEKS = 52;
/**
 * Fixed span of the accuracy trend, in calendar days ending today. Matches the
 * forecast's `HORIZON_DAYS` so the two charts read as a pair: load for the next
 * fortnight, accuracy over the last one.
 */
export const TREND_DAYS = 14;

const cap = (ms: number | undefined): number =>
  Math.min(ms ?? 0, DURATION_CAP_MS);

/** Storage-agnostic view of one logged grade: all the history math needs. */
export interface ReviewEvent {
  reviewedAt: number;
  rating: number;
  /** ts-fsrs `State` the card held going into the review. */
  state: number;
  durationMs?: number;
}

/** One reconstructed study session: a run of grades with no long idle gap. */
export interface Block {
  startedAt: number;
  endedAt: number;
  count: number;
  /** Grades that were Good or Easy. */
  correct: number;
  /** Active time on cards (capped per card), falling back to span if untimed. */
  durationMs: number;
  /** Counts indexed by rating−1: [Again, Hard, Good, Easy]. */
  byRating: number[];
}

export interface DayStat {
  /** Local-day key (`YYYY-MM-DD`). */
  key: string;
  /** Start-of-day Date, for labels. */
  date: Date;
  /** Days back from today: 0 = today, 1 = yesterday, … */
  offset: number;
  count: number;
  correct: number;
}

export interface HeatCell {
  key: string;
  date: Date;
  count: number;
  /** False for future days padding the current week. Render them blank. */
  inRange: boolean;
}

export interface HistorySummary {
  totalReviews: number;
  daysStudied: number;
  currentStreak: number;
  longestStreak: number;
  /** Sum of capped per-card time across all reviews, in ms. */
  totalDurationMs: number;
  firstReviewAt: number | null;
  /**
   * Reviews of graduated cards (going-in state `Review`) and how many were
   * retained (recalled in the FSRS sense: any grade but `Again`, so `Hard`
   * counts). Their ratio is "true retention": recall with learning-stage fumbles
   * filtered out, the number FSRS's desired retention targets.
   */
  matureReviews: number;
  matureCorrect: number;
}

export interface History {
  summary: HistorySummary;
  /** Most recent session first. */
  blocks: Block[];
  /** Contribution grid, oldest week first; each inner array is Sun→Sat. */
  weeks: HeatCell[][];
  /**
   * The last `TREND_DAYS` calendar days oldest→newest, zero-count days
   * included, for the accuracy trend.
   */
  trend: DayStat[];
}

/**
 * Split the log into study sessions by idle gap (> `gapMs` between consecutive
 * grades starts a new block). Per-block `durationMs` is the summed capped
 * time-on-card; when no grades carry a duration (e.g. an old backup), it falls
 * back to the start→end span so a block is never reported as zero-length.
 * Pure and order-independent. The input is sorted by time first.
 */
export const sessionize = (
  events: ReviewEvent[],
  gapMs: number = SESSION_GAP_MS,
): Block[] => {
  const sorted = [...events].sort((a, b) => a.reviewedAt - b.reviewedAt);
  const blocks: Block[] = [];
  let current: Block | null = null;
  let lastAt = 0;

  for (const e of sorted) {
    if (!current || e.reviewedAt - lastAt > gapMs) {
      current = {
        startedAt: e.reviewedAt,
        endedAt: e.reviewedAt,
        count: 0,
        correct: 0,
        durationMs: 0,
        byRating: [0, 0, 0, 0],
      };
      blocks.push(current);
    }
    current.endedAt = e.reviewedAt;
    current.count += 1;
    if (isRecalled(e.rating)) current.correct += 1;
    current.durationMs += cap(e.durationMs);
    const idx = e.rating - 1;
    if (idx >= 0 && idx < 4) current.byRating[idx] += 1;
    lastAt = e.reviewedAt;
  }

  for (const b of blocks) {
    if (b.durationMs === 0 && b.endedAt > b.startedAt) {
      b.durationMs = b.endedAt - b.startedAt;
    }
  }
  return blocks;
};

/**
 * Headline totals: volume, days studied, current/longest streak, time spent,
 * and the true-retention counts (recall on graduated cards only).
 */
export const summarize = (
  events: ReviewEvent[],
  now: Date = new Date(),
): HistorySummary => {
  const days = new Set<string>();
  let totalDurationMs = 0;
  let firstReviewAt: number | null = null;
  let matureReviews = 0;
  let matureCorrect = 0;
  for (const e of events) {
    days.add(dayKey(new Date(e.reviewedAt)));
    totalDurationMs += cap(e.durationMs);
    if (firstReviewAt === null || e.reviewedAt < firstReviewAt) {
      firstReviewAt = e.reviewedAt;
    }
    if (e.state === State.Review) {
      matureReviews += 1;
      if (isRetained(e.rating)) matureCorrect += 1;
    }
  }
  return {
    totalReviews: events.length,
    daysStudied: days.size,
    currentStreak: computeStreak(days, now),
    longestStreak: longestStreak(days),
    totalDurationMs,
    firstReviewAt,
    matureReviews,
    matureCorrect,
  };
};

/**
 * Per-day review/recall counts over a fixed window of the last `days` calendar
 * days ending today, oldest first. Inactive days are included with zero counts
 * (like the forecast's fixed horizon), so the chart keeps a real time axis: a
 * skipped day renders as a gap rather than being spliced out. Events older
 * than the window are dropped. Pure given `now`.
 */
export const accuracyByDay = (
  events: ReviewEvent[],
  now: Date = new Date(),
  days: number = TREND_DAYS,
): DayStat[] => {
  const todayStart = startOfDay(now);
  const window: DayStat[] = [];
  const byKey = new Map<string, DayStat>();
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(todayStart);
    date.setDate(date.getDate() - offset);
    const stat: DayStat = {
      key: dayKey(date),
      date,
      offset,
      count: 0,
      correct: 0,
    };
    window.push(stat);
    byKey.set(stat.key, stat);
  }
  for (const e of events) {
    const stat = byKey.get(dayKey(new Date(e.reviewedAt)));
    if (!stat) continue;
    stat.count += 1;
    if (isRecalled(e.rating)) stat.correct += 1;
  }
  return window;
};

/**
 * Weeks the contribution grid should span: enough to reach the earliest logged
 * review, floored at {@link MIN_HEATMAP_WEEKS} (so a new learner's grid stays
 * dense) and capped at {@link MAX_HEATMAP_WEEKS} (one year). Counts whole weeks
 * between the first review's Sunday and the current week's, inclusive. Both are
 * local midnights, so the divide-and-round absorbs DST drift. Pure given `now`.
 */
export const heatmapSpan = (
  events: ReviewEvent[],
  now: Date = new Date(),
): number => {
  let firstReviewAt = Number.POSITIVE_INFINITY;
  for (const e of events) {
    if (e.reviewedAt < firstReviewAt) firstReviewAt = e.reviewedAt;
  }
  if (!Number.isFinite(firstReviewAt)) return MIN_HEATMAP_WEEKS;

  const thisSunday = startOfWeek(now);
  const firstSunday = startOfWeek(new Date(firstReviewAt));
  const span =
    Math.round((thisSunday.getTime() - firstSunday.getTime()) / WEEK_MS) + 1;
  return Math.min(MAX_HEATMAP_WEEKS, Math.max(MIN_HEATMAP_WEEKS, span));
};

/**
 * GitHub-style contribution grid: `weeks` columns ending with the current week,
 * each a Sun→Sat array of day cells carrying that day's review count. The span
 * defaults to {@link heatmapSpan}: adaptive, growing from a dense quarter to a
 * full year as history accumulates. The trailing future days of the current
 * week are marked `inRange: false` so the view can leave them blank rather than
 * implying zero activity. Pure given `now`.
 */
export const heatmapWeeks = (
  events: ReviewEvent[],
  now: Date = new Date(),
  weeks: number = heatmapSpan(events, now),
): HeatCell[][] => {
  const counts = new Map<string, number>();
  for (const e of events) {
    const key = dayKey(new Date(e.reviewedAt));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const today = startOfDay(now);
  // Step back from the current week's Sunday to the first column's Sunday.
  const firstSunday = startOfWeek(now);
  firstSunday.setDate(firstSunday.getDate() - 7 * (weeks - 1));

  const grid: HeatCell[][] = [];
  for (let w = 0; w < weeks; w += 1) {
    const column: HeatCell[] = [];
    for (let d = 0; d < 7; d += 1) {
      const date = new Date(firstSunday);
      date.setDate(firstSunday.getDate() + w * 7 + d);
      const key = dayKey(date);
      column.push({
        key,
        date,
        count: counts.get(key) ?? 0,
        inRange: date.getTime() <= today.getTime(),
      });
    }
    grid.push(column);
  }
  return grid;
};

/**
 * For each week column of a {@link heatmapWeeks} grid, the month index (0-11)
 * when that column opens a new month (read off its Sunday) else null. The
 * first column is always labelled. Lets the view caption the grid with month
 * names aligned to where each month begins, like GitHub's contribution graph.
 * Pure.
 */
export const heatmapMonthLabels = (weeks: HeatCell[][]): (number | null)[] => {
  let prevMonth = -1;
  return weeks.map((week) => {
    const month = week[0].date.getMonth();
    if (month === prevMonth) return null;
    prevMonth = month;
    return month;
  });
};

/** Read the review log and shape the full history view. Thin IndexedDB wrapper. */
export const getHistory = async (now: Date = new Date()): Promise<History> => {
  const rows = await db.reviews.toArray();
  const events: ReviewEvent[] = rows.map((r) => ({
    reviewedAt: r.reviewedAt,
    rating: r.rating,
    state: r.state,
    durationMs: r.durationMs,
  }));
  return {
    summary: summarize(events, now),
    blocks: sessionize(events).reverse(),
    weeks: heatmapWeeks(events, now),
    trend: accuracyByDay(events, now),
  };
};
