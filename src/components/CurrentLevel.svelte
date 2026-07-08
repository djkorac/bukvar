<script lang="ts">
import Icon from "~/components/Icon.svelte";
import { LEVELS, levelNumber } from "~/lib/content/levels";
import { liveValue } from "~/lib/db/live-query.svelte";
import { isOnboarded } from "~/lib/db/settings";
import { getLevelProgress } from "~/lib/study/levels";

// Compact dashboard indicator of the current level, linking to the levels map.
// Read-only: it never seeds (the Reviewer on this page owns first-run seeding),
// so before the deck exists it degrades to the first level. Stays hidden through
// first-run onboarding (the placement test owns the screen), then resolves (and
// thereafter tracks) the current level as cards progress.
//
// The whole read lives in the querier (not a subscribe callback) so liveValue's
// error arm covers both the isOnboarded and getLevelProgress reads; on a rejected
// read `current` stays null and the chip simply stays hidden; absence is more
// honest on a compact pill than a stuck spinner.
const level = liveValue<string | null>(async () => {
  if (!(await isOnboarded())) return null;
  const summary = await getLevelProgress();
  const lvl = LEVELS.find((l) => l.id === summary.currentLevelId) ?? LEVELS[0];
  return `Level ${levelNumber(lvl)} · ${lvl.name}`;
}, null);
</script>

{#if level.current}
  <a
    href="/levels"
    class="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elev px-3 py-1 text-sm text-fg-muted hover:bg-primary-soft"
  >
    <span class="font-medium text-fg">{level.current}</span>
    <Icon name="arrow-right" class="opacity-60" />
  </a>
{/if}
