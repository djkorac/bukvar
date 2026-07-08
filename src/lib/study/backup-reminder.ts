import { serializeBackup } from "~/lib/db/backup";
import { getPreferences, setPreference } from "~/lib/db/settings";
import { downloadTextFile } from "~/lib/download";
import { getFirstActivityAt } from "~/lib/study/activity";
import { DAY_MS, dayKey, startOfDay } from "~/lib/study/day";

/**
 * Periodic backup nudge. In a local-first app with no server, an exported file
 * is the only copy of a learner's progress that survives storage eviction, a
 * cleared cache, or a lost device. Persistence (see `lib/db/persist`) only
 * reduces eviction risk best-effort. So once a learner has real progress on the
 * line, we remind them to keep a copy if it's been a while.
 *
 * The decision is a pure function over four timestamps so it stays testable; the
 * thin DB reads/writes that feed it live below.
 */

/** Remind to back up once this many days have passed since the last one. */
export const BACKUP_INTERVAL_DAYS = 30;
/** After a "Later", stay quiet for this many days before asking again. */
export const BACKUP_SNOOZE_DAYS = 7;

export interface BackupReminderInput {
  now: number;
  /** When the learner first studied (earliest review), or null if never. */
  firstActivityAt: number | null;
  lastBackupAt: number | null;
  snoozedAt: number | null;
}

export interface BackupReminder {
  show: boolean;
  /** Whole days since the last backup, or null if never backed up. */
  daysSinceBackup: number | null;
}

export const evaluateBackupReminder = ({
  now,
  firstActivityAt,
  lastBackupAt,
  snoozedAt,
}: BackupReminderInput): BackupReminder => {
  // A local calendar-day delta, not a raw 24h-span floor: snap both instants to
  // their local midnight and divide-and-round, the `day.ts` idiom (DST-tolerant).
  // This is only the human-facing "It's been N days" label; the threshold below
  // stays span-based on purpose.
  const daysSinceBackup =
    lastBackupAt === null
      ? null
      : Math.max(
          0,
          Math.round(
            (startOfDay(new Date(now)).getTime() -
              startOfDay(new Date(lastBackupAt)).getTime()) /
              DAY_MS,
          ),
        );

  // Nothing to protect yet: the learner has no study activity on record.
  if (firstActivityAt === null) return { show: false, daysSinceBackup };

  // The clock runs from the last backup, or (if there's never been one) from
  // when the learner started studying, so a long-time user who's never exported
  // gets nudged too.
  const since = lastBackupAt ?? firstActivityAt;
  if ((now - since) / DAY_MS < BACKUP_INTERVAL_DAYS)
    return { show: false, daysSinceBackup };

  // Respect a recent "Later".
  if (snoozedAt !== null && (now - snoozedAt) / DAY_MS < BACKUP_SNOOZE_DAYS)
    return { show: false, daysSinceBackup };

  return { show: true, daysSinceBackup };
};

/** Read the deck + prefs and decide whether to nudge. Thin IndexedDB wrapper. */
export const getBackupReminder = async (
  now: Date = new Date(),
): Promise<BackupReminder> => {
  const [prefs, firstActivityAt] = await Promise.all([
    getPreferences(),
    getFirstActivityAt(),
  ]);
  return evaluateBackupReminder({
    now: now.getTime(),
    firstActivityAt,
    lastBackupAt: prefs.lastBackupAt,
    snoozedAt: prefs.backupNudgeSnoozedAt,
  });
};

/** Mark that a backup just happened. Resets the nudge clock. */
export const recordBackup = async (now: Date = new Date()): Promise<void> => {
  await setPreference("lastBackupAt", now.getTime());
};

/**
 * Serialize all progress to a download and reset the nudge clock, in one step.
 * The serialize → download → record sequence shared by the Settings export and
 * the backup nudge, so the two can't drift. Throws on failure; the caller
 * decides how to surface it (each view presents errors in its own idiom).
 */
export const downloadBackup = async (now: Date = new Date()): Promise<void> => {
  const json = await serializeBackup(now);
  downloadTextFile(`bukvar-backup-${dayKey(now)}.json`, json);
  await recordBackup(now);
};

/** Dismiss the nudge for {@link BACKUP_SNOOZE_DAYS} days. */
export const snoozeBackupReminder = async (
  now: Date = new Date(),
): Promise<void> => {
  await setPreference("backupNudgeSnoozedAt", now.getTime());
};
