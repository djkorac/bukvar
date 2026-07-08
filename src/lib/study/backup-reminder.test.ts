import { describe, expect, it } from "vitest";
import {
  BACKUP_INTERVAL_DAYS,
  BACKUP_SNOOZE_DAYS,
  evaluateBackupReminder,
} from "~/lib/study/backup-reminder";

const DAY = 86_400_000;
const NOW = new Date("2026-06-07T12:00:00").getTime();
const daysAgo = (n: number) => NOW - n * DAY;

describe("evaluateBackupReminder", () => {
  it("stays quiet when there's no study activity to protect", () => {
    const r = evaluateBackupReminder({
      now: NOW,
      firstActivityAt: null,
      lastBackupAt: null,
      snoozedAt: null,
    });
    expect(r.show).toBe(false);
    expect(r.daysSinceBackup).toBeNull();
  });

  it("stays quiet for a learner who started studying recently", () => {
    const r = evaluateBackupReminder({
      now: NOW,
      firstActivityAt: daysAgo(BACKUP_INTERVAL_DAYS - 1),
      lastBackupAt: null,
      snoozedAt: null,
    });
    expect(r.show).toBe(false);
  });

  it("nudges a long-time learner who has never backed up", () => {
    const r = evaluateBackupReminder({
      now: NOW,
      firstActivityAt: daysAgo(BACKUP_INTERVAL_DAYS + 5),
      lastBackupAt: null,
      snoozedAt: null,
    });
    expect(r.show).toBe(true);
    expect(r.daysSinceBackup).toBeNull();
  });

  it("nudges once a backup is older than the interval", () => {
    const r = evaluateBackupReminder({
      now: NOW,
      firstActivityAt: daysAgo(200),
      lastBackupAt: daysAgo(BACKUP_INTERVAL_DAYS + 3),
      snoozedAt: null,
    });
    expect(r.show).toBe(true);
    expect(r.daysSinceBackup).toBe(BACKUP_INTERVAL_DAYS + 3);
  });

  it("floors days at 0 for a future-dated backup (clock skew)", () => {
    const r = evaluateBackupReminder({
      now: NOW,
      firstActivityAt: daysAgo(200),
      lastBackupAt: daysAgo(-3),
      snoozedAt: null,
    });
    expect(r.daysSinceBackup).toBe(0);
  });

  it("a recent backup resets the clock and silences the nudge", () => {
    const r = evaluateBackupReminder({
      now: NOW,
      firstActivityAt: daysAgo(200),
      lastBackupAt: daysAgo(2),
      snoozedAt: null,
    });
    expect(r.show).toBe(false);
    expect(r.daysSinceBackup).toBe(2);
  });

  it("stays quiet during the snooze window after a 'Later'", () => {
    const r = evaluateBackupReminder({
      now: NOW,
      firstActivityAt: daysAgo(200),
      lastBackupAt: null,
      snoozedAt: daysAgo(BACKUP_SNOOZE_DAYS - 1),
    });
    expect(r.show).toBe(false);
  });

  it("nudges again once the snooze window expires", () => {
    const r = evaluateBackupReminder({
      now: NOW,
      firstActivityAt: daysAgo(200),
      lastBackupAt: null,
      snoozedAt: daysAgo(BACKUP_SNOOZE_DAYS + 1),
    });
    expect(r.show).toBe(true);
  });
});
