/**
 * Content model for Bukvar's learnable material.
 *
 * Everything the learner studies is one of two kinds: a Cyrillic letter or a
 * vocabulary word. Both are authored as plain typed data in `src/data` so the
 * corpus is reviewable and contributable via pull requests, and both normalize
 * into a {@link StudyItem} for the spaced-repetition reviewer.
 *
 * The model is deliberately language-agnostic in shape (script pair + gloss +
 * examples) even though the seed corpus is Serbian, so the same machinery could
 * back other scripts later without a rewrite.
 */

/** Serbian is digraphic; a learner picks which script to read prompts in. */
export type Script = "cyrillic" | "latin";

/**
 * Coarse grouping used to order and theme the curriculum. Authored as a runtime
 * `as const` array so the {@link Topic} union is *derived* from it, the single
 * source of truth. That lets a test assert {@link LEVELS}/{@link PHASES} cover
 * every topic (not just the ones a word happens to use), which a bare type union
 * (invisible at runtime) could not.
 */
export const TOPICS = [
  "alphabet",
  "greetings",
  "phrases",
  "pronouns",
  "people",
  "body",
  "numbers",
  "colours",
  "time",
  "food",
  "home",
  "places",
  "travel",
  "clothing",
  "animals",
  "nature",
  "questions",
  "verbs-core",
  "verbs",
  "adjectives-core",
  "adjectives",
  "directions",
  "grammar",
  "feelings",
  "work",
  "school",
  "money",
  "tech",
  "general",
  "everyday",
] as const;

export type Topic = (typeof TOPICS)[number];

/** A single letter of the Serbian Cyrillic azbuka, paired with its Latin form. */
export interface LetterEntry {
  /** Stable id, e.g. `letter-be`. Used as the SRS card key. */
  id: string;
  /** Position in the azbuka (1-30). */
  order: number;
  cyrillic: string;
  cyrillicLower: string;
  latin: string;
  latinLower: string;
  /**
   * Extra answers the typed reviewer accepts but never displays: the letter
   * equivalent of {@link WordEntry.accept}. Only needed for Ђ, whose Latin "Đ"
   * has no NFD decomposition (so the diacritic fold can't reach it) and is hard
   * to type without the đ key; here it accepts the conventional digraph "dj".
   */
  accept?: string[];
  /** Rough IPA for the letter's sound. */
  ipa: string;
  /** A short Serbian word that uses the letter. The Latin form is derived 1:1
   * via `toLatin` at the point of use, never stored, so it can't drift. */
  example: string;
  exampleEn: string;
  /** Memory hook, especially for letters that look like a Latin letter but
   * sound different (В, Н, Р, С, У, Х …), the classic learner traps. */
  mnemonic?: string;
  /** Note shown under the letter page's italic specimen. Authored only for
   * б г д п т, whose Serbian shapes differ from what most fonts show.
   * Inline Serbian is backtick-marked for `<SrText>`. */
  italicNote?: string;
}

/** An example sentence giving a word real-world context. */
export interface ExampleSentence {
  cyrillic: string;
  latin: string;
  english: string;
}

/**
 * Part of speech. A small closed set rather than a free-form string, so it's
 * type-checked and queryable. Two values gate grammatical fields: `noun`
 * requires `gender`, and `verb` requires `aspect` (and may carry `pair`). These
 * pos↔field invariants are enforced by the corpus tests (`words.test.ts`), not
 * derived in `word()`. The grammatical fields are authored, and `word()` passes
 * them through untouched. The remaining values are descriptive. Function words
 * and the like are simply left untagged.
 */
export type Pos = "noun" | "verb" | "adjective" | "numeral" | "pronoun";

/**
 * A noun's grammatical gender: masculine, feminine, or neuter. Serbian is an
 * agreement language, so the gender is what lets a learner pick the right
 * adjective and case endings; see `grammar/gender.astro`. Authored explicitly
 * on every noun (see `WordSeed.gender`).
 */
export type Gender = "m" | "f" | "n";

/**
 * A verb's grammatical aspect. Serbian verbs are imperfective (an action seen as
 * a process: ongoing, repeated) or perfective (seen as one complete whole), and
 * the choice changes meaning: a perfective's present tense doesn't mean "now".
 * A few verbs are biaspectual (`both`). See `grammar/verbs.astro`. Authored
 * explicitly on every verb. It can't be read off the form (see `WordSeed.aspect`).
 */
export type Aspect = "impf" | "pf" | "both";

/** A verb's aspectual counterpart: the partner of the opposite aspect with the
 * same lexical meaning (e.g. `купити` pf ↔ `куповати` impf). Latin is derived. */
export interface AspectPair {
  cyrillic: string;
  latin: string;
}

/**
 * A vocabulary word. The corpus is ordered by curriculum / introduction
 * position (see `words/index.ts`), not raw frequency.
 */
export interface WordEntry {
  /** Stable id, e.g. `word-zdravo`. Used as the SRS card key. */
  id: string;
  cyrillic: string;
  latin: string;
  /** English gloss / translation. */
  english: string;
  /**
   * Extra answers the typed reviewer accepts but never displays. For genuine
   * lexical synonyms the matcher can't infer: regional variants ("bathroom"
   * for "toilet"), a second sense ("sorry" for "excuse me"), so the shown
   * gloss stays clean while the learner isn't marked wrong for an equally
   * correct word. Each entry is a full acceptable answer (and may itself use
   * the `/` synonym convention). Display the gloss only; match against both.
   */
  accept?: string[];
  ipa?: string;
  topic: Topic;
  /** Lower = introduced earlier (curriculum order; high-utility material is
   * front-loaded). Assigned from curriculum position by the corpus aggregator. */
  rank: number;
  /** Part of speech, when classified. */
  pos?: Pos;
  /** Grammatical gender, set on nouns only (see `WordSeed.gender`). */
  gender?: Gender;
  /** Grammatical aspect, set on verbs only (see `WordSeed.aspect`). */
  aspect?: Aspect;
  /** The aspectual counterpart, on verbs that have a clean one. */
  pair?: AspectPair;
  mnemonic?: string;
  examples?: ExampleSentence[];
}

export type CardKind = "letter" | "word";

/**
 * How a Cyrillic prompt renders: upright, or in true Serbian italics via the
 * serif's `locl` variants (б г д п т change shape). See `.sr-italic` in
 * global.css.
 */
export type GlyphForm = "upright" | "italic";

/**
 * A reviewer-facing item normalized from a letter or word entry. `front` is
 * what the learner is prompted with; `back` is the answer revealed on flip.
 * Both are derived from the chosen {@link Script}, so the same entry can be
 * studied in either direction without duplicating data.
 */
export interface StudyItem {
  id: string;
  kind: CardKind;
  front: string;
  /** Secondary prompt line, e.g. the lowercase glyph for a letter. */
  frontSub?: string;
  back: string;
  /** Extra accepted answers for typed mode, never displayed (words only). */
  accept?: string[];
  /** The word in the other script: a reading aid shown with the headword
   * (words only; a letter's Latin form is its `back`). */
  transliteration?: string;
  /** Broad IPA pronunciation, when known. */
  ipa?: string;
  /** Optional authored memory hook, shown as a tip under the answer. */
  mnemonic?: string;
  /** Part of speech, when known (words only). */
  pos?: Pos;
  /** Grammatical gender, when known (nouns only). */
  gender?: Gender;
  /** Grammatical aspect, when known (verbs only). */
  aspect?: Aspect;
  /** The aspectual counterpart, when known (verbs only). */
  pair?: AspectPair;
  /** Example sentences, when authored (words only). */
  examples?: ExampleSentence[];
  topic: Topic;
  /** Prompt glyph presentation (letter cards only; upright when absent).
   * Mature letters sometimes come up in Serbian italics so the learner also
   * practises the variant shapes. */
  form?: GlyphForm;
}
