<script lang="ts">
import { onMount } from "svelte";
import Icon from "~/components/Icon.svelte";
import {
  getStorageUsage,
  isStoragePersisted,
  requestPersistentStorage,
} from "~/lib/db/persist";

// Read-only window onto storage durability: is this origin exempt from the
// browser's automatic eviction, and how much space is it using? `persist()` is
// best-effort and can be denied silently, so surfacing the outcome here is what
// makes the request on first run trustworthy rather than invisible.

let loaded = $state(false);
let supported = $state(true);
let persisted = $state(false);
let usage = $state<number | null>(null);
let quota = $state<number | null>(null);
let requesting = $state(false);
// True only after an explicit click that still didn't yield persistence: the
// cue to point at installing the app, the more reliable lever on iOS/Chromium.
let denied = $state(false);

async function refresh() {
  supported = !!globalThis.navigator?.storage?.persisted;
  persisted = await isStoragePersisted();
  const used = await getStorageUsage();
  usage = used?.usage ?? null;
  quota = used?.quota ?? null;
  loaded = true;
}

onMount(refresh);

async function enableProtection() {
  requesting = true;
  const granted = await requestPersistentStorage();
  requesting = false;
  denied = !granted;
  await refresh();
}

// Coarse, human-readable size. These are browser estimates, not exact counts,
// so one significant decimal past KB is plenty.
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(1)} GB`;
}
</script>

{#if loaded && supported}
  <div class="card mt-4 flex flex-col gap-3">
    <div class="flex items-start gap-3">
      <span
        class="mt-0.5 {persisted ? 'text-primary' : 'text-fg-muted'}"
        aria-hidden="true"
      >
        <Icon name={persisted ? "check" : "x"} size={20} />
      </span>
      <div class="flex flex-col gap-1">
        <p class="font-medium">
          {persisted
            ? "Protected from automatic cleanup"
            : "Not protected from automatic cleanup"}
        </p>
        <p class="text-sm text-fg-muted">
          {#if persisted}
            Your browser won't evict this app's data to reclaim space.
          {:else}
            The browser may clear your progress to free space, or after a stretch
            of not opening the app. Turn on protection to prevent that.
          {/if}
        </p>
      </div>
    </div>

    {#if usage !== null}
      <p class="text-sm text-fg-muted">
        Using {formatBytes(usage)}{quota ? ` of ${formatBytes(quota)} available` : ""}
        on this device.
      </p>
    {/if}

    {#if !persisted}
      <div class="flex flex-col gap-2">
        <button
          type="button"
          onclick={enableProtection}
          disabled={requesting}
          class="btn-accent self-start px-5 py-2 disabled:opacity-60"
        >
          {requesting ? "Requesting…" : "Turn on protection"}
        </button>
        {#if denied}
          <p class="text-sm text-fg-muted">
            Your browser didn't grant it, and may not until you've used the app
            for a while. To be sure your progress is safe, export a backup below.
            It keeps a copy whatever the browser does.
          </p>
        {/if}
      </div>
    {/if}
  </div>
{/if}
