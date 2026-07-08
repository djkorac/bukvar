import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { alphabet } from "./alphabet";
import { words } from "./words";

/**
 * Append-only guard on the seeded-card keyspace. Each letter and word id is the
 * IndexedDB primary key for that item's SRS state (`lib/db/db.ts`), and seeding
 * matches on it (`lib/db/seed.ts`): renaming a shipped id silently orphans a
 * learner's progress under the old id and reseeds a zero-progress card under the
 * new one. New ids may be added freely; shipped ids are permanent.
 *
 * `shipped-ids.txt` records every id that has shipped. After adding entries,
 * regenerate it with `yarn ids:update` (union-only, so it can't drop an id).
 * Retiring an id is a deliberate hand-edit of that file paired with a Dexie key
 * migration.
 */
describe("shipped id keyspace", () => {
  const current = [...alphabet.map((l) => l.id), ...words.map((w) => w.id)];
  const shipped = readFileSync(
    new URL("./shipped-ids.txt", import.meta.url),
    "utf8",
  )
    .split("\n")
    .filter(Boolean);

  it("never drops or renames a shipped id (append-only)", () => {
    const currentSet = new Set(current);
    const dropped = shipped.filter((id) => !currentSet.has(id));
    expect(
      dropped,
      "shipped ids missing from the corpus: pin the old `slug`, or migrate the Dexie key",
    ).toEqual([]);
  });

  // Without this, an id added but never recorded ships unguarded: renaming it
  // later would pass the drop check above and still orphan progress.
  it("records every current corpus id", () => {
    const shippedSet = new Set(shipped);
    const unrecorded = current.filter((id) => !shippedSet.has(id));
    expect(
      unrecorded,
      "corpus ids not yet in shipped-ids.txt: run `yarn ids:update`",
    ).toEqual([]);
  });
});
