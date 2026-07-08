import { db } from "~/lib/db/db";
import { dayKey, startOfDay } from "~/lib/study/day";

/**
 * Habit tracking derived from the append-only review log: how many cards were
 * reviewed today, and the current consecutive-day streak. The streak math is
 * pure and tested; the IndexedDB read is a thin wrapper around it.
 */

export interface ProgressSummary {
  reviewedToday: number;
  streak: number;
}

/**
 * Consecutive-day streak ending today. If today has no reviews yet the streak
 * is the run ending yesterday (still "alive": review today to keep it), which
 * matches how habit apps conventionally display it.
 */
export const computeStreak = (days: Set<string>, today: Date): number => {
  const cursor = new Date(today);
  if (!days.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

/**
 * Longest consecutive-day run ever recorded: the all-time best for the history
 * view's stat row. Walks each day that starts a run (no prior day present) and
 * counts forward, so it's O(days) over the unique-day set. Pure, like
 * {@link computeStreak}, and shares its `dayKey` bucketing.
 */
export const longestStreak = (days: Set<string>): number => {
  let best = 0;
  for (const key of days) {
    const [y, m, d] = key.split("-").map(Number);
    const start = new Date(y, m - 1, d);
    const prev = new Date(start);
    prev.setDate(prev.getDate() - 1);
    if (days.has(dayKey(prev))) continue; // mid-run; only count from run starts
    let len = 0;
    const cursor = new Date(start);
    while (days.has(dayKey(cursor))) {
      len += 1;
      cursor.setDate(cursor.getDate() + 1);
    }
    best = Math.max(best, len);
  }
  return best;
};

/**
 * Count reviews falling on a single local day via the `reviewedAt` index:
 * `[localMidnight, nextLocalMidnight)`. The next boundary is built with the
 * date constructor rather than `+86_400_000` so it stays correct across DST.
 * IndexedDB answers this from the index without materializing any row.
 */
const countReviewsOn = (dayStart: Date): Promise<number> => {
  const start = dayStart.getTime();
  const end = new Date(
    dayStart.getFullYear(),
    dayStart.getMonth(),
    dayStart.getDate() + 1,
  ).getTime();
  return db.reviews
    .where("reviewedAt")
    .between(start, end, true, false)
    .count();
};

/**
 * Runs after every grade, so it must not scan the whole append-only log to
 * recompute two values that barely move. Both reads ride the `reviewedAt`
 * index: `reviewedToday` is one range count, and the streak walks back one
 * local day at a time, stopping at the first gap: O(streak) cheap range
 * counts, not O(all reviews). The bounded day-set then feeds the canonical
 * {@link computeStreak} so the streak's definition lives in one tested place.
 * Wrapped in a single read transaction so the per-day probes share it.
 */
export const getProgress = (now: Date = new Date()): Promise<ProgressSummary> =>
  db.transaction("r", db.reviews, async () => {
    const dayStart = startOfDay(now);
    const reviewedToday = await countReviewsOn(dayStart);

    const days = new Set<string>();
    const cursor = new Date(dayStart);
    // Today counts only if it has reviews; an empty today doesn't break the
    // streak. It's the run ending yesterday, still alive (matches
    // computeStreak's grace). Either way the walk resumes at yesterday.
    if (reviewedToday > 0) days.add(dayKey(cursor));
    cursor.setDate(cursor.getDate() - 1);
    while ((await countReviewsOn(cursor)) > 0) {
      days.add(dayKey(cursor));
      cursor.setDate(cursor.getDate() - 1);
    }

    return { reviewedToday, streak: computeStreak(days, now) };
  });
