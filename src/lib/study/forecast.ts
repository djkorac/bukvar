import type { State } from "ts-fsrs";
import { type CardClass, classifyCard } from "~/lib/content/levels";
import { db } from "~/lib/db/db";
import { DAY_MS, dayKey, startOfDay } from "~/lib/study/day";

/**
 * Read-only review forecast: bucket scheduled cards by the local day they fall
 * due, so a learner can see upcoming load. Derived entirely from FSRS due dates
 * already in IndexedDB. It adds no scheduling behaviour. The bucketing is a
 * pure function over plain snapshots ({@link bucketForecast}); {@link getForecast}
 * is the thin IndexedDB wrapper, mirroring `progress.ts`.
 */

export const HORIZON_DAYS = 14;

/** Minimal per-card state the forecast needs (storage-agnostic, so it's testable). */
export interface DueSnapshot {
  /** `fsrs.due` as epoch milliseconds. */
  due: number;
  reps: number;
  state: State;
}

export interface ForecastDay {
  /** Local-day key (`YYYY-MM-DD`). */
  key: string;
  /** Days from today: 0 = today, 1 = tomorrow, … */
  offset: number;
  /** Start-of-day Date, for rendering labels. */
  date: Date;
  total: number;
  learning: number;
  known: number;
}

export interface Forecast {
  /** Exactly `horizonDays` buckets, today first; zero-count days are included. */
  days: ForecastDay[];
  /** Review cards due beyond the horizon: counted, never silently dropped. */
  later: number;
  /** Total scheduled review cards across `days` + `later`. */
  total: number;
  /** Largest single-day total, for scaling bars (0 when nothing is due). */
  max: number;
}

export interface IntradayOutlook {
  /** Review cards (reps > 0) due after `now` but before local midnight. */
  dueLaterToday: number;
  /** Soonest such due time (epoch ms), or null when none remain today. */
  nextDueAt: number | null;
}

/**
 * Bucket scheduled review cards by the local day they fall due, over a fixed
 * horizon. Only cards with real history (`reps > 0`) count. Unseen cards are
 * paced by `newPerDay`, not by an FSRS due date, so they aren't "scheduled".
 * Overdue cards (`due ≤ now`) fold into today; anything past the horizon is
 * tallied in `later` so it is never silently dropped. Each day is split into
 * `known` (graduated to Review) vs `learning`, mirroring the level progress bar.
 * Pure and deterministic given `now`.
 */
export const bucketForecast = (
  snapshots: DueSnapshot[],
  now: Date = new Date(),
  horizonDays: number = HORIZON_DAYS,
): Forecast => {
  const todayStart = startOfDay(now);
  const nowMs = now.getTime();

  const days: ForecastDay[] = [];
  for (let offset = 0; offset < horizonDays; offset += 1) {
    const date = new Date(todayStart);
    date.setDate(date.getDate() + offset);
    days.push({
      key: dayKey(date),
      offset,
      date,
      total: 0,
      learning: 0,
      known: 0,
    });
  }

  let later = 0;
  let total = 0;

  for (const snap of snapshots) {
    if (snap.reps <= 0) continue;
    total += 1;

    // Round the day delta so a DST shift across the span can't push a bucket
    // off by one.
    const offset =
      snap.due <= nowMs
        ? 0
        : Math.round(
            (startOfDay(new Date(snap.due)).getTime() - todayStart.getTime()) /
              DAY_MS,
          );

    if (offset >= horizonDays) {
      later += 1;
      continue;
    }

    const day = days[offset];
    day.total += 1;
    const klass: CardClass = classifyCard(snap);
    // reps > 0 here, so "new" can't occur; Review → known, else learning.
    if (klass === "known") day.known += 1;
    else day.learning += 1;
  }

  const max = days.reduce((m, d) => Math.max(m, d.total), 0);
  return { days, later, total, max };
};

/** Read the deck and project each card to the minimal snapshot the forecasts need. */
const loadDueSnapshots = async (): Promise<DueSnapshot[]> => {
  const records = await db.cards.toArray();
  return records.map((r) => ({
    due: r.fsrs.due.getTime(),
    reps: r.fsrs.reps,
    state: r.fsrs.state,
  }));
};

/** Read the deck and bucket its upcoming reviews. Thin IndexedDB wrapper. */
export const getForecast = async (
  now: Date = new Date(),
  horizonDays: number = HORIZON_DAYS,
): Promise<Forecast> => {
  return bucketForecast(await loadDueSnapshots(), now, horizonDays);
};

/**
 * What's still coming *today*: review cards (reps > 0) not due this instant but
 * falling due before local midnight: the short-term learning steps that bring
 * just-seen cards back within minutes. Drives the done screen's "more later
 * today" line so a learner who finishes a lesson knows reviews refill the same
 * day rather than assuming "see you tomorrow". Pure and deterministic given `now`.
 */
export const intradayOutlook = (
  snapshots: DueSnapshot[],
  now: Date = new Date(),
): IntradayOutlook => {
  const nowMs = now.getTime();
  const tomorrowStart = startOfDay(now);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const endMs = tomorrowStart.getTime();

  let dueLaterToday = 0;
  let nextDueAt: number | null = null;
  for (const snap of snapshots) {
    if (snap.reps <= 0 || snap.due <= nowMs || snap.due >= endMs) continue;
    dueLaterToday += 1;
    if (nextDueAt === null || snap.due < nextDueAt) nextDueAt = snap.due;
  }
  return { dueLaterToday, nextDueAt };
};

/** Read the deck and tally what's still due later today. Thin IndexedDB wrapper. */
export const getIntradayOutlook = async (
  now: Date = new Date(),
): Promise<IntradayOutlook> => {
  return intradayOutlook(await loadDueSnapshots(), now);
};
