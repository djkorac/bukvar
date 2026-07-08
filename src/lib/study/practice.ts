import { LEVELS, type Level } from "~/data/levels";
import { words } from "~/data/words";
import { wordsForTopics } from "~/lib/content/corpus";
import type { Topic, WordEntry } from "~/lib/content/types";
import { buildOptions, type Rng, shuffle } from "~/lib/study/drill";

/**
 * SRS-neutral topic practice ("cram"): multiple-choice rounds over the words
 * of chosen topics, for the learner who wants to keep going after the day's
 * queue is done, or to front-load a topic ahead of need (drill `travel`
 * before a trip). Pure generators with an injectable RNG, like the alphabet
 * drill.
 *
 * Deliberately *not* spaced repetition: nothing here reads or writes storage,
 * and the practice flow never grades into FSRS. Cram-interval reps would
 * distort the scheduler's stability/difficulty estimates and pollute the
 * review log that retention stats derive from: the same reason Anki's
 * filtered cram decks default to not rescheduling. Whole
 * topics are drillable regardless of card state, matching the alphabet
 * drill's first-contact role.
 */

export interface PracticeQuestion {
  word: WordEntry;
  /** English glosses, shuffled, including the correct one. */
  options: string[];
  /** The correct English gloss. */
  answer: string;
}

/** Multiple-choice options per question (the gloss plus distractors). */
export const PRACTICE_OPTION_COUNT = 4;

/**
 * Questions per round: a fresh sample each round, so big topics come in
 * finishable bites. Topics at or under the cap get one question per word,
 * like the alphabet drill.
 */
export const PRACTICE_ROUND_SIZE = 20;

/** The drillable levels: every curriculum level except the alphabet, whose
 * letters have their own drill at /alphabet. */
export const PRACTICE_LEVELS: Level[] = LEVELS.filter(
  (l) => l.topic !== "alphabet",
);

const drillableTopics = new Set<Topic>(PRACTICE_LEVELS.map((l) => l.topic));

/**
 * Parse a `?topic=` query value (comma-separated topic ids, e.g.
 * `travel` or `verbs-core,verbs` from the merged landing pages) into known
 * word topics. Unknown ids (and the alphabet) are dropped; null/empty → []
 * (the caller shows the topic picker).
 */
export const parsePracticeTopics = (raw: string | null): Topic[] => {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter((t): t is Topic => drillableTopics.has(t as Topic));
};

/**
 * One question: what does this word mean? Distractor glosses come from the
 * topic pool first (semantically close options are the real workout when
 * cramming one theme), topped up from the whole corpus when the pool runs
 * out of distinct glosses.
 */
export const buildPracticeQuestion = (
  word: WordEntry,
  topicPool: WordEntry[],
  rng: Rng = Math.random,
): PracticeQuestion => ({
  word,
  answer: word.english,
  options: buildOptions(
    word.english,
    [topicPool, words],
    (w) => w.english,
    PRACTICE_OPTION_COUNT,
    rng,
  ),
});

/**
 * A practice round over the given topics: up to {@link PRACTICE_ROUND_SIZE}
 * of their words, sampled without repeats in shuffled order. Empty for no
 * (valid) topics.
 */
export const buildPracticeRound = (
  topics: Topic[],
  rng: Rng = Math.random,
): PracticeQuestion[] => {
  const pool = wordsForTopics(topics);
  return shuffle(pool, rng)
    .slice(0, PRACTICE_ROUND_SIZE)
    .map((word) => buildPracticeQuestion(word, pool, rng));
};
