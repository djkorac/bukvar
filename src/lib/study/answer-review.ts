import type { StudyItem } from "~/lib/content/types";
import type { RecallOutcome } from "~/lib/study/answer-check";

/**
 * One answered question, kept for the answer breakdown shown after a graded run.
 * Both the end-of-placement-test scorecard and the end-of-lesson recap render
 * these, so the shape lives here rather than in either feature. A pure view-data
 * record, built from a probe (placement) or a typed card (review), then handed
 * to `AnswerRow.svelte`.
 */
export interface AnswerReview {
  /**
   * Stable id of the underlying entry (card/letter/word). Keys the recap
   * each-blocks: {@link prompt} is a display string and homographs collide
   * (e.g. сто "table" vs сто "hundred"), which duplicate-keys the list.
   */
  id: string;
  /** The prompt as shown: a Cyrillic letter or word. Serbian. */
  prompt: string;
  /** Secondary line under the prompt (a word's Latin form); omitted for letters. */
  promptSub?: string;
  /** What the learner gave: a chosen option, a typed answer, or {@link SKIP_LABEL}. */
  chosen: string;
  /** The correct answer. */
  correct: string;
  /** Whether {@link chosen} counts as correct. */
  isCorrect: boolean;
}

/**
 * The {@link AnswerReview.chosen} value shown when the learner skips ("I don't
 * know this"). Distinct from any answer, so it always scores wrong; in the
 * placement test guessing isn't forced, which keeps the estimate honest.
 */
export const SKIP_LABEL = "Skipped";

/**
 * A recap row for one typed (active-recall) review card, the typed-card sibling
 * of placement's {@link reviewScript}/{@link reviewVocab}. Recorded for the
 * end-of-lesson scorecard in typed mode only; flip mode self-grades, with no
 * objective answer to score. Two non-obvious rules: a near-miss counts as
 * recalled but shows the canonical spelling rather than the learner's typo (so a
 * ✓ row never displays a misspelled word), and an empty answer (an "I don't
 * know" skip) reads as {@link SKIP_LABEL}, as in placement.
 */
export const reviewTyped = (
  item: StudyItem,
  outcome: RecallOutcome,
  answer: string,
): AnswerReview => ({
  id: item.id,
  prompt: item.front,
  promptSub: item.frontSub,
  chosen: outcome === "near" ? item.back : answer.trim() || SKIP_LABEL,
  correct: item.back,
  isCorrect: outcome !== "wrong",
});
