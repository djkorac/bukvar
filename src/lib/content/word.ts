import { toIpa } from "~/lib/content/ipa";
import { asciiSlug, toLatin } from "~/lib/content/transliterate";
import type {
  Aspect,
  Gender,
  Pos,
  Topic,
  WordEntry,
} from "~/lib/content/types";

/**
 * Authoring shape for an example sentence. As with the word itself, you write
 * only the meaning-bearing Cyrillic + English; the Latin form is derived 1:1 via
 * {@link toLatin} so it can't drift. There's deliberately no Latin override. The
 * transliteration is exact and total, so a wrong result is a bug in `toLatin`
 * (which would affect every word with that letter) to be fixed centrally, never
 * patched per-entry.
 */
export interface ExampleSeed {
  cyrillic: string;
  english: string;
}

/**
 * Authoring helper for the corpus. You hand-write only the meaning-bearing
 * fields (Cyrillic, English, topic); the Latin form, broad IPA, and id are
 * derived correct-by-construction. The lossy/approximate derivations can be
 * overridden when the automatic value needs a human correction (the `slug`
 * collision, an `ipa` accent the rules can't infer); the Latin form can't. It's
 * an exact 1:1 transliteration, so a wrong result is a central `toLatin` bug.
 *
 * `rank` is assigned later by the corpus aggregator, from curriculum position.
 */
export interface WordSeed {
  cyrillic: string;
  english: string;
  topic: Topic;
  /**
   * Extra typed-mode answers to accept without displaying them, for genuine
   * synonyms the matcher can't infer (e.g. `accept: ["sorry"]` on an "excuse
   * me" gloss). See {@link WordEntry.accept}.
   */
  accept?: string[];
  pos?: Pos;
  /**
   * Grammatical gender. Required on nouns (a noun without one fails the corpus
   * test) and meaningless elsewhere. Authored explicitly per entry. Most
   * follow the ending (-а → f, -о/-е → n, consonant → m), but enough buck it
   * (feminine i-stems `ноћ`/`ствар`, masculine `сто`/`посао`, pluralia tantum
   * `врата`/`панталоне`) that it's a fact we state, not one we guess.
   */
  gender?: Gender;
  /**
   * Grammatical aspect. Required on verbs (a verb without one fails the corpus
   * test) and meaningless elsewhere. Always authored. Aspect can't be read off
   * the infinitive (читати→прочитати by prefix, but купити→куповати by stem,
   * рећи↔говорити suppletively).
   */
  aspect?: Aspect;
  /**
   * The verb's aspectual counterpart: the partner infinitive of the opposite
   * aspect with the same meaning (on `купити` pf, `pair: "куповати"`). Write only
   * the Cyrillic; the Latin is derived. Omit for biaspectual verbs, modals, and
   * the few with no clean 1:1 counterpart (ићи, говорити).
   */
  pair?: string;
  /** Override the broad auto IPA (e.g. to add an accent the rules can't infer). */
  ipa?: string;
  /**
   * Override the id slug. Needed only for the rare case where two distinct
   * words fold to the same ASCII slug (e.g. кожа "skin" vs коза "goat").
   */
  slug?: string;
  mnemonic?: string;
  examples?: ExampleSeed[];
}

export const word = (seed: WordSeed): Omit<WordEntry, "rank"> => {
  const latin = toLatin(seed.cyrillic);
  return {
    id: `word-${seed.slug ?? asciiSlug(latin)}`,
    cyrillic: seed.cyrillic,
    latin,
    english: seed.english,
    accept: seed.accept,
    ipa: seed.ipa ?? toIpa(seed.cyrillic),
    topic: seed.topic,
    pos: seed.pos,
    // Grammatical fields carry straight through from the seed; word() only
    // derives, it never sanitizes. The pos↔field invariants (gender on nouns
    // only, aspect/pair on verbs only) are guarded by the corpus tests, which
    // can only do their job if they see the authored data unmodified.
    gender: seed.gender,
    aspect: seed.aspect,
    // The pair's Latin is derived 1:1 so it can't drift.
    pair: seed.pair
      ? { cyrillic: seed.pair, latin: toLatin(seed.pair) }
      : undefined,
    mnemonic: seed.mnemonic,
    examples: seed.examples?.map((ex) => ({
      cyrillic: ex.cyrillic,
      latin: toLatin(ex.cyrillic),
      english: ex.english,
    })),
  };
};
