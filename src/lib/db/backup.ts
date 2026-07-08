import {
  type CardRecord,
  db,
  type ReviewRecord,
  type SettingRecord,
} from "~/lib/db/db";
import { DEFAULT_PREFERENCES } from "~/lib/db/settings";
import { NEW_COUNTER_KEY } from "~/lib/study/session";

/**
 * Local-first data portability: export all learner state to a JSON file and
 * import it back. With no account or server, an exported file is how a learner
 * keeps a copy of their progress and moves it between devices.
 *
 * Import semantics are restore-from-backup: it *replaces* the device's current
 * data (merging FSRS state across devices is a conflict-resolution problem we
 * intentionally don't take on here).
 */

const FORMAT = "bukvar-backup";
/**
 * Backup-file format version, independent of `db.version()` (the live Dexie
 * schema). A Dexie schema bump does not change this; this only moves when the
 * exported JSON envelope itself changes. Backups are long-lived offline
 * artifacts (a user may restore a months-old export onto a new device), so
 * bumping this REQUIRES adding a forward-migration for older versions in
 * `parseBackup` + a test. Never a bare `VERSION++`, which would orphan every
 * previously-exported backup.
 */
const VERSION = 1;

export interface BackupFile {
  format: typeof FORMAT;
  version: number;
  exportedAt: string;
  cards: CardRecord[];
  /**
   * Reviews without their `id`: it's a device-local auto-increment surrogate
   * that nothing references across a backup boundary (history/progress/activity
   * key off `reviewedAt`; the only id consumer is the in-session undo receipt).
   * So it carries zero portable information. We don't export it, and import
   * lets Dexie assign fresh keys (see `importBackup`).
   */
  reviews: Omit<ReviewRecord, "id">[];
  settings: SettingRecord[];
}

export const exportBackup = async (
  now: Date = new Date(),
): Promise<BackupFile> => {
  // One read transaction so all three tables come from a single consistent
  // snapshot. A backup is a point-in-time view, and this matches how every
  // other multi-table accessor in this module (import/reset/grade) is wrapped.
  const [cards, reviews, settings] = await db.transaction(
    "r",
    db.cards,
    db.reviews,
    db.settings,
    () =>
      Promise.all([
        db.cards.toArray(),
        db.reviews.toArray(),
        db.settings.toArray(),
      ]),
  );
  return {
    format: FORMAT,
    version: VERSION,
    exportedAt: now.toISOString(),
    cards,
    // Drop the surrogate `id` (see BackupFile.reviews): it's plumbing, not data.
    reviews: reviews.map(({ id: _id, ...row }) => row),
    settings,
  };
};

export const serializeBackup = async (now?: Date): Promise<string> =>
  JSON.stringify(await exportBackup(now), null, 2);

/**
 * JSON.stringify turns the FSRS card's Date fields into ISO strings; on the way
 * back in we revive them, or the scheduler's `card.due.getTime()` would throw.
 */
export const reviveCard = (card: CardRecord): CardRecord => ({
  ...card,
  fsrs: {
    ...card.fsrs,
    due: new Date(card.fsrs.due),
    // Mirror isValidCard's `== null` check, not a truthiness test: a stored
    // last_review of epoch 0 (the integer, e.g. from hand-crafted JSON) passes
    // the validator via isParseableDate, so the reviver must honor it too rather
    // than coerce the falsy 0 to undefined.
    last_review:
      card.fsrs.last_review == null
        ? undefined
        : new Date(card.fsrs.last_review),
  },
});

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

/** A value `new Date(...)` (and thus `reviveCard`) can turn into a real date. */
const isParseableDate = (v: unknown): boolean =>
  (typeof v === "string" || typeof v === "number") &&
  !Number.isNaN(new Date(v).getTime());

/**
 * Per-record validators. These mirror the *fields the app reads without a
 * fallback*: the ones that, left malformed, would either make `bulkPut` reject
 * mid-transaction (a missing primary key) or surface far downstream as a silent
 * NaN: an unparseable `fsrs.due` revives to an Invalid Date, a non-number or
 * negative `reps` vanishes a card from both the new and review queues, and a
 * `rating` outside FSRS's 1-4 domain quietly skews every recall/lapse metric
 * derived from it (`correct`, `matureCorrect`, the lapse-rate pacing math).
 * `kind` is checked
 * against the closed `CardKind` set for a second reason: it is typed as that
 * narrow union (not a bare `string`), so the `return candidate as BackupFile`
 * cast is only honest if a foreign `kind` is rejected here rather than dispatched
 * by some future consumer's exhaustive switch. For `settings` we only check the
 * `key`, since values are typed `unknown` by design and validated at each read
 * seam (preferences via `getPreferences`'s type/range/domain guards, the
 * `newIntroduced` counter via `readCountForToday`), so a malformed value falls
 * back there, not here.
 *
 * The `fsrs` guards cover the stable scalar core of the ts-fsrs `Card`, because
 * nothing downstream re-checks it: `stability`/`difficulty`/`state` are fed
 * straight into ts-fsrs's `next()` on the very next grade (`scheduler.ts`), which
 * does *no* input validation, so a bad value corrupts that card's forward
 * scheduling permanently, it does not self-correct. `stability`/`difficulty`/
 * `lapses` are guarded with `Number.isFinite`, not a bare `typeof number`: JSON
 * has no `NaN` literal, but `1e999` parses to `Infinity` (a `number` by `typeof`)
 * that would otherwise flow straight into `next()`. `lapses`/`stability` are also
 * read raw by leech detection (`leeches.ts`) and `state` by the level/forecast
 * views. We still don't mirror the *full* schema: the line is
 * version drift, not "ts-fsrs owns it". `learning_steps` is a newer field a
 * valid older v1 backup may lack, and `elapsed_days`/`scheduled_days` are FSRS
 * outputs it recomputes on the next grade, so neither is guarded here.
 */
const isValidCard = (c: unknown): boolean => {
  if (!isObject(c)) return false;
  const { fsrs } = c;
  return (
    typeof c.itemId === "string" &&
    (c.kind === "letter" || c.kind === "word") &&
    Number.isFinite(c.addedAt) &&
    isObject(fsrs) &&
    typeof fsrs.reps === "number" &&
    // reps is a non-negative integer counter and the new-vs-seen discriminator
    // (session.ts/levels.ts): a negative value drops the card from both queues,
    // a fractional one (reps > 0) misfiles a never-graded card as seen.
    Number.isInteger(fsrs.reps) &&
    fsrs.reps >= 0 &&
    typeof fsrs.state === "number" &&
    // state is the ts-fsrs State enum: New=0..Relearning=3. An out-of-range
    // value type-checks as a number but matches no case in next()'s
    // default-less switch, so the next grade throws (see isValidReview's
    // rating guard for the same 1:1 closed-domain check).
    Number.isInteger(fsrs.state) &&
    fsrs.state >= 0 &&
    fsrs.state <= 3 &&
    Number.isFinite(fsrs.stability) &&
    Number.isFinite(fsrs.difficulty) &&
    Number.isFinite(fsrs.lapses) &&
    isParseableDate(fsrs.due) &&
    (fsrs.last_review == null || isParseableDate(fsrs.last_review))
  );
};

const isValidReview = (r: unknown): boolean => {
  if (!isObject(r)) return false;
  // `id` is deliberately not validated: import strips any inline id and lets
  // Dexie reassign keys (see `importBackup`), so a backup's id is ignored, never
  // trusted. There's no value here worth range-checking the way `rating` is.
  return (
    typeof r.itemId === "string" &&
    typeof r.rating === "number" &&
    Number.isInteger(r.rating) &&
    r.rating >= 1 &&
    r.rating <= 4 &&
    Number.isFinite(r.reviewedAt) &&
    typeof r.state === "number" &&
    // state is the going-in ts-fsrs State enum (New=0..Relearning=3), the same
    // closed domain isValidCard range-checks on fsrs.state. summarize() compares
    // it `=== State.Review` for the mature-retention denominator, so an
    // out-of-range value type-checks yet silently skews that stat.
    Number.isInteger(r.state) &&
    r.state >= 0 &&
    r.state <= 3 &&
    Number.isFinite(r.stability) &&
    Number.isFinite(r.difficulty) &&
    Number.isFinite(r.scheduledDays) &&
    // durationMs is time-on-card, summed into the history view's totals; a
    // negative one is finite yet renders as negative time. The live path
    // (performance.now() diff) can't produce it, so this only guards an edited
    // import. `>= 0`, not `> 0`: an instant grade legitimately rounds to 0.
    (r.durationMs == null ||
      (typeof r.durationMs === "number" &&
        Number.isFinite(r.durationMs) &&
        r.durationMs >= 0))
  );
};

const isValidSetting = (s: unknown): boolean =>
  isObject(s) && typeof s.key === "string";

/**
 * Every key the app legitimately stores in the `settings` table. Two owners
 * write here: the learner preferences declared in `DEFAULT_PREFERENCES`, and the
 * per-day new-card counter (`NEW_COUNTER_KEY`, owned by `session.ts`), so the
 * allow-list is their union, *not* `Object.keys(DEFAULT_PREFERENCES)` alone,
 * which would silently drop the live counter on every import. Import filters
 * incoming settings to this set (see `parseBackup`) so a stale/foreign/`__proto__`
 * key can't be persisted and re-exported as cruft. Reads are already key-specific
 * (`getPreferences`' Map lookup, `session.ts`' explicit get), so this is hygiene,
 * not a prototype-pollution guard.
 */
const KNOWN_SETTING_KEYS: ReadonlySet<string> = new Set([
  ...Object.keys(DEFAULT_PREFERENCES),
  NEW_COUNTER_KEY,
]);

/** Parse and validate a backup file, throwing a friendly error if it's wrong. */
export const parseBackup = (json: string): BackupFile => {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    throw new Error("That file isn't valid JSON.");
  }
  if (!data || typeof data !== "object") {
    throw new Error("Unexpected file contents.");
  }
  const candidate = data as Partial<BackupFile>;
  if (candidate.format !== FORMAT) {
    throw new Error("That isn't a Bukvar backup file.");
  }
  // Type-check the version before comparing it, so a missing/non-number value
  // gets a defect-naming message instead of falling through to the `!==` seam
  // below and interpolating a raw `undefined`/`[object Object]` into a string
  // the user sees (BackupControls). With this guard, version is provably a
  // number for both checks that follow.
  if (typeof candidate.version !== "number") {
    throw new Error(
      "This backup is missing its version, so it can't be imported.",
    );
  }
  // Reject backups from a newer Bukvar than this build. We can't honor fields
  // we predate. (Older formats get forward-migrated below; none exist under v1
  // yet; see VERSION.) Splitting newer-vs-older keeps the catch-all `!==` as
  // the seam where that migration lands.
  if (candidate.version > VERSION) {
    throw new Error(
      `This backup is from a newer version of Bukvar (v${candidate.version}). Update the app, then import.`,
    );
  }
  if (candidate.version !== VERSION) {
    throw new Error(`Unsupported backup version: ${candidate.version}.`);
  }
  if (
    !Array.isArray(candidate.cards) ||
    !Array.isArray(candidate.reviews) ||
    !Array.isArray(candidate.settings)
  ) {
    throw new Error("This backup is missing data.");
  }
  // Validate the records, not just the envelope: import *replaces* all device
  // data, so a malformed row caught here is a friendly rejection before any
  // table is cleared, not a raw TypeError or silently-committed corruption.
  if (
    !candidate.cards.every(isValidCard) ||
    !candidate.reviews.every(isValidReview) ||
    !candidate.settings.every(isValidSetting)
  ) {
    throw new Error("This backup is damaged or has unexpected contents.");
  }
  // Reject duplicate cards: `cards.itemId` is the primary key (db.ts), so a
  // hand-edited/merged file with two rows for one itemId would have one silently
  // overwrite the other at `bulkPut`, losing that card's FSRS state with the
  // import still reporting success. Unlike `reviews` (whose colliding surrogate
  // `id` we renumber, since the rows are distinct), two cards sharing an itemId
  // are genuinely ambiguous (same card, conflicting state, no principled merge),
  // so we reject the file rather than pick a winner. Cross-record invariant,
  // so it lives here, not in the per-record `isValidCard`.
  const itemIds = candidate.cards.map((c) => c.itemId);
  if (new Set(itemIds).size !== itemIds.length) {
    throw new Error("This backup has duplicate cards.");
  }
  // Drop settings whose key the app doesn't recognize. Unlike a malformed row
  // (rejected above), an unknown-but-well-formed key is just compat noise (a
  // since-removed pref from an older backup, or junk from a hand-edited file),
  // so we filter rather than fail the whole restore. This keeps stale/foreign
  // keys out of the table (import *replaces* it) and out of future exports.
  return {
    ...candidate,
    settings: candidate.settings.filter((s) => KNOWN_SETTING_KEYS.has(s.key)),
  } as BackupFile;
};

/**
 * Replace all local data with the contents of a parsed backup. The clears and
 * the writes share one `rw` transaction, so a write that fails (e.g. a row that
 * slips past `parseBackup`) aborts and rolls the clears back: a bad import can
 * never half-wipe progress: it either replaces everything or leaves it
 * untouched. `store.test.ts` pins this rollback.
 */
export const importBackup = async (file: BackupFile): Promise<void> => {
  const cards = file.cards.map(reviveCard);
  await db.transaction("rw", db.cards, db.reviews, db.settings, async () => {
    await Promise.all([
      db.cards.clear(),
      db.reviews.clear(),
      db.settings.clear(),
    ]);
    await db.cards.bulkPut(cards);
    // bulkAdd, not bulkPut: review ids are device-local surrogates (see
    // BackupFile.reviews), so let Dexie assign fresh keys. Strip any inline id
    // first: the reviews keyPath is `id`, so a stray one (e.g. from a
    // hand-merged backup) would be honored as a key and could silently overwrite
    // another row; renumbering instead means colliding ids can't lose data.
    await db.reviews.bulkAdd(
      (file.reviews as ReviewRecord[]).map(({ id: _id, ...row }) => row),
    );
    await db.settings.bulkPut(file.settings);
  });
};

/**
 * Wipe every local table back to a clean slate, the same three tables that
 * import/export cover (cards, reviews, settings), just with nothing written
 * back. Since `settings` is cleared too, there's no `onboarded` flag, so the
 * next load re-seeds a fresh corpus and re-runs onboarding: exactly a first
 * install. Irreversible. The UI gates it behind a confirmation and a nudge to
 * export a backup first.
 */
export const resetAllData = async (): Promise<void> => {
  await db.transaction("rw", db.cards, db.reviews, db.settings, async () => {
    await Promise.all([
      db.cards.clear(),
      db.reviews.clear(),
      db.settings.clear(),
    ]);
  });
};
