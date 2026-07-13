import { alphabet } from "~/data/alphabet";
import { LEVELS, type Level } from "~/data/levels";
import { words } from "~/data/words";
import type { LetterEntry, Topic, WordEntry } from "~/lib/content/types";
import { buildQuestion, type DrillQuestion } from "~/lib/study/alphabet-drill";
import type { AnswerReview } from "~/lib/study/answer-review";
import { buildOptions, shuffle } from "~/lib/study/drill";

export type { AnswerReview } from "~/lib/study/answer-review";
export { SKIP_LABEL } from "~/lib/study/answer-review";

/**
 * The onboarding placement test (Phase 6): a pure, evidence-based estimate of
 * what a returning/heritage learner already knows, so they skip it instead of
 * grinding through known cards. Two orthogonal axes. They don't predict each
 * other (a heritage speaker reads nothing but knows words; a Russian-reader is
 * the reverse):
 *
 *   - **Script literacy**: can they read Cyrillic? A short letter-recognition
 *     probe over the *discriminating* letters (the "false friends" that look
 *     Latin but sound different, plus a couple of Serbian-unique glyphs). Routes
 *     the `script` preference and, on a pass, seeds the alphabet known.
 *   - **Vocabulary**: probed **section by section**, never by an assumed
 *     difficulty. Each word topic (a curriculum {@link Level}) is sampled with
 *     {@link SECTION_PROBES} words, and a section is marked known *only* if the
 *     learner gets all of them right. There is deliberately no global "frontier":
 *     knowledge isn't monotonic (a learner may know a later topic from a course
 *     but not an earlier one), so every section is judged purely on its own
 *     evidence, and seeding is section-scoped (passing one topic never sweeps in
 *     another, which an earlier frequency-frontier design wrongly did).
 *
 * Everything here is framework-agnostic and RNG-injectable so the sampling and
 * question generators stay unit-testable; the Svelte island
 * (`PlacementTest.svelte`) only renders these and persists the result via the
 * existing seeding primitive (`markKnown` in `lib/study/levels.ts`). The estimate
 * is deliberately *soft*: a falsely-marked item resurfaces on its one confirming
 * review (`knownSeedCard`), so over-marking self-corrects.
 */

// ── Script literacy axis ─────────────────────────────────────────────────────

/**
 * The letters that actually distinguish "reads Cyrillic" from "knows the Latin
 * alphabet": the false friends (В=V, Н=N, Р=R, С=S, У=U, Х=H: Latin look-alikes
 * with different sounds) plus two Serbian-specific glyphs (Њ, Љ). A Latin-only
 * reader misses these; someone who reads Cyrillic does not. Kept short so the
 * axis is ~8 probes, not all 30 letters.
 */
export const SCRIPT_PROBE_CYRILLIC = [
  "В",
  "Н",
  "Р",
  "С",
  "У",
  "Х",
  "Љ",
  "Њ",
] as const;

/** Fraction of script probes that must be correct to count as "reads Cyrillic". */
export const SCRIPT_PASS_RATIO = 0.8;

const letterByCyrillic = new Map<string, LetterEntry>(
  alphabet.map((l) => [l.cyrillic, l]),
);

/**
 * Recognition questions for the script axis: one per discriminating letter (any
 * not found in the corpus is skipped), reusing the alphabet drill's question
 * builder so the format matches the standalone drill. Distractors are drawn from
 * the full azbuka.
 */
export const buildScriptProbes = (
  rng: () => number = Math.random,
): DrillQuestion[] =>
  SCRIPT_PROBE_CYRILLIC.map((c) => letterByCyrillic.get(c))
    .filter((l): l is LetterEntry => Boolean(l))
    .map((l) => buildQuestion(l, alphabet, 4, rng));

/** Whether a script-probe score clears the pass bar (no probes → not a reader). */
export const canReadCyrillic = (correct: number, total: number): boolean =>
  total > 0 && correct / total >= SCRIPT_PASS_RATIO;

// ── Vocabulary axis: per-section probes ──────────────────────────────────────

/** Words sampled from each section. A section is "known" only if all are right. */
export const SECTION_PROBES = 3;
/** Multiple-choice options per vocabulary probe (the gloss plus distractors). */
export const VOCAB_OPTION_COUNT = 4;

/** The word sections to probe, in curriculum order (every level but the alphabet). */
export const PLACEMENT_TOPICS: Topic[] = LEVELS.filter(
  (l) => l.topic !== "alphabet",
).map((l) => l.topic);

/** Corpus words grouped by topic, for sampling and whole-section seeding. */
const wordsByTopic = new Map<Topic, WordEntry[]>();
for (const w of words) {
  const list = wordsByTopic.get(w.topic);
  if (list) list.push(w);
  else wordsByTopic.set(w.topic, [w]);
}

/** One "what does this word mean?" recognition question. */
export interface VocabProbe {
  word: WordEntry;
  /** English glosses, shuffled, including the correct one. */
  options: string[];
  /** The correct English gloss. */
  answer: string;
}

const buildVocabProbe = (
  word: WordEntry,
  pool: WordEntry[],
  rng: () => number,
): VocabProbe => {
  const answer = word.english;
  return {
    word,
    answer,
    options: buildOptions(
      answer,
      [pool],
      (w) => w.english,
      VOCAB_OPTION_COUNT,
      rng,
    ),
  };
};

/**
 * Up to {@link SECTION_PROBES} recognition questions sampled from one section
 * (curriculum {@link Topic}). Distractor glosses are drawn from the whole corpus
 * so a wrong answer is a real confusion, not an in-topic giveaway. Sections are
 * disjoint (a word has exactly one topic), so a probe never repeats across them.
 */
export const buildSectionProbes = (
  topic: Topic,
  rng: () => number = Math.random,
): VocabProbe[] =>
  shuffle(wordsByTopic.get(topic) ?? [], rng)
    .slice(0, SECTION_PROBES)
    .map((w) => buildVocabProbe(w, words, rng));

/** A section counts as known only when every sampled probe was answered right. */
export const sectionPassed = (correct: number, total: number): boolean =>
  total > 0 && correct === total;

// ── Outcomes → seeding & messaging ───────────────────────────────────────────

/** The learner's result for one probed section. */
export interface SectionOutcome {
  topic: Topic;
  /** Ids of this section's probe words answered correctly (direct evidence). */
  correctIds: string[];
  /** Whether every probe was right. Extrapolate to the whole section. */
  passed: boolean;
}

/**
 * Ids to seed known from the vocabulary outcomes: every probe word the learner
 * actually got right (direct evidence), plus (only for sections passed in full)
 * the rest of that section (a deliberate, soft extrapolation; each seeded card
 * still gets its one confirming review). Section-scoped by construction: a passed
 * topic never sweeps in words from another, unlike the old frequency frontier.
 */
export const wordsKnownFromSections = (
  outcomes: SectionOutcome[],
): string[] => {
  const ids = new Set<string>();
  for (const o of outcomes) {
    for (const id of o.correctIds) ids.add(id);
    if (o.passed)
      for (const w of wordsByTopic.get(o.topic) ?? []) ids.add(w.id);
  }
  return [...ids];
};

/**
 * The level the learner starts *learning new material* at, for the "we'll start
 * you around Level N" message. A non-reader starts at the alphabet; otherwise it
 * is the first word section they didn't pass in full (cleared sections are
 * skipped ahead), falling back to the last level if they passed everything.
 */
export const projectedStartLevel = (
  passedTopics: ReadonlySet<Topic>,
  readsCyrillic: boolean,
): Level => {
  if (!readsCyrillic) return LEVELS[0];
  for (const level of LEVELS) {
    if (level.topic === "alphabet") continue;
    if (!passedTopics.has(level.topic)) return level;
  }
  return LEVELS[LEVELS.length - 1];
};

// ── End-of-test review ───────────────────────────────────────────────────────

/** A review row for a script (letter-recognition) probe. */
export const reviewScript = (
  q: DrillQuestion,
  chosen: string,
): AnswerReview => ({
  id: q.letter.id,
  prompt: q.letter.cyrillic,
  chosen,
  correct: q.answer,
  isCorrect: chosen === q.answer,
});

/** A review row for a vocabulary (word-meaning) probe. */
export const reviewVocab = (p: VocabProbe, chosen: string): AnswerReview => ({
  id: p.word.id,
  prompt: p.word.cyrillic,
  promptSub: p.word.latin,
  chosen,
  correct: p.answer,
  isCorrect: chosen === p.answer,
});
