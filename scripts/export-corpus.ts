import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { words } from "~/data/words";

/**
 * Exports the whole corpus to `corpus-review.csv` for an at-a-glance review
 * pass. Only the *authored* fields are emitted; the derived `latin`/`ipa`/`id`
 * are left out (a wrong derivation is a central `transliterate`/`ipa` bug, not a
 * corpus-entry mistake, so there's nothing for a corpus reviewer to fix there).
 * `pair`/`examples` show only their authored Cyrillic+English halves, since
 * their Latin is derived 1:1. Run with `yarn corpus:review`.
 */

const csvCell = (s: string) => `"${s.replace(/"/g, '""')}"`;

const rows = [
  "topic,cyrillic,english,pos,gender,aspect,pair,accept,mnemonic,examples",
];
for (const w of words) {
  rows.push(
    [
      w.topic,
      w.cyrillic,
      w.english,
      w.pos ?? "",
      w.gender ?? "",
      w.aspect ?? "",
      w.pair?.cyrillic ?? "",
      w.accept?.join("; ") ?? "",
      w.mnemonic ?? "",
      w.examples?.map((ex) => `${ex.cyrillic} — ${ex.english}`).join(" | ") ??
        "",
    ]
      .map(csvCell)
      .join(","),
  );
}

const out = fileURLToPath(new URL("../corpus-review.csv", import.meta.url));
writeFileSync(out, `${rows.join("\n")}\n`);
console.log(`wrote corpus-review.csv (${words.length} words)`);
