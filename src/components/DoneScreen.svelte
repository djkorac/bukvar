<script lang="ts">
import { onMount } from "svelte";
import AnswerRow from "~/components/AnswerRow.svelte";
import Icon from "~/components/Icon.svelte";
import type { Script } from "~/lib/content/types";
import { getPreferences, setPreference } from "~/lib/db/settings";
import type { AnswerReview } from "~/lib/study/answer-review";
import { getIntradayOutlook, type IntradayOutlook } from "~/lib/study/forecast";
import { getLevelProgress } from "~/lib/study/levels";

let {
  script,
  reviewed,
  lockedNew,
  moreNewToday,
  streak,
  sessionReviews,
  canUndo,
  commitError,
  onUndo,
  onRestart,
  onScriptChange,
}: {
  /** Current prompt script, to decide whether the Cyrillic nudge applies. */
  script: Script;
  /** Cards graded this session. */
  reviewed: number;
  /** New cards withheld today by the daily/batch caps. */
  lockedNew: number;
  /** Whether another lesson of new cards is still available today. */
  moreNewToday: boolean;
  /** Current day streak. */
  streak: number;
  /** Typed-mode recap rows recorded this session (empty in flip mode). */
  sessionReviews: AnswerReview[];
  /** Whether the last grade can still be undone. */
  canUndo: boolean;
  /**
   * Whether the last grade/undo commit failed (a dropped IndexedDB write). The
   * Reviewer owns the flag; the done screen renders it by its Undo button so a
   * failed undo here isn't silent: the reviewing-branch alert isn't mounted in
   * this phase.
   */
  commitError: boolean;
  onUndo: () => void;
  onRestart: () => void;
  /**
   * Switch the Reviewer's prompt script and persist it, returning whether the
   * write committed (false if it failed and was rolled back). Called when the
   * learner accepts the Cyrillic nudge.
   */
  onScriptChange: (script: Script) => Promise<boolean>;
} = $props();

// What's still coming today: the count of reviews due later today and the
// soonest such due time. Lets this screen say reviews refill the same day
// instead of implying "see you tomorrow". Null until fetched, and the
// dependent copy is gated on it, so "nothing more is due today" can't flash
// before the count arrives.
let outlook = $state<IntradayOutlook | null>(null);
// One-time prompt, once a Latin-prompt learner finishes the alphabet, to move
// their prompts to Cyrillic.
let showCyrillicNudge = $state(false);

// Two independent best-effort reads: fire each on its own so a failure of one
// (private browsing, eviction, quota) doesn't suppress the other, and swallow
// per-read. Both fields default to their feature-absent value.
onMount(() => {
  getIntradayOutlook()
    .then((o) => {
      outlook = o;
    })
    .catch(() => {});
  checkCyrillicNudge()
    .then((n) => {
      showCyrillicNudge = n;
    })
    .catch(() => {});
});

// Human phrase for when the soonest review returns today, so the "later today"
// line reads concretely ("in a few minutes") rather than vaguely.
const nextDueLabel = $derived.by(() => {
  if (!outlook || outlook.nextDueAt === null) return "";
  const mins = Math.round((outlook.nextDueAt - Date.now()) / 60000);
  if (mins <= 20) return "in a few minutes";
  if (mins < 60) return "within the hour";
  const hours = Math.round(mins / 60);
  return `in about ${hours} hour${hours === 1 ? "" : "s"}`;
});

const sessionCorrect = $derived(
  sessionReviews.filter((r) => r.isCorrect).length,
);

// Show the Cyrillic prompt only to a learner who is on Latin prompts, has
// finished the whole alphabet, and hasn't been offered the switch before.
async function checkCyrillicNudge(): Promise<boolean> {
  if (script !== "latin") return false;
  const prefs = await getPreferences();
  if (prefs.cyrillicNudged) return false;
  const summary = await getLevelProgress();
  const alphabet = summary.levels.find((l) => l.level.topic === "alphabet");
  return (
    alphabet !== undefined &&
    alphabet.total > 0 &&
    alphabet.known >= alphabet.total
  );
}

async function acceptCyrillic() {
  // The Reviewer owns (and persists) the script switch. If its write failed and
  // rolled back, leave the nudge up so the learner can retry rather than
  // recording it as handled while still on Latin.
  if (!(await onScriptChange("cyrillic"))) return;
  await markNudged();
}

async function dismissCyrillicNudge() {
  await markNudged();
}

// Persist the one-time flag, then hide the nudge regardless. A dropped write
// only means the nudge may reappear next session (benign), so it must not throw
// out of the click handler or block the dismissal.
async function markNudged() {
  try {
    await setPreference("cyrillicNudged", true);
  } catch {
    // Best-effort: the nudge reappearing next session is acceptable.
  }
  showCyrillicNudge = false;
}

// Re-anchor focus as the screen mounts: the swap from the review card unmounts
// the focused control, silently dropping keyboard and screen-reader focus to
// <body>. preventScroll so phones keep the card in view.
function focusOnMount(node: HTMLElement) {
  node.focus({ preventScroll: true });
}
</script>

{#if showCyrillicNudge}
  <div
    class="flex flex-col gap-3 rounded-2xl border border-primary bg-primary-soft p-6 text-center"
  >
    <p class="flex items-center justify-center gap-2 font-semibold text-fg">
      <Icon name="book-open" class="text-primary" />
      You've learned the Cyrillic alphabet. Ready to read in it?
    </p>
    <p class="text-sm text-fg-muted">
      Word prompts are in Latin right now. Switch to <span lang="sr"
        >Ћирилица</span
      > to build reading fluency. You can switch back anytime from
      the review screen.
    </p>
    <div class="mt-1 flex flex-col gap-2 sm:flex-row sm:justify-center">
      <button
        type="button"
        onclick={acceptCyrillic}
        class="btn-primary px-5 py-2"
      >
        Switch to <span lang="sr">Ћирилица</span>
      </button>
      <button
        type="button"
        onclick={dismissCyrillicNudge}
        class="btn-secondary px-5 py-2"
      >
        Not yet
      </button>
    </div>
  </div>
{/if}
<div
  tabindex="-1"
  use:focusOnMount
  class="flex flex-col items-center gap-3 rounded-2xl border border-border bg-bg-elev p-12 text-center focus:outline-none"
>
  <p class="flex items-center justify-center gap-2 text-2xl font-semibold">
    <span lang="sr">Свака част!</span>
    <Icon name="party-popper" size={24} class="text-primary" />
  </p>
  {#if reviewed > 0}
    <p class="text-fg-muted">
      You reviewed {reviewed} card{reviewed === 1 ? "" : "s"} this session.
    </p>
  {/if}
  {#if canUndo}
    <button
      type="button"
      onclick={onUndo}
      class="inline-flex touch-manipulation items-center gap-1 text-sm font-medium text-fg-muted hover:text-fg"
    >
      <Icon name="undo" size={14} /> Undo last grade
    </button>
  {/if}
  {#if commitError}
    <p role="alert" class="text-sm font-medium text-accent">
      We couldn't undo your last grade — your browser's storage may be full. Try
      again.
    </p>
  {/if}
  <p class="text-fg-muted">
    {#if moreNewToday}
      Lesson done. Start another to learn more words today.
    {:else if lockedNew > 0}
      That's all of today's new words. Spacing them out helps them stick.
    {:else}
      No new words left to introduce today.
    {/if}
  </p>
  {#if outlook && (outlook.dueLaterToday > 0 || !moreNewToday)}
    <p class="text-fg-muted">
      {#if outlook.dueLaterToday >= 2}
        {outlook.dueLaterToday} review cards come due later today, the first {nextDueLabel}.
      {:else if outlook.dueLaterToday === 1}
        One review card comes due {nextDueLabel}.
      {:else}
        Nothing more is due today. Come back tomorrow to keep going.
      {/if}
    </p>
  {/if}
  {#if streak > 0}
    <p
      class="flex items-center justify-center gap-1.5 text-sm font-medium text-fg"
    >
      <Icon name="flame-filled" size={14} class="text-streak" />
      {streak}-day streak. Keep it going tomorrow.
    </p>
  {/if}
  <div class="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-center">
    <button
      type="button"
      onclick={onRestart}
      class="btn-accent px-5 py-2"
    >
      {moreNewToday ? "Start next lesson" : "Reload"}
    </button>
    <!-- SRS-neutral cram (never graded into FSRS), so "I want to keep going"
         has an answer that can't distort the schedule just protected above. -->
    <a
      href="/practice"
      class="btn-secondary px-5 py-2"
    >
      Practise a topic
    </a>
  </div>
</div>
{#if sessionReviews.length > 0}
  <section class="rounded-2xl border border-border bg-bg-elev p-6">
    <div class="text-center">
      <h2 class="text-xl font-semibold">How you did</h2>
      <p class="mt-0.5 text-sm text-fg-muted">
        {sessionCorrect} / {sessionReviews.length} correct
      </p>
    </div>
    <ul class="mt-4 flex flex-col gap-0.5">
      {#each sessionReviews as r (r.id)}
        <AnswerRow {r} />
      {/each}
    </ul>
  </section>
{/if}
