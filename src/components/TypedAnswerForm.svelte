<script lang="ts">
import type { CardKind } from "~/lib/content/types";

// `answer` is bindable rather than owned here: the caller reads it live; the
// recap row records what was typed (even on an Esc "I don't know"), and the
// caller clears it between cards. Takes the prompt's kind and front text
// rather than a full StudyItem so the placement test's word probes can use the
// same form as the Reviewer's cards.
let {
  kind,
  front,
  answer = $bindable(),
  onCheck,
  onUnknown,
}: {
  kind: CardKind;
  front: string;
  answer: string;
  onCheck: () => void;
  onUnknown: () => void;
} = $props();

// Focus the answer box as each typed card mounts, so the learner can start
// typing without reaching for the mouse. (Native `autofocus` only fires on the
// first page load, not when the input is re-created for the next card.)
function autofocus(node: HTMLInputElement) {
  node.focus();
}
</script>

<form
  onsubmit={(e) => {
    e.preventDefault();
    onCheck();
  }}
  class="flex flex-col gap-2"
>
  <input
    type="text"
    bind:value={answer}
    use:autofocus
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    spellcheck="false"
    aria-label={kind === "letter"
      ? `Type the Latin letter for ${front}`
      : `Type the meaning of ${front} in English`}
    placeholder={kind === "letter"
      ? "Type the Latin letter"
      : "Type the meaning in English"}
    class="w-full rounded-lg border border-border bg-bg px-4 py-3 text-center text-lg focus:border-primary focus:outline-none"
  />
  <button
    type="submit"
    disabled={!answer.trim()}
    class="btn-primary touch-manipulation py-3 disabled:cursor-not-allowed disabled:opacity-50"
  >
    Check <span class="opacity-60">(enter)</span>
  </button>
  <button
    type="button"
    onclick={onUnknown}
    class="touch-manipulation rounded-lg border border-border py-3 text-sm font-medium text-fg-muted hover:bg-primary-soft hover:text-fg"
  >
    I don't know <span class="opacity-60">(esc)</span>
  </button>
</form>
