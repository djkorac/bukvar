/**
 * Splits a mostly-English string into runs, flagging which runs are Serbian
 * Cyrillic so a view can wrap them in `lang="sr"` (WCAG 3.1.2 "Language of
 * Parts"; it also drives the Serbian serif + `locl` glyph forms).
 *
 * Used for derived data strings that mix English and inline Cyrillic, mnemonics
 * ("нула ↔ 'null'") and the reviewer's transliteration line, where hand-marking
 * every Serbian run would be ~200 error-prone edits. The whole corpus is
 * Serbian, so any Cyrillic run is unambiguously Serbian: we detect it by script
 * rather than make authors tag it. (Author-controlled *prose* with inline terms
 * uses the explicit backtick `<SrText>`/`<SrTerm>` pattern instead. That can
 * also mark Serbian *Latin* and carry chip styling, which this can't.)
 */
export interface CyrillicSegment {
  text: string;
  /** True when `text` is a Serbian Cyrillic run that must carry `lang="sr"`. */
  sr: boolean;
}

// A maximal run of Cyrillic *letters*. `\p{Script=Cyrillic}` excludes combining
// marks (they're Script=Inherited), but the corpus is precomposed and uses none,
// so a grapheme is never split. (`\p{Script_Extensions=Cyrillic}` would absorb a
// trailing Cyrillic accent but also wrongly claim a standalone Latin/Greek
// combining mark, so it isn't used.) Global so `matchAll` can walk every run;
// `matchAll` uses an internal clone, so reusing this module-level regex is safe.
const CYRILLIC_RUN = /\p{Script=Cyrillic}+/gu;

/**
 * Partition `text` into alternating Cyrillic / non-Cyrillic runs. Concatenating
 * every segment's `text` reproduces the input exactly (no characters dropped or
 * added); an empty string yields `[]`.
 */
export function segmentCyrillic(text: string): CyrillicSegment[] {
  const segments: CyrillicSegment[] = [];
  let cursor = 0;
  for (const match of text.matchAll(CYRILLIC_RUN)) {
    if (match.index > cursor) {
      segments.push({ text: text.slice(cursor, match.index), sr: false });
    }
    segments.push({ text: match[0], sr: true });
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), sr: false });
  }
  return segments;
}
