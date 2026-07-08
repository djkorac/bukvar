import { beforeEach, describe, expect, it } from "vitest";
import { alphabet } from "~/data/alphabet";
import { words } from "~/data/words";
import { levelOf } from "~/lib/content/levels";
import {
  type BackupFile,
  importBackup,
  parseBackup,
  serializeBackup,
} from "~/lib/db/backup";
import { type CardRecord, db } from "~/lib/db/db";
import { seedIfNeeded } from "~/lib/db/seed";
import {
  DEFAULT_PREFERENCES,
  getPreferences,
  getRequestRetention,
  MAX_DAILY_GOAL,
  MIN_DAILY_GOAL,
  setPreference,
} from "~/lib/db/settings";
import {
  MAX_REQUEST_RETENTION,
  MIN_REQUEST_RETENTION,
  Rating,
} from "~/lib/srs/scheduler";
import { dayKey } from "~/lib/study/day";
import { getLeeches } from "~/lib/study/leeches";
import { getLevelProgress, markLevelKnown } from "~/lib/study/levels";
import {
  getDueItems,
  gradeItem,
  NEW_COUNTER_KEY,
  undoGrade,
} from "~/lib/study/session";

/**
 * Integration tests over the real Dexie layer (IndexedDB polyfilled by
 * fake-indexeddb). These cover the browser-only paths that can't be exercised
 * in a headless build: seeding, the new-cards/day cap, the daily counter, and
 * the backup round-trip.
 */

const TOTAL = alphabet.length + words.length;
const now = new Date("2026-06-04T09:00:00");

beforeEach(async () => {
  await Promise.all([
    db.cards.clear(),
    db.reviews.clear(),
    db.settings.clear(),
  ]);
});

describe("seeding", () => {
  it("seeds one card per letter and word", async () => {
    await seedIfNeeded(now);
    expect(await db.cards.count()).toBe(TOTAL);
  });

  it("is idempotent", async () => {
    await seedIfNeeded(now);
    await seedIfNeeded(now);
    expect(await db.cards.count()).toBe(TOTAL);
  });

  // Two first-run callers (two tabs, or a ClientRouter swap mid-seed) can both
  // start before either has written. The rw transaction serializes them, so the
  // loser reads the winner's committed keys and adds nothing, no duplicate
  // inserts and no BulkError. Without the transaction one call rejects.
  it("is safe under concurrent first-run seeding", async () => {
    await Promise.all([seedIfNeeded(now), seedIfNeeded(now)]);
    expect(await db.cards.count()).toBe(TOTAL);
  });
});

describe("due selection with the new-cards/day cap", () => {
  // A non-binding batch keeps these focused on the daily cap, not the per-lesson
  // batch (which has its own describe below).
  const NO_BATCH = 100;

  it("shows only newPerDay cards on a fresh deck, alphabet first", async () => {
    await seedIfNeeded(now);
    await setPreference("batchSize", NO_BATCH);
    const { newPerDay } = await getPreferences();
    const due = await getDueItems("cyrillic", now);
    expect(due.items).toHaveLength(newPerDay);
    expect(due.items[0].id).toBe("letter-a");
    expect(due.lockedNew).toBe(TOTAL - newPerDay);
  });

  it("respects a custom newPerDay", async () => {
    await seedIfNeeded(now);
    await setPreference("batchSize", NO_BATCH);
    await setPreference("newPerDay", 5);
    expect((await getDueItems("cyrillic", now)).items).toHaveLength(5);
  });

  it("consumes the daily allowance as new cards are graded", async () => {
    await seedIfNeeded(now);
    await setPreference("batchSize", NO_BATCH);
    await setPreference("newPerDay", 10);
    const first = await getDueItems("cyrillic", now);
    await gradeItem(first.items[0].id, Rating.Good, now);
    // One new intro used today; the graded card is scheduled ahead, not due now.
    expect((await getDueItems("cyrillic", now)).items).toHaveLength(9);
  });

  it("resets the allowance on the next day", async () => {
    await seedIfNeeded(now);
    await setPreference("batchSize", NO_BATCH);
    await setPreference("newPerDay", 3);
    for (const item of (await getDueItems("cyrillic", now)).items) {
      await gradeItem(item.id, Rating.Good, now);
    }
    expect((await getDueItems("cyrillic", now)).items).toHaveLength(0);

    const tomorrow = new Date("2026-06-05T09:00:00");
    expect(
      (await getDueItems("cyrillic", tomorrow)).items.length,
    ).toBeGreaterThan(0);
  });

  // A malformed daily counter (from a hand-edited backup or a manual IndexedDB
  // edit) must not poison pacing. Settings values are typed `unknown`, so
  // `readCountForToday` validates the shape at the read seam: a non-numeric count
  // reads as "nothing introduced today" (full allowance, a finite `lockedNew`)
  // rather than flowing on as a NaN, and the next grade rewrites it to a clean
  // number instead of letting `count + 1` concatenate a string.
  it("ignores a malformed daily counter and self-corrects on the next grade", async () => {
    await seedIfNeeded(now);
    await setPreference("batchSize", NO_BATCH);
    await setPreference("newPerDay", 10);
    // Today's record, but with junk an `as NewCounter` cast would have trusted.
    await db.settings.put({
      key: NEW_COUNTER_KEY,
      value: { day: dayKey(now), count: "oops" },
    });

    // Read seam: junk counts as 0 introduced, so the full allowance is offered
    // and lockedNew stays a real number (the unguarded path yields 0 items here,
    // with lockedNew NaN).
    const due = await getDueItems("cyrillic", now);
    expect(due.items).toHaveLength(10);
    expect(due.lockedNew).toBe(TOTAL - 10);

    // Write seam: grading one new card rewrites the counter to the number 1, not
    // the string "oops1" that `count + 1` would otherwise have concatenated.
    await gradeItem(due.items[0].id, Rating.Good, now);
    expect((await db.settings.get(NEW_COUNTER_KEY))?.value).toEqual({
      day: dayKey(now),
      count: 1,
    });
  });

  // A negative or fractional count is well-typed and finite, so it slips past a
  // bare `typeof number` check yet is a shape the app never writes (the counter
  // only starts at 0 and increments). Left unguarded, a hand-edited `-50` reads
  // as -50 introduced and inflates `dailyRemaining` (newPerDay + 50), silently
  // loosening the daily cap. `readCountForToday`'s integer + non-negative guard
  // (mirroring isValidCard's `reps` check) makes both read as 0 introduced.
  it("treats a negative or fractional daily counter as nothing introduced", async () => {
    await seedIfNeeded(now);
    await setPreference("batchSize", NO_BATCH);
    await setPreference("newPerDay", 10);

    for (const count of [-50, 4.5]) {
      await db.settings.put({
        key: NEW_COUNTER_KEY,
        value: { day: dayKey(now), count },
      });
      const due = await getDueItems("cyrillic", now);
      // Unguarded: -50 offers 60 items, 4.5 offers 5. Guarded: the full 10.
      expect(due.items).toHaveLength(10);
      expect(due.lockedNew).toBe(TOTAL - 10);
    }
  });
});

describe("lesson batch size (layered over the daily cap)", () => {
  it("caps a lesson at the batch size while the day has room to spare", async () => {
    await seedIfNeeded(now);
    await setPreference("newPerDay", 10);
    await setPreference("batchSize", 3);
    const first = await getDueItems("cyrillic", now);
    expect(first.items).toHaveLength(3);
    expect(first.moreNewToday).toBe(true);
  });

  it("introduces the next batch on reload until the daily cap is reached", async () => {
    await seedIfNeeded(now);
    await setPreference("newPerDay", 5);
    await setPreference("batchSize", 2);

    // Lesson 1: a batch of 2.
    const first = await getDueItems("cyrillic", now);
    expect(first.items).toHaveLength(2);
    for (const item of first.items) await gradeItem(item.id, Rating.Good, now);

    // Lesson 2: the next batch of 2.
    const second = await getDueItems("cyrillic", now);
    expect(second.items).toHaveLength(2);
    for (const item of second.items) await gradeItem(item.id, Rating.Good, now);

    // Lesson 3: only 1 left under the daily cap of 5; the day is now exhausted.
    const third = await getDueItems("cyrillic", now);
    expect(third.items).toHaveLength(1);
    expect(third.moreNewToday).toBe(false);
    await gradeItem(third.items[0].id, Rating.Good, now);

    // Daily cap reached: no more new cards today.
    expect((await getDueItems("cyrillic", now)).items).toHaveLength(0);
  });
});

describe("concurrent grading of one card", () => {
  // A held key or a desktop double-click can fire grade() twice before the first
  // commits. gradeItem reads, schedules, and writes inside one rw transaction, so
  // the second grade of the same card sees the first's committed result and the
  // new-card slot is charged once, not twice off a stale `reps === 0` read. (The
  // island guards this synchronously too; this pins the storage layer on its own.)
  const NO_BATCH = 100;

  it("charges the new-card slot once when the same card is graded twice at once", async () => {
    await seedIfNeeded(now);
    await setPreference("batchSize", NO_BATCH);
    await setPreference("newPerDay", 3);
    const [a] = (await getDueItems("cyrillic", now)).items;

    await Promise.all([
      gradeItem(a.id, Rating.Good, now),
      gradeItem(a.id, Rating.Good, now),
    ]);

    // One intro charged → two of the three daily new cards remain. With the read
    // hoisted outside the transaction both calls see `reps === 0`, charge two
    // intros, and only one new card would be left.
    expect((await getDueItems("cyrillic", now)).items).toHaveLength(2);
  });
});

describe("undoing a grade", () => {
  // FSRS fuzz makes the pre-grade state non-recomputable, so these assert the
  // receipt round-trip restores it bit-for-bit rather than re-deriving it.
  const NO_BATCH = 100;

  it("restores the exact pre-grade card state and deletes the log row", async () => {
    await seedIfNeeded(now);
    const before = await db.cards.get("letter-a");
    const receipt = await gradeItem("letter-a", Rating.Good, now);
    if (!receipt) throw new Error("expected a grade receipt");
    expect(await db.reviews.count()).toBe(1);

    await undoGrade(receipt, now);
    expect(await db.reviews.count()).toBe(0);
    const after = await db.cards.get("letter-a");
    expect(after?.fsrs).toEqual(before?.fsrs);
  });

  it("releases the undone intro's new-card slot for the same day", async () => {
    await seedIfNeeded(now);
    await setPreference("batchSize", NO_BATCH);
    await setPreference("newPerDay", 3);
    const first = await getDueItems("cyrillic", now);
    expect(first.items).toHaveLength(3);

    const receipt = await gradeItem(first.items[0].id, Rating.Good, now);
    if (!receipt) throw new Error("expected a grade receipt");
    expect((await getDueItems("cyrillic", now)).items).toHaveLength(2);

    // Undo returns the card to the queue as a new card, not a spent intro.
    await undoGrade(receipt, now);
    const due = await getDueItems("cyrillic", now);
    expect(due.items).toHaveLength(3);
    expect(due.items.map((i) => i.id)).toContain(first.items[0].id);

    // Regrading spends exactly one slot. The undone intro isn't double-counted.
    await gradeItem(first.items[0].id, Rating.Good, now);
    expect((await getDueItems("cyrillic", now)).items).toHaveLength(2);
  });

  it("unwinds only the last review when a card has history", async () => {
    await seedIfNeeded(now);
    await gradeItem("letter-a", Rating.Good, now);
    const afterFirst = await db.cards.get("letter-a");

    const later = new Date("2026-06-04T18:00:00");
    const receipt = await gradeItem("letter-a", Rating.Again, later);
    if (!receipt) throw new Error("expected a grade receipt");
    expect(await db.reviews.count()).toBe(2);

    await undoGrade(receipt, later);
    expect(await db.reviews.count()).toBe(1);
    const restored = await db.cards.get("letter-a");
    expect(restored?.fsrs).toEqual(afterFirst?.fsrs);
    expect(restored?.fsrs.reps).toBe(1);
  });
});

describe("backup round-trip", () => {
  it("restores cards and reviews, reviving Date fields", async () => {
    await seedIfNeeded(now);
    await gradeItem("letter-a", Rating.Good, now);
    const json = await serializeBackup(now);

    await Promise.all([
      db.cards.clear(),
      db.reviews.clear(),
      db.settings.clear(),
    ]);
    expect(await db.cards.count()).toBe(0);

    await importBackup(parseBackup(json));
    expect(await db.cards.count()).toBe(TOTAL);
    expect(await db.reviews.count()).toBe(1);

    const card = await db.cards.get("letter-a");
    expect(card?.fsrs.reps).toBe(1);
    expect(card?.fsrs.due).toBeInstanceOf(Date);
  });

  // Import is destructive (clear-then-write), and in a no-backend app IndexedDB
  // is the only copy of progress, so a failed import must roll back, never
  // half-wipe. parseBackup would normally reject a key-less card, so we feed
  // importBackup one directly to exercise the transaction's atomicity in
  // isolation: the card revives fine (valid fsrs.due) but then rejects at
  // cards.bulkPut for want of a primary key, after the clears have run.
  it("rolls back rather than wiping when a write fails mid-transaction", async () => {
    await seedIfNeeded(now);
    await gradeItem("letter-a", Rating.Good, now);
    expect(await db.cards.count()).toBe(TOTAL);

    const corrupt: BackupFile = {
      format: "bukvar-backup",
      version: 1,
      exportedAt: now.toISOString(),
      cards: [
        {
          kind: "letter",
          addedAt: 0,
          fsrs: { due: now.toISOString() },
        } as unknown as CardRecord,
      ],
      reviews: [],
      settings: [],
    };

    await expect(importBackup(corrupt)).rejects.toThrow();

    // The pre-existing data survived the aborted transaction untouched.
    expect(await db.cards.count()).toBe(TOTAL);
    expect(await db.reviews.count()).toBe(1);
    expect((await db.cards.get("letter-a"))?.fsrs.reps).toBe(1);
  });

  // Import must not persist setting keys the app doesn't recognize. A stale or
  // hand-edited backup can carry foreign keys (a since-removed pref, junk, or a
  // "__proto__" row); parseBackup filters them to the known-key allow-list so
  // they never reach the table or round-trip into the next export. The two
  // legitimate keys here must survive: a real preference *and* session.ts'
  // "newIntroduced" counter, which a naive Object.keys(DEFAULT_PREFERENCES)
  // filter would wrongly drop.
  it("drops unknown setting keys on import, keeping known ones", async () => {
    const counter = { day: "2026-06-04", count: 3 };
    const file = {
      format: "bukvar-backup",
      version: 1,
      exportedAt: now.toISOString(),
      cards: [],
      reviews: [],
      settings: [
        { key: "script", value: "latin" },
        { key: "newIntroduced", value: counter },
        { key: "stale-removed-pref", value: 42 },
        { key: "__proto__", value: "junk" },
      ],
    };

    // parseBackup is the seam that cleans untrusted input; the foreign keys are
    // gone before importBackup ever writes.
    const parsed = parseBackup(JSON.stringify(file));
    expect(parsed.settings.map((s) => s.key).sort()).toEqual([
      "newIntroduced",
      "script",
    ]);

    await importBackup(parsed);
    expect((await db.settings.toArray()).map((s) => s.key).sort()).toEqual([
      "newIntroduced",
      "script",
    ]);
    expect(await db.settings.get("__proto__")).toBeUndefined();
    // Both known keys are intact and usable downstream.
    expect((await getPreferences()).script).toBe("latin");
    expect((await db.settings.get("newIntroduced"))?.value).toEqual(counter);
  });

  // The cards counterpart to the reviews-collision case below: two rows for one
  // `itemId` (the cards primary key) can't both survive a bulkPut. One silently
  // overwrites the other, losing its FSRS state. Unlike reviews, an itemId is
  // identity, not a discardable surrogate, so parseBackup rejects the file at the
  // boundary rather than renumbering. Pins that we never silently drop a card.
  it("rejects a backup with duplicate card itemIds", () => {
    const card = (itemId: string): CardRecord => ({
      itemId,
      kind: "letter",
      addedAt: 0,
      fsrs: {
        due: now.toISOString(),
        reps: 0,
        state: 0,
        stability: 1,
        difficulty: 5,
        lapses: 0,
      } as unknown as CardRecord["fsrs"],
    });
    const file = {
      format: "bukvar-backup",
      version: 1,
      exportedAt: now.toISOString(),
      cards: [card("letter-a"), card("letter-a")],
      reviews: [],
      settings: [],
    };

    expect(() => parseBackup(JSON.stringify(file))).toThrow(/duplicate/i);
  });

  // A hand-merged backup (two devices' logs concatenated) can carry two distinct
  // reviews colliding on a stale `id`. Import renumbers rather than honoring the
  // inline key, so both rows survive. A bulkPut would have let the second
  // silently overwrite the first. Reviews are id-agnostic on the way in.
  it("renumbers review ids on import, losing no rows to a collision", async () => {
    const review = (id: number, reviewedAt: number) => ({
      id,
      itemId: "letter-a",
      rating: 3,
      reviewedAt,
      state: 0,
      stability: 1,
      difficulty: 5,
      scheduledDays: 1,
    });
    const file = {
      format: "bukvar-backup",
      version: 1,
      exportedAt: now.toISOString(),
      cards: [],
      reviews: [review(1, 1000), review(1, 2000)],
      settings: [],
    };

    await importBackup(parseBackup(JSON.stringify(file)));

    expect(await db.reviews.count()).toBe(2);
    const ids = (await db.reviews.toArray()).map((r) => r.id);
    expect(new Set(ids).size).toBe(2); // freshly assigned, distinct keys
  });
});

describe("leech detection", () => {
  // Bump a seeded card's FSRS counters in place, the same fields a streak of
  // failed reviews would drive, without grinding the card through the scheduler.
  const setLapses = async (
    itemId: string,
    lapses: number,
    stability: number,
  ): Promise<void> => {
    const card = await db.cards.get(itemId);
    if (!card) throw new Error(`no card ${itemId}`);
    await db.cards.update(itemId, {
      fsrs: { ...card.fsrs, lapses, stability },
    });
  };

  it("surfaces a failing card resolved to its corpus entry", async () => {
    await seedIfNeeded(now);
    await setLapses("letter-a", 9, 2);

    const leeches = await getLeeches();
    const hit = leeches.find((l) => l.itemId === "letter-a");
    expect(hit).toBeDefined();
    expect(hit?.lapses).toBe(9);
    // Resolved from the corpus, not left as a bare id.
    expect(hit?.cyrillic).toBeTruthy();
    expect(hit?.gloss).toBeTruthy();
  });

  it("ranks worst-first and drops a card that has since matured", async () => {
    await seedIfNeeded(now);
    await setLapses("letter-a", 9, 2);
    await setLapses("letter-be", 14, 2);
    await setLapses("letter-ve", 20, 40); // high lapses, but now mature

    const ids = (await getLeeches()).map((l) => l.itemId);
    expect(ids).toEqual(["letter-be", "letter-a"]);
    expect(ids).not.toContain("letter-ve");
  });
});

describe("preferences", () => {
  it("round-trips through the settings store", async () => {
    await setPreference("newPerDay", 7);
    await setPreference("script", "latin");
    const prefs = await getPreferences();
    expect(prefs.newPerDay).toBe(7);
    expect(prefs.script).toBe("latin");
  });

  it("falls back to the default when a stored value has the wrong type", async () => {
    // A corrupt import or manual edit could leave a string where a number lives;
    // it must not flow on to NaN the pacing math.
    await db.settings.put({ key: "newPerDay", value: "x" });
    expect((await getPreferences()).newPerDay).toBe(
      DEFAULT_PREFERENCES.newPerDay,
    );
  });

  it("rejects a NaN number so it can't slip past the type check into the pacing math", async () => {
    // NaN is a `number` by typeof, so a type-only guard admits it, yet it
    // defeats the downstream `Math.max(0, …)` clamps (silently zeroing new
    // cards) and the scheduler's retention clamp. Reachable only via a manual
    // IndexedDB edit (JSON can't carry NaN), but the read boundary must reject it.
    await db.settings.put({ key: "newPerDay", value: NaN });
    expect((await getPreferences()).newPerDay).toBe(
      DEFAULT_PREFERENCES.newPerDay,
    );
    await db.settings.put({ key: "requestRetention", value: NaN });
    expect(await getRequestRetention()).toBe(
      DEFAULT_PREFERENCES.requestRetention,
    );
  });

  it("falls back to the default when a closed string domain holds a foreign value", async () => {
    // script/reviewMode consumers dispatch on equality, so an out-of-domain
    // string from a hand-edited backup would silently pick the wrong branch
    // (Latin prompts, flip grading). The read boundary rejects it instead.
    await db.settings.put({ key: "script", value: "glagolitic" });
    await db.settings.put({ key: "reviewMode", value: "osmosis" });
    const prefs = await getPreferences();
    expect(prefs.script).toBe(DEFAULT_PREFERENCES.script);
    expect(prefs.reviewMode).toBe(DEFAULT_PREFERENCES.reviewMode);
  });

  it("clamps an out-of-range dailyGoal on read so it can't NaN the progress ring", async () => {
    // dailyGoal is a divisor in the Reviewer's goal ring; 0 is finite (so it
    // passes the type/finiteness check) but would yield NaN/Infinity. A
    // hand-edited backup can plant it, so the read boundary clamps to the band
    // the setter already enforces.
    await db.settings.put({ key: "dailyGoal", value: 0 });
    expect((await getPreferences()).dailyGoal).toBe(MIN_DAILY_GOAL);
    await db.settings.put({ key: "dailyGoal", value: 9999 });
    expect((await getPreferences()).dailyGoal).toBe(MAX_DAILY_GOAL);
  });

  it("keeps a valid number for a number|null pref but rejects a wrong-typed one", async () => {
    await db.settings.put({ key: "lastBackupAt", value: 123 });
    expect((await getPreferences()).lastBackupAt).toBe(123);
    await db.settings.put({ key: "lastBackupAt", value: "nope" });
    expect((await getPreferences()).lastBackupAt).toBe(
      DEFAULT_PREFERENCES.lastBackupAt,
    );
  });

  it("guards the hot-path requestRetention read too", async () => {
    await db.settings.put({ key: "requestRetention", value: "x" });
    expect(await getRequestRetention()).toBe(
      DEFAULT_PREFERENCES.requestRetention,
    );
  });

  it("clamps an out-of-range requestRetention on read so display can't diverge from the scheduler", async () => {
    // History.svelte shows this as the retention "target"; the scheduler clamps
    // it to its band when scheduling. A finite-but-out-of-band value from a
    // hand-edited backup would otherwise display a target the scheduler isn't
    // pursuing, so the read boundary clamps to the same band (like dailyGoal),
    // on both readers: the hot-path getRequestRetention and the settings-panel
    // getPreferences.
    await db.settings.put({ key: "requestRetention", value: 0.5 });
    expect(await getRequestRetention()).toBe(MIN_REQUEST_RETENTION);
    expect((await getPreferences()).requestRetention).toBe(
      MIN_REQUEST_RETENTION,
    );
    await db.settings.put({ key: "requestRetention", value: 0.99 });
    expect(await getRequestRetention()).toBe(MAX_REQUEST_RETENTION);
    expect((await getPreferences()).requestRetention).toBe(
      MAX_REQUEST_RETENTION,
    );
  });
});

describe("mark level known (seeding primitive)", () => {
  it("promotes a level's new cards to a confirming review that bypasses the new-card cap", async () => {
    await seedIfNeeded(now);
    await setPreference("newPerDay", 0); // no new cards would surface normally

    const promoted = await markLevelKnown("greetings", now);
    expect(promoted).toBeGreaterThan(0);

    // Marked-known cards are dispersed across the coming days (earliest is
    // tomorrow), so nothing surfaces now, and crucially they don't appear as
    // new cards either.
    expect((await getDueItems("cyrillic", now)).items).toHaveLength(0);

    // The confirming review comes due later: the whole level shows up as
    // reviews despite the zero new-card allowance, proving it bypasses pacing.
    const later = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    const dueLater = await getDueItems("cyrillic", later);
    expect(dueLater.items).toHaveLength(promoted);
    expect(
      dueLater.items.every((i) => levelOf(i.id)?.topic === "greetings"),
    ).toBe(true);
  });

  it("leaves studied cards untouched and is a no-op when re-run", async () => {
    await seedIfNeeded(now);
    const first = await markLevelKnown("greetings", now);
    const second = await markLevelKnown("greetings", now);
    expect(first).toBeGreaterThan(0);
    expect(second).toBe(0);
  });

  it("shows the level as fully known in progress afterwards", async () => {
    await seedIfNeeded(now);
    await markLevelKnown("greetings", now);
    const summary = await getLevelProgress();
    const greetings = summary.levels.find((p) => p.level.topic === "greetings");
    expect(greetings?.new).toBe(0);
    expect(greetings?.known).toBe(greetings?.total);
  });
});
