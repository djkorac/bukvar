<script lang="ts">
import { onMount, tick } from "svelte";
import Icon from "~/components/Icon.svelte";
import {
  type LevelProgress,
  type LevelSummary,
  levelLinks,
  levelNumber,
} from "~/lib/content/levels";
import { ensureStorageReady } from "~/lib/db/seed";
import { getLevelProgress, markLevelKnown } from "~/lib/study/levels";

let loaded = $state(false);
let errored = $state(false);
let summary = $state<LevelSummary | null>(null);
// The level id currently being marked known (disables its button meanwhile).
let busy = $state<string | null>(null);
// The level id whose last "mark known" write failed, so its row can show an
// inline retry hint. A dropped storage write must not pass silently. That's how
// local-first progress is lost (mirrors BackupReminder's error handling).
let markError = $state<string | null>(null);

// Element refs per level, so we can scroll the current one into view on load.
const levelEls: Record<string, HTMLLIElement> = {};

async function load() {
  summary = await getLevelProgress();
}

// Mirror the recoverable error boundary in Reviewer/PlacementTest: a rejected
// storage read (private browsing, full storage, eviction) must not strand this
// island on its loading skeleton. `retry` re-runs the whole setup, which is
// idempotent: it re-seeds and re-reads, never mutating on a repeat.
let retry = $state<() => void>(() => {});
async function guard(run: () => Promise<void>) {
  try {
    await run();
  } catch {
    retry = () => void guard(run);
    errored = true;
  }
}

async function setup() {
  errored = false;
  // This island is alone on /levels, so it owns first-run storage setup.
  await ensureStorageReady();
  await load();
  loaded = true;
  // The current level can sit well below the fold (29 levels), so bring it into
  // view once the list has rendered. await tick() so the refs exist.
  await tick();
  scrollToCurrentLevel();
}

onMount(() => void guard(setup));

function scrollToCurrentLevel() {
  const id = summary?.currentLevelId;
  // Skip when there's no current level, or it's the first one (already in view).
  if (!id || id === summary?.levels[0]?.level.id) return;
  const el = levelEls[id];
  if (!el) return;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  // block: center leaves the previous, completed level peeking in above, so the
  // current level reads as "you are here" rather than pinned to the very top.
  el.scrollIntoView({
    block: "center",
    behavior: reduceMotion ? "auto" : "smooth",
  });
}

const pct = (n: number, total: number): number =>
  total > 0 ? Math.round((n / total) * 100) : 0;

async function handleMark(p: LevelProgress) {
  if (p.new === 0 || busy) return;
  const ok = window.confirm(
    `Mark all ${p.total} items in “${p.level.name}” as known?\n\n` +
      "They'll each get one confirming review and won't be taught as new " +
      "cards. Anything you've actually forgotten will resurface normally.",
  );
  if (!ok) return;
  busy = p.level.id;
  markError = null;
  try {
    await markLevelKnown(p.level.id);
    await load();
  } catch {
    // Keep the list in place so the learner can retry by clicking again.
    markError = p.level.id;
  } finally {
    busy = null;
  }
}
</script>

{#if errored}
  <div
    class="flex flex-col items-center gap-4 rounded-2xl border border-border bg-bg-elev p-10 text-center"
  >
    <p class="text-lg font-semibold">We couldn't load your levels</p>
    <p class="text-sm text-fg-muted">
      Reading from this browser's storage failed, which can happen in private
      browsing or when storage is full. Try again.
    </p>
    <button type="button" onclick={retry} class="btn-primary py-3">
      Try again
    </button>
  </div>
{:else if loaded && summary}
  <ol class="flex flex-col gap-3">
    {#each summary.levels as p (p.level.id)}
      {@const current = summary.currentLevelId === p.level.id}
      <li
        bind:this={levelEls[p.level.id]}
        class="rounded-2xl border bg-bg-elev p-5 {current
          ? 'border-primary'
          : 'border-border'}"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-baseline gap-3">
            <span
              class="text-sm font-semibold tabular-nums text-fg-muted"
              aria-hidden="true">{levelNumber(p.level)}</span
            >
            <div>
              <h2 class="font-semibold">{p.level.name}</h2>
              {#if current}
                <span class="text-xs font-medium text-primary">Current level</span>
              {/if}
            </div>
          </div>
          {#if p.new > 0}
            <button
              type="button"
              onclick={() => handleMark(p)}
              disabled={busy !== null}
              class="shrink-0 rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-primary-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy === p.level.id ? "Marking…" : "Mark known"}
            </button>
          {:else}
            <span
              class="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary"
            >
              Known <Icon name="check" size={14} />
            </span>
          {/if}
        </div>

        <div class="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-primary-soft">
          <div class="h-full bg-primary" style="width: {pct(p.known, p.total)}%"></div>
          <div
            class="h-full bg-primary/40"
            style="width: {pct(p.learning, p.total)}%"
          ></div>
        </div>
        <p class="mt-2 text-xs text-fg-muted">
          {p.known} known · {p.learning} learning · {p.new} new
          <span class="opacity-60">/ {p.total}</span>
        </p>
        <!-- Kept mounted so role="status" announces the save failure: a live
             region only fires reliably when it pre-exists and its text changes.
             mt-2 toggles with the text so the empty idle region adds no gap. -->
        <p
          class="text-xs text-accent {markError === p.level.id ? 'mt-2' : ''}"
          role="status"
        >
          {markError === p.level.id ? "Couldn't save — please try again." : ""}
        </p>

        <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {#each levelLinks(p.level) as link (link.href)}
            <a
              href={link.href}
              class="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              {link.label} <Icon name="arrow-right" size={12} />
            </a>
          {/each}
        </div>
      </li>
    {/each}
  </ol>
{:else}
  <p class="py-20 text-center text-fg-muted">Loading levels…</p>
{/if}
