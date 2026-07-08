import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { words } from "~/data/words";
import type { WordEntry } from "~/lib/content/types";
import { buildFreqIndex, lookupRank } from "./lib/freq-match";

/**
 * Authoring-time frequency report. Looks each corpus lemma up in the vendored
 * open-source frequency list and prints coverage plus the lemmas that fell back,
 * as a reference while curating the corpus (e.g. deciding which verbs/adjectives
 * are common enough to belong in a "core" level).
 *
 * Frequency is *not* a shipped property: the app reads no per-word rank, so
 * nothing is materialized into `src/data`. This is a read-only lookup over
 * `scripts/vendor/`; run `yarn freq:report` whenever you want the numbers.
 *
 * The corpus is the same typed `words` array the app ships (imported, never
 * re-parsed), so this report and the app can't disagree about what's in it.
 */

const entries: WordEntry[] = [];
const seen = new Set<string>();
for (const e of words) {
  if (seen.has(e.cyrillic)) {
    console.warn(
      `! duplicate Cyrillic lemma "${e.cyrillic}" (topic ${e.topic}) — keeping first`,
    );
    continue;
  }
  seen.add(e.cyrillic);
  entries.push(e);
}

const listPath = fileURLToPath(new URL("./vendor/sr_50k.txt", import.meta.url));
const index = buildFreqIndex(readFileSync(listPath, "utf8").split("\n"));

const matched: WordEntry[] = [];
const fallback: WordEntry[] = [];
for (const e of entries) {
  if (lookupRank(index, e.cyrillic) === null) fallback.push(e);
  else matched.push(e);
}

const pct = ((matched.length / entries.length) * 100).toFixed(1);
console.log(`Coverage: ${matched.length}/${entries.length} matched (${pct}%)`);
if (fallback.length) {
  console.log(`\n${fallback.length} lemma(s) not in the list (rarest band):`);
  for (const e of fallback) console.log(`  ${e.cyrillic} — ${e.english}`);
}
