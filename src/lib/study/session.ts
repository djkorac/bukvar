import { alphabet } from "~/data/alphabet";
import { words } from "~/data/words";
import { getLetterById, getWordById } from "~/lib/content/corpus";
import { toLatin } from "~/lib/content/transliterate";
import type {
  CardKind,
  GlyphForm,
  LetterEntry,
  Script,
  StudyItem,
  WordEntry,
} from "~/lib/content/types";
import { db, type SettingRecord } from "~/lib/db/db";
import { getPreferences, getRequestRetention } from "~/lib/db/settings";
import {
  type Card,
  type Grade,
  isDue,
  review,
  State,
} from "~/lib/srs/scheduler";
import { dayKey } from "~/lib/study/day";
import { shuffle } from "~/lib/study/drill";
import { paceNewCards, planQueue } from "~/lib/study/queue-plan";

/**
 * The reviewer's read/write API: turn stored cards into prompts, surface what's
 * due (paced by the daily new-card cap), and persist a grade. Plain async TS
 * over the storage and scheduler layers. The Svelte island calls these.
 */

// Introduction order for never-seen cards: the alphabet first (by azbuka
// order), then words in curriculum order. Keeps new material paced sensibly.
const curriculumOrder = new Map<string, number>();
for (const letter of alphabet) {
  curriculumOrder.set(letter.id, letter.order);
}
for (const w of words) {
  curriculumOrder.set(w.id, 1000 + w.rank);
}
const curriculumIndex = (id: string): number =>
  curriculumOrder.get(id) ?? Number.MAX_SAFE_INTEGER;

const letterToStudyItem = (l: LetterEntry): StudyItem => ({
  id: l.id,
  kind: "letter",
  front: l.cyrillic,
  frontSub: l.cyrillicLower,
  back: l.latin,
  accept: l.accept,
  ipa: l.ipa,
  mnemonic: l.mnemonic,
  // The illustrative word reuses the example-box treatment; its Latin form is
  // derived 1:1 (never stored, so it can't drift), like a word's examples.
  examples: [
    { cyrillic: l.example, latin: toLatin(l.example), english: l.exampleEn },
  ],
  topic: "alphabet",
});

const wordToStudyItem = (w: WordEntry, script: Script): StudyItem => {
  const prompt = script === "cyrillic" ? w.cyrillic : w.latin;
  const other = script === "cyrillic" ? w.latin : w.cyrillic;
  return {
    id: w.id,
    kind: "word",
    front: prompt,
    back: w.english,
    accept: w.accept,
    transliteration: other,
    ipa: w.ipa,
    mnemonic: w.mnemonic,
    pos: w.pos,
    gender: w.gender,
    aspect: w.aspect,
    pair: w.pair,
    examples: w.examples,
    topic: w.topic,
  };
};

/** Fraction of mature letter prompts rendered in true Serbian italics. */
const ITALIC_REVIEW_SHARE = 0.25;

/**
 * Decide a letter card's prompt form. Only graduated cards (FSRS `Review`
 * state) can come up italic, and only some of the time; a learner still
 * learning the upright shape is never quizzed on the variant.
 */
export const letterPromptForm = (
  state: State,
  rng: () => number = Math.random,
): GlyphForm =>
  state === State.Review && rng() < ITALIC_REVIEW_SHARE ? "italic" : "upright";

/** Resolve a stored card's id+kind to a renderable prompt, or null if unknown. */
export const toStudyItem = (
  itemId: string,
  kind: CardKind,
  script: Script,
): StudyItem | null => {
  if (kind === "letter") {
    const l = getLetterById(itemId);
    return l ? letterToStudyItem(l) : null;
  }
  const w = getWordById(itemId);
  return w ? wordToStudyItem(w, script) : null;
};

// ── Daily new-card counter (settings-backed, resets each local day) ──────────

export const NEW_COUNTER_KEY = "newIntroduced";
interface NewCounter {
  day: string;
  count: number;
}

// Validated read of today's intro count. Settings values are typed `unknown`
// and trusted nowhere (mirroring isStoredType for preferences), so a malformed
// shape (a hand-edited backup, a manual IndexedDB edit, a prior day's record)
// falls back to 0 rather than flowing on as a string (which would make the
// `+ 1` below concatenate) or a NaN. A prior day reads as 0 too: yesterday's
// spent allowance no longer constrains today.
const readCountForToday = (
  record: SettingRecord | undefined,
  today: string,
): number => {
  const value = record?.value as Partial<NewCounter> | undefined;
  return typeof value?.count === "number" &&
    Number.isInteger(value.count) &&
    value.count >= 0 &&
    value.day === today
    ? value.count
    : 0;
};

const getNewIntroducedToday = async (now: Date): Promise<number> => {
  const record = await db.settings.get(NEW_COUNTER_KEY);
  return readCountForToday(record, dayKey(now));
};

// Must run inside a rw transaction that includes db.settings.
const bumpNewIntroduced = async (now: Date): Promise<void> => {
  const today = dayKey(now);
  const record = await db.settings.get(NEW_COUNTER_KEY);
  const count = readCountForToday(record, today) + 1;
  await db.settings.put({ key: NEW_COUNTER_KEY, value: { day: today, count } });
};

// Reverse of bumpNewIntroduced, for undoing a first-intro grade. A no-op when
// the counter belongs to another day (an undo straddling midnight releases
// nothing: yesterday's spent allowance no longer constrains today): such a
// record reads as 0 here, short-circuiting the decrement.
// Must run inside a rw transaction that includes db.settings.
const unbumpNewIntroduced = async (now: Date): Promise<void> => {
  const today = dayKey(now);
  const record = await db.settings.get(NEW_COUNTER_KEY);
  const count = readCountForToday(record, today);
  if (count <= 0) return;
  await db.settings.put({
    key: NEW_COUNTER_KEY,
    value: { day: today, count: count - 1 },
  });
};

export interface DueResult {
  items: StudyItem[];
  /** New cards held back for future days because the daily new-card cap is reached. */
  lockedNew: number;
  /** Whether more new cards remain for another lesson today (batch-limited). */
  moreNewToday: boolean;
}

/**
 * Items to study now: all due reviews (shuffled, never capped) plus new cards
 * for this lesson: `min(batchSize, daily remaining)` of them,
 * introduced in curriculum order. A brand-new learner therefore sees one lesson
 * batch of letters, not all 1,004. `lockedNew` is how many new cards are paced
 * for later days; `moreNewToday` flags that more remain for another lesson today,
 * so the reviewer can offer "start another lesson" rather than "all caught up".
 */
export const getDueItems = async (
  script: Script,
  now: Date = new Date(),
): Promise<DueResult> => {
  // One read transaction so the three reads see a single snapshot: a grade
  // committed in another tab between them can't skew the new-card pacing
  // (lockedNew/moreNewToday) against a stale cards count. Matches getProgress
  // and the gradeItem/undoGrade write paths; the Dexie zone propagates into
  // getPreferences/getNewIntroducedToday (both pure db.settings reads), so it
  // needs db.cards + db.settings. Keep the wrap. Don't "simplify" it away.
  const [records, prefs, introduced] = await db.transaction(
    "r",
    db.cards,
    db.settings,
    () =>
      Promise.all([
        db.cards.toArray(),
        getPreferences(),
        getNewIntroducedToday(now),
      ]),
  );
  const byId = new Map(records.map((r) => [r.itemId, r]));

  // Shuffle due reviews so the order tracks neither due time nor card id:
  // interleaving keeps related cards from clustering back-to-back.
  const reviewDue = shuffle(
    records.filter((r) => r.fsrs.reps > 0 && isDue(r.fsrs, now)),
  ).map((r) => r.itemId);

  const newCards = records
    .filter((r) => r.fsrs.reps === 0)
    .sort((a, b) => curriculumIndex(a.itemId) - curriculumIndex(b.itemId))
    .map((r) => r.itemId);

  const pacing = paceNewCards(
    newCards.length,
    introduced,
    prefs.newPerDay,
    prefs.batchSize,
  );
  const ids = planQueue(reviewDue, newCards, pacing.allowance);

  const items: StudyItem[] = [];
  for (const id of ids) {
    const record = byId.get(id);
    if (!record) continue;
    const item = toStudyItem(record.itemId, record.kind, script);
    if (!item) continue;
    if (item.kind === "letter") {
      item.form = letterPromptForm(record.fsrs.state);
    }
    items.push(item);
  }
  return {
    items,
    lockedNew: pacing.lockedNew,
    moreNewToday: pacing.moreNewToday,
  };
};

/**
 * Everything needed to reverse one grade. Held in memory by the reviewer for
 * the session's most recent grade only, never persisted. The pre-grade FSRS
 * state must be snapshotted here because it can't be recomputed afterwards:
 * the scheduler runs with fuzz, so replaying the log diverges.
 */
export interface GradeReceipt {
  itemId: string;
  prevFsrs: Card;
  /** Whether this grade was the card's first intro (it spent a new-card slot). */
  wasNew: boolean;
  /** Primary key of the review-log row this grade appended. */
  reviewId: number;
}

/**
 * Apply a grade: reschedule via FSRS, log it (with the scheduler's own
 * `ReviewLog` metrics and the optional time-on-card), and count first-time
 * intros. `durationMs` is the prompt→grade wall-clock the view measured; it's
 * stored raw and capped only when aggregated, so an idle card can't be undone.
 * Returns the receipt {@link undoGrade} needs, or null for an unknown item.
 */
export const gradeItem = async (
  itemId: string,
  grade: Grade,
  now: Date = new Date(),
  durationMs?: number,
): Promise<GradeReceipt | null> => {
  // Read, schedule, and write inside one rw transaction so the snapshot the
  // grade is computed from can't go stale between read and write. IndexedDB
  // serializes overlapping rw transactions on the same stores, so a second
  // concurrent grade of this card reads this one's committed result instead of
  // racing it, keeping gradeItem correct for any caller, independent of the
  // island's in-flight guard. Every await here is a Dexie op (db.cards,
  // db.settings via getRequestRetention) so the zone holds, and review() is
  // synchronous so it can't trigger an auto-commit mid-transaction.
  return db.transaction("rw", db.cards, db.reviews, db.settings, async () => {
    const record = await db.cards.get(itemId);
    if (!record) return null;

    const wasNew = record.fsrs.reps === 0;
    const { card, log } = review(
      record.fsrs,
      grade,
      now,
      await getRequestRetention(),
    );
    await db.cards.update(itemId, { fsrs: card });
    const reviewId = await db.reviews.add({
      itemId,
      rating: log.rating,
      reviewedAt: now.getTime(),
      state: log.state,
      stability: log.stability,
      difficulty: log.difficulty,
      scheduledDays: log.scheduled_days,
      durationMs,
    });
    if (wasNew) {
      await bumpNewIntroduced(now);
    }
    return {
      itemId,
      prevFsrs: record.fsrs,
      wasNew,
      reviewId,
    };
  });
};

/**
 * Reverse a grade (the misclick escape hatch): restore the pre-grade FSRS
 * snapshot, delete the review-log row, and release the daily new-card slot if
 * the grade was a first intro. Everything downstream (progress, streak,
 * retention stats) heals itself, since it's all derived from the review log.
 */
export const undoGrade = async (
  receipt: GradeReceipt,
  now: Date = new Date(),
): Promise<void> => {
  await db.transaction("rw", db.cards, db.reviews, db.settings, async () => {
    await db.cards.update(receipt.itemId, {
      fsrs: receipt.prevFsrs,
    });
    await db.reviews.delete(receipt.reviewId);
    if (receipt.wasNew) {
      await unbumpNewIntroduced(now);
    }
  });
};
