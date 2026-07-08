<script lang="ts">
import Icon from "~/components/Icon.svelte";
import type { AnswerReview } from "~/lib/study/answer-review";

/**
 * One row of an answer breakdown: the Serbian prompt, what the learner gave, and
 * (on a miss) the correct answer. Shared by the placement-test scorecard and
 * the end-of-lesson recap so the two render identically.
 */
let { r }: { r: AnswerReview } = $props();
</script>

<li
  class="flex items-center gap-3 rounded-lg border-l-4 px-3 py-2 odd:bg-bg {r.isCorrect
    ? 'border-success'
    : 'border-accent'}"
>
  <span
    class="flex w-4 shrink-0 items-center justify-center {r.isCorrect
      ? 'text-success'
      : 'text-accent'}"
  >
    <Icon name={r.isCorrect ? "check" : "x"} />
    <!-- The icon is aria-hidden and the row's color carries no semantics for a
         screen reader, so the verdict is spelled out invisibly. -->
    <span class="sr-only">{r.isCorrect ? "Correct:" : "Incorrect:"}</span>
  </span>
  <div
    class="flex flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3"
  >
    <span class="flex items-baseline gap-2">
      <span lang="sr" class="font-semibold">{r.prompt}</span>
      {#if r.promptSub}
        <span lang="sr" class="text-sm text-fg-muted">{r.promptSub}</span>
      {/if}
    </span>
    <span class="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
      {#if r.isCorrect}
        <span class="font-medium text-success">{r.chosen}</span>
      {:else}
        <span class="text-fg-muted"
          ><span class="sr-only">your answer: </span>{r.chosen}</span
        >
        <Icon name="arrow-right" size={14} class="text-fg-muted" />
        <span class="font-medium text-success"
          ><span class="sr-only">correct answer: </span>{r.correct}</span
        >
      {/if}
    </span>
  </div>
</li>
