import { describe, expect, it } from "vitest";
import { wordSlug } from "~/lib/content/corpus";
import { toLatin } from "~/lib/content/transliterate";
import { CONTRACTIONS } from "~/lib/study/answer-check";
import { alphabet } from "./alphabet";
import { words } from "./words";

// Every azbuka glyph, both cases: the only letters the corpus may use.
const AZBUKA = new Set(alphabet.flatMap((l) => [l.cyrillic, l.cyrillicLower]));
const LETTER = /\p{L}/u;

// Letters in `s` that aren't azbuka letters. Punctuation, digits, and spaces are
// ignored: example sentences legitimately contain them; we only guard that the
// letters are Serbian. This catches both a Russian э/ы/ъ pasted from a reference
// and the invisible case: an ASCII homoglyph (Latin a/e/o/c/p/x/j for а/е/о/с/р/х/ј)
// that no reviewer can spot by eye, both of which toLatin and toIpa pass through
// unchanged, so the stray glyph survives into the derived forms rather than vanishing.
const strayLetters = (s: string): string[] =>
  [...s].filter((ch) => LETTER.test(ch) && !AZBUKA.has(ch));

describe("words corpus", () => {
  it("has unique ids (no homograph collisions)", () => {
    const ids = words.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("derives a Latin form, IPA, gloss, and slug for every entry", () => {
    for (const w of words) {
      expect(w.latin.length).toBeGreaterThan(0);
      expect(w.ipa, w.id).toMatch(/^\/.+\/$/);
      expect(w.english.length).toBeGreaterThan(0);
      expect(wordSlug(w.id), w.id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("spells every word and example with azbuka letters only", () => {
    for (const w of words) {
      expect(strayLetters(w.cyrillic), w.id).toEqual([]);
      for (const ex of w.examples ?? []) {
        expect(strayLetters(ex.cyrillic), w.id).toEqual([]);
      }
    }
  });

  // The typed reviewer grades against the gloss and its `accept` synonyms. A
  // contraction there that CONTRACTIONS can't expand fails silently: the
  // apostrophe folds to a space ("we'll" -> "we ll"), so a learner typing the
  // correct answer grades wrong and the card resets, and no reviewer catches it
  // in the diff. Possessive "'s" is skipped (the genitive "New Year's" is not a
  // contraction, and the "'s" contractions the matcher expands are all present);
  // example sentences are display-only.
  it("expands every contraction that appears in a graded gloss or accept", () => {
    for (const w of words) {
      for (const target of [w.english, ...(w.accept ?? [])]) {
        for (const [tok] of target
          .toLowerCase()
          .matchAll(/\b[a-z]+'[a-z]+\b/g)) {
          if (tok.endsWith("'s")) continue;
          expect(tok in CONTRACTIONS, `${w.id}: "${tok}"`).toBe(true);
        }
      }
    }
  });

  it("assigns sequential ranks from 1", () => {
    expect(words[0].rank).toBe(1);
    expect(words.at(-1)?.rank).toBe(words.length);
  });

  it("gives every noun a gender, and only nouns a gender", () => {
    for (const w of words) {
      if (w.pos === "noun") {
        expect(w.gender, w.id).toMatch(/^[mfn]$/);
      } else {
        expect(w.gender, w.id).toBeUndefined();
      }
    }
  });

  it("gives every verb an aspect, and only verbs an aspect", () => {
    for (const w of words) {
      if (w.pos === "verb") {
        expect(w.aspect, w.id).toMatch(/^(impf|pf|both)$/);
      } else {
        expect(w.aspect, w.id).toBeUndefined();
      }
    }
  });

  it("pairs aspectual counterparts: verb-only, azbuka-spelled, Latin derived", () => {
    for (const w of words) {
      if (!w.pair) continue;
      expect(w.pos, w.id).toBe("verb");
      // A pair is only meaningful between the two aspects, never on a biaspectual.
      expect(w.aspect, w.id).not.toBe("both");
      expect(strayLetters(w.pair.cyrillic), w.id).toEqual([]);
      expect(w.pair.latin, w.id).toBe(toLatin(w.pair.cyrillic));
    }
  });

  it("pairs never resolve through an ambiguous homograph spelling", () => {
    // [slug].astro links a verb to its aspect partner via getWordByCyrillic,
    // which is keyed on the non-unique `cyrillic` (last entry wins on a
    // homograph like сто numeral/noun). A pair.cyrillic that two headwords
    // share would silently link to whichever loaded last, so require every
    // pair target to be an unambiguous spelling.
    const spellingCount = new Map<string, number>();
    for (const w of words)
      spellingCount.set(w.cyrillic, (spellingCount.get(w.cyrillic) ?? 0) + 1);
    for (const w of words) {
      if (!w.pair) continue;
      // 0 = partner isn't a headword (no link, fine); 1 = unambiguous;
      // ≥2 = getWordByCyrillic would pick the wrong headword.
      expect(spellingCount.get(w.pair.cyrillic) ?? 0, w.id).toBeLessThanOrEqual(
        1,
      );
    }
  });
});
