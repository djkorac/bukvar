import type { GlyphForm, LetterEntry } from "~/lib/content/types";
import { buildOptions, type Rng, shuffle } from "~/lib/study/drill";

/**
 * Recognition-drill generator for the Cyrillic-literacy track: given a Cyrillic
 * glyph, the learner picks its Latin equivalent from several options. This is
 * focused first-contact practice, separate from the spaced-repetition reviewer
 * (which handles long-term retention of the same letters).
 *
 * The letter-specific layer over the shared multiple-choice machinery in
 * `lib/study/drill.ts`.
 */

export interface DrillQuestion {
  letter: LetterEntry;
  /** Latin options, shuffled, including the correct answer. */
  options: string[];
  /** The correct Latin equivalent. */
  answer: string;
  /** How the prompt glyphs render. Some questions come up in Serbian
   * italics, where б г д п т look quite different from their upright forms. */
  form: GlyphForm;
}

/** Fraction of drill prompts rendered in italics. */
export const ITALIC_SHARE = 0.25;

/** One multiple-choice question: the letter's Latin form plus distractors. */
export const buildQuestion = (
  letter: LetterEntry,
  pool: LetterEntry[],
  optionCount = 4,
  rng: Rng = Math.random,
): DrillQuestion => {
  const form: GlyphForm = rng() < ITALIC_SHARE ? "italic" : "upright";
  const answer = letter.latin;
  return {
    letter,
    answer,
    options: buildOptions(answer, [pool], (l) => l.latin, optionCount, rng),
    form,
  };
};

/** A full round: one question per letter, in shuffled order. */
export const buildDrill = (
  letters: LetterEntry[],
  optionCount = 4,
  rng: Rng = Math.random,
): DrillQuestion[] =>
  shuffle(letters, rng).map((l) => buildQuestion(l, letters, optionCount, rng));
