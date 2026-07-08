<script lang="ts">
import { onMount, tick } from "svelte";
import DoneScreen from "~/components/DoneScreen.svelte";
import GradeBar, { GRADES } from "~/components/GradeBar.svelte";
import Icon from "~/components/Icon.svelte";
import PlacementTest from "~/components/PlacementTest.svelte";
import SrAuto from "~/components/SrAuto.svelte";
import TypedAnswerForm from "~/components/TypedAnswerForm.svelte";
import { ASPECT_LABEL, counterpartAspectLabel } from "~/lib/content/aspect";
import { GENDER_LABEL } from "~/lib/content/gender";
import { levelName, type PhaseId, phaseOfTopic } from "~/lib/content/levels";
import type { Script, StudyItem } from "~/lib/content/types";
import { ensureStorageReady } from "~/lib/db/seed";
import {
  DEFAULT_PREFERENCES,
  getPreferences,
  type ReviewMode,
  setPreference,
} from "~/lib/db/settings";
import type { Grade } from "~/lib/srs/scheduler";
import {
  checkAnswer,
  gradeForOutcome,
  type RecallOutcome,
} from "~/lib/study/answer-check";
import { type AnswerReview, reviewTyped } from "~/lib/study/answer-review";
import { onInteractiveTarget } from "~/lib/study/interactive-target";
import { getProgress, type ProgressSummary } from "~/lib/study/progress";
import {
  type GradeReceipt,
  getDueItems,
  gradeItem,
  toStudyItem,
  undoGrade,
} from "~/lib/study/session";
import { createTapLock } from "~/lib/study/tap-lock";

type Phase = "loading" | "onboarding" | "reviewing" | "done" | "error";

// Text color for a card's level tag, by curriculum phase. Full class strings
// (not built from fragments) so Tailwind's scanner emits each utility.
const phaseTextClass: Record<PhaseId, string> = {
  azbuka: "text-phase-azbuka",
  survival: "text-phase-survival",
  core: "text-phase-core",
  life: "text-phase-life",
  ideas: "text-phase-ideas",
  mastery: "text-phase-mastery",
};

let phase = $state<Phase>("loading");
let script = $state<Script>(DEFAULT_PREFERENCES.script);
let reviewMode = $state<ReviewMode>(DEFAULT_PREFERENCES.reviewMode);
let dailyGoal = $state(DEFAULT_PREFERENCES.dailyGoal);
let queue = $state<StudyItem[]>([]);
let index = $state(0);
let revealed = $state(false);
let reviewed = $state(0);
// Per-card answer rows for the end-of-lesson recap, recorded only in typed mode
// (flip mode is self-graded, with no objective answer to score). Reset each
// session; shown as a scorecard on the done screen.
let sessionReviews = $state<AnswerReview[]>([]);
let lockedNew = $state(0);
let moreNewToday = $state(false);
let progress = $state<ProgressSummary>({ reviewedToday: 0, streak: 0 });
// Single-step undo for a misclicked grade: the lib receipt for the most recent
// grade, plus whether that grade pushed a typed-mode recap row (so undo can pop
// it). Null whenever there's nothing to undo: before the first grade, after an
// undo, and across session loads, where the receipt would point into a stale
// queue. Cleared synchronously when a new grade starts, so the button can't
// fire against a commit in flight. `$state.raw`, not `$state`: only presence
// drives the UI, and the receipt must stay a plain object: a deep $state
// proxy can't be structured-cloned, so Dexie would reject the restore with
// DataCloneError when undoGrade writes the snapshot back.
let lastUndo = $state.raw<{
  receipt: GradeReceipt;
  pushedReview: boolean;
} | null>(null);

// Typed-mode (active recall) state, reset between cards.
let answer = $state("");
let outcome = $state<RecallOutcome | null>(null);

// The three facets of the typed-mode verdict line, keyed by outcome: the
// visible label, its colour token, and the spoken form for the live region
// (the verdict is silent to screen readers without it). One record so the
// facets can't drift, and the union is exhaustive: a new outcome won't
// silently fall through to `wrong`. Full class strings, not fragments, so
// Tailwind's scanner emits each utility. The lone `correct` check icon stays
// a one-off in the template (see below) rather than bloating every entry.
const OUTCOME_VERDICT: Record<
  RecallOutcome,
  { label: string; className: string; spoken: string }
> = {
  correct: { label: "Correct", className: "text-primary", spoken: "Correct." },
  near: {
    label: "Almost, just a typo",
    className: "text-fg",
    spoken: "Almost, just a typo.",
  },
  wrong: { label: "Not quite", className: "text-accent", spoken: "Not quite." },
};

// The prompt card element, so a submitted typed answer can scroll it back to
// the top on phones (see scrollCardIntoViewOnMobile).
let cardEl = $state<HTMLElement | undefined>();

// Swallow taps for a brief window after a reveal/advance so an accidental mobile
// double-tap can't act on the button the first tap just swapped into place. The
// reveal→grade and check→continue handoffs put a new button where the finger
// already is. See createTapLock; the PlacementTest shares it so the cooldown and
// the coarse-pointer rule can't drift between the two.
const { locked: tapLocked, lock: lockTaps } = createTapLock();

// Re-entrancy guard for the async grade/undo commit. A plain (non-reactive)
// boolean, set synchronously before the first await and cleared in `finally`, so
// a second trigger (desktop double-click, a held key, a fast tap that beats the
// touch cooldown) can't start a second commit while one is in flight. tapLocked
// only covers coarse pointers; this covers every input path. Not $state: it
// guards control flow, it doesn't drive the view.
let grading = false;

// Set when a grade/undo commit fails on a mid-session IndexedDB write error
// (quota exhausted, eviction). The write is atomic, so nothing is half-saved and
// the card flow stays put; this just surfaces an inline alert so the failure
// isn't silent (the first load is already covered by `guard`, but a grade isn't).
// Cleared by resetCard, which runs whenever a fresh card loads, including every
// session (re)start, so a stale error can't outlive the card it belongs to.
let commitError = $state(false);

const current = $derived<StudyItem | undefined>(queue[index]);
const goalPct = $derived(
  Math.min(100, Math.round((progress.reviewedToday / dailyGoal) * 100)),
);
// Once the goal is met the fraction pins to `goal/goal` (a target, not a cap)
// and any surplus shows as a `+N` bonus, so over-achieving reads as success
// rather than an "over budget" 33/20.
const goalMet = $derived(progress.reviewedToday >= dailyGoal);
const overGoal = $derived(Math.max(0, progress.reviewedToday - dailyGoal));
// When the current prompt was first shown, to log time-on-card with the grade.
// Plain (non-reactive): it's measured, never rendered. Stamped as each card
// becomes current via resetCard, which runs at session start and every advance.
let shownAt = 0;

// Clear the per-card answer state when moving to a new prompt.
function resetCard() {
  revealed = false;
  answer = "";
  outcome = null;
  commitError = false;
  shownAt = performance.now();
}

// The first load and every session restart hang on IndexedDB reads, and those
// can fail (storage blocked in private browsing, quota exhausted, eviction).
// Route each load boundary through one recoverable error screen so a rejected
// read can't strand the learner on the loading spinner forever. `retry` re-runs
// whatever failed; init and startSession are idempotent (they re-query, never
// mutate), so re-running the whole step from the top is safe. Mirrors the
// recoverable error screen in PlacementTest.
let retry = $state<() => void>(() => {});
async function guard(run: () => Promise<void>) {
  try {
    await run();
  } catch {
    retry = () => void guard(run);
    phase = "error";
  }
}

async function startSession() {
  phase = "loading";
  const due = await getDueItems(script);
  queue = due.items;
  lockedNew = due.lockedNew;
  moreNewToday = due.moreNewToday;
  index = 0;
  resetCard();
  reviewed = 0;
  sessionReviews = [];
  lastUndo = null;
  progress = await getProgress();
  phase = queue.length > 0 ? "reviewing" : "done";
}

async function init() {
  await ensureStorageReady();
  const prefs = await getPreferences();
  script = prefs.script;
  reviewMode = prefs.reviewMode;
  dailyGoal = prefs.dailyGoal;
  if (!prefs.onboarded) {
    phase = "onboarding";
    return;
  }
  await startSession();
}

onMount(() => void guard(init));

// Placement finished (or was skipped): it persisted the script choice and any
// seeding, so re-read prefs and start the first session.
async function handlePlacementDone() {
  await guard(async () => {
    const prefs = await getPreferences();
    script = prefs.script;
    reviewMode = prefs.reviewMode;
    await startSession();
  });
}

function reveal() {
  if (tapLocked()) return;
  revealed = true;
  lockTaps();
}

// Re-anchor focus on an element as it mounts. The review flow swaps controls in
// place (answer form → Continue, Show answer → grade buttons), and the swap
// unmounts the focused element, silently dropping
// keyboard and screen-reader focus to <body>. preventScroll so phones keep the
// card (the feedback) in view rather than jumping to the control. The flag
// exists because use: can't be applied conditionally. The revealed answer is
// the focus target only in flip mode (typed mode focuses Continue instead).
// Inert targets are deliberate: focusing a grade button would let a held-down
// Enter chain reveal→Again through several cards via native button activation.
function focusOnMount(node: HTMLElement, enabled = true) {
  if (enabled) node.focus({ preventScroll: true });
}

// Typed mode: grade the typed answer, then reveal so the learner sees the
// correct form and details before committing the mapped grade on continue.
async function checkTyped() {
  const item = current;
  // No tapLocked() guard (unlike reveal/markUnknown): the post-advance lock
  // window only ever coincides with an empty answer (resetCard clears it), and
  // both the !answer.trim() early-return below and the disabled Check button
  // already swallow a stray tap then. A tapLocked() check here would guard a
  // state that can't occur.
  if (!item || revealed || !answer.trim()) return;
  outcome = checkAnswer(answer, item.back, item.accept);
  await revealTyped();
}

// Typed mode: the learner can't recall it, so skip the ritual of typing a wrong
// guess. Reveal the answer straight away and mark it a miss; gradeForOutcome
// maps "wrong" to Again, the honest lapse signal, committed on continue.
async function markUnknown() {
  if (tapLocked()) return;
  if (!current || revealed) return;
  outcome = "wrong";
  await revealTyped();
}

// Flip a typed card to its back. On phones the answer box was focused (keyboard
// up) and the card may be scrolled past its top; once the answer and examples
// reveal, bring the card back into view so the feedback reads from the start.
async function revealTyped() {
  revealed = true;
  lockTaps();
  await tick();
  scrollCardIntoViewOnMobile();
}

// Scroll the prompt card to the top of the viewport on phone-sized screens;
// no-op on wider viewports, where the card stays in view as it grows.
function scrollCardIntoViewOnMobile() {
  if (!cardEl || !window.matchMedia("(max-width: 640px)").matches) return;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  cardEl.scrollIntoView({
    block: "start",
    behavior: reduceMotion ? "auto" : "smooth",
  });
}

// Best-effort refresh of the derived progress display (reviewedToday / streak).
// Runs only after a grade/undo has committed and the card has advanced, so it
// must never throw: a rejected read reaching a handler's catch would re-trigger
// the already-committed write. Stale progress self-heals on the next refresh.
async function refreshProgress() {
  try {
    progress = await getProgress();
  } catch {
    // Swallow: progress is a derived display value, not part of the commit.
  }
}

async function grade(rating: Grade) {
  const item = current;
  if (!item || grading || tapLocked()) return;
  grading = true;
  try {
    lastUndo = null;
    const receipt = await gradeItem(
      item.id,
      rating,
      undefined,
      Math.round(performance.now() - shownAt),
    );
    // Record a recap row for typed mode only (flip mode has no graded answer),
    // and only once the write commits: a rejected grade (`receipt === null`,
    // the card gone from db.cards) must not leave a phantom row that desyncs the
    // scorecard from `reviewed`. reviewTyped encodes how the row reads (near-miss
    // vs. skip). See answer-review.ts.
    if (receipt) {
      const typedReview =
        reviewMode === "type" && outcome
          ? reviewTyped(item, outcome, answer)
          : null;
      if (typedReview) sessionReviews.push(typedReview);
      lastUndo = { receipt, pushedReview: typedReview !== null };
      reviewed += 1;
    }
    // Arm the tap lock on either outcome: the done branch swaps the whole
    // control area out for DoneScreen (a button under the finger), so a stray
    // second tap must be swallowed there too, else undoLastGrade's own
    // tapLocked() guard is inert on the done screen.
    lockTaps();
    if (index + 1 < queue.length) {
      index += 1;
      resetCard();
    } else {
      phase = "done";
    }
  } catch {
    // The grade transaction rolled back, so the card is unchanged and stays in
    // place (revealed, with its controls); surface the failure and let the
    // learner re-grade, which simply retries the write.
    commitError = true;
  } finally {
    grading = false;
  }
  // The grade has committed and the card advanced; refresh the progress display
  // outside the try so a failed read can't reach the catch and strand the card
  // re-gradeable (a re-grade would double-write the append-only review log).
  await refreshProgress();
}

// Reverse the most recent grade after a misclick: the lib restores the stored
// state (card snapshot, review log, new-card slot), then the view steps back to
// the card, returning from the done screen when the misclick was on the
// session's last card, where grade() leaves `index` in place. Single-step, so
// the receipt is consumed (and the button gone) before the async work runs.
async function undoLastGrade() {
  if (!lastUndo || grading || tapLocked()) return;
  const { receipt, pushedReview } = lastUndo;
  grading = true;
  try {
    lastUndo = null;
    await undoGrade(receipt);
    if (pushedReview) sessionReviews.pop();
    reviewed = Math.max(0, reviewed - 1);
    if (phase === "done") {
      phase = "reviewing";
    } else {
      index = Math.max(0, index - 1);
    }
    resetCard();
    lockTaps();
  } catch {
    // The undo transaction rolled back, so the grade still stands and the view
    // is unchanged. Restore the receipt so the undo stays retryable, and set
    // commitError so the alert prompts a retry.
    lastUndo = { receipt, pushedReview };
    commitError = true;
  } finally {
    grading = false;
  }
  // As in grade(): the undo has committed, so refresh progress outside the try.
  // A failed read here must not restore the receipt and re-run undoGrade, which
  // would over-decrement the daily new-card counter.
  await refreshProgress();
}

// The one place the prompt script changes: flip local state and re-render the
// queue optimistically, then persist. A dropped Dexie write must not split the
// live view from storage (which silently reverts on the next load), so on
// failure we roll the script back. The review chrome has no error surface and
// the pref is cosmetic and self-correcting, so a silent revert is the
// proportionate repair. Returns whether the new script was committed, so the
// done-screen nudge can keep itself up to retry.
async function setScript(next: Script): Promise<boolean> {
  const prev = script;
  applyScript(next);
  try {
    await setPreference("script", next);
    return true;
  } catch {
    applyScript(prev);
    return false;
  }
}

// Re-render the existing queue in the given script without re-querying, so the
// learner keeps their place. Letter cards always show Cyrillic, and the glyph
// form rolled at queue build stays put.
function applyScript(value: Script) {
  script = value;
  queue = queue.map((item) => {
    const next = toStudyItem(item.id, item.kind, value);
    return next ? { ...next, form: item.form } : item;
  });
}

function toggleScript() {
  void setScript(script === "cyrillic" ? "latin" : "cyrillic");
}

function handleKey(event: KeyboardEvent) {
  // Auto-repeat from a held key is never a deliberate second action: drop it so
  // holding Enter/Space (reveal, typed-mode commit) or a 1-4 grade key can't
  // re-fire reveal/grade. Typing into the answer box is unaffected: the input
  // owns its own keystrokes; this handler only acts on the control keys below.
  if (event.repeat) return;
  if (phase !== "reviewing") return;
  if (reviewMode === "type") {
    // Before reveal the input/form owns the keyboard (typing + Enter to check),
    // except Esc, which gives up and reveals the answer as a miss; after reveal,
    // Enter commits the mapped grade and advances.
    if (!revealed && event.key === "Escape") {
      event.preventDefault();
      markUnknown();
      return;
    }
    if (
      revealed &&
      event.key === "Enter" &&
      outcome &&
      !onInteractiveTarget(event)
    ) {
      event.preventDefault();
      grade(gradeForOutcome(outcome));
    }
    return;
  }
  if (
    !revealed &&
    (event.key === " " || event.key === "Enter") &&
    !onInteractiveTarget(event)
  ) {
    event.preventDefault();
    reveal();
    return;
  }
  if (revealed && event.key >= "1" && event.key <= "4") {
    event.preventDefault();
    grade(GRADES[Number(event.key) - 1].rating);
  }
}
</script>

<svelte:window onkeydown={handleKey} />

<div class="mx-auto flex w-full max-w-xl flex-col gap-6">
  {#if phase === "reviewing" || phase === "done"}
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between text-sm text-fg-muted">
        <span class="flex items-center gap-4">
          <span
            title="Day streak"
            class="inline-flex items-center gap-1 font-medium text-fg"
          >
            <Icon name="flame-filled" size={14} class="text-streak" />
            {progress.streak}<span class="sr-only"> day streak</span>
          </span>
          <span
            title="Reviewed today vs daily goal"
            class={goalMet
              ? "inline-flex items-center gap-1 font-medium text-primary"
              : undefined}
          >
            {#if goalMet}
              {dailyGoal}/{dailyGoal}{overGoal > 0 ? ` +${overGoal}` : ""}
              <Icon name="check" size={14} /> today
            {:else}
              {progress.reviewedToday}/{dailyGoal} today
            {/if}
          </span>
        </span>
        {#if phase === "reviewing"}
          <button
            type="button"
            onclick={toggleScript}
            class="rounded-full border border-border px-3 py-1 font-medium hover:bg-primary-soft"
          >
            {#if script === "cyrillic"}<span lang="sr">Ћирилица</span>{:else}Latinica{/if}
          </button>
        {/if}
      </div>
      <div
        aria-hidden="true"
        class="h-1.5 w-full overflow-hidden rounded-full bg-primary-soft"
      >
        <div
          class="h-full rounded-full bg-primary transition-all"
          style="width: {goalPct}%"
        ></div>
      </div>
    </div>
  {/if}

  {#if phase === "loading"}
    <p class="py-20 text-center text-fg-muted">Loading your deck…</p>
  {:else if phase === "onboarding"}
    <PlacementTest onComplete={handlePlacementDone} />
  {:else if phase === "done"}
    <DoneScreen
      {script}
      {reviewed}
      {lockedNew}
      {moreNewToday}
      streak={progress.streak}
      {sessionReviews}
      canUndo={lastUndo !== null}
      {commitError}
      onUndo={undoLastGrade}
      onRestart={() => guard(startSession)}
      onScriptChange={setScript}
    />
  {:else if phase === "error"}
    <div
      class="flex flex-col items-center gap-4 rounded-2xl border border-border bg-bg-elev p-10 text-center"
    >
      <p class="text-lg font-semibold">We couldn't load your deck</p>
      <p class="text-sm text-fg-muted">
        Reading from this browser's storage failed, which can happen in private
        browsing or when storage is full. Try again.
      </p>
      <button type="button" onclick={retry} class="btn-primary py-3">
        Try again
      </button>
    </div>
  {:else if current}
    <div class="relative">
      <p class="text-center text-sm text-fg-muted">
        Card {index + 1} of {queue.length}
      </p>
      {#if lastUndo && !revealed}
        <button
          type="button"
          onclick={undoLastGrade}
          class="absolute inset-y-0 right-0 inline-flex touch-manipulation items-center gap-1 text-sm font-medium text-fg-muted hover:text-fg"
        >
          <Icon name="undo" size={14} /> Undo last grade
        </button>
      {/if}
    </div>
    <div
      bind:this={cardEl}
      class="flex min-h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-bg-elev p-10 text-center shadow-sm"
    >
      <span
        class="text-xs font-semibold uppercase tracking-[0.18em] {phaseTextClass[
          phaseOfTopic(current.topic)
        ]}"
      >
        {current.kind === "letter" ? "Cyrillic letter" : levelName(current.topic)}
      </span>

      <p
        lang="sr"
        class="text-6xl font-bold leading-none"
        class:sr-italic={current.form === "italic"}
      >
        {current.front}
      </p>
      {#if current.frontSub}
        <p
          lang="sr"
          class="text-3xl text-fg-muted"
          class:sr-italic={current.form === "italic"}
        >
          {current.frontSub}
        </p>
      {/if}
      {#if current.form === "italic"}
        <span class="text-xs font-medium text-fg-muted">in italics</span>
      {/if}

      {#if revealed}
        <!-- Pronunciation rides with the headword (dictionary style): the
             other-script reading aid, then broad IPA. SrAuto tags any Cyrillic
             run lang="sr", so the latin-mode transliteration (Cyrillic) gets the
             Serbian glyphs while the cyrillic-mode one (Latin) stays plain. -->
        {#if current.transliteration || current.ipa}
          <p class="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
            {#if current.transliteration}
              <span class="text-lg text-fg-muted">
                <SrAuto text={current.transliteration} />
              </span>
            {/if}
            {#if current.ipa}
              <span class="text-sm text-fg-muted">{current.ipa}</span>
            {/if}
          </p>
        {/if}

        <hr class="w-16 border-border" />

        {#if reviewMode === "type" && outcome}
          <p
            class="flex items-center justify-center gap-1.5 text-sm font-semibold {OUTCOME_VERDICT[
              outcome
            ].className}"
          >
            {OUTCOME_VERDICT[outcome].label}
            {#if outcome === "correct"}<Icon name="check" size={14} />{/if}
          </p>
        {/if}

        <!-- Answer zone: the meaning, with its grammar tucked tight beneath it. -->
        <p
          tabindex="-1"
          use:focusOnMount={reviewMode === "flip"}
          class="text-2xl font-semibold text-primary focus:outline-none"
        >
          {current.back}
        </p>
        {#if current.pos}
          <p class="-mt-3 text-sm italic text-fg-muted">
            {current.pos}{current.gender ? ` · ${GENDER_LABEL[current.gender]}` : ""}{current.aspect ? ` · ${ASPECT_LABEL[current.aspect]}` : ""}
          </p>
        {/if}
        {#if current.pair}
          <p class="text-sm text-fg-muted">
            {counterpartAspectLabel(current.aspect)} counterpart:
            <span lang="sr" class="font-medium text-fg">
              {script === "cyrillic" ? current.pair.cyrillic : current.pair.latin}
            </span>
            {#if script === "cyrillic"}
              ({current.pair.latin})
            {:else}
              (<span lang="sr">{current.pair.cyrillic}</span>)
            {/if}
          </p>
        {/if}

        <!-- Supporting zone: the mnemonic as a left-aligned tip, then examples. -->
        {#if current.mnemonic}
          <p
            class="flex w-full items-start gap-2 rounded-lg bg-primary-soft p-3 text-left text-sm text-fg-muted"
          >
            <Icon name="lightbulb" size={16} class="mt-0.5 shrink-0 text-primary" />
            <span><SrAuto text={current.mnemonic} /></span>
          </p>
        {/if}
        {#if current.examples && current.examples.length > 0}
          <ul class="flex w-full flex-col gap-2 text-left">
            {#each current.examples as ex (ex.cyrillic)}
              <li class="rounded-lg border border-border bg-bg p-3 text-sm">
                <!-- Shown in the chosen script only (it flips with the toggle,
                     like the headword): the 1:1 romanization of a whole sentence
                     is mechanical noise, not a second reading. -->
                <p lang="sr" class="font-medium">
                  {script === "cyrillic" ? ex.cyrillic : ex.latin}
                </p>
                <p class="mt-1 text-fg-muted">{ex.english}</p>
              </li>
            {/each}
          </ul>
        {/if}
      {/if}
    </div>

    {#if commitError}
      <p role="alert" class="text-center text-sm font-medium text-accent">
        We couldn't save your progress — your browser's storage may be full. Try
        again.
      </p>
    {/if}

    {#if reviewMode === "type"}
      {#if revealed}
        <button
          type="button"
          onclick={() => outcome && grade(gradeForOutcome(outcome))}
          use:focusOnMount
          class="btn-primary touch-manipulation py-3"
        >
          Continue <span class="opacity-60">(enter)</span>
        </button>
      {:else}
        <TypedAnswerForm
          item={current}
          bind:answer
          onCheck={checkTyped}
          onUnknown={markUnknown}
        />
      {/if}
    {:else if revealed}
      <GradeBar onGrade={grade} />
    {:else}
      <button
        type="button"
        onclick={reveal}
        use:focusOnMount
        class="btn-primary touch-manipulation py-3"
      >
        Show answer <span class="opacity-60">(space)</span>
      </button>
    {/if}
  {/if}

  <!-- One persistent live region for the whole island. It is never inside a
       phase branch: announcements only fire reliably from an aria-live node
       that already exists in the DOM. It voices what each visual swap only
       shows: the next card, the verdict + revealed answer, session done. -->
  <p role="status" class="sr-only">
    {#if phase === "error"}
      We couldn't load your deck. Try again.
    {:else if phase === "done"}
      Session complete.
      {#if reviewed > 0}
        You reviewed {reviewed} card{reviewed === 1 ? "" : "s"}.
      {/if}
    {:else if phase === "reviewing" && current}
      {#if revealed}
        {reviewMode === "type" && outcome ? OUTCOME_VERDICT[outcome].spoken : ""}
        The answer is {current.back}.
      {:else}
        Card {index + 1} of {queue.length}:
        <span lang="sr">{current.front}</span>{#if current.frontSub}<span
            lang="sr">, {current.frontSub}</span
          >{/if}
      {/if}
    {/if}
  </p>
</div>
