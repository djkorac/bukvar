import { db } from "~/lib/db/db";

/**
 * When the learner first studied: the earliest recorded review's `reviewedAt`,
 * or null if they've never reviewed. The shared notion of "activity on record"
 * that the backup and install nudges both gate on, so the two can't drift on
 * what counts as a learner having progress worth protecting.
 */
export const getFirstActivityAt = async (): Promise<number | null> => {
  const firstReview = await db.reviews.orderBy("reviewedAt").first();
  return firstReview?.reviewedAt ?? null;
};
