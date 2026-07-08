import Dexie, { type EntityTable } from "dexie";
import type { Card } from "ts-fsrs";
import type { CardKind } from "~/lib/content/types";

/**
 * Local-first persistence. All learner state lives in IndexedDB via Dexie;
 * there is no server and no account. This is the only stateful, browser-only
 * layer; it must never be imported into build-time Astro frontmatter.
 */

/** Per-item SRS state: one row per learnable item (a letter or a word). */
export interface CardRecord {
  /** Matches the entry id from `src/data`. Primary key. */
  itemId: string;
  kind: CardKind;
  /**
   * Full ts-fsrs card state, stored with its Date fields intact. `fsrs.due` is
   * the card's due time; `getDueItems` filters on it directly. The
   * corpus is small and `getDueItems` loads every card anyway (it needs the
   * never-seen ones), so due selection is an in-memory scan, not a range query,
   * which is why `due` is not a stored top-level field or an index.
   */
  fsrs: Card;
  addedAt: number;
}

/**
 * Append-only log of every grade. Feeds stats, the history view, and future
 * FSRS tuning. Beyond the rating we persist the FSRS `ReviewLog` fields the
 * scheduler computes at grade time: they're cheap to store, impossible to
 * reconstruct afterwards, and exactly what a retention analysis or an FSRS
 * re-optimization run needs. `state` is the card's state *going into* the
 * review (New/Learning/Review/Relearning), so "recall on mature cards" is a
 * filter, not a guess.
 */
export interface ReviewRecord {
  /** Auto-increment key. Dexie assigns it; `EntityTable` keeps it out of inserts. */
  id: number;
  itemId: string;
  /** FSRS Rating: 1=Again, 2=Hard, 3=Good, 4=Easy. */
  rating: number;
  reviewedAt: number;
  /** ts-fsrs `State` the card held when reviewed (0=New … 3=Relearning). */
  state: number;
  /** FSRS memory-model outputs after this review. */
  stability: number;
  difficulty: number;
  /**
   * Interval FSRS assigned to the next review, in days. Kept because (unlike
   * elapsed time, which is derivable from consecutive `reviewedAt`) the
   * *intended* interval can't be reconstructed (a review may land early or late).
   */
  scheduledDays: number;
  /** Wall-clock time on the card, prompt→grade, in ms. Capped on read, not here. */
  durationMs?: number;
}

/** Key/value store for onboarding choices (e.g. preferred script, daily goal). */
export interface SettingRecord {
  key: string;
  value: unknown;
}

export const db = new Dexie("bukvar") as Dexie & {
  cards: EntityTable<CardRecord, "itemId">;
  reviews: EntityTable<ReviewRecord, "id">;
  settings: EntityTable<SettingRecord, "key">;
};

db.version(1).stores({
  cards: "itemId",
  reviews: "++id, itemId, reviewedAt",
  settings: "key",
});
