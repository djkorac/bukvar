<script lang="ts">
import { importBackup, parseBackup, resetAllData } from "~/lib/db/backup";
import { errorMessage } from "~/lib/errors";
import { downloadBackup } from "~/lib/study/backup-reminder";

type Status = { kind: "idle" | "ok" | "error"; message: string };
let status = $state<Status>({ kind: "idle", message: "" });

let fileInput: HTMLInputElement;

async function exportProgress() {
  try {
    await downloadBackup();
    status = { kind: "ok", message: "Backup downloaded." };
  } catch (error) {
    status = { kind: "error", message: errorMessage(error) };
  }
}

async function importProgress(event: Event) {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  input.value = ""; // let the same file be re-selected later
  if (!file) return;
  try {
    const backup = parseBackup(await file.text());
    const confirmed = window.confirm(
      `Import ${backup.cards.length} cards? This replaces the progress currently on this device.`,
    );
    if (!confirmed) return;
    await importBackup(backup);
    status = { kind: "ok", message: "Progress imported. Reload to see it." };
  } catch (error) {
    status = {
      kind: "error",
      message: `Import failed: ${errorMessage(error)}`,
    };
  }
}

async function resetProgress() {
  const confirmed = window.confirm(
    "Reset everything to a clean slate?\n\n" +
      "This permanently erases all progress, review history, and study " +
      "preferences on this device and can't be undone. " +
      "Export a backup first if you might want it back.",
  );
  if (!confirmed) return;
  try {
    await resetAllData();
    // settings is cleared too, so /app re-seeds and re-runs onboarding.
    window.location.href = "/app";
  } catch (error) {
    status = {
      kind: "error",
      message: `Reset failed: ${errorMessage(error)}`,
    };
  }
}
</script>

<div class="flex flex-col gap-4">
  <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
    <button
      type="button"
      onclick={exportProgress}
      class="btn-primary w-full px-5 py-2 text-center sm:w-auto"
    >
      Export progress
    </button>
    <button
      type="button"
      onclick={() => fileInput.click()}
      class="btn-secondary w-full px-5 py-2 text-center sm:w-auto"
    >
      Import progress…
    </button>
    <input
      bind:this={fileInput}
      type="file"
      accept="application/json,.json"
      class="hidden"
      onchange={importProgress}
    />
  </div>

  <!-- Always in the DOM so the live region is announced: role="status" only
       fires reliably when the element pre-exists and its text changes, not when
       element and text mount together. Empty (0-height) while idle. -->
  <p
    class="text-sm {status.kind === 'error' ? 'text-accent' : 'text-fg-muted'}"
    role="status"
  >
    {status.message}
  </p>

  <div class="mt-2 border-t border-border pt-4">
    <button
      type="button"
      onclick={resetProgress}
      class="rounded-lg border border-accent px-5 py-2 font-medium text-accent hover:bg-accent hover:text-on-primary"
    >
      Reset everything
    </button>
    <p class="mt-2 text-xs text-fg-muted">
      Erases all progress, history, and study preferences on this device and
      starts over from a clean slate. This can't be undone, so export a backup
      first if you want to keep it.
    </p>
  </div>
</div>
