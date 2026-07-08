import { alphabet } from "~/data/alphabet";
import { words } from "~/data/words";
import { type CardRecord, db } from "~/lib/db/db";
import { requestPersistentStorage } from "~/lib/db/persist";
import { newCard } from "~/lib/srs/scheduler";

const buildRecord = (
  itemId: string,
  kind: CardRecord["kind"],
  now: Date,
): CardRecord => {
  const card = newCard(now);
  return {
    itemId,
    kind,
    fsrs: card,
    addedAt: now.getTime(),
  };
};

/**
 * Populate the local card store from the seed corpus. Idempotent and additive:
 * existing cards are never touched (so a learner's progress is safe across
 * releases), and only corpus entries without a card yet get one. New words
 * shipped in a later release simply appear as fresh cards on next load.
 *
 * The read of existing keys and the bulkAdd run in one rw transaction so the
 * read-modify-write is atomic. IndexedDB serializes overlapping rw transactions
 * on the same store across connections, so two first-run callers (two tabs, or a
 * ClientRouter swap mid-seed) can't both read an empty deck and then both insert.
 * The loser reads the winner's committed keys, filters to nothing, and adds
 * nothing, instead of rejecting with a BulkError on the colliding ids. bulkAdd
 * (not bulkPut) keeps it non-clobbering: under that serialization the filtered
 * records are guaranteed still missing, so there's no ConstraintError to suppress.
 */
export const seedIfNeeded = (now: Date = new Date()): Promise<void> =>
  db.transaction("rw", db.cards, async () => {
    const existing = new Set<string>(
      await db.cards.toCollection().primaryKeys(),
    );
    const records: CardRecord[] = [];

    for (const letter of alphabet) {
      if (!existing.has(letter.id)) {
        records.push(buildRecord(letter.id, "letter", now));
      }
    }
    for (const word of words) {
      if (!existing.has(word.id)) {
        records.push(buildRecord(word.id, "word", now));
      }
    }

    if (records.length > 0) {
      await db.cards.bulkAdd(records);
    }
  });

/**
 * The single first-contact-with-storage entry point for the stateful islands.
 * Requests durable storage (best-effort) and seeds any missing corpus cards.
 * Idempotent: safe to call from every island that may be the first to mount
 * (Reviewer, PlacementTest, Levels); seeding twice is a no-op and the persist
 * request short-circuits once granted.
 *
 * The persist request is intentionally *not* awaited: Firefox surfaces it as a
 * permission prompt, and blocking on it would delay seeding and first render.
 * Durability is an upgrade layered under the data, not a gate in front of it.
 */
export const ensureStorageReady = async (): Promise<void> => {
  void requestPersistentStorage();
  await seedIfNeeded();
};
