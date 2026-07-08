import { beforeEach, describe, expect, it } from "vitest";
import { db } from "~/lib/db/db";
import { dayKey } from "./day";
import { computeStreak, getProgress, longestStreak } from "./progress";

const at = (iso: string) => new Date(iso);
const keysFor = (...isos: string[]) => new Set(isos.map((i) => dayKey(at(i))));

describe("computeStreak", () => {
  const today = at("2026-06-03T10:00:00");

  it("is 0 with no reviews", () => {
    expect(computeStreak(new Set(), today)).toBe(0);
  });

  it("counts today alone as 1", () => {
    expect(computeStreak(keysFor("2026-06-03T08:00:00"), today)).toBe(1);
  });

  it("counts today plus prior consecutive days", () => {
    const days = keysFor(
      "2026-06-03T08:00:00",
      "2026-06-02T08:00:00",
      "2026-06-01T08:00:00",
    );
    expect(computeStreak(days, today)).toBe(3);
  });

  it("stays alive when only yesterday has reviews", () => {
    expect(computeStreak(keysFor("2026-06-02T08:00:00"), today)).toBe(1);
  });

  it("is 0 when neither today nor yesterday has reviews", () => {
    expect(computeStreak(keysFor("2026-06-01T08:00:00"), today)).toBe(0);
  });

  it("stops at a gap", () => {
    const days = keysFor("2026-06-03T08:00:00", "2026-06-01T08:00:00");
    expect(computeStreak(days, today)).toBe(1);
  });
});

describe("longestStreak", () => {
  it("is 0 with no days", () => {
    expect(longestStreak(new Set())).toBe(0);
  });

  it("counts a single day as 1", () => {
    expect(longestStreak(keysFor("2026-06-03T08:00:00"))).toBe(1);
  });

  it("returns the longest run, not the most recent", () => {
    const days = keysFor(
      // a 3-day run…
      "2026-06-01T08:00:00",
      "2026-06-02T08:00:00",
      "2026-06-03T08:00:00",
      // …then a gap and a shorter, more recent 2-day run.
      "2026-06-06T08:00:00",
      "2026-06-07T08:00:00",
    );
    expect(longestStreak(days)).toBe(3);
  });

  it("is order-independent over the day set", () => {
    const days = keysFor(
      "2026-06-07T08:00:00",
      "2026-06-05T08:00:00",
      "2026-06-06T08:00:00",
    );
    expect(longestStreak(days)).toBe(3);
  });
});

// getProgress reads IndexedDB (fake-indexeddb/auto) via the reviewedAt index.
// These exercise the indexed range count and the backward day-probe walk that
// replaced the full-log scan, the parts the pure computeStreak tests can't.
describe("getProgress", () => {
  const today = at("2026-06-03T10:00:00");
  let id = 0;

  const review = (iso: string) =>
    db.reviews.add({
      itemId: `w-${id++}`,
      rating: 3,
      reviewedAt: at(iso).getTime(),
      state: 2,
      stability: 1,
      difficulty: 5,
      scheduledDays: 1,
    });

  beforeEach(() => db.reviews.clear());

  it("is empty with no reviews", async () => {
    expect(await getProgress(today)).toEqual({ reviewedToday: 0, streak: 0 });
  });

  it("counts only today's reviews for reviewedToday", async () => {
    await review("2026-06-03T08:00:00");
    await review("2026-06-03T23:59:59");
    await review("2026-06-02T08:00:00"); // yesterday, excluded from the count
    expect((await getProgress(today)).reviewedToday).toBe(2);
  });

  it("walks back consecutive days for the streak", async () => {
    await review("2026-06-03T08:00:00");
    await review("2026-06-02T08:00:00");
    await review("2026-06-01T08:00:00");
    expect((await getProgress(today)).streak).toBe(3);
  });

  it("stays alive when only yesterday has reviews", async () => {
    await review("2026-06-02T08:00:00");
    expect(await getProgress(today)).toEqual({ reviewedToday: 0, streak: 1 });
  });

  it("stops the streak at a gap", async () => {
    await review("2026-06-03T08:00:00");
    await review("2026-06-01T08:00:00"); // gap on the 2nd
    expect((await getProgress(today)).streak).toBe(1);
  });
});
