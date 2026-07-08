import { describe, expect, it } from "vitest";
import type { CardRecord, ReviewRecord, SettingRecord } from "~/lib/db/db";
import { type BackupFile, parseBackup, reviveCard } from "./backup";

const validBackup = (): BackupFile => ({
  format: "bukvar-backup",
  version: 1,
  exportedAt: "2026-06-03T00:00:00.000Z",
  cards: [],
  reviews: [],
  settings: [],
});

// A card as it appears in a backup file: dates are ISO strings (post-JSON), not
// Date objects, which is exactly what parseBackup must accept and revive.
const validCard = (): CardRecord =>
  ({
    itemId: "word-x",
    kind: "word",
    addedAt: 0,
    fsrs: {
      due: "2026-01-01T00:00:00.000Z",
      stability: 1,
      difficulty: 1,
      elapsed_days: 0,
      scheduled_days: 0,
      learning_steps: 0,
      reps: 1,
      lapses: 0,
      state: 2,
    },
  }) as unknown as CardRecord;

const validReview = (): ReviewRecord => ({
  id: 1,
  itemId: "word-x",
  rating: 3,
  reviewedAt: 0,
  state: 2,
  stability: 1,
  difficulty: 1,
  scheduledDays: 1,
});

describe("parseBackup", () => {
  it("accepts a valid backup", () => {
    const parsed = parseBackup(JSON.stringify(validBackup()));
    expect(parsed.format).toBe("bukvar-backup");
  });

  it("rejects non-JSON", () => {
    expect(() => parseBackup("{not json")).toThrow(/valid JSON/);
  });

  it("rejects a foreign format", () => {
    const bad = { ...validBackup(), format: "something-else" };
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(/Bukvar backup/);
  });

  it("rejects a backup from a newer Bukvar with an update hint", () => {
    const bad = { ...validBackup(), version: 99 };
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(/newer version/);
  });

  it("rejects an older/unknown version (the forward-migration seam)", () => {
    const bad = { ...validBackup(), version: 0 };
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(
      /Unsupported backup version/,
    );
  });

  it("rejects a missing/non-number version without interpolating a raw value", () => {
    // JSON.stringify drops an `undefined` value, so this also covers the
    // missing-key case; `null` and `"1"` survive and exercise the type guard.
    for (const version of [undefined, null, "1"]) {
      const bad = { ...validBackup(), version };
      expect(() => parseBackup(JSON.stringify(bad))).toThrow(
        /missing its version/,
      );
    }
  });

  it("rejects missing tables", () => {
    const { cards, ...rest } = validBackup();
    expect(() => parseBackup(JSON.stringify(rest))).toThrow(/missing data/);
  });

  it("accepts a backup with populated, well-formed records", () => {
    const full = {
      ...validBackup(),
      cards: [validCard()],
      reviews: [validReview()],
      settings: [{ key: "newPerDay", value: 15 }],
    };
    expect(() => parseBackup(JSON.stringify(full))).not.toThrow();
  });

  it("rejects a card with an unparseable due date", () => {
    const card = {
      ...validCard(),
      fsrs: { ...validCard().fsrs, due: "not a date" },
    } as unknown as CardRecord;
    const bad = { ...validBackup(), cards: [card] };
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(/damaged/);
  });

  it("rejects a card missing its fsrs state", () => {
    const { fsrs, ...cardNoFsrs } = validCard();
    const bad = {
      ...validBackup(),
      cards: [cardNoFsrs as unknown as CardRecord],
    };
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(/damaged/);
  });

  // The scalar core of the fsrs Card (state/stability/difficulty/lapses) is read
  // raw downstream and re-fed into ts-fsrs's next() on the following grade, which
  // does no input validation, so a non-number that slips past here poisons
  // that card's forward scheduling (difficulty/stability) or silently breaks leech
  // detection (lapses). A string `"x"` type-checks as neither number nor a JSON
  // NaN, exercising each guard; a missing field (undefined) does the same.
  it("rejects a card with a non-numeric fsrs scalar", () => {
    for (const field of ["state", "stability", "difficulty", "lapses"]) {
      const card = {
        ...validCard(),
        fsrs: { ...validCard().fsrs, [field]: "x" },
      } as unknown as CardRecord;
      const bad = { ...validBackup(), cards: [card] };
      expect(() => parseBackup(JSON.stringify(bad))).toThrow(/damaged/);
    }
  });

  // JSON has no NaN literal, but `1e999` parses to Infinity, a `number` by typeof
  // that a bare guard would admit and pass downstream unchecked; Number.isFinite
  // is what rejects it. Infinity can't be set on the object (JSON.stringify writes
  // it as null), so inject the raw `1e999` literal into the serialized text via a
  // sentinel that appears nowhere else in a valid backup.
  it("rejects a card with a non-finite fsrs scalar", () => {
    for (const field of ["stability", "difficulty", "lapses", "addedAt"]) {
      const card =
        field === "addedAt"
          ? { ...validCard(), addedAt: 999999 }
          : { ...validCard(), fsrs: { ...validCard().fsrs, [field]: 999999 } };
      const json = JSON.stringify({ ...validBackup(), cards: [card] }).replace(
        "999999",
        "1e999",
      );
      expect(() => parseBackup(json)).toThrow(/damaged/);
    }
  });

  // state is the closed ts-fsrs State enum (New=0..Relearning=3). An out-of-domain
  // number passes the bare `typeof` guard yet, on the next grade, matches no case
  // in next()'s default-less `switch (state)` → undefined → gradeItem's destructure
  // throws inside the rw transaction, leaving the card permanently un-gradeable.
  // `-1`/`4` exercise the range bounds, `1.5` the integer check.
  it("rejects a card with an out-of-range fsrs state", () => {
    for (const state of [-1, 4, 1.5]) {
      const card = {
        ...validCard(),
        fsrs: { ...validCard().fsrs, state },
      } as unknown as CardRecord;
      const bad = { ...validBackup(), cards: [card] };
      expect(() => parseBackup(JSON.stringify(bad))).toThrow(/damaged/);
    }
  });

  // reps is a non-negative integer counter and the new-vs-seen discriminator.
  // -1 drops the card from both queues (reps > 0 and reps === 0 both false),
  // 0.5 misfiles a never-graded card as seen. Mirrors the fsrs.state guard above.
  it("rejects a card with an invalid fsrs reps", () => {
    for (const reps of [-1, 0.5]) {
      const card = {
        ...validCard(),
        fsrs: { ...validCard().fsrs, reps },
      } as unknown as CardRecord;
      const bad = { ...validBackup(), cards: [card] };
      expect(() => parseBackup(JSON.stringify(bad))).toThrow(/damaged/);
    }
  });

  it("rejects a review with a non-numeric rating", () => {
    const bad = {
      ...validBackup(),
      reviews: [{ ...validReview(), rating: "x" } as unknown as ReviewRecord],
    };
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(/damaged/);
  });

  // FSRS ratings are the closed integer 1-4 domain; these out-of-domain values
  // each type-check as a number (passing a bare `typeof` guard) yet poison every
  // recall/lapse metric derived from them. `0`/`5` exercise the range bounds,
  // `1.5` the integer check. (`NaN` can't reach here. JSON has no NaN literal.)
  it("rejects a review with an out-of-range rating", () => {
    for (const rating of [0, 5, 1.5]) {
      const bad = {
        ...validBackup(),
        reviews: [{ ...validReview(), rating } as unknown as ReviewRecord],
      };
      expect(() => parseBackup(JSON.stringify(bad))).toThrow(/damaged/);
    }
  });

  // Review `state` is the closed ts-fsrs State domain (New=0..Relearning=3), the
  // same guard isValidCard applies to fsrs.state. An out-of-domain value passes a
  // bare `typeof` yet skews summarize()'s `=== State.Review` mature-retention
  // tally. `-1`/`4` exercise the range bounds, `1.5` the integer check.
  it("rejects a review with an out-of-range state", () => {
    for (const state of [-1, 4, 1.5]) {
      const bad = {
        ...validBackup(),
        reviews: [{ ...validReview(), state } as unknown as ReviewRecord],
      };
      expect(() => parseBackup(JSON.stringify(bad))).toThrow(/damaged/);
    }
  });

  // Same finiteness hole on the review side: `1e999` parses to Infinity past a
  // bare typeof, so these scalars get the same Number.isFinite guard. Same
  // sentinel-into-serialized-text trick as the card case above.
  it("rejects a review with a non-finite scalar", () => {
    for (const field of [
      "stability",
      "difficulty",
      "scheduledDays",
      "reviewedAt",
      "durationMs",
    ]) {
      const review = { ...validReview(), [field]: 999999 };
      const json = JSON.stringify({
        ...validBackup(),
        reviews: [review],
      }).replace("999999", "1e999");
      expect(() => parseBackup(json)).toThrow(/damaged/);
    }
  });

  // durationMs is summed into the history view's time totals, so a negative
  // (finite, past the isFinite guard) would render as negative time. The live
  // path can't produce it; only an edited import can.
  it("rejects a review with a negative durationMs", () => {
    const bad = {
      ...validBackup(),
      reviews: [
        { ...validReview(), durationMs: -1 } as unknown as ReviewRecord,
      ],
    };
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(/damaged/);
  });

  // `kind` is typed as the closed `CardKind` union, so a foreign value must be
  // rejected at the boundary. Otherwise it's bulkPut into IndexedDB and the
  // `as BackupFile` cast silently lies about the row's type.
  it("rejects a card with an unknown kind", () => {
    const bad = {
      ...validBackup(),
      cards: [{ ...validCard(), kind: "garbage" } as unknown as CardRecord],
    };
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(/damaged/);
  });

  it("rejects a setting with a non-string key", () => {
    const bad = {
      ...validBackup(),
      settings: [{ key: 5, value: 1 } as unknown as SettingRecord],
    };
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(/damaged/);
  });
});

describe("reviveCard", () => {
  const raw = {
    itemId: "word-x",
    kind: "word",
    addedAt: 0,
    fsrs: {
      due: "2026-01-01T00:00:00.000Z",
      last_review: "2025-12-30T00:00:00.000Z",
      stability: 1,
      difficulty: 1,
      elapsed_days: 0,
      scheduled_days: 0,
      learning_steps: 0,
      reps: 1,
      lapses: 0,
      state: 2,
    },
  } as unknown as CardRecord;

  it("revives ISO date strings back into Date objects", () => {
    const revived = reviveCard(raw);
    expect(revived.fsrs.due).toBeInstanceOf(Date);
    expect(revived.fsrs.due.getTime()).toBe(
      Date.parse("2026-01-01T00:00:00.000Z"),
    );
    expect(revived.fsrs.last_review).toBeInstanceOf(Date);
  });

  it("leaves a missing last_review undefined", () => {
    const noReview = {
      ...raw,
      fsrs: { ...raw.fsrs, last_review: undefined },
    } as unknown as CardRecord;
    expect(reviveCard(noReview).fsrs.last_review).toBeUndefined();
  });

  it("revives an epoch-0 last_review rather than dropping it", () => {
    // isValidCard accepts last_review: 0 (isParseableDate(0) is true), so the
    // reviver must turn it into new Date(0), not coerce the falsy 0 to undefined.
    const epoch0 = {
      ...raw,
      fsrs: { ...raw.fsrs, last_review: 0 },
    } as unknown as CardRecord;
    expect(reviveCard(epoch0).fsrs.last_review?.getTime()).toBe(0);
  });
});
