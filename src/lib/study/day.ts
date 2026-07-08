/**
 * Local-calendar primitives shared across the study modules: the day/week
 * boundary math (and the day-label formatting) that the read-only views
 * (progress, forecast, history) all need. Kept in one place so the helpers can't
 * drift apart (they used to be copy-pasted per file) and so the math has a single
 * tested home.
 *
 * Everything here works in the learner's *own* timezone: a "day" is local
 * midnight-to-midnight, not UTC. `DAY_MS`/`WEEK_MS` are the fixed-span constants
 * for divide-and-round spacing between two local midnights (DST-tolerant) and
 * for elapsed-duration thresholds; they are deliberately *not* wrapped in an
 * "add N days" helper, because additive offset math drifts across a DST change;
 * `progress.ts` builds its day boundaries with the date constructor for exactly
 * that reason.
 */

export const DAY_MS = 86_400_000;
export const WEEK_MS = 7 * DAY_MS;

/**
 * Human-readable local day, e.g. "Mon, Jun 1": the label the forecast and
 * history axes render in tooltips. Shared so the two views, which are meant to
 * read consistently (history's trend mirrors the forecast's horizon), can't
 * drift apart.
 */
export const dayLabel = (d: Date): string =>
  d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

/** Local-day key (`YYYY-MM-DD`) in the learner's own timezone. */
export const dayKey = (d: Date): string => {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/** Local midnight starting the day that contains `d`. */
export const startOfDay = (d: Date): Date => {
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  return start;
};

/** Sunday (local) of the week containing `d`, at start of day. */
export const startOfWeek = (d: Date): Date => {
  const sunday = startOfDay(d);
  sunday.setDate(sunday.getDate() - sunday.getDay());
  return sunday;
};
