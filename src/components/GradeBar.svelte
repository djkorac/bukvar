<script module lang="ts">
import { type Grade, Rating } from "~/lib/srs/scheduler";

/**
 * The four FSRS grades in keyboard order (1-4). Exported so the Reviewer's
 * window-level key handler maps digit keys from the same source the buttons
 * render from. Full class strings (not built from fragments) so Tailwind's
 * scanner emits each utility.
 */
export const GRADES: { label: string; rating: Grade; classes: string }[] = [
  {
    label: "Again",
    rating: Rating.Again,
    classes: "border-accent text-accent",
  },
  { label: "Hard", rating: Rating.Hard, classes: "border-border text-fg" },
  {
    label: "Good",
    rating: Rating.Good,
    classes: "border-primary text-primary",
  },
  {
    label: "Easy",
    rating: Rating.Easy,
    classes: "border-primary bg-primary text-on-primary",
  },
];
</script>

<script lang="ts">
let { onGrade }: { onGrade: (rating: Grade) => void } = $props();
</script>

<div class="grid grid-cols-4 gap-2">
  {#each GRADES as g, i (g.label)}
    <button
      type="button"
      onclick={() => onGrade(g.rating)}
      class="flex touch-manipulation flex-col items-center rounded-lg border px-2 py-3 text-sm font-medium transition hover:opacity-90 {g.classes}"
    >
      <span>{g.label}</span>
      <span class="text-xs opacity-60">{i + 1}</span>
    </button>
  {/each}
</div>
