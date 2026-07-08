<script lang="ts">
import Icon from "~/components/Icon.svelte";
import SrAuto from "~/components/SrAuto.svelte";
import { cardHref } from "~/lib/content/corpus";
import { liveValue } from "~/lib/db/live-query.svelte";
import { getRequestRetention, isOnboarded } from "~/lib/db/settings";
import { DEFAULT_REQUEST_RETENTION } from "~/lib/srs/scheduler";
import { dayLabel } from "~/lib/study/day";
import {
  getHistory,
  type History,
  heatmapMonthLabels,
} from "~/lib/study/history";
import { getLeeches, type LeechCard } from "~/lib/study/leeches";

// liveQuery re-runs each read on any write to the table it touches, so the page
// refreshes itself after each graded card with no coupling to the reviewer.
// liveValue adds the error arm a bare subscribe omits, so a rejected read shows a
// retry rather than stranding the page on "Loading…".
// The onboarding check lives inside the querier (mirrors CurrentLevel.svelte), so
// one error arm covers both reads: a rejected isOnboarded() OR getHistory() lands
// in `errored` and shows the retry below, instead of an errored onboarding read
// silently blanking the panel for a returning learner. Returns the "hidden"
// sentinel pre-onboarding so the template can tell that apart from loading (null).
const history = liveValue<History | "hidden" | null>(async () => {
  if (!(await isOnboarded())) return "hidden";
  return getHistory();
}, null);
// Cards the learner keeps failing (FSRS lapses past the leech threshold). Empty
// for everyone until a card has been failed enough times.
const leeches = liveValue<LeechCard[]>(() => getLeeches(), []);
// The learner's desired-retention target, shown next to measured true retention
// so the setting has a feedback loop (am I actually hitting what I asked for?).
const target = liveValue(
  () => getRequestRetention(),
  DEFAULT_REQUEST_RETENTION,
);

const retryAll = (): void => {
  history.retry();
  leeches.retry();
  target.retry();
};

// Color a heatmap cell by review volume; full class strings so Tailwind's
// scanner emits each utility (it can't see runtime-built fragments).
const heatClass = (count: number, inRange: boolean): string => {
  if (!inRange) return "bg-transparent";
  if (count === 0) return "bg-primary-soft";
  if (count < 5) return "bg-primary/30";
  if (count < 15) return "bg-primary/60";
  return "bg-primary";
};

// One label per heatmap column: a month index where a month begins, else null.
// Derived so it tracks the grid as the adaptive span grows with history.
const monthLabels = $derived(
  history.current && history.current !== "hidden"
    ? heatmapMonthLabels(history.current.weeks)
    : [],
);

const monthName = (m: number): string =>
  new Date(2000, m, 1).toLocaleDateString(undefined, { month: "short" });

const pct = (correct: number, count: number): number =>
  count > 0 ? Math.round((correct / count) * 100) : 0;

const formatDuration = (ms: number): string => {
  const totalSec = Math.round(ms / 1000);
  if (totalSec < 60) return `${totalSec}s`;
  const min = Math.round(totalSec / 60);
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

const timeLabel = (ms: number): string =>
  new Date(ms).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

const BLOCK_LIMIT = 40;
const blocks = $derived(
  history.current && history.current !== "hidden"
    ? history.current.blocks.slice(0, BLOCK_LIMIT)
    : [],
);

// Surface only the worst few offenders: the point is a focused "give these a
// second look", not a wall of every card that's ever lapsed.
const LEECH_LIMIT = 5;
const shownLeeches = $derived(leeches.current.slice(0, LEECH_LIMIT));
</script>

{#if history.current === "hidden"}
  <!-- Pre-onboarding: nothing to show until the learner has a deck. A failed
       read no longer lands here; it falls through to the retry below. -->
{:else if history.errored}
  <div
    class="flex flex-col items-center gap-4 rounded-2xl border border-border bg-bg-elev p-10 text-center"
  >
    <p class="text-lg font-semibold">We couldn't load your history</p>
    <p class="text-sm text-fg-muted">
      Reading from this browser's storage failed, which can happen in private
      browsing or when storage is full. Try again.
    </p>
    <button type="button" onclick={retryAll} class="btn-primary py-3">
      Try again
    </button>
  </div>
{:else if history.current === null}
  <p class="py-10 text-center text-fg-muted">Loading history…</p>
{:else if history.current.summary.totalReviews === 0}
  <section class="rounded-2xl border border-border bg-bg-elev p-8 text-center">
    <p class="text-fg-muted">
      No review history yet. Finish a lesson to start your streak.
    </p>
  </section>
{:else}
  {@const h = history.current}
  {@const s = h.summary}
  <div class="flex flex-col gap-6">
    <section
      class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4"
    >
      <div class="flex flex-col gap-1 bg-bg-elev p-5">
        <span class="text-2xl font-semibold tabular-nums">{s.totalReviews}</span>
        <span class="text-xs text-fg-muted">reviews</span>
      </div>
      <div class="flex flex-col gap-1 bg-bg-elev p-5">
        <span
          class="inline-flex items-center gap-1.5 text-2xl font-semibold tabular-nums"
        >
          <Icon name="flame-filled" size={18} class="text-streak" />
          {s.currentStreak}
        </span>
        <span class="text-xs text-fg-muted">day streak</span>
      </div>
      <div class="flex flex-col gap-1 bg-bg-elev p-5">
        <span class="text-2xl font-semibold tabular-nums">{s.longestStreak}</span
        >
        <span class="text-xs text-fg-muted">longest streak</span>
      </div>
      <div class="flex flex-col gap-1 bg-bg-elev p-5">
        <span class="text-2xl font-semibold tabular-nums"
          >{formatDuration(s.totalDurationMs)}</span
        >
        <span class="text-xs text-fg-muted">time studied</span>
      </div>
    </section>

    <!-- Leeches: the few cards the learner keeps failing. Hidden until one
         crosses the lapse threshold, so it never nags a healthy deck. -->
    {#if shownLeeches.length > 0}
      <section class="rounded-2xl border border-accent/40 bg-bg-elev p-5">
        <div class="flex items-baseline justify-between gap-4">
          <h2 class="font-semibold text-accent">Cards fighting you</h2>
          {#if leeches.current.length > LEECH_LIMIT}
            <span class="text-xs text-fg-muted">
              Top {LEECH_LIMIT} of {leeches.current.length}
            </span>
          {/if}
        </div>
        <p class="mt-1 text-sm text-fg-muted">
          You keep slipping on these. Open one for its mnemonic and examples;
          a closer look usually helps.
        </p>
        <ul class="mt-3 flex flex-col gap-0.5">
          {#each shownLeeches as leech (leech.itemId)}
            <li>
              <a
                href={cardHref(leech.kind, leech.itemId)}
                class="-mx-2 flex flex-col gap-1 rounded-lg px-2 py-3 transition hover:bg-accent/10"
              >
                <div class="flex items-baseline justify-between gap-4">
                  <span class="flex items-baseline gap-2">
                    <span class="text-lg font-medium" lang="sr">{leech.cyrillic}</span>
                    <span class="text-sm text-fg-muted">{leech.gloss}</span>
                  </span>
                  <span
                    class="flex shrink-0 items-center gap-2 text-xs tabular-nums text-accent"
                  >
                    failed {leech.lapses}×
                    <Icon name="book-open" size={14} class="text-fg-muted" />
                  </span>
                </div>
                {#if leech.mnemonic}
                  <span class="text-sm text-fg-muted"><SrAuto text={leech.mnemonic} /></span>
                {/if}
              </a>
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    <section class="rounded-2xl border border-border bg-bg-elev p-5">
      <div class="flex items-baseline justify-between gap-4">
        <h2 class="font-semibold">Activity</h2>
        <span class="text-xs text-fg-muted">
          {s.daysStudied} day{s.daysStudied === 1 ? "" : "s"} studied
        </span>
      </div>
      <div class="mt-4 overflow-x-auto">
        <div class="inline-flex flex-col gap-1">
          <!-- Month captions, aligned to the column that opens each month. Each
               slot is one column wide; the label spills rightward over the
               empty slots that follow it, GitHub-style. -->
          <div class="flex gap-1 text-xs text-fg-muted" aria-hidden="true">
            {#each monthLabels as month, w (w)}
              <div class="w-2.5">
                {#if month !== null}
                  <span class="whitespace-nowrap">{monthName(month)}</span>
                {/if}
              </div>
            {/each}
          </div>
          <div class="flex gap-1">
            {#each h.weeks as week, w (w)}
              <div class="flex flex-col gap-1">
                {#each week as cell (cell.key)}
                  <div
                    class="h-2.5 w-2.5 rounded-xs {heatClass(
                      cell.count,
                      cell.inRange,
                    )}"
                    title={cell.inRange
                      ? `${dayLabel(cell.date)} — ${cell.count} review${cell.count === 1 ? "" : "s"}`
                      : undefined}
                  ></div>
                {/each}
              </div>
            {/each}
          </div>
        </div>
      </div>
      <div class="mt-3 flex items-center justify-end gap-1.5 text-xs text-fg-muted">
        <span>less</span>
        <span class="h-2.5 w-2.5 rounded-xs bg-primary-soft"></span>
        <span class="h-2.5 w-2.5 rounded-xs bg-primary/30"></span>
        <span class="h-2.5 w-2.5 rounded-xs bg-primary/60"></span>
        <span class="h-2.5 w-2.5 rounded-xs bg-primary"></span>
        <span>more</span>
      </div>
    </section>

    <!-- Accuracy trend: a fixed calendar window mirroring the forecast's
         horizon, so a skipped day reads as a gap rather than being spliced
         out. Days without reviews render an empty column, not a 0% bar. -->
    <section class="rounded-2xl border border-border bg-bg-elev p-5">
      <div class="flex items-baseline justify-between gap-4">
        <h2 class="font-semibold">Recall accuracy</h2>
        <span class="text-xs text-fg-muted">
          Last {h.trend.length} days
        </span>
      </div>
      <div class="mt-5 flex h-24 items-end gap-1" aria-hidden="true">
        {#each h.trend as day (day.key)}
          <div
            class="flex h-full flex-1 flex-col justify-end"
            title="{dayLabel(day.date)} — {day.count > 0
              ? `${pct(day.correct, day.count)}% of ${day.count}`
              : 'no reviews'}"
          >
            {#if day.count > 0}
              <div
                class="w-full rounded-t bg-primary"
                style="height: {Math.max(pct(day.correct, day.count), 2)}%"
              ></div>
            {/if}
          </div>
        {/each}
      </div>
      <div class="mt-2 flex gap-1">
        {#each h.trend as day (day.key)}
          <div
            class="flex-1 text-center text-xs tabular-nums {day.offset === 0
              ? 'font-semibold text-primary'
              : 'text-fg-muted'}"
          >
            {day.date.getDate()}
          </div>
        {/each}
      </div>
      <p class="mt-4 text-sm text-fg-muted">
        Share of cards recalled (Good or Easy) each day.
      </p>
      {#if s.matureReviews > 0}
        <p class="mt-3 border-t border-border pt-3 text-sm text-fg-muted">
          True retention, all time:
          <span class="font-medium text-fg"
            >{pct(s.matureCorrect, s.matureReviews)}%</span
          >
          on {s.matureReviews} review{s.matureReviews === 1 ? "" : "s"} of
          graduated cards, where a miss is real forgetting. You're aiming for
          {Math.round(target.current * 100)}%.
        </p>
      {/if}
    </section>

    <section class="rounded-2xl border border-border bg-bg-elev p-5">
      <div class="flex items-baseline justify-between gap-4">
        <h2 class="font-semibold">Sessions</h2>
        {#if h.blocks.length > BLOCK_LIMIT}
          <span class="text-xs text-fg-muted">
            Showing the latest {BLOCK_LIMIT} of {h.blocks.length}
          </span>
        {/if}
      </div>
      <ul class="mt-4 flex flex-col divide-y divide-border">
        {#each blocks as b (b.startedAt)}
          <li class="flex items-center justify-between gap-4 py-3">
            <div class="flex flex-col">
              <span class="font-medium">{dayLabel(new Date(b.startedAt))}</span>
              <span class="text-xs text-fg-muted">{timeLabel(b.startedAt)}</span>
            </div>
            <div
              class="flex items-center gap-4 text-sm tabular-nums text-fg-muted"
            >
              <span title="Cards reviewed">
                {b.count} card{b.count === 1 ? "" : "s"}
              </span>
              <span class="font-medium text-fg" title="Recalled (Good or Easy)">
                {pct(b.correct, b.count)}%
              </span>
              <span class="w-12 text-right">{formatDuration(b.durationMs)}</span>
            </div>
          </li>
        {/each}
      </ul>
    </section>
  </div>
{/if}
