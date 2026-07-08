import { alphabet } from "~/data/alphabet";

/**
 * Broad phonemic IPA, generated from the spelling.
 *
 * Serbian orthography is near-phonemic ("read as written"), so a per-letter
 * mapping gives a usable broad transcription straight from the Cyrillic. It
 * deliberately omits pitch accent and vowel length (no open source has those
 * cleanly). It's a learner aid, and any entry can override `ipa` by hand.
 */

const phonemeByLetter = new Map<string, string>();
for (const letter of alphabet) {
  phonemeByLetter.set(letter.cyrillicLower, letter.ipa.replace(/\//g, ""));
}

/** Broad phonemic transcription of a Cyrillic word, wrapped in slashes. */
export const toIpa = (cyrillic: string): string => {
  let body = "";
  for (const ch of cyrillic.toLowerCase()) {
    // Pass unmapped characters through unchanged (matching toLatin), so word
    // boundaries (spaces, and a hyphen in a form like `како-тако`) survive
    // into the transcription rather than being silently dropped.
    body += phonemeByLetter.get(ch) ?? ch;
  }
  return `/${body}/`;
};
