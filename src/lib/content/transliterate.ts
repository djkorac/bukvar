import { alphabet } from "~/data/alphabet";

/**
 * Cyrillic → Latin transliteration and URL slugs, derived from the azbuka.
 *
 * Serbian Cyrillic → Latin is strictly 1:1 per glyph (Љ→Lj, Њ→Nj, Џ→Dž), so we
 * always author words in Cyrillic and derive the Latin form. It can't drift
 * and there's nothing to hand-maintain. (The reverse direction needs digraph
 * handling and isn't needed by the pipeline, so it's intentionally omitted.)
 */

const latinByCyrillic = new Map<string, string>();
// Capital digraphs (Љ/Њ/Џ) need both a title-case and an all-caps Latin form,
// since the right one depends on context (see toLatin). The all-caps form is
// derived from the authored title-case one, so it can't drift either.
const upperDigraphByCyrillic = new Map<
  string,
  [title: string, upper: string]
>();
for (const letter of alphabet) {
  latinByCyrillic.set(letter.cyrillic, letter.latin);
  latinByCyrillic.set(letter.cyrillicLower, letter.latinLower);
  if (Array.from(letter.latin).length > 1) {
    upperDigraphByCyrillic.set(letter.cyrillic, [
      letter.latin,
      letter.latin.toUpperCase(),
    ]);
  }
}

const isUpperLetter = (ch: string): boolean =>
  ch === ch.toUpperCase() && ch !== ch.toLowerCase();

/**
 * Transliterate a Cyrillic string to Serbian Latin (gajica).
 *
 * A capital digraph is title-case on its own (`Љубав` → `Ljubav`) but all-caps
 * inside an all-caps run (`ЉУБАВ` → `LJUBAV`); which one is right is decided by
 * whether an adjacent letter is uppercase, the standard contextual rule, so a
 * trailing digraph in an all-caps word still works (`КОЊ` → `KONJ`).
 */
export const toLatin = (cyrillic: string): string => {
  const chars = Array.from(cyrillic);
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const digraph = upperDigraphByCyrillic.get(ch);
    if (digraph) {
      const allCaps =
        isUpperLetter(chars[i - 1] ?? "") || isUpperLetter(chars[i + 1] ?? "");
      out += allCaps ? digraph[1] : digraph[0];
    } else {
      out += latinByCyrillic.get(ch) ?? ch;
    }
  }
  return out;
};

// Fold Serbian Latin diacritics to ASCII for stable, clean URL slugs.
const FOLD: Record<string, string> = {
  ž: "z",
  š: "s",
  č: "c",
  ć: "c",
  đ: "dj",
};

/** ASCII slug from a (Serbian) Latin string, e.g. `doviđenja` → `dovidjenja`. */
export const asciiSlug = (latin: string): string =>
  Array.from(latin.toLowerCase(), (c) => FOLD[c] ?? c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
