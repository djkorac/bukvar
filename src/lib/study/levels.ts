import { LEVELS } from "~/data/levels";
import {
  type CardSnapshot,
  type LevelSummary,
  levelItemIds,
  summarizeLevels,
} from "~/lib/content/levels";
import type { Topic } from "~/lib/content/types";
import { type CardRecord, db } from "~/lib/db/db";
import { knownSeedCard } from "~/lib/srs/scheduler";
import { DAY_MS } from "~/lib/study/day";

/**
 * The storage bridge for levels: read per-level progress from the card store,
 * and the shared **seeding primitive**: mark a set of items "known" by
 * graduating their still-new cards to a mid SRS stage (see
 * {@link knownSeedCard}) so each surfaces once for a confirming review instead
 * of being skipped. Reused by the manual level skip here and by the placement
 * test (Phase 6). The pure bucketing/promotion logic lives in
 * `lib/content/levels.ts` and {@link promoteToKnown}; these are the thin
 * IndexedDB wrappers.
 */

/** Per-level new/learning/known counts and the current level, from the deck. */
export const getLevelProgress = async (): Promise<LevelSummary> => {
  const records = await db.cards.toArray();
  const snapshots: CardSnapshot[] = records.map((r) => ({
    itemId: r.itemId,
    reps: r.fsrs.reps,
    state: r.fsrs.state,
  }));
  return summarizeLevels(snapshots);
};

/**
 * Confirming reviews of bulk-seeded "known" cards are capped at this many per
 * day (starting tomorrow) instead of all falling on FSRS's single shared
 * ~1-week interval. A fixed daily *rate*, not a fixed window: a strong
 * placement pass can seed several hundred cards, and any fixed window scales
 * the daily pile with the batch (each failed confirmation also feeds next-day
 * relearning on top). The cap bounds the daily toll no matter how much the
 * learner tests out of; a big batch just takes more days, and the forecast's
 * "later" bucket counts any spill past its chart.
 */
export const SEED_CONFIRMATIONS_PER_DAY = 20;

/**
 * Pure: given existing card rows, return updated rows for the still-**new**
 * (`reps === 0`) ids only. Cards with real review history are left untouched,
 * so a learner's progress is never clobbered. Confirming reviews are dripped at
 * {@link SEED_CONFIRMATIONS_PER_DAY}, in input order, so a whole batch doesn't
 * fall due together (the placement-test "clump"). Only the *due date* is chosen here;
 * the FSRS-derived stability is kept intact, and resurfacing a touch early/late
 * is handled cleanly on the next grade.
 */
export const promoteToKnown = (
  records: CardRecord[],
  ids: Iterable<string>,
  now: Date = new Date(),
): CardRecord[] => {
  const target = new Set(ids);
  const nowMs = now.getTime();
  const updated: CardRecord[] = [];
  for (const record of records) {
    if (!target.has(record.itemId) || record.fsrs.reps > 0) continue;
    const card = knownSeedCard(now);
    const offsetDays =
      Math.floor(updated.length / SEED_CONFIRMATIONS_PER_DAY) + 1;
    const dueMs = nowMs + offsetDays * DAY_MS;
    // Sync `scheduled_days` so the stored card stays self-consistent
    // (last_review + scheduled_days === due).
    const fsrs = { ...card, due: new Date(dueMs), scheduled_days: offsetDays };
    updated.push({ ...record, fsrs });
  }
  return updated;
};

/**
 * Mark an arbitrary set of items known. The reusable seeding primitive: loads
 * their card rows, promotes the new ones, persists, and returns how many were
 * promoted. (Does not touch the daily new-intro counter. These aren't
 * introductions.)
 */
export const markKnown = async (
  ids: string[],
  now: Date = new Date(),
): Promise<number> =>
  // Read, promote, and write inside one rw transaction so the new-only snapshot
  // the promotion is computed from can't go stale between bulkGet and bulkPut.
  // IndexedDB serializes overlapping rw transactions on db.cards (across tabs
  // too), so a concurrent gradeItem can't slip between the read and write and
  // have its committed grade clobbered back to seed state: whichever commits
  // first wins, and the loser re-reads it. A card graded first reads back with
  // reps > 0, which promoteToKnown skips. promoteToKnown/knownSeedCard are
  // synchronous, so the only awaits here are Dexie ops and the zone holds.
  db.transaction("rw", db.cards, async () => {
    const records = (await db.cards.bulkGet(ids)).filter((r): r is CardRecord =>
      Boolean(r),
    );
    const updated = promoteToKnown(records, ids, now);
    if (updated.length > 0) await db.cards.bulkPut(updated);
    return updated.length;
  });

/** Mark every item in a level known. Thin wrapper over {@link markKnown}. */
export const markLevelKnown = async (
  levelId: Topic,
  now: Date = new Date(),
): Promise<number> => {
  const level = LEVELS.find((l) => l.id === levelId);
  return level ? markKnown(levelItemIds(level), now) : 0;
};
