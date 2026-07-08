<script lang="ts">
import { liveValue } from "~/lib/db/live-query.svelte";
import { isOnboarded } from "~/lib/db/settings";
import { dayLabel } from "~/lib/study/day";
import { type Forecast, getForecast } from "~/lib/study/forecast";

// liveQuery re-runs getForecast on any write to db.cards, so the chart refreshes
// itself after each grade (and after mark-known / restore) with no coupling to
// the reviewer island. liveValue adds the error arm a bare subscribe omits, so a
// rejected read surfaces a retry instead of stranding the chart on "Loading…".
// The onboarding check lives inside the querier (mirrors CurrentLevel.svelte), so
// one error arm covers both reads: a rejected isOnboarded() OR getForecast() shows
// the retry below, instead of an errored onboarding read silently blanking the
// chart for a returning learner. Returns the "hidden" sentinel pre-onboarding so
// the template can tell that apart from loading (null).
const forecast = liveValue<Forecast | "hidden" | null>(async () => {
  if (!(await isOnboarded())) return "hidden";
  return getForecast();
}, null);

const barHeight = (total: number, max: number): number =>
  max > 0 ? (total / max) * 100 : 0;

const share = (n: number, total: number): number =>
  total > 0 ? (n / total) * 100 : 0;
</script>

{#if forecast.current === "hidden"}
  <!-- Pre-onboarding: render nothing; the placement test owns the screen. A
       failed read no longer lands here; it falls through to the retry below
       (honest: broken storage also breaks the placement test itself). -->
{:else if forecast.errored}
  <div
    class="flex flex-col items-center gap-4 rounded-2xl border border-border bg-bg-elev p-10 text-center"
  >
    <p class="text-lg font-semibold">We couldn't load your forecast</p>
    <p class="text-sm text-fg-muted">
      Reading from this browser's storage failed, which can happen in private
      browsing or when storage is full. Try again.
    </p>
    <button type="button" onclick={() => forecast.retry()} class="btn-primary py-3">
      Try again
    </button>
  </div>
{:else if forecast.current === null}
  <p class="py-10 text-center text-fg-muted">Loading forecast…</p>
{:else}
  {@const f = forecast.current}
  <section class="rounded-2xl border border-border bg-bg-elev p-5">
    <div class="flex items-baseline justify-between gap-4">
      <h2 class="font-semibold">Review forecast</h2>
      <span class="text-xs text-fg-muted">
        Next {f.days.length} days · this device
      </span>
    </div>

    {#if f.total === 0}
      <p class="py-8 text-center text-sm text-fg-muted">
        You're all caught up. No reviews scheduled yet.
      </p>
    {:else}
      <div class="mt-5 flex h-28 items-end gap-1" aria-hidden="true">
        {#each f.days as day (day.key)}
          <div
            class="flex h-full flex-1 flex-col justify-end"
            title="{dayLabel(day.date)} — {day.total} due"
          >
            <div
              class="flex w-full flex-col overflow-hidden rounded-t"
              style="height: {barHeight(day.total, f.max)}%; min-height: {day.total >
              0
                ? '2px'
                : '0px'}"
            >
              <div
                class="w-full bg-primary/40"
                style="height: {share(day.learning, day.total)}%"
              ></div>
              <div
                class="w-full bg-primary"
                style="height: {share(day.known, day.total)}%"
              ></div>
            </div>
          </div>
        {/each}
      </div>

      <div class="mt-2 flex gap-1">
        {#each f.days as day (day.key)}
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
        <span class="font-medium text-fg">{f.total}</span>
        {f.total === 1 ? "review" : "reviews"} in the next {f.days
          .length} days{#if f.later > 0}{" "}· +{f.later} later{/if}
      </p>
    {/if}
  </section>
{/if}
