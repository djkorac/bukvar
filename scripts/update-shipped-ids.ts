import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { alphabet } from "~/data/alphabet";
import { words } from "~/data/words";

/**
 * Regenerates `src/data/shipped-ids.txt`, the append-only record of every
 * seeded-card id (letters + words) that has shipped. Unions the current corpus
 * ids into the existing record; it never drops one, so a run can add newly
 * authored ids but can't silently retire a shipped id (which would orphan a
 * learner's SRS progress, guarded by shipped-ids.test.ts). Run `yarn ids:update`
 * after adding entries. Retiring an id is a deliberate hand-edit of that file
 * paired with a Dexie key migration.
 */

const RECORD = fileURLToPath(
  new URL("../src/data/shipped-ids.txt", import.meta.url),
);

const current = [...alphabet.map((l) => l.id), ...words.map((w) => w.id)];

// No fallback on a failed read: starting from an empty record would rewrite
// the file from the current corpus alone, erasing recorded-but-dropped ids
// and defeating the append-only guard. The file is committed; crash loudly.
const existing = readFileSync(RECORD, "utf8").split("\n").filter(Boolean);

const union = [...new Set([...existing, ...current])].sort();
writeFileSync(RECORD, `${union.join("\n")}\n`);
console.log(
  `wrote shipped-ids.txt (${union.length} ids, +${union.length - existing.length} new)`,
);
