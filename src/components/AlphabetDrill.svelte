<script lang="ts">
import DrillShell from "~/components/DrillShell.svelte";
import SrAuto from "~/components/SrAuto.svelte";
import { alphabet } from "~/data/alphabet";
import { buildDrill, type DrillQuestion } from "~/lib/study/alphabet-drill";
import { DrillSession } from "~/lib/study/drill-session.svelte";

const session = new DrillSession<DrillQuestion>();
// The drill runs immediately on this page (there's no picker), so load without
// pulling focus: it mustn't be yanked from the top of the page on load.
session.load(buildDrill(alphabet), false);
session.focusOnAdvance();

function restart() {
  session.load(buildDrill(alphabet), true);
}
</script>

<DrillShell
  {session}
  unit="Letter"
  question="Which letter is this?"
  optionCols={2}
  optionClass="text-lg"
>
  {#snippet prompt(q)}
    <p
      lang="sr"
      class="text-7xl font-bold leading-none"
      class:sr-italic={q.form === "italic"}
    >
      {q.letter.cyrillic}
    </p>
    <p
      lang="sr"
      class="text-2xl text-fg-muted"
      class:sr-italic={q.form === "italic"}
    >
      {q.letter.cyrillicLower}
    </p>
    {#if q.form === "italic"}
      <span class="text-xs font-medium text-fg-muted">in italics</span>
    {/if}
  {/snippet}

  {#snippet reveal(q)}
    <p class="font-medium">
      <span lang="sr">{q.letter.cyrillic}{q.letter.cyrillicLower}</span> = {q.answer}
      <span class="text-fg-muted">· {q.letter.ipa}</span>
    </p>
    {#if q.letter.mnemonic}
      <p class="mt-1 text-fg-muted"><SrAuto text={q.letter.mnemonic} /></p>
    {/if}
    <p class="mt-1 text-fg-muted">
      <span lang="sr">{q.letter.example}</span> — {q.letter.exampleEn}
    </p>
  {/snippet}

  {#snippet spokenPrompt(q)}
    Which letter is this? <span lang="sr">{q.letter.cyrillic}</span>
  {/snippet}

  {#snippet done()}
    <p class="text-fg-muted">
      {session.correct === session.round.length
        ? "Perfect! You can read every letter."
        : "Nice work. Run it again to lock in the tricky ones."}
    </p>
    <button type="button" onclick={restart} class="btn-primary mt-2 px-5 py-2">
      Practise again
    </button>
  {/snippet}
</DrillShell>
