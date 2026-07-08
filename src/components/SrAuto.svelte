<script lang="ts">
/**
 * Svelte twin of `SrAuto.astro` for the reviewer islands (the drills, the
 * reviewer, the history leech list): auto-detects inline Serbian Cyrillic in a
 * derived data string and wraps each run in `lang="sr"`. Shares the one tested
 * `segmentCyrillic` core so the two frameworks can't drift.
 */
import { segmentCyrillic } from "~/lib/content/segment-cyrillic";

interface Props {
  /** Optional so a caller can pass an optional field (e.g. a mnemonic) straight
   * through; an absent or empty string renders nothing. */
  text?: string;
}
const { text = "" }: Props = $props();
</script>
{#each segmentCyrillic(text) as seg}{#if seg.sr}<span lang="sr">{seg.text}</span>{:else}{seg.text}{/if}{/each}
