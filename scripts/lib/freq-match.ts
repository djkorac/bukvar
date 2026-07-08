/**
 * Pure matching helpers for the frequency report (`scripts/freq-report.ts`).
 *
 * Kept free of any filesystem/IO and app imports so the matching logic can be
 * unit-tested in isolation (`freq-match.test.ts`). It keeps its own small
 * Cyrillic→Latin table on purpose: this is match *normalization* (fold a lemma
 * to lowercase Serbian Latin so it can be compared against the vendored list),
 * not the shipped 1:1 transliteration in `src/lib/content/transliterate.ts`, and
 * the self-contained table is what lets the matcher be tested without loading
 * the corpus/alphabet. It's covered by its own tests, so it can't silently
 * drift. Nothing here is materialized into `src/data`; it only feeds the report.
 *
 * The vendored list (`scripts/vendor/sr_50k.txt`) is predominantly Serbian
 * Latin, so we normalize our Cyrillic lemmas to lowercase Serbian Latin
 * (diacritics kept, ž/š/č/ć/đ/dž/lj/nj, never ASCII-folded, which would
 * conflate distinct words) and match on that.
 */

/** Lowercase Cyrillic → Serbian Latin. Mirrors src/lib/content/transliterate.ts. */
const latinMap: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  ђ: "đ",
  е: "e",
  ж: "ž",
  з: "z",
  и: "i",
  ј: "j",
  к: "k",
  л: "l",
  љ: "lj",
  м: "m",
  н: "n",
  њ: "nj",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  ћ: "ć",
  у: "u",
  ф: "f",
  х: "h",
  ц: "c",
  ч: "č",
  џ: "dž",
  ш: "š",
};

/** Transliterate a (lowercased) Serbian string to Latin; non-Cyrillic passes through. */
export const toLatin = (s: string): string =>
  [...s].map((c) => latinMap[c] ?? c).join("");

/** Canonical match key: lowercase Serbian Latin. Works on either script. */
export const normalizeLemma = (s: string): string =>
  toLatin(s.toLowerCase()).trim();

/**
 * Build `normalizedForm → frequency rank` from raw `word count` lines. The list
 * is pre-sorted most-frequent-first; each distinct normalized form is ranked
 * 1-based in first-appearance order. Rank counts *distinct* forms, not raw
 * lines: `normalizeLemma` folds Cyrillic spellings onto their Latin twins, and
 * a folded duplicate is skipped without advancing the rank, so duplicates ahead
 * of a form can't inflate its rank. The first (lowest-rank) occurrence wins.
 */
export const buildFreqIndex = (lines: string[]): Map<string, number> => {
  const index = new Map<string, number>();
  let rank = 0;
  for (const line of lines) {
    const form = line.trim().split(/\s+/)[0];
    if (!form) continue;
    const key = normalizeLemma(form);
    if (key && !index.has(key)) {
      rank += 1;
      index.set(key, rank);
    }
  }
  return index;
};

/**
 * Frequency rank for a Cyrillic lemma, or `null` if unfound.
 *
 * Single words match exactly on the normalized form. Multi-word phrases (e.g.
 * "добро јутро") have no single rank, so we proxy to the **rarest** matched
 * constituent (a phrase is gated by its hardest word) and return `null` only
 * if no constituent is found.
 */
export const lookupRank = (
  index: Map<string, number>,
  cyrillic: string,
): number | null => {
  const normalized = normalizeLemma(cyrillic);
  if (!normalized) return null;

  const direct = index.get(normalized);
  if (direct !== undefined) return direct;

  const parts = normalized.split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return null;

  let rarest: number | null = null;
  for (const part of parts) {
    const rank = index.get(part);
    if (rank !== undefined)
      rarest = rarest === null ? rank : Math.max(rarest, rank);
  }
  return rarest;
};
