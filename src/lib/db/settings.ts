import type { Script } from "~/lib/content/types";
import { db } from "~/lib/db/db";
import { clampRetention, DEFAULT_REQUEST_RETENTION } from "~/lib/srs/scheduler";

/**
 * How a review card is answered: `flip` reveals the back and the learner
 * self-grades; `type` has the learner type the meaning, which we grade for them
 * (see `lib/study/answer-check.ts`). Both feed the same FSRS scheduler.
 */
export type ReviewMode = "flip" | "type";

/**
 * Learner preferences, persisted in the Dexie `settings` key/value table.
 * Local-first: these never leave the device.
 */
export interface Preferences {
  /** Which script prompts are shown in (letter cards are always Cyrillic). */
  script: Script;
  /** How review cards are answered: flip-and-self-grade, or typed recall. */
  reviewMode: ReviewMode;
  /** Target number of reviews per day, used for the progress ring. */
  dailyGoal: number;
  /** How many never-seen cards to introduce per day (SRS pacing). */
  newPerDay: number;
  /**
   * How many new cards to introduce per *lesson session*, layered over
   * `newPerDay`: the day caps the total, the batch caps a single lesson. Set it
   * to `newPerDay` (or higher) to introduce them all in one lesson.
   */
  batchSize: number;
  /**
   * Desired retention: the recall probability FSRS targets when scheduling each
   * review, the single biggest lever on daily workload. Lower means longer
   * intervals and fewer reviews (at lower recall); higher means the reverse. It
   * applies going forward, card by card, as each is next reviewed; it never
   * reschedules the existing deck in bulk. Clamped to the scheduler's valid range
   * (`MIN_REQUEST_RETENTION`..`MAX_REQUEST_RETENTION`).
   */
  requestRetention: number;
  /** Whether the first-run script choice has been made. */
  onboarded: boolean;
  /**
   * Whether we've offered to move a Latin-prompt learner to Cyrillic once they
   * finished the alphabet. One-shot: the nudge shows at most once, then the
   * learner uses the script toggle as normal.
   */
  cyrillicNudged: boolean;
  /** Epoch ms of the last progress export, or null if never. Drives the backup nudge. */
  lastBackupAt: number | null;
  /** Epoch ms a backup nudge was last dismissed with "Later", or null. */
  backupNudgeSnoozedAt: number | null;
  /** Epoch ms the install nudge was last dismissed, or null. */
  installNudgeSnoozedAt: number | null;
}

export const DEFAULT_PREFERENCES: Preferences = {
  script: "cyrillic",
  reviewMode: "type",
  dailyGoal: 20,
  newPerDay: 15,
  batchSize: 5,
  requestRetention: DEFAULT_REQUEST_RETENTION,
  onboarded: false,
  cyrillicNudged: false,
  lastBackupAt: null,
  backupNudgeSnoozedAt: null,
  installNudgeSnoozedAt: null,
};

/**
 * Bounds for the daily review goal, a divisor in the Reviewer's progress ring
 * (`reviewedToday / dailyGoal`), so a 0 or negative value would yield
 * `NaN`/`Infinity` in the UI. The setter clamps user edits to this band and
 * `getPreferences` re-clamps on read (see `clampOnRead`), so a finite-but-out-
 * of-range value from a hand-edited backup or manual IndexedDB edit can't reach
 * a consumer.
 */
export const MIN_DAILY_GOAL = 1;
export const MAX_DAILY_GOAL = 200;

const clampDailyGoal = (n: number): number =>
  Math.max(MIN_DAILY_GOAL, Math.min(MAX_DAILY_GOAL, n));

/**
 * Per-key read-boundary range clamps. `isStoredType` enforces type/finiteness
 * but not range, so a finite-but-out-of-band value (a hand-edited backup, a
 * manual IndexedDB edit) is pulled back into its valid band at this one read
 * boundary every consumer crosses. `dailyGoal` is the progress-ring divisor
 * above; `requestRetention` is rendered as the retention target in the settings
 * panel, which reads it straight from `getPreferences` and so bypasses the
 * scheduler's own clamp. Without this it would show a target the scheduler
 * isn't pursuing (`getRequestRetention` applies the same clamp on its hot-path
 * read). A key absent here needs no range clamp.
 */
const clampOnRead: Partial<Record<keyof Preferences, (n: number) => number>> = {
  dailyGoal: clampDailyGoal,
  requestRetention: clampRetention,
};

/**
 * Per-key allowed value sets for the closed string domains, the string
 * counterpart of `clampOnRead`: `isStoredType` only proves these are strings,
 * so a foreign value from a hand-edited backup or manual IndexedDB edit would
 * otherwise flow to consumers that dispatch on equality and silently take the
 * wrong branch (`script === "cyrillic"` forcing Latin prompts, `reviewMode ===
 * "type"` falling through to flip). Out-of-domain values fall back to the
 * default instead. A key absent here is not a closed string domain.
 */
const allowedOnRead: Partial<Record<keyof Preferences, ReadonlySet<unknown>>> =
  {
    script: new Set<Script>(["cyrillic", "latin"]),
    reviewMode: new Set<ReviewMode>(["flip", "type"]),
  };

/**
 * Trust a stored value only if it matches the default's type, and, for numeric
 * prefs, only if it's finite. A malformed value (a hand-edited or partly-corrupt
 * import, a manual IndexedDB edit, version drift) then falls back to the default
 * instead of flowing on as, say, a `NaN` `newPerDay`: `NaN` is a `number` by
 * `typeof`, so a type check alone admits it, yet it defeats the downstream
 * `Math.max(0, …)` pacing clamps (NaN passes straight through min/max) and
 * silently zeroes new cards. The three `number | null` prefs default to `null`,
 * for which a finite number is the valid shape (a missing or null value just
 * takes the default). Values are typed `unknown` in the table, so this read is
 * the one place their type is enforced.
 */
const isStoredType = (value: unknown, fallback: unknown): boolean =>
  fallback === null || typeof fallback === "number"
    ? typeof value === "number" && Number.isFinite(value)
    : typeof value === typeof fallback;

export const getPreferences = async (): Promise<Preferences> => {
  const rows = await db.settings.toArray();
  const stored = new Map(rows.map((r) => [r.key, r.value]));
  // Keyed off DEFAULT_PREFERENCES, so a stale key in the table is ignored and a
  // newly added preference only needs its interface entry + default.
  return Object.fromEntries(
    Object.entries(DEFAULT_PREFERENCES).map(([key, fallback]) => {
      const raw = stored.get(key);
      const allowed = allowedOnRead[key as keyof Preferences];
      const value =
        isStoredType(raw, fallback) && (!allowed || allowed.has(raw))
          ? raw
          : fallback;
      // `isStoredType` enforces type/finiteness, not range; range-bound prefs
      // are pulled back into band here so every consumer is protected at this
      // one boundary (see `clampOnRead`).
      const clamp = clampOnRead[key as keyof Preferences];
      return [key, clamp ? clamp(value as number) : value];
    }),
  ) as Preferences;
};

/**
 * Whether first-run onboarding (placement test / script choice) is complete. A
 * single-key read so it stays cheap inside a `liveQuery`, letting the dashboard
 * islands (level pill, forecast) hide themselves until the learner is past
 * onboarding, without coupling to the Reviewer island that owns the flow.
 */
export const isOnboarded = async (): Promise<boolean> => {
  const raw = (await db.settings.get("onboarded"))?.value;
  return isStoredType(raw, DEFAULT_PREFERENCES.onboarded)
    ? (raw as boolean)
    : DEFAULT_PREFERENCES.onboarded;
};

/**
 * The learner's desired retention, as a cheap single-key read for the grading
 * hot path (mirrors {@link isOnboarded}, which exists for the same reason). A
 * non-finite stored value is rejected by `isStoredType` (falling back to the
 * default); a finite but out-of-range one is clamped to the scheduler's band
 * here, so the History view's "you're aiming for X%" can't show a target the
 * scheduler isn't pursuing (the scheduler re-clamps as defence-in-depth). Same
 * read-boundary clamp `dailyGoal` gets in {@link getPreferences}.
 */
export const getRequestRetention = async (): Promise<number> => {
  const raw = (await db.settings.get("requestRetention"))?.value;
  return isStoredType(raw, DEFAULT_PREFERENCES.requestRetention)
    ? clampRetention(raw as number)
    : DEFAULT_PREFERENCES.requestRetention;
};

export const setPreference = async <K extends keyof Preferences>(
  key: K,
  value: Preferences[K],
): Promise<void> => {
  await db.settings.put({ key, value });
};
