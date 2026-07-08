import {
  type Card,
  createEmptyCard,
  type FSRS,
  fsrs,
  type Grade,
  generatorParameters,
  Rating,
  type RecordLogItem,
  State,
} from "ts-fsrs";

/**
 * Spaced-repetition core, wrapping ts-fsrs (the FSRS algorithm Anki adopted).
 *
 * This module is intentionally framework-agnostic: it knows nothing about
 * Svelte, Astro, or IndexedDB. The view and storage layers both build on top
 * of it.
 */

/**
 * Scheduler configuration shared across every retention setting. Fuzz spreads
 * otherwise-identical intervals slightly so reviews don't clump on the same day;
 * short-term steps keep brand-new cards in a learning phase for their first few
 * exposures. `request_retention` is deliberately *not* set here. It's the one
 * learner-tunable knob, supplied per call via {@link schedulerFor}.
 */
const baseParams = {
  enable_fuzz: true,
  enable_short_term: true,
} as const;

/**
 * Default desired retention: the recall probability FSRS schedules each review
 * for. 0.9 is FSRS's own default and the right starting point; the learner can
 * trade it off against daily workload (lower ⇒ longer intervals, fewer reviews).
 */
export const DEFAULT_REQUEST_RETENTION = 0.9;

/**
 * Bounds for the desired-retention knob. Below 0.8 the algorithm's accuracy
 * degrades (FSRS's own guidance); above 0.95 review counts climb steeply for
 * little real retention gain. The setter and the scheduler both clamp to this.
 */
export const MIN_REQUEST_RETENTION = 0.8;
export const MAX_REQUEST_RETENTION = 0.95;

export const clampRetention = (r: number): number =>
  Math.max(MIN_REQUEST_RETENTION, Math.min(MAX_REQUEST_RETENTION, r));

/**
 * Schedulers keyed by desired retention. FSRS is stateless and a pure function
 * of `(card, now, grade, params)`, so one instance per distinct retention is
 * enough, built lazily and reused. (This was a single module-level singleton
 * until retention became a learner setting; the value now lives in async
 * IndexedDB, so it can no longer be baked in at import time.) Clamping keeps
 * keys within the valid range; the cache stays small because retention is one
 * of a few discrete, learner-chosen values, not because clamping bounds its
 * cardinality.
 */
const schedulers = new Map<number, FSRS>();

export const schedulerFor = (
  requestRetention: number = DEFAULT_REQUEST_RETENTION,
): FSRS => {
  const retention = clampRetention(requestRetention);
  let scheduler = schedulers.get(retention);
  if (!scheduler) {
    scheduler = fsrs(
      generatorParameters({ ...baseParams, request_retention: retention }),
    );
    schedulers.set(retention, scheduler);
  }
  return scheduler;
};

export type { Card, Grade };
export { Rating, State };

/**
 * Whether a grade was a *lapse*: the learner failed to recall, and the card
 * takes FSRS's forget path. In FSRS only `Again` is a lapse; `Hard` is a
 * successful (if effortful) recall whose stability still grows. The one
 * authoritative "what counts as forgetting" rule, so the history view's true
 * retention (built on {@link isRetained}) stays in step with the scheduler.
 */
export const isLapse = (rating: number): boolean => rating === Rating.Again;

/**
 * Inverse of {@link isLapse}: the card was retained (`Hard`, `Good`, or `Easy`),
 * "recalled" in the FSRS sense that desired retention targets. Distinct from a
 * Good/Easy-only *clean recall* accuracy metric, which is a separate, stricter
 * notion the history view computes for itself.
 */
export const isRetained = (rating: number): boolean => !isLapse(rating);

/** A fresh, never-reviewed card, due immediately. */
export const newCard = (now: Date = new Date()): Card => createEmptyCard(now);

/**
 * A card seeded as "already known": the FSRS state for marking an item known
 * (the manual level skip, and later the placement test) without skipping it
 * outright. Applying a single `Easy` grade graduates a fresh card straight into
 * the Review state with FSRS's own ~one-week interval and derived stability
 * (no hand-fabricated numbers): `reps > 0`, so it bypasses the new-card cap, and
 * it surfaces exactly once for a confirming review. If that review is failed,
 * normal relearning resurfaces it, the insurance against over-marking.
 */
export const knownSeedCard = (now: Date = new Date()): Card =>
  schedulerFor().next(createEmptyCard(now), now, Rating.Easy).card;

/**
 * Apply a grade, returning the next card state and the review log entry.
 * `requestRetention` is the learner's desired-retention setting; it changes only
 * the next interval (FSRS's stability/difficulty updates are retention-agnostic),
 * so the effect is prospective: each card moves to the new cadence as it's
 * reviewed, with no bulk reschedule.
 */
export const review = (
  card: Card,
  grade: Grade,
  now: Date = new Date(),
  requestRetention: number = DEFAULT_REQUEST_RETENTION,
): RecordLogItem => schedulerFor(requestRetention).next(card, now, grade);

/** Whether a card's next review falls due at or before `now`. */
export const isDue = (card: Card, now: Date = new Date()): boolean =>
  card.due.getTime() <= now.getTime();
