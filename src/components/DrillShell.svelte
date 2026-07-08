<script lang="ts" generics="Q extends DrillQuestion">
import type { Snippet } from "svelte";
import { OPTION_CLASS } from "~/components/drill-option-class";
import type {
  DrillQuestion,
  DrillSession,
} from "~/lib/study/drill-session.svelte";

let {
  session,
  unit,
  question,
  optionCols,
  optionClass,
  srOptions = false,
  picker,
  prompt,
  reveal,
  spokenPrompt,
  done,
  changeAction,
}: {
  /** The drill engine, owned by the parent (it knows the concrete question type). */
  session: DrillSession<Q>;
  /** The counted noun in the status row and live region ("Letter"/"Number"/"Word"). */
  unit: string;
  /** The prompt-card sub-heading ("Which letter is this?"). */
  question: string;
  /** Option-grid columns: 2 for the short alphabet options, 1 for words/numbers. */
  optionCols: 1 | 2;
  /** Per-drill utility classes on each option button (size/alignment). */
  optionClass: string;
  /** Options are Serbian, so the buttons and the spoken answer carry lang="sr". */
  srOptions?: boolean;
  /** Pre-drill picker. Absent for the always-on alphabet drill. */
  picker?: Snippet;
  /** The big prompt face under the question heading. */
  prompt: Snippet<[Q]>;
  /** The post-answer reveal-panel contents. */
  reveal: Snippet<[Q]>;
  /** The live-region question, spoken with the prompt's actual content. */
  spokenPrompt: Snippet<[Q]>;
  /** The done-card body under the shared score heading (copy + restart actions). */
  done: Snippet;
  /** Optional status-row secondary action (change range/topic). */
  changeAction?: Snippet;
} = $props();

// A local alias so `{:else if current}` narrows the question to non-undefined;
// TypeScript can't narrow a getter (`session.current`) across the template.
const current = $derived(session.current);
</script>

<svelte:window onkeydown={(e) => session.handleKey(e)} />

{#if session.round.length === 0 && picker}
  {@render picker()}
{:else}
  <div class="mx-auto flex w-full max-w-md flex-col gap-5">
    {#if session.done}
      <div
        bind:this={session.card}
        tabindex="-1"
        class="flex flex-col items-center gap-3 rounded-2xl border border-border bg-bg-elev p-10 text-center focus:outline-none"
      >
        <p class="text-2xl font-semibold">
          {session.correct}/{session.round.length} correct
        </p>
        {@render done()}
      </div>
    {:else if current}
      <div class="flex items-center justify-between text-sm text-fg-muted">
        <span>{unit} {session.index + 1} of {session.round.length}</span>
        {#if changeAction}
          <span class="flex items-center gap-3">
            <span>{session.correct} correct</span>
            {@render changeAction()}
          </span>
        {:else}
          <span>{session.correct} correct</span>
        {/if}
      </div>

      <div
        bind:this={session.card}
        tabindex="-1"
        class="flex flex-col items-center gap-1 rounded-2xl border border-border bg-bg-elev p-10 text-center shadow-sm focus:outline-none"
      >
        <span class="text-xs font-semibold uppercase tracking-[0.18em] text-fg-muted">
          {question}
        </span>
        {@render prompt(current)}
      </div>

      <div class="grid gap-2 {optionCols === 2 ? 'grid-cols-2' : 'grid-cols-1'}">
        {#each current.options as option, i (option)}
          <button
            type="button"
            onclick={() => session.choose(option)}
            disabled={session.chosen !== null}
            lang={srOptions ? "sr" : undefined}
            class="flex items-center justify-between rounded-lg border px-4 py-3 font-medium transition {optionClass} {OPTION_CLASS[
              session.optionState(option)
            ]}"
          >
            <span>{option}</span>
            {#if session.chosen === null}
              <span class="text-xs text-fg-muted">{i + 1}</span>
            {/if}
          </button>
        {/each}
      </div>

      {#if session.chosen !== null}
        <div class="rounded-lg border border-border bg-bg-elev p-4 text-sm">
          {@render reveal(current)}
        </div>
        <button type="button" onclick={() => session.next()} class="btn-primary py-3">
          Next <span class="opacity-60">(space)</span>
        </button>
      {/if}
    {/if}
  </div>
{/if}

<!-- One persistent live region, a root-level sibling so it survives the
     picker↔drill swap (announcements only fire reliably from an aria-live node
     already in the DOM): voices each prompt as the card swaps, and the verdict
     + answer once an option is chosen. Mirrors Reviewer. Lives here, shared by
     all three drills, so the screen-reader surface can't drift between them. -->
<p role="status" class="sr-only">
  {#if session.done}
    {session.correct} of {session.round.length} correct.
  {:else if current}
    {#if session.chosen !== null}
      {session.chosen === current.answer ? "Correct." : "Not quite."}
      The answer is {#if srOptions}<span lang="sr">{current.answer}</span>{:else}{current.answer}{/if}.
    {:else}
      {unit} {session.index + 1} of {session.round.length}. {@render spokenPrompt(current)}
    {/if}
  {/if}
</p>
