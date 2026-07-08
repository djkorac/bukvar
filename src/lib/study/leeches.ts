import { getLetterById, getWordById } from "~/lib/content/corpus";
import type { CardKind } from "~/lib/content/types";
import { db } from "~/lib/db/db";

/**
 * Leech detection: the handful of cards a learner keeps failing, surfaced in the
 * history view so they get a second look ("these are fighting you. Here's the
 * memory hook") instead of silently draining time.
 *
 * The signal is FSRS's own per-card `lapses` counter, which increments on
 * exactly `Again`-in-Review-state, the same event Anki uses to flag a leech
 * (default threshold {@link LEECH_LAPSES}). It is already maintained on every
 * card, so this needs no review-log scan: detection is a pure filter over card
 * snapshots ({@link findLeeches}); {@link getLeeches} is the thin IndexedDB
 * wrapper that resolves the survivors to renderable entries, mirroring the
 * pure-core/thin-wrapper split in `forecast.ts`.
 *
 * A card counts as a leech only while it is *still* hard. Lifetime `lapses`
 * never decrements, so without a guard a card fought early but since mastered
 * would haunt the list forever; gating on current stability (a matured card has
 * stability past {@link MATURE_STABILITY_DAYS}) drops those off.
 */

/** Lapses (`Again` while in the Review state) at which a card is flagged. Anki's default. */
export const LEECH_LAPSES = 8;

/**
 * Stability (days) at or above which a card counts as mastered and is no longer
 * a leech. FSRS stability ≈ the interval at which recall sits at the target
 * retention, so this mirrors Anki's "mature card" line (interval ≥ 21 days): a
 * card you can still recall after three weeks isn't fighting you anymore.
 */
export const MATURE_STABILITY_DAYS = 21;

/** Storage-agnostic per-card state the detector needs. Keeps it unit-testable. */
export interface LeechSnapshot {
  itemId: string;
  kind: CardKind;
  /** FSRS lifetime lapse count (`Again` graded while in the Review state). */
  lapses: number;
  /** FSRS memory stability, in days. */
  stability: number;
}

/** A flagged card, before content resolution. */
export interface Leech {
  itemId: string;
  kind: CardKind;
  lapses: number;
}

/** A leech resolved to its corpus entry, ready to render. */
export interface LeechCard extends Leech {
  /** Cyrillic form being learned. Render with `lang="sr"`. */
  cyrillic: string;
  /** What it means: the English gloss for a word, the Latin form for a letter. */
  gloss: string;
  /** Authored memory hook, when the entry has one. */
  mnemonic?: string;
}

/**
 * The cards still fighting the learner, worst-first: at least `threshold`
 * lifetime lapses and not yet matured (stability below `matureStability`). Ties
 * break by id so the order is stable. Pure and storage-agnostic.
 */
export const findLeeches = (
  snapshots: LeechSnapshot[],
  threshold: number = LEECH_LAPSES,
  matureStability: number = MATURE_STABILITY_DAYS,
): Leech[] =>
  snapshots
    .filter((s) => s.lapses >= threshold && s.stability < matureStability)
    .sort((a, b) => b.lapses - a.lapses || a.itemId.localeCompare(b.itemId))
    .map(({ itemId, kind, lapses }) => ({ itemId, kind, lapses }));

/** Resolve a flagged card to its corpus entry, or null if the id is unknown. */
const resolveLeech = (leech: Leech): LeechCard | null => {
  if (leech.kind === "letter") {
    const l = getLetterById(leech.itemId);
    return l
      ? { ...leech, cyrillic: l.cyrillic, gloss: l.latin, mnemonic: l.mnemonic }
      : null;
  }
  const w = getWordById(leech.itemId);
  return w
    ? { ...leech, cyrillic: w.cyrillic, gloss: w.english, mnemonic: w.mnemonic }
    : null;
};

/** Read the deck, detect leeches, and resolve them for display. Thin IndexedDB wrapper. */
export const getLeeches = async (): Promise<LeechCard[]> => {
  const records = await db.cards.toArray();
  const snapshots: LeechSnapshot[] = records.map((r) => ({
    itemId: r.itemId,
    kind: r.kind,
    lapses: r.fsrs.lapses,
    stability: r.fsrs.stability,
  }));
  return findLeeches(snapshots)
    .map(resolveLeech)
    .filter((c): c is LeechCard => c !== null);
};
