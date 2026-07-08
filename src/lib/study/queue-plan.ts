/**
 * Pure queue planning + pacing for the reviewer. No storage and no UI. The
 * IndexedDB read lives in `session.ts`, which feeds plain values into these so
 * the pacing rules stay unit-testable in isolation.
 */

/**
 * Composes the study queue: every due review first (these are never capped: a
 * backlog must be cleared), then new cards limited to the session's allowance.
 */
export const planQueue = (
  reviewDueIds: string[],
  newCardIds: string[],
  newAllowance: number,
): string[] => [
  ...reviewDueIds,
  ...newCardIds.slice(0, Math.max(0, newAllowance)),
];

/** New-card pacing for one lesson session: how many to introduce, and why the rest are held. */
export interface NewPacing {
  /**
   * Cap on new cards for this lesson: the slice limit handed to {@link planQueue}.
   * The queue introduces fewer if fewer new cards actually remain.
   */
  allowance: number;
  /** New cards held for future days because the daily cap is reached. */
  lockedNew: number;
  /**
   * Whether more new cards remain for another lesson *today*, i.e. the batch
   * (not the day) is what's holding cards back. Lets the reviewer invite another
   * lesson instead of claiming "all caught up".
   */
  moreNewToday: boolean;
}

/**
 * Pace new cards by layering the per-lesson `batchSize` over the daily
 * `newPerDay` cap: the day caps the total introduced, the batch caps a single
 * session. So `min(batchSize, dailyRemaining)` enter this lesson, the next
 * lesson today gets the following batch, and anything beyond the day's cap is
 * deferred to future days (`lockedNew`).
 */
export const paceNewCards = (
  totalNew: number,
  introducedToday: number,
  newPerDay: number,
  batchSize: number,
): NewPacing => {
  const dailyRemaining = Math.max(0, newPerDay - introducedToday);
  const allowance = Math.max(0, Math.min(batchSize, dailyRemaining));
  return {
    allowance,
    lockedNew: Math.max(0, totalNew - dailyRemaining),
    moreNewToday: dailyRemaining > allowance && totalNew > allowance,
  };
};
