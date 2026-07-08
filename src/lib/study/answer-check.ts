import { type Grade, Rating } from "~/lib/srs/scheduler";

/**
 * Answer-checking for the typed (active-recall) review mode. Pure and
 * framework-agnostic (it knows nothing about Svelte, storage, or FSRS state),
 * so the matcher can be unit-tested directly and the reviewer stays view-only.
 *
 * The learner is shown a prompt (a Cyrillic word, or a letter) and types the
 * answer (the English meaning, or the Latin letter). Glosses are authored short
 * and human, so a single gloss can carry several acceptable answers in a few
 * conventional shapes the matcher has to understand:
 *
 *   - synonyms separated by `/`             : "hen / chicken", "sorry / excuse me"
 *   - a parenthetical register/grammar tag  : "well / good (adv.)", "you (singular)"
 *   - a parenthetical clarifier             : "straight (ahead)"  (both forms ok)
 *   - an infinitive marker on verbs         : "to be"  (accept "be" too)
 *
 * `/` is the *only* synonym separator. A comma is ordinary phrase punctuation
 * ("the bill, please" is one phrase, not two synonyms), so it is folded away
 * like any other punctuation rather than split on.
 *
 * Matching is deliberately lenient (this is recall practice, not a spelling
 * test): case-, whitespace-, punctuation-, and diacritic-insensitive, common
 * English contractions are expanded so "what's" and "what is" agree, and a
 * one-character typo is accepted as a *near* miss rather than a hard failure.
 */

/**
 * Common English contractions, expanded to their full form. Applied to both the
 * gloss and the input so "what's your name" and "what is your name" agree.
 * Expansion (rather than just dropping the apostrophe) is required because a
 * contraction and its expansion differ in *word count*, not only punctuation:
 * "what's" → "whats" would still not equal "what is".
 */
export const CONTRACTIONS: Record<string, string> = {
  "i'm": "i am",
  "i've": "i have",
  "i'd": "i would",
  "i'll": "i will",
  "you're": "you are",
  "you've": "you have",
  "you'll": "you will",
  "we're": "we are",
  "we've": "we have",
  "they're": "they are",
  "they've": "they have",
  "he's": "he is",
  "she's": "she is",
  "it's": "it is",
  "that's": "that is",
  "what's": "what is",
  "where's": "where is",
  "who's": "who is",
  "here's": "here is",
  "there's": "there is",
  "let's": "let us",
  "don't": "do not",
  "doesn't": "does not",
  "didn't": "did not",
  "isn't": "is not",
  "aren't": "are not",
  "wasn't": "was not",
  "weren't": "were not",
  "can't": "can not",
  "won't": "will not",
  "couldn't": "could not",
  "wouldn't": "would not",
  "shouldn't": "should not",
  "haven't": "have not",
  "hasn't": "has not",
  "hadn't": "had not",
};

/**
 * Apostrophe-less spellings ("dont", "youre", "whats") are common when typing
 * quickly, and mobile autocorrect doesn't always restore the apostrophe, so the
 * bare form of each contraction is accepted too. The exception is the handful
 * whose apostrophe-less spelling is itself an ordinary English word: the
 * apostrophe is the only thing telling "we're" from "were", "it's" from "its",
 * or "i'll" from "ill", so those stay apostrophe-only rather than silently
 * rewriting a real word to a contraction.
 */
const APOSTROPHE_AMBIGUOUS = new Set([
  "its",
  "were",
  "ill",
  "id",
  "lets",
  "wont",
  "cant",
]);

const EXPANSIONS: Record<string, string> = { ...CONTRACTIONS };
for (const [contraction, expansion] of Object.entries(CONTRACTIONS)) {
  const bare = contraction.replace(/'/g, "");
  if (!APOSTROPHE_AMBIGUOUS.has(bare)) EXPANSIONS[bare] = expansion;
}

const CONTRACTION_RE = new RegExp(
  `\\b(?:${Object.keys(EXPANSIONS).join("|")})\\b`,
  "g",
);

/** Expand any contraction in `s` to its full form (apostrophes already straight). */
const expandContractions = (s: string): string =>
  s.replace(CONTRACTION_RE, (m) => EXPANSIONS[m] ?? m);

/** The verdict for a typed answer, ordered from best to worst. */
export type RecallOutcome = "correct" | "near" | "wrong";

/**
 * Canonical comparison key: lowercase, diacritics folded, contractions expanded,
 * all punctuation reduced to single spaces, and a leading article/infinitive
 * marker stripped. Applied to both the accepted glosses and the learner's input,
 * so "Café"/"cafe "/"café" all collapse together, "be" matches "to be", and
 * "the bill please" matches "the bill, please".
 */
export const normalizeAnswer = (input: string): string => {
  let s = input
    .toLowerCase()
    // Fold diacritics: NFD splits e.g. "é" → "e" + combining accent, "ž" → "z"
    // + combining caron, which we then drop. (Đ/đ have no decomposition and
    // pass through unchanged, so the Ђ letter card, the one prompt whose Latin
    // is non-ASCII, carries accept: ["dj"] in the corpus for the typed digraph.)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    // Normalise curly apostrophes (mobile autocorrect) so contractions match.
    .replace(/[‘’]/g, "'");
  s = expandContractions(s);
  // Fold every run of punctuation/whitespace (internal commas, apostrophes,
  // and "?" included) to one space. Recall practice grades meaning, not
  // punctuation, so "the bill please" and "the bill, please" must agree.
  s = s.replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  // Drop a leading "to " (infinitive) or article so "to be"/"the bill" also
  // match "be"/"bill". Done on both sides, so the stripping stays symmetric.
  s = s.replace(/^(?:to|the|a|an)\s+/u, "");
  return s;
};

const stripParens = (s: string): string => s.replace(/\([^)]*\)/g, " ");

/**
 * The set of normalized strings that count as a correct answer for a gloss.
 * The whole gloss (with parenthetical tags folded into the phrase) and the gloss
 * with those tags removed both count, so a learner can type the full clarified
 * form or just the core meaning, and each `/`-separated synonym is accepted on
 * its own.
 *
 * The synonym split runs on the *paren-stripped* form, because `/` is only a
 * synonym separator at the top level: a slash inside a parenthetical tag
 * ("you (plural / formal)") separates two tags, not two answers, and splitting
 * the raw gloss there would wrongly accept a bare "formal". (The clarified whole
 * form survives `normalizeAnswer` folding the parentheses to spaces, so
 * "straight (ahead)" still accepts both "straight" and "straight ahead".)
 */
export const acceptedAnswers = (gloss: string): Set<string> => {
  const accepted = new Set<string>();
  const add = (s: string): void => {
    const key = normalizeAnswer(s);
    if (key) accepted.add(key);
  };
  add(gloss);
  add(stripParens(gloss));
  for (const part of stripParens(gloss).split("/")) add(part);
  return accepted;
};

const levenshtein = (a: string, b: string): number => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev = curr;
  }
  return prev[b.length];
};

/**
 * Grade a typed answer against a word's gloss (or a letter's Latin form). An
 * exact match (after normalization) is `correct`; a single-character slip on a
 * non-trivial answer is `near`; anything else is `wrong`. The length guard keeps
 * short answers (2-letter words) from being one edit away from an unrelated one.
 *
 * `alternates` are extra accepted answers that aren't shown to the learner (a
 * word's `accept` list: regional synonyms the matcher can't infer); each is
 * folded in through {@link acceptedAnswers}, so it may itself use `/`.
 */
export const checkAnswer = (
  input: string,
  gloss: string,
  alternates: string[] = [],
): RecallOutcome => {
  const key = normalizeAnswer(input);
  if (!key) return "wrong";
  const accepted = acceptedAnswers(gloss);
  for (const alt of alternates) {
    for (const a of acceptedAnswers(alt)) accepted.add(a);
  }
  if (accepted.has(key)) return "correct";
  if (key.length >= 3) {
    for (const candidate of accepted) {
      // Both sides must clear the length bar: a 3-letter input is one edit from
      // a 2-letter answer ("she"→"he", "one"→"on"), so guarding only the input
      // would credit a different short word as a typo (levenshtein is symmetric).
      if (candidate.length >= 3 && levenshtein(key, candidate) <= 1)
        return "near";
    }
  }
  return "wrong";
};

/**
 * Map a typed-answer outcome to an FSRS grade. A clean recall is `Good` (matching
 * the flip mode's default, so neither mode inflates intervals); a typo is `Hard`
 * (knew it, slipped) rather than resetting the card; a miss is `Again`. FSRS
 * still does all the scheduling from there.
 */
export const gradeForOutcome = (outcome: RecallOutcome): Grade =>
  outcome === "correct"
    ? Rating.Good
    : outcome === "near"
      ? Rating.Hard
      : Rating.Again;
