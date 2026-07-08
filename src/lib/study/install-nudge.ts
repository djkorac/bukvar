import { getPreferences, setPreference } from "~/lib/db/settings";
import { getFirstActivityAt } from "~/lib/study/activity";
import { DAY_MS } from "~/lib/study/day";

/**
 * Install nudge. On iOS an installed (home-screen) app is the *only* way the
 * learner's IndexedDB survives Safari's 7-day eviction (see `lib/db/persist`),
 * and on every platform installing makes Bukvar open from the home screen and
 * work offline, so once a learner has come back with progress worth keeping, we
 * suggest installing.
 *
 * Like the backup nudge, the timing is a pure function over timestamps (kept
 * testable); *whether* installing is possible and *how* is decided in the view
 * from `lib/pwa/install`. Unlike backup, installing is a one-shot action, so a
 * dismissal is respected for a long stretch rather than on a short repeating clock.
 */

/** Wait this many days past the learner's first study before suggesting install. */
export const INSTALL_NUDGE_DELAY_DAYS = 1;
/** After a dismissal, stay quiet this many days before suggesting again. */
export const INSTALL_NUDGE_SNOOZE_DAYS = 30;

export interface InstallNudgeInput {
  now: number;
  /** When the learner first studied (earliest review), or null if never. */
  firstActivityAt: number | null;
  /** Epoch ms the nudge was last dismissed, or null. */
  snoozedAt: number | null;
}

export interface InstallNudge {
  show: boolean;
}

export const evaluateInstallNudge = ({
  now,
  firstActivityAt,
  snoozedAt,
}: InstallNudgeInput): InstallNudge => {
  // Nothing worth protecting yet: the learner has no study activity on record.
  if (firstActivityAt === null) return { show: false };

  // Hold off until they've stuck with it a little, rather than on first contact.
  if ((now - firstActivityAt) / DAY_MS < INSTALL_NUDGE_DELAY_DAYS)
    return { show: false };

  // Respect a recent dismissal.
  if (
    snoozedAt !== null &&
    (now - snoozedAt) / DAY_MS < INSTALL_NUDGE_SNOOZE_DAYS
  )
    return { show: false };

  return { show: true };
};

/** Read activity + prefs and decide whether to nudge. Thin IndexedDB wrapper. */
export const getInstallNudge = async (
  now: Date = new Date(),
): Promise<InstallNudge> => {
  const [prefs, firstActivityAt] = await Promise.all([
    getPreferences(),
    getFirstActivityAt(),
  ]);
  return evaluateInstallNudge({
    now: now.getTime(),
    firstActivityAt,
    snoozedAt: prefs.installNudgeSnoozedAt,
  });
};

/** Dismiss the install nudge for {@link INSTALL_NUDGE_SNOOZE_DAYS} days. */
export const snoozeInstallNudge = async (
  now: Date = new Date(),
): Promise<void> => {
  await setPreference("installNudgeSnoozedAt", now.getTime());
};
