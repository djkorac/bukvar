<script lang="ts">
import { onMount } from "svelte";
import Icon from "~/components/Icon.svelte";
import {
  getInstallState,
  type InstallState,
  onInstallChange,
  promptInstall,
} from "~/lib/pwa/install";

// The install affordance for Settings → Your data. Platform-aware because the
// install story differs by engine (see lib/pwa/install): a real one-tap button
// on Chromium, a Share → "Add to Home Screen" instruction on iOS, and nothing
// where there's no affordance worth showing or the app is already installed.
// Owns its own card so an empty state leaves no empty box (cf. StorageStatus).

let installState = $state<InstallState | null>(null);
let busy = $state(false);

function refresh() {
  installState = getInstallState();
}

onMount(() => {
  refresh();
  // The Chromium prompt can arrive after mount; re-read when it does.
  return onInstallChange(refresh);
});

async function install() {
  busy = true;
  try {
    await promptInstall();
    refresh();
  } finally {
    busy = false;
  }
}
</script>

{#if installState && !installState.isStandalone}
  {#if installState.platform === "chromium" && installState.canPrompt}
    <div class="card mt-4 flex flex-col gap-2">
      <button
        type="button"
        onclick={install}
        disabled={busy}
        class="btn-primary self-start px-5 py-2 disabled:opacity-60"
      >
        {busy ? "Opening…" : "Install Bukvar"}
      </button>
      <p class="text-sm text-fg-muted">
        Installs as an app so it opens from your home screen, works offline, and
        keeps your progress safe from automatic cleanup.
      </p>
    </div>
  {:else if installState.platform === "ios"}
    <div class="card mt-4">
      <p class="text-sm text-fg-muted">
        To install on iPhone or iPad, tap
        <Icon
          name="share"
          size={16}
          class="mx-0.5 inline-block translate-y-0.5 text-fg"
        />
        <span class="font-medium text-fg">Share</span> in Safari, then
        <span class="font-medium text-fg">Add to Home Screen</span>. This keeps
        your progress safe from automatic cleanup and lets the app work offline.
      </p>
    </div>
  {/if}
{/if}
