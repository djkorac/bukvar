<script lang="ts">
import { onMount } from "svelte";
import { errorMessage } from "~/lib/errors";
import {
  downloadBackup,
  getBackupReminder,
  snoozeBackupReminder,
} from "~/lib/study/backup-reminder";

// A dismissible nudge to export a backup once it's been a while. Renders nothing
// until due (see `lib/study/backup-reminder`), so it can sit unconditionally at
// the top of /app. Backing up or snoozing here resets the same clock the
// Settings export does, so the reminder won't double up.

let show = $state(false);
let daysSinceBackup = $state<number | null>(null);
let busy = $state(false);
let error = $state<string | null>(null);

async function refresh() {
  const reminder = await getBackupReminder();
  show = reminder.show;
  daysSinceBackup = reminder.daysSinceBackup;
}

// Best-effort: a failed read (private browsing, eviction) just leaves the
// nudge hidden instead of surfacing an unhandled rejection.
onMount(() => {
  refresh().catch(() => {});
});

async function backUpNow() {
  busy = true;
  error = null;
  try {
    await downloadBackup();
    show = false;
  } catch (e) {
    // Keep the nudge up so the learner can retry, and say what went wrong;
    // a silently-failed backup is the exact way local-first progress is lost.
    error = errorMessage(e);
  } finally {
    busy = false;
  }
}

async function later() {
  // Hide regardless: a dropped snooze write only means the nudge may reappear
  // next session (benign), so it must not block the dismissal or throw from the
  // click handler.
  try {
    await snoozeBackupReminder();
  } catch {
    // benign: best-effort snooze
  } finally {
    show = false;
  }
}
</script>

{#if show}
  <div class="mx-auto mb-6 w-full max-w-xl">
    <div class="nudge">
      <p class="font-semibold text-fg">
        {daysSinceBackup === null
          ? "Back up your progress"
          : `It's been ${daysSinceBackup} days since your last backup`}
      </p>
      <p class="text-sm text-fg-muted">
        Bukvar keeps everything on this device, so a cleared cache or a lost
        device would take your progress with it. Export a copy to keep it safe.
      </p>
      <div class="mt-1 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onclick={backUpNow}
          disabled={busy}
          class="btn-primary px-5 py-2 disabled:opacity-60"
        >
          {busy ? "Backing up…" : "Back up now"}
        </button>
        <button
          type="button"
          onclick={later}
          class="btn-secondary px-5 py-2"
        >
          Later
        </button>
      </div>
      <!-- Kept mounted so role="status" announces the failure: a live region
           only fires reliably when it pre-exists and its text changes. Empty
           (0-height) until a backup fails. -->
      <p class="text-sm text-accent" role="status">
        {error ? `Backup failed: ${error}` : ""}
      </p>
    </div>
  </div>
{/if}
