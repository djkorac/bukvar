<script lang="ts">
import { onMount } from "svelte";
import Icon from "~/components/Icon.svelte";
import {
  getInstallState,
  type InstallState,
  promptInstall,
} from "~/lib/pwa/install";
import { getInstallNudge, snoozeInstallNudge } from "~/lib/study/install-nudge";

// A dismissible nudge to install the app once the learner has come back to it.
// Renders nothing until due (lib/study/install-nudge) and only where installing
// is actually possible and not already done (lib/pwa/install), so it can sit
// unconditionally at the top of /app beside the backup nudge. On iOS (where
// there's no install API but installing is the only durable storage), it shows
// the Share → Add to Home Screen instruction; on Chromium it's a one-tap button.

let show = $state(false);
let installState = $state<InstallState | null>(null);
let busy = $state(false);

onMount(async () => {
  try {
    // Await the due check first; the Chromium prompt usually lands during that DB
    // read, so reading install state afterwards avoids a mount-time race.
    const nudge = await getInstallNudge();
    const s = getInstallState();
    installState = s;
    if (!nudge.show) return;
    if (s.isStandalone || s.platform === "other") return;
    // Chromium with no deferred prompt has no actionable button. Don't show.
    if (s.platform === "chromium" && !s.canPrompt) return;
    show = true;
  } catch {
    // Best-effort: a failed read just leaves the nudge hidden.
  }
});

async function install() {
  busy = true;
  try {
    const outcome = await promptInstall();
    // The prompt is one-shot: promptInstall() consumed it whatever the outcome,
    // so a non-accepted result would leave a dead button. Treat it as a
    // dismissal (snooze + hide), mirroring InstallControl's self-correction.
    if (outcome === "accepted") show = false;
    else await later();
  } finally {
    busy = false;
  }
}

async function later() {
  // Hide regardless: a dropped snooze write only means the nudge may reappear
  // next session (benign), so it must not block the dismissal or throw from the
  // click handler.
  try {
    await snoozeInstallNudge();
  } catch {
    // benign: best-effort snooze
  } finally {
    show = false;
  }
}
</script>

{#if show && installState}
  <div class="mx-auto mb-6 w-full max-w-xl">
    <div class="nudge">
      <p class="font-semibold text-fg">
        Add Bukvar to your {installState.platform === "ios"
          ? "home screen"
          : "device"}
      </p>
      <p class="text-sm text-fg-muted">
        Installing keeps your progress safe from automatic cleanup and lets
        Bukvar open from your home screen and work offline.
      </p>
      {#if installState.platform === "ios"}
        <p class="text-sm text-fg-muted">
          In Safari, tap
          <Icon
            name="share"
            size={16}
            class="mx-0.5 inline-block translate-y-0.5 text-fg"
          />
          <span class="font-medium text-fg">Share</span>, then
          <span class="font-medium text-fg">Add to Home Screen</span>.
        </p>
        <div class="mt-1">
          <button type="button" onclick={later} class="btn-secondary px-5 py-2">
            Got it
          </button>
        </div>
      {:else}
        <div class="mt-1 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onclick={install}
            disabled={busy}
            class="btn-primary px-5 py-2 disabled:opacity-60"
          >
            {busy ? "Opening…" : "Install Bukvar"}
          </button>
          <button type="button" onclick={later} class="btn-secondary px-5 py-2">
            Later
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}
