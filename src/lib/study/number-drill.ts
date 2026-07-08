import { MAX_NUMBER, numberToCyrillic } from "~/lib/content/number-name";
import { toLatin } from "~/lib/content/transliterate";
import { buildOptions, type Rng, shuffle } from "~/lib/study/drill";

/**
 * Recognition drill for *composing* Serbian numbers: a numeral is shown and the
 * learner picks its spoken Cyrillic name. This is the skill the word cards can't
 * teach: седам (7) and седамдесет (70) are separate cards, but седамдесет три →
 * 73 is composition, generated here from {@link numberToCyrillic}.
 *
 * The numbers themselves are generated, not a corpus, so the question shape
 * mirrors the alphabet drill rather than topic practice; the multiple-choice
 * machinery (`buildOptions`/`shuffle`) is shared with both. Like them, every
 * generator takes an injectable `rng` so rounds are unit-testable, and nothing
 * here touches storage or the SRS schedule. It's first-contact practice.
 */

export interface NumberQuestion {
  /** The number to read, shown as digits. */
  value: number;
  /** Cyrillic name options, shuffled, including the answer. */
  options: string[];
  /** The correct Serbian name (Cyrillic). */
  answer: string;
  /** The answer's derived Latin, for the reveal. */
  latin: string;
}

/** Multiple-choice options per question. */
export const NUMBER_OPTION_COUNT = 4;

/** Questions per round: a finishable bite, like the practice round size. */
export const NUMBER_ROUND_SIZE = 12;

/**
 * Difficulty presets for the picker: a ceiling the learner ramps up through,
 * the way most number trainers work. Each names the inclusive maximum.
 */
export const NUMBER_RANGES: { label: string; max: number }[] = [
  { label: "Up to 20", max: 20 },
  { label: "Up to 100", max: 100 },
  { label: "Up to 1,000", max: 1000 },
  { label: "Up to 10,000", max: 10000 },
  { label: "Up to 999,999", max: MAX_NUMBER },
];

// Numbers grouped by digit-length. Sampling a band first, then a number within
// it, spreads a round across magnitudes. Without it, a uniform draw over
// [0, 999999] is ~90% six-digit numbers and never shows the small ones.
const BANDS: [number, number][] = [
  [0, 9],
  [10, 99],
  [100, 999],
  [1000, 9999],
  [10000, 99999],
  [100000, 999999],
];

/** A magnitude-spread random number in [0, max]. */
const randomNumber = (max: number, rng: Rng): number => {
  const bands = BANDS.filter(([lo]) => lo <= max).map(
    ([lo, hi]): [number, number] => [lo, Math.min(hi, max)],
  );
  const [lo, hi] = bands[Math.floor(rng() * bands.length)];
  return lo + Math.floor(rng() * (hi - lo + 1));
};

/**
 * Numbers a learner is likely to confuse with `value`: one component off, or
 * the tens/units swapped (73 ↔ 37). These make the closest distractors; the
 * question tops up from magnitude-matched random numbers when they run short.
 */
const confusables = (value: number, max: number, rng: Rng): number[] => {
  const out = new Set<number>();
  for (const delta of [1, -1, 10, -10, 100, -100, 1000, -1000]) {
    const v = value + delta;
    if (v >= 0 && v <= max) out.add(v);
  }
  if (value >= 10) {
    const ones = value % 10;
    const tens = Math.floor(value / 10) % 10;
    const swapped = value - (tens * 10 + ones) + (ones * 10 + tens);
    if (ones !== tens && swapped <= max) out.add(swapped);
  }
  out.delete(value);
  return shuffle([...out], rng);
};

/**
 * One question: read this numeral. Distractors are confusable numbers first,
 * then magnitude-matched random fillers, so the learner always gets a full set
 * of distinct, plausible options.
 *
 * Precondition: `0 <= value <= max`. Every distractor is `<= max`, so a
 * `value` above it would be the lone out-of-range option: a giveaway, not a
 * crash. `buildNumberRound` guarantees this by drawing `value` from
 * `randomNumber(max)`; the invariant is trusted, not re-validated here.
 */
export const buildNumberQuestion = (
  value: number,
  max: number,
  rng: Rng = Math.random,
): NumberQuestion => {
  const answer = numberToCyrillic(value);
  const near = confusables(value, max, rng).map(numberToCyrillic);
  const filler = Array.from({ length: NUMBER_OPTION_COUNT * 2 }, () =>
    numberToCyrillic(randomNumber(max, rng)),
  );
  return {
    value,
    answer,
    latin: toLatin(answer),
    options: buildOptions(
      answer,
      [near, filler],
      (c) => c,
      NUMBER_OPTION_COUNT,
      rng,
    ),
  };
};

/**
 * A round of {@link NUMBER_ROUND_SIZE} questions over [0, max], with distinct
 * targets. A range smaller than the round (e.g. "up to 20") simply yields as
 * many distinct numbers as it has. The loop is bounded, never spinning.
 */
export const buildNumberRound = (
  max: number = MAX_NUMBER,
  rng: Rng = Math.random,
): NumberQuestion[] => {
  const values = new Set<number>();
  for (
    let tries = 0;
    values.size < NUMBER_ROUND_SIZE && tries < NUMBER_ROUND_SIZE * 20;
    tries++
  ) {
    values.add(randomNumber(max, rng));
  }
  return [...values].map((value) => buildNumberQuestion(value, max, rng));
};
