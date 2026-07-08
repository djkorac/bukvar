<script lang="ts">
import { onMount } from "svelte";
import DrillShell from "~/components/DrillShell.svelte";
import SrAuto from "~/components/SrAuto.svelte";
import { wordsForTopics } from "~/lib/content/corpus";
import type { Topic } from "~/lib/content/types";
import { DrillSession } from "~/lib/study/drill-session.svelte";
import { getLevelProgress } from "~/lib/study/levels";
import {
  buildPracticeRound,
  PRACTICE_LEVELS,
  type PracticeQuestion,
  parsePracticeTopics,
} from "~/lib/study/practice";

// Per-level word counts for the picker, straight from the static corpus.
const levelCounts = new Map<Topic, number>(
  PRACTICE_LEVELS.map((l) => [l.topic, wordsForTopics([l.topic]).length]),
);

// The topics behind the running drill; empty = the picker is showing.
let topics = $state<Topic[]>([]);
// The learner's current level, to badge in the picker. Read from the deck;
// "alphabet" (a fresh deck) never matches a picker entry, so no badge shows.
let currentLevelId = $state<Topic | null>(null);

const session = new DrillSession<PracticeQuestion>();
session.focusOnAdvance();

onMount(async () => {
  // Deep link: /practice?topic=travel (or topic=verbs-core,verbs from the
  // merged landing pages) skips the picker and starts the drill directly. No
  // focus pull: it starts without a gesture, so focus stays at the page top.
  const fromUrl = parsePracticeTopics(
    new URLSearchParams(location.search).get("topic"),
  );
  if (fromUrl.length > 0) start(fromUrl, false);
  // Best-effort badge: a failed read just leaves the "Your level" badge off.
  currentLevelId =
    (await getLevelProgress().catch(() => null))?.currentLevelId ?? null;
});

function start(selected: Topic[], focus: boolean) {
  topics = selected;
  session.load(buildPracticeRound(selected), focus);
}

function backToTopics() {
  topics = [];
  session.load([], false);
  // Drop a stale ?topic= deep link so a reload comes back to the picker.
  history.replaceState(null, "", location.pathname);
}
</script>

<DrillShell
  {session}
  unit="Word"
  question="What does this word mean?"
  optionCols={1}
  optionClass="gap-3 text-left"
>
  {#snippet picker()}
    <div class="flex flex-col gap-4">
      <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {#each PRACTICE_LEVELS as level (level.id)}
          <button
            type="button"
            onclick={() => start([level.topic], true)}
            class="flex items-center justify-between gap-2 rounded-lg border border-border bg-bg-elev px-4 py-3 text-left font-medium transition hover:bg-primary-soft"
          >
            <span>
              {level.name}
              {#if level.topic === currentLevelId}
                <span
                  class="ml-1 rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary"
                  >Your level</span
                >
              {/if}
            </span>
            <span class="shrink-0 text-xs text-fg-muted">
              {levelCounts.get(level.topic)} words
            </span>
          </button>
        {/each}
      </div>
      <p class="text-sm text-fg-muted">
        Practising the letters instead? Try the
        <a
          href="/alphabet"
          class="font-medium text-primary underline underline-offset-2"
          >alphabet drill</a
        >.
      </p>
    </div>
  {/snippet}

  {#snippet changeAction()}
    <button
      type="button"
      onclick={backToTopics}
      class="font-medium hover:text-fg"
    >
      Change topic
    </button>
  {/snippet}

  {#snippet prompt(q)}
    <p lang="sr" class="text-5xl font-bold leading-none">
      {q.word.cyrillic}
    </p>
    <p class="text-xl text-fg-muted">{q.word.latin}</p>
  {/snippet}

  {#snippet reveal(q)}
    <p class="font-medium">
      <span lang="sr">{q.word.cyrillic}</span>
      ({q.word.latin}) = {q.answer}
      {#if q.word.ipa}
        <span class="text-fg-muted">· {q.word.ipa}</span>
      {/if}
    </p>
    {#if q.word.mnemonic}
      <p class="mt-1 text-fg-muted"><SrAuto text={q.word.mnemonic} /></p>
    {/if}
    {#if q.word.examples && q.word.examples.length > 0}
      <p class="mt-1 text-fg-muted">
        <span lang="sr">{q.word.examples[0].cyrillic}</span>
        — {q.word.examples[0].english}
      </p>
    {/if}
  {/snippet}

  {#snippet spokenPrompt(q)}
    What does <span lang="sr">{q.word.cyrillic}</span> ({q.word.latin}) mean?
  {/snippet}

  {#snippet done()}
    <p class="text-fg-muted">
      {session.correct === session.round.length
        ? "Perfect! You know these words."
        : "Nice work. Another round locks in the tricky ones."}
    </p>
    <p class="text-sm text-fg-muted">
      Practice rounds never change your review schedule.
    </p>
    <div class="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-center">
      <button
        type="button"
        onclick={() => start(topics, true)}
        class="btn-primary px-5 py-2"
      >
        Practise again
      </button>
      <button
        type="button"
        onclick={backToTopics}
        class="btn-secondary px-5 py-2"
      >
        Choose another topic
      </button>
    </div>
  {/snippet}
</DrillShell>
