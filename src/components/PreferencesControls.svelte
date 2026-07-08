<script lang="ts">
import { onDestroy, onMount } from "svelte";
import type { Script } from "~/lib/content/types";
import {
  DEFAULT_PREFERENCES,
  getPreferences,
  MAX_DAILY_GOAL,
  MIN_DAILY_GOAL,
  type ReviewMode,
  setPreference,
} from "~/lib/db/settings";
import {
  getThemePreference,
  setThemePreference,
  type ThemePreference,
} from "~/lib/theme";

// Unlike the Dexie-backed preferences below, the theme lives in localStorage
// (synchronous, so BaseLayout's inline script can apply it before first
// paint). See lib/theme.ts. Safe to read at init: this island is client:only.
let theme = $state<ThemePreference>(getThemePreference());
let script = $state<Script>(DEFAULT_PREFERENCES.script);
let reviewMode = $state<ReviewMode>(DEFAULT_PREFERENCES.reviewMode);
let dailyGoal = $state(DEFAULT_PREFERENCES.dailyGoal);
let newPerDay = $state(DEFAULT_PREFERENCES.newPerDay);
let batchSize = $state(DEFAULT_PREFERENCES.batchSize);
let requestRetention = $state(DEFAULT_PREFERENCES.requestRetention);
let loaded = $state(false);
let loadError = $state(false);
let saved = $state(false);
let saveError = $state(false);
let savedTimer: ReturnType<typeof setTimeout> | undefined;

const themes: { value: ThemePreference; label: string }[] = [
  { value: "device", label: "Device" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

// Discrete steps within the scheduler's valid 0.80-0.95 band, no free input,
// so the value is always schedulable without extra validation.
const retentionOptions: { value: number; label: string }[] = [
  { value: 0.8, label: "80%" },
  { value: 0.85, label: "85%" },
  { value: 0.9, label: "90%" },
  { value: 0.95, label: "95%" },
];

// A rejected Dexie read (private browsing, quota, blocked upgrade) must not strand
// the panel blank: catch it into loadError so the template renders a retry arm
// that re-runs load(), mirroring Forecast/Levels.
async function load() {
  loadError = false;
  try {
    const prefs = await getPreferences();
    script = prefs.script;
    reviewMode = prefs.reviewMode;
    dailyGoal = prefs.dailyGoal;
    newPerDay = prefs.newPerDay;
    batchSize = prefs.batchSize;
    requestRetention = prefs.requestRetention;
    loaded = true;
  } catch {
    loadError = true;
  }
}

onMount(load);

onDestroy(() => clearTimeout(savedTimer));

function flagSaved() {
  saved = true;
  // A successful save clears any standing error: covers chooseTheme, which
  // flags success outside persist() (theme writes can't fail, see lib/theme.ts)
  // and so would otherwise leave a prior failed Dexie write's error showing.
  saveError = false;
  clearTimeout(savedTimer);
  savedTimer = setTimeout(() => {
    saved = false;
  }, 1500);
}

// A dropped Dexie write must not pass silently. That's how local-first state is
// lost (mirrors BackupReminder/Levels). Persist first, then let the caller commit
// the local $state only on success, so a failed write never leaves a control
// selected while storage holds the old value (which would silently snap back on
// the next load). Confirm on success, and flag the failure on rejection so the
// template can surface it visibly (mirroring Reviewer/DoneScreen); the error
// clears on the next attempt.
// (The theme pref is localStorage and swallows its own write error in
// lib/theme.ts, so chooseTheme stays outside this.)
async function persist(write: () => Promise<void>): Promise<boolean> {
  saveError = false;
  try {
    await write();
    flagSaved();
    return true;
  } catch {
    saveError = true;
    return false;
  }
}

const clamp = (n: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, n));

async function chooseScript(value: Script) {
  if (await persist(() => setPreference("script", value))) script = value;
}

async function chooseReviewMode(value: ReviewMode) {
  if (await persist(() => setPreference("reviewMode", value)))
    reviewMode = value;
}

// The number inputs are one-way (value={…}), so Svelte only rewrites the DOM
// when the bound state changes by identity. A clamp that lands on the value the
// state already holds (type 500 over a stored max of 100, or clear a field that
// already holds the default) is a no-op commit: the binding never re-runs and
// the box keeps the user's stale text. So each handler imperatively sets el.value
// to the clamped result, the way React/Vue force a controlled input on commit,
// then commits the $state only if the write succeeds, restoring el.value to the
// still-current value on failure, so the box never shows an unpersisted number.
async function setBatch(el: HTMLInputElement, value: number) {
  const next = clamp(
    Number.isNaN(value) ? DEFAULT_PREFERENCES.batchSize : Math.round(value),
    1,
    100,
  );
  el.value = String(next);
  if (await persist(() => setPreference("batchSize", next))) batchSize = next;
  else el.value = String(batchSize);
}

async function setGoal(el: HTMLInputElement, value: number) {
  const next = clamp(
    Number.isNaN(value) ? DEFAULT_PREFERENCES.dailyGoal : Math.round(value),
    MIN_DAILY_GOAL,
    MAX_DAILY_GOAL,
  );
  el.value = String(next);
  if (await persist(() => setPreference("dailyGoal", next))) dailyGoal = next;
  else el.value = String(dailyGoal);
}

async function setNew(el: HTMLInputElement, value: number) {
  const next = clamp(
    Number.isNaN(value) ? DEFAULT_PREFERENCES.newPerDay : Math.round(value),
    0,
    100,
  );
  el.value = String(next);
  if (await persist(() => setPreference("newPerDay", next))) newPerDay = next;
  else el.value = String(newPerDay);
}

async function chooseRetention(value: number) {
  if (await persist(() => setPreference("requestRetention", value)))
    requestRetention = value;
}

function chooseTheme(value: ThemePreference) {
  theme = value;
  setThemePreference(value);
  flagSaved();
}
</script>

<div class="flex flex-col gap-6">
  {#if loadError}
    <div
      class="flex flex-col items-center gap-4 rounded-2xl border border-border bg-bg-elev p-10 text-center"
    >
      <p class="text-lg font-semibold">We couldn't load your preferences</p>
      <p class="text-sm text-fg-muted">
        Reading from this browser's storage failed, which can happen in private
        browsing or when storage is full. Try again.
      </p>
      <button type="button" onclick={load} class="btn-primary py-3">
        Try again
      </button>
    </div>
  {:else if loaded}
    <div class="flex flex-col gap-2" role="group" aria-labelledby="pref-script">
      <span id="pref-script" class="text-sm font-medium">Prompt script</span>
      <div class="flex gap-2">
        <button
          type="button"
          aria-pressed={script === "cyrillic"}
          onclick={() => chooseScript("cyrillic")}
          class="rounded-lg border px-4 py-2 text-sm font-medium {script ===
          'cyrillic'
            ? 'border-primary bg-primary text-on-primary'
            : 'border-border hover:bg-primary-soft'}"
        >
          <span lang="sr">Ћирилица</span>
        </button>
        <button
          type="button"
          aria-pressed={script === "latin"}
          onclick={() => chooseScript("latin")}
          class="rounded-lg border px-4 py-2 text-sm font-medium {script ===
          'latin'
            ? 'border-primary bg-primary text-on-primary'
            : 'border-border hover:bg-primary-soft'}"
        >
          Latinica
        </button>
      </div>
      <p class="text-xs text-fg-muted">
        Letters are always taught in Cyrillic; this sets word prompts.
      </p>
    </div>

    <div
      class="flex flex-col gap-2"
      role="group"
      aria-labelledby="pref-review-mode"
    >
      <span id="pref-review-mode" class="text-sm font-medium">Review mode</span>
      <div class="flex gap-2">
        <button
          type="button"
          aria-pressed={reviewMode === "flip"}
          onclick={() => chooseReviewMode("flip")}
          class="rounded-lg border px-4 py-2 text-sm font-medium {reviewMode ===
          'flip'
            ? 'border-primary bg-primary text-on-primary'
            : 'border-border hover:bg-primary-soft'}"
        >
          Flip &amp; self-grade
        </button>
        <button
          type="button"
          aria-pressed={reviewMode === "type"}
          onclick={() => chooseReviewMode("type")}
          class="rounded-lg border px-4 py-2 text-sm font-medium {reviewMode ===
          'type'
            ? 'border-primary bg-primary text-on-primary'
            : 'border-border hover:bg-primary-soft'}"
        >
          Type the answer
        </button>
      </div>
      <p class="text-xs text-fg-muted">
        Flip reveals the answer for you to self-grade. Type has you write the
        English meaning, and we grade it for you.
      </p>
    </div>

    <label class="flex flex-col gap-1">
      <span class="text-sm font-medium">New words per day</span>
      <input
        type="number"
        min="0"
        max="100"
        value={newPerDay}
        onchange={(e) => setNew(e.currentTarget, e.currentTarget.valueAsNumber)}
        class="w-28 rounded-lg border border-border bg-bg px-3 py-2"
      />
      <span class="text-xs text-fg-muted">
        How many never-seen cards to introduce each day. Reviews are never capped.
      </span>
    </label>

    <label class="flex flex-col gap-1">
      <span class="text-sm font-medium">Lesson batch size</span>
      <input
        type="number"
        min="1"
        max="100"
        value={batchSize}
        onchange={(e) => setBatch(e.currentTarget, e.currentTarget.valueAsNumber)}
        class="w-28 rounded-lg border border-border bg-bg px-3 py-2"
      />
      <span class="text-xs text-fg-muted">
        New words introduced per lesson, layered over the daily cap above. Set it
        to your daily count (or higher) to learn them all in one lesson.
      </span>
    </label>

    <div
      class="flex flex-col gap-2"
      role="group"
      aria-labelledby="pref-retention"
    >
      <span id="pref-retention" class="text-sm font-medium">
        Desired retention
      </span>
      <div class="flex flex-wrap gap-2">
        {#each retentionOptions as r (r.value)}
          <button
            type="button"
            aria-pressed={requestRetention === r.value}
            onclick={() => chooseRetention(r.value)}
            class="rounded-lg border px-4 py-2 text-sm font-medium {requestRetention ===
            r.value
              ? 'border-primary bg-primary text-on-primary'
              : 'border-border hover:bg-primary-soft'}"
          >
            {r.label}
          </button>
        {/each}
      </div>
      <p class="text-xs text-fg-muted">
        Advanced: the recall target the scheduler aims for. Lower means longer
        gaps and fewer reviews each day, with a little more forgetting. Higher
        means the reverse. 90% is recommended. A change applies to each card from
        its next review, so your existing schedule isn't rebuilt.
      </p>
    </div>

    <label class="flex flex-col gap-1">
      <span class="text-sm font-medium">Daily review goal</span>
      <input
        type="number"
        min={MIN_DAILY_GOAL}
        max={MAX_DAILY_GOAL}
        value={dailyGoal}
        onchange={(e) => setGoal(e.currentTarget, e.currentTarget.valueAsNumber)}
        class="w-28 rounded-lg border border-border bg-bg px-3 py-2"
      />
      <span class="text-xs text-fg-muted">Target for the daily progress bar.</span>
    </label>
  {/if}

  <!-- Theme is localStorage-backed (lib/theme.ts), so it stays outside the
       loaded/loadError gate: a failed Dexie prefs read must not disable the one
       control that doesn't depend on Dexie. -->
  <div class="flex flex-col gap-2" role="group" aria-labelledby="pref-theme">
    <span id="pref-theme" class="text-sm font-medium">Theme</span>
    <div class="flex gap-2">
      {#each themes as t (t.value)}
        <button
          type="button"
          aria-pressed={theme === t.value}
          onclick={() => chooseTheme(t.value)}
          class="rounded-lg border px-4 py-2 text-sm font-medium {theme ===
          t.value
            ? 'border-primary bg-primary text-on-primary'
            : 'border-border hover:bg-primary-soft'}"
        >
          {t.label}
        </button>
      {/each}
    </div>
    <p class="text-xs text-fg-muted">
      “Device” follows your system's light/dark setting.
    </p>
  </div>

  {#if saveError}
    <p role="alert" class="text-sm font-medium text-accent">
      We couldn't save your preference — your browser's storage may be full. Try
      again.
    </p>
  {/if}
  <p class="sr-only" role="status">{saved ? "Saved." : ""}</p>
</div>
