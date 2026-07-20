<script lang="ts">
import { onMount } from "svelte";
import AnswerRow from "~/components/AnswerRow.svelte";
import Icon from "~/components/Icon.svelte";
import TypedAnswerForm from "~/components/TypedAnswerForm.svelte";
import { LEVELS } from "~/data/levels";
import { levelItemIds, levelNumber } from "~/lib/content/levels";
import type { Script, Topic, WordEntry } from "~/lib/content/types";
import { ensureStorageReady } from "~/lib/db/seed";
import { setPreference } from "~/lib/db/settings";
import type { DrillQuestion } from "~/lib/study/alphabet-drill";
import { markKnown } from "~/lib/study/levels";
import {
  type AnswerReview,
  buildScriptProbes,
  buildSectionProbes,
  canReadCyrillic,
  PLACEMENT_TOPICS,
  projectedStartLevel,
  reviewScript,
  reviewVocab,
  type SectionOutcome,
  SKIP_LABEL,
  sectionPassed,
  wordsKnownFromSections,
} from "~/lib/study/placement";
import { createTapLock } from "~/lib/study/tap-lock";

/**
 * The onboarding placement test island. View-only: every decision (which letters
 * to probe, which words per section, what counts as "known") comes from
 * `lib/study/placement.ts`; this component renders the questions and, at the end,
 * persists the result via the existing seeding primitive (`markKnown`). The
 * estimate is soft: seeded cards each get one confirming review, so over-marking
 * self-heals.
 *
 * The vocabulary axis walks the curriculum **section by section** (every word
 * level), sampling a few words from each and marking a section known only when
 * the learner clears it in full. Probes are typed recall, the same skill the
 * reviewer grades (see `buildSectionProbes` for why). There is no difficulty
 * ordering and no cross-section sweep: each section stands on its own evidence.
 *
 * Used in two places with the same flow: inline on first run (the Reviewer's
 * onboarding) and standalone on `/placement` for a re-take. `onComplete` lets the
 * caller resume its own session; standalone, it falls back to navigating to /app.
 */

type Phase =
  | "loading"
  | "intro"
  | "script"
  | "vocab"
  | "applying"
  | "results"
  | "scriptChoice"
  | "error";

let { onComplete }: { onComplete?: () => void } = $props();

let phase = $state<Phase>("loading");

const levelNameByTopic = new Map<Topic, string>(
  LEVELS.map((l) => [l.topic, l.name]),
);

// Script-literacy axis.
let scriptProbes = $state<DrillQuestion[]>([]);
let scriptIndex = $state(0);
let scriptCorrect = $state(0);
let scriptReviews = $state<AnswerReview[]>([]);

// Vocabulary axis: one section (word topic) at a time, probed by typed recall.
let sectionIndex = $state(0);
let sectionProbes = $state<WordEntry[]>([]);
let probeIndex = $state(0);
let sectionCorrect = $state(0);
let answer = $state("");
// Per-section scratch (not rendered live, so plain arrays): the ids answered
// right and the rows for this section, folded into the reactive state on finish.
let sectionCorrectIds: string[] = [];
let sectionReviews: AnswerReview[] = [];
let outcomes: SectionOutcome[] = [];

// Result + the per-section breakdown shown at the end.
let readsCyrillic = $state(false);
let startLabel = $state("");
type SectionGroup = {
  topic: Topic;
  name: string;
  passed: boolean;
  reviews: AnswerReview[];
};
let sectionGroups = $state<SectionGroup[]>([]);

const totalQuestions = $derived(
  scriptReviews.length +
    sectionGroups.reduce((n, g) => n + g.reviews.length, 0),
);
const totalCorrect = $derived(
  scriptReviews.filter((r) => r.isCorrect).length +
    sectionGroups.reduce(
      (n, g) => n + g.reviews.filter((r) => r.isCorrect).length,
      0,
    ),
);
const knownSectionCount = $derived(
  sectionGroups.filter((g) => g.passed).length,
);

// Swallow taps for a brief window after each advance so an accidental mobile
// double-tap can't act on the answer button the first tap just swapped into
// place. Answering rebuilds the option grid under the finger. Shares the
// Reviewer's cooldown via createTapLock so the two can't drift. There's no
// `grading`-style re-entrancy guard because answerScript/answerVocab are
// synchronous (no in-flight await to re-enter). The only live double-fire paths
// are this and key auto-repeat.
const { locked: tapLocked, lock: lockTaps } = createTapLock();

// Every phase change past the intro hangs on an IndexedDB write, and those can
// fail (storage blocked in private browsing, quota exhausted, eviction). Route
// each async boundary through one recoverable error screen so a rejected write
// can't strand the learner on a loading phase forever. `retry` re-runs whatever
// failed; each step is idempotent (a settings put, or a promote-to-known
// bulkPut), so re-running the whole step from the top is safe. The learner's
// answers stay in component state across the error, so retry recovers the
// session rather than restarting it.
let retry = $state<() => void>(() => {});
async function guard(run: () => Promise<void>) {
  try {
    await run();
  } catch {
    retry = () => void guard(run);
    phase = "error";
  }
}

onMount(async () => {
  // Idempotent: needed when this island stands alone on /placement (the Reviewer
  // sets up storage first when used inline, but persisting/seeding twice is a no-op).
  await guard(async () => {
    await ensureStorageReady();
    phase = "intro";
  });
});

function startTest() {
  scriptProbes = buildScriptProbes();
  scriptIndex = 0;
  scriptCorrect = 0;
  scriptReviews = [];
  sectionGroups = [];
  outcomes = [];
  phase = "script";
}

function answerScript(option: string) {
  const q = scriptProbes[scriptIndex];
  if (!q || tapLocked()) return;
  scriptReviews.push(reviewScript(q, option));
  if (option === q.answer) scriptCorrect += 1;
  if (scriptIndex + 1 < scriptProbes.length) {
    scriptIndex += 1;
  } else {
    readsCyrillic = canReadCyrillic(scriptCorrect, scriptProbes.length);
    startVocab();
  }
  lockTaps();
}

function startVocab() {
  sectionIndex = 0;
  loadSection();
}

// Set up the next section to probe, or finish once every section is done.
function loadSection() {
  if (sectionIndex >= PLACEMENT_TOPICS.length) {
    void finish();
    return;
  }
  sectionProbes = buildSectionProbes(PLACEMENT_TOPICS[sectionIndex]);
  probeIndex = 0;
  sectionCorrect = 0;
  sectionCorrectIds = [];
  sectionReviews = [];
  // A section with no words can't be probed. Record it unpassed and move on.
  if (sectionProbes.length === 0) {
    finalizeSection();
    return;
  }
  phase = "vocab";
}

// Fold the just-finished section into the outcomes + breakdown, then advance.
function finalizeSection() {
  const topic = PLACEMENT_TOPICS[sectionIndex];
  const passed = sectionPassed(sectionCorrect, sectionProbes.length);
  outcomes.push({ topic, correctIds: sectionCorrectIds, passed });
  sectionGroups.push({
    topic,
    name: levelNameByTopic.get(topic) ?? topic,
    passed,
    reviews: sectionReviews,
  });
  sectionIndex += 1;
  loadSection();
}

// Score a typed probe (empty string = the "I don't know" decline) and advance.
function answerVocab(typed: string) {
  const word = sectionProbes[probeIndex];
  if (!word || tapLocked()) return;
  const row = reviewVocab(word, typed);
  sectionReviews.push(row);
  if (row.isCorrect) {
    sectionCorrect += 1;
    sectionCorrectIds.push(word.id);
  }
  answer = "";
  if (probeIndex + 1 < sectionProbes.length) {
    probeIndex += 1;
  } else {
    finalizeSection();
  }
  lockTaps();
}

// Persist the estimate: route the script preference, seed the alphabet known if
// they read Cyrillic, and seed the vocabulary they demonstrated (the words they
// got right, plus every word in a section they cleared in full, never beyond).
// Onboarding is marked done here (the moment the test finishes), so the whole
// result is saved without the learner having to tap "Start learning"; closing the
// tab on the results screen no longer re-runs onboarding. `done()` is then purely
// navigation. (The dashboard chrome, gated on `onboarded`, reveals alongside the
// breakdown; the learner is in fact onboarded at this point.)
async function finish() {
  await guard(async () => {
    phase = "applying";
    const passedTopics = new Set<Topic>(
      outcomes.filter((o) => o.passed).map((o) => o.topic),
    );
    await setPreference("script", readsCyrillic ? "cyrillic" : "latin");
    // One markKnown call for everything (alphabet first, then words in
    // curriculum order): the confirmation drip's per-day cap is per call, so
    // separate calls would each start at day one and stack on the same days.
    await markKnown([
      ...(readsCyrillic ? levelItemIds(LEVELS[0]) : []),
      ...wordsKnownFromSections(outcomes),
    ]);
    await setPreference("onboarded", true);
    const level = projectedStartLevel(passedTopics, readsCyrillic);
    startLabel = `Level ${levelNumber(level)} · ${level.name}`;
    phase = "results";
  });
}

// Skip path: today's beginner onboarding. Pick a script, seed nothing, mark
// onboarding done, and start from the top.
async function skipWith(choice: Script) {
  await guard(async () => {
    phase = "applying";
    await setPreference("script", choice);
    await setPreference("onboarded", true);
    done();
  });
}

// Leave the results (or skip) screen: resume the caller's session inline, or
// navigate to /app standalone. Onboarding is already persisted by this point
// (`finish()` for the test, `skipWith()` for the skip), so this is purely
// navigation. Nothing is lost if the learner never reaches it.
function done() {
  if (onComplete) onComplete();
  else window.location.href = "/app";
}

function handleKey(event: KeyboardEvent) {
  // Auto-repeat from a held key is never a deliberate second answer: drop it so
  // holding a 1-5 key can't race through the test, answering every remaining
  // question. Deliberate fast typing fires distinct keydowns (repeat === false)
  // and is unaffected. Mirrors the Reviewer's handler.
  if (event.repeat) return;
  if (phase === "script") {
    const q = scriptProbes[scriptIndex];
    if (!q) return;
    if (event.key === "5") answerScript(SKIP_LABEL);
    else if (event.key >= "1" && event.key <= String(q.options.length))
      answerScript(q.options[Number(event.key) - 1]);
  } else if (phase === "vocab") {
    // Typing happens in the answer box (Enter submits via the form); the only
    // global key is Esc for "I don't know", mirroring the Reviewer's typed mode.
    if (event.key === "Escape") answerVocab("");
  }
}

const scriptCurrent = $derived(scriptProbes[scriptIndex]);
const vocabCurrent = $derived(sectionProbes[probeIndex]);
const sectionName = $derived(
  levelNameByTopic.get(PLACEMENT_TOPICS[sectionIndex]) ?? "",
);

// Script phase only: answering destroys the clicked option button (options
// rebuild per question), which would silently drop keyboard focus to <body>
// between questions. Pull focus back to the question card on every advance so
// Tab reaches the new options directly and screen readers read on from the
// question. The card, not an option: a focused option would let a held-down
// Enter chain-answer several questions via native button activation, with no
// undo here. The vocab phase needs none of this: its answer form persists
// across probes, so the input keeps focus and the learner just types on.
let questionEl = $state<HTMLElement | undefined>();
$effect(() => {
  void scriptIndex;
  if (phase === "script" && questionEl) {
    questionEl.focus({ preventScroll: true });
  }
});

// The $effect re-focuses the still-mounted question card; the terminal screens are
// a fresh mount, so re-anchor them too or focus drops to <body>. As DoneScreen/Reviewer.
function focusOnMount(node: HTMLElement) {
  node.focus({ preventScroll: true });
}
</script>

<svelte:window onkeydown={handleKey} />

<div class="mx-auto flex w-full max-w-xl flex-col gap-6">
  {#if phase === "loading" || phase === "applying"}
    <p class="py-20 text-center text-fg-muted">
      {phase === "applying" ? "Setting up your deck…" : "Loading…"}
    </p>
  {:else if phase === "intro"}
    <div
      class="flex flex-col items-center gap-5 rounded-2xl border border-border bg-bg-elev p-10 text-center"
    >
      <p lang="sr" class="text-5xl font-bold">Здраво!</p>
      <div>
        <p class="text-lg font-semibold">Let's find your starting point</p>
        <p class="mt-1 text-sm text-fg-muted">
          A quick check: read a few Cyrillic letters, then type the meaning of
          a handful of words from each topic. We only skip a topic you get every
          word right on; tap "I don't know" instead of guessing. New to
          Serbian? Skip it and start from the beginning.
        </p>
      </div>
      <div class="grid w-full gap-3 sm:grid-cols-2">
        <button
          type="button"
          onclick={startTest}
          class="flex flex-col items-center gap-1 rounded-xl border border-primary bg-primary px-4 py-5 text-on-primary transition-colors hover:border-primary-strong hover:bg-primary-strong"
        >
          <span class="text-lg font-bold">Take the check</span>
          <span class="text-xs opacity-80">a few minutes</span>
        </button>
        <button
          type="button"
          onclick={() => (phase = "scriptChoice")}
          class="flex flex-col items-center gap-1 rounded-xl border border-border px-4 py-5 transition-colors hover:bg-primary-soft"
        >
          <span class="text-lg font-bold">Skip</span>
          <span class="text-xs text-fg-muted">I'm new to Serbian</span>
        </button>
      </div>
    </div>
  {:else if phase === "scriptChoice"}
    <div
      class="flex flex-col items-center gap-5 rounded-2xl border border-border bg-bg-elev p-10 text-center"
    >
      <div>
        <p class="text-lg font-semibold">Which script should prompts use?</p>
        <p class="mt-1 text-sm text-fg-muted">
          You can switch anytime. The alphabet is always taught in Cyrillic.
        </p>
      </div>
      <div class="grid w-full gap-3 sm:grid-cols-2">
        <button
          type="button"
          onclick={() => skipWith("cyrillic")}
          class="flex flex-col items-center gap-1 rounded-xl border border-primary bg-primary px-4 py-5 text-on-primary transition-colors hover:border-primary-strong hover:bg-primary-strong"
        >
          <span lang="sr" class="text-2xl font-bold">Ћирилица</span>
          <span class="text-xs opacity-80">Cyrillic · recommended</span>
        </button>
        <button
          type="button"
          onclick={() => skipWith("latin")}
          class="flex flex-col items-center gap-1 rounded-xl border border-border px-4 py-5 transition-colors hover:bg-primary-soft"
        >
          <span class="text-2xl font-bold">Latinica</span>
          <span class="text-xs text-fg-muted">Latin</span>
        </button>
      </div>
    </div>
  {:else if phase === "script" && scriptCurrent}
    <p class="text-center text-sm text-fg-muted">
      Reading check · {scriptIndex + 1} of {scriptProbes.length}
    </p>
    <div
      bind:this={questionEl}
      tabindex="-1"
      class="flex flex-col items-center gap-1 rounded-2xl border border-border bg-bg-elev p-10 text-center shadow-sm focus:outline-none"
    >
      <span class="text-xs font-semibold uppercase tracking-[0.18em] text-fg-muted">
        Which letter is this?
      </span>
      <p lang="sr" class="text-7xl font-bold leading-none">
        {scriptCurrent.letter.cyrillic}
      </p>
      <p lang="sr" class="text-2xl text-fg-muted">
        {scriptCurrent.letter.cyrillicLower}
      </p>
    </div>
    <div class="grid grid-cols-2 gap-2">
      {#each scriptCurrent.options as option, i (option)}
        <button
          type="button"
          onclick={() => answerScript(option)}
          class="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-lg font-medium transition hover:bg-primary-soft"
        >
          <span>{option}</span>
          <span class="text-xs text-fg-muted">{i + 1}</span>
        </button>
      {/each}
    </div>
    <button
      type="button"
      onclick={() => answerScript(SKIP_LABEL)}
      class="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm font-medium text-fg-muted transition hover:bg-primary-soft hover:text-fg"
    >
      <span class="w-4" aria-hidden="true"></span>
      <span>I don't know this</span>
      <span class="w-4 text-right text-xs text-fg-muted">5</span>
    </button>
  {:else if phase === "vocab" && vocabCurrent}
    <p class="text-center text-sm text-fg-muted">
      Vocabulary · topic {sectionIndex + 1} of {PLACEMENT_TOPICS.length} · {sectionName}
    </p>
    <div
      class="flex flex-col items-center gap-1 rounded-2xl border border-border bg-bg-elev p-10 text-center shadow-sm"
    >
      <span class="text-xs font-semibold uppercase tracking-[0.18em] text-fg-muted">
        What does this word mean?
      </span>
      <p lang="sr" class="text-5xl font-bold leading-none">
        {vocabCurrent.cyrillic}
      </p>
      <p class="text-xl text-fg-muted">{vocabCurrent.latin}</p>
    </div>
    <TypedAnswerForm
      kind="word"
      front={vocabCurrent.cyrillic}
      bind:answer
      onCheck={() => answer.trim() && answerVocab(answer)}
      onUnknown={() => answerVocab("")}
    />
  {:else if phase === "results"}
    <div
      tabindex="-1"
      use:focusOnMount
      class="flex flex-col items-center gap-4 rounded-2xl border border-border bg-bg-elev p-10 text-center focus:outline-none"
    >
      <p class="flex items-center justify-center gap-2 text-2xl font-semibold">
        All set!
        <Icon name="party-popper" size={24} class="text-primary" />
      </p>
      <p class="text-fg-muted">
        {#if readsCyrillic}
          You can read Cyrillic, so prompts will be in <span lang="sr">Ћирилица</span>.
        {:else}
          We'll teach you the Cyrillic alphabet first, with Latin prompts to start.
        {/if}
      </p>
      <p class="text-lg font-medium">We'll start you around {startLabel}.</p>
      {#if sectionGroups.length > 0}
        <p class="text-sm text-fg-muted">
          You cleared {knownSectionCount} of {sectionGroups.length} topics. Those are
          marked known and skipped ahead.
        </p>
      {/if}
      <p class="text-sm text-fg-muted">
        Words you already know get a single confirming review. Anything
        you've actually forgotten will resurface normally.
      </p>
    </div>

    <button
      type="button"
      onclick={done}
      class="btn-primary py-3"
    >
      Start learning
    </button>

    {#if totalQuestions > 0}
      <section class="rounded-2xl border border-border bg-bg-elev p-6">
        <div class="text-center">
          <h2 class="text-xl font-semibold">How you did</h2>
          <p class="mt-0.5 text-sm text-fg-muted">
            {totalCorrect} / {totalQuestions} correct
          </p>
        </div>

        {#if scriptReviews.length > 0}
          <h3 class="mt-5 text-sm font-semibold text-fg-muted">Reading</h3>
          <ul class="mt-2 flex flex-col gap-0.5">
            {#each scriptReviews as r (r.id)}
              <AnswerRow {r} />
            {/each}
          </ul>
        {/if}

        {#each sectionGroups as g (g.topic)}
          {#if g.reviews.length > 0}
            <div class="mt-5 flex items-baseline justify-between gap-3">
              <h3 class="text-sm font-semibold">{g.name}</h3>
              <span
                class="text-xs font-medium {g.passed
                  ? 'text-success'
                  : 'text-fg-muted'}"
              >
                {#if g.passed}
                  <span class="inline-flex items-center gap-1">
                    Known <Icon name="check" size={14} />
                  </span>
                {:else}
                  {g.reviews.filter((r) => r.isCorrect).length}/{g.reviews
                    .length}
                {/if}
              </span>
            </div>
            <ul class="mt-2 flex flex-col gap-0.5">
              {#each g.reviews as r (r.id)}
                <AnswerRow {r} />
              {/each}
            </ul>
          {/if}
        {/each}
      </section>
    {/if}
  {:else if phase === "error"}
    <div
      tabindex="-1"
      use:focusOnMount
      class="flex flex-col items-center gap-4 rounded-2xl border border-border bg-bg-elev p-10 text-center focus:outline-none"
    >
      <p class="text-lg font-semibold">We couldn't save your progress</p>
      <p class="text-sm text-fg-muted">
        Your answers are still here. Saving to this browser failed, which can
        happen in private browsing or when storage is full. Try again.
      </p>
      <button type="button" onclick={retry} class="btn-primary py-3">
        Try again
      </button>
    </div>
  {/if}

  <!-- One persistent live region (announcements only fire reliably from an
       aria-live node that already exists in the DOM): voices each question as
       the visuals swap, and the final placement result. -->
  <p role="status" class="sr-only">
    {#if phase === "script" && scriptCurrent}
      Reading check, {scriptIndex + 1} of {scriptProbes.length}. Which letter is
      this? <span lang="sr">{scriptCurrent.letter.cyrillic}</span>
    {:else if phase === "vocab" && vocabCurrent}
      Vocabulary, {sectionName}, {probeIndex + 1} of {sectionProbes.length}.
      Type what <span lang="sr">{vocabCurrent.cyrillic}</span>
      ({vocabCurrent.latin}) means.
    {:else if phase === "results"}
      All set. We'll start you around {startLabel}.
    {:else if phase === "error"}
      We couldn't save your progress. Your answers are still here. Try again.
    {/if}
  </p>
</div>
