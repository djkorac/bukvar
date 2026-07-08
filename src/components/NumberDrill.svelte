<script lang="ts">
import DrillShell from "~/components/DrillShell.svelte";
import { DrillSession } from "~/lib/study/drill-session.svelte";
import {
  buildNumberRound,
  NUMBER_RANGES,
  type NumberQuestion,
} from "~/lib/study/number-drill";

// The chosen ceiling for the running drill; null = the range picker is showing.
let max = $state<number | null>(null);

const session = new DrillSession<NumberQuestion>();
session.focusOnAdvance();

// Group the digits (123456 → "123,456") so big numbers stay legible; the
// numeral is digits, not Serbian, so it keeps the default UI language.
const grouped = (value: number): string => value.toLocaleString("en-US");

function start(ceiling: number) {
  max = ceiling;
  session.load(buildNumberRound(ceiling), true);
}

function backToRanges() {
  max = null;
  session.load([], false);
}
</script>

<DrillShell
  {session}
  unit="Number"
  question="How do you say this number?"
  optionCols={1}
  optionClass="gap-3 text-left"
  srOptions
>
  {#snippet picker()}
    <div class="flex flex-col gap-4">
      <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {#each NUMBER_RANGES as range (range.max)}
          <button
            type="button"
            onclick={() => start(range.max)}
            class="rounded-lg border border-border bg-bg-elev px-4 py-3 text-left font-medium transition hover:bg-primary-soft"
          >
            {range.label}
          </button>
        {/each}
      </div>
      <p class="text-sm text-fg-muted">
        Still learning the number words? Try the
        <a
          href="/practice?topic=numbers"
          class="font-medium text-primary underline underline-offset-2"
          >number vocabulary</a
        >.
      </p>
    </div>
  {/snippet}

  {#snippet changeAction()}
    <button
      type="button"
      onclick={backToRanges}
      class="font-medium hover:text-fg"
    >
      Change range
    </button>
  {/snippet}

  {#snippet prompt(q)}
    <p class="text-6xl font-bold leading-none tabular-nums">
      {grouped(q.value)}
    </p>
  {/snippet}

  {#snippet reveal(q)}
    <p class="font-medium">
      {grouped(q.value)} =
      <span lang="sr">{q.answer}</span>
      <span class="text-fg-muted">({q.latin})</span>
    </p>
  {/snippet}

  {#snippet spokenPrompt(q)}
    How do you say {grouped(q.value)}?
  {/snippet}

  {#snippet done()}
    <p class="text-fg-muted">
      {session.correct === session.round.length
        ? "Perfect! You can read these numbers."
        : "Nice work. Another round locks in the tricky ones."}
    </p>
    <div class="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-center">
      <button
        type="button"
        onclick={() => max !== null && start(max)}
        class="btn-primary px-5 py-2"
      >
        Practise again
      </button>
      <button
        type="button"
        onclick={backToRanges}
        class="btn-secondary px-5 py-2"
      >
        Change range
      </button>
    </div>
  {/snippet}
</DrillShell>
