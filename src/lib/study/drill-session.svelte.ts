/**
 * The shared multiple-choice drill engine: a round of questions stepped one at a
 * time, with a running tally, keyboard control, and focus-on-advance. Pure
 * interaction logic (no markup, no Tailwind), so each drill (alphabet, numbers,
 * vocabulary) keeps only its own divergent rendering. Lives in `lib`, not a
 * `.svelte` component, so the logic that the three drills used to triplicate
 * (and where the screen-reader gap crept in) stays in one tested place.
 *
 * It is a rune class (`.svelte.ts`) rather than a plain module because the state
 * is reactive: the Svelte 5 equivalent of a `useQuiz` hook / composable.
 */

import { onInteractiveTarget } from "~/lib/study/interactive-target";

/** The minimal shape every drill question shares. `DrillQuestion` (alphabet),
 *  `NumberQuestion`, and `PracticeQuestion` all satisfy it. */
export type DrillQuestion = { options: string[]; answer: string };

/** Semantic state of an option button once an answer is locked in; the view
 *  maps it to colours, keeping Tailwind out of the engine. */
export type OptionState = "idle" | "answer" | "chosen" | "muted";

export class DrillSession<Q extends DrillQuestion> {
  round = $state<Q[]>([]);
  index = $state(0);
  chosen = $state<string | null>(null);
  correct = $state(0);
  // The element an advance re-anchors focus on: the question card mid-round, or
  // the done card on the final advance. Bound by the view because next() destroys
  // the focused control (rebuilding the option buttons, or swapping in the done
  // card), so focus would silently drop to <body> without this.
  card = $state<HTMLElement | undefined>(undefined);

  // Whether the next question-card mount should pull focus. A plain field, not
  // $state: it gates an effect, it doesn't drive the view. Set true only by
  // user-driven transitions (next/load-with-focus), so a round shown without a
  // gesture (the initial page load, a deep link) never steals focus from the
  // top of the page.
  #pullFocus = false;

  current = $derived<Q | undefined>(this.round[this.index]);
  done = $derived(this.round.length > 0 && this.index >= this.round.length);

  /** Start a fresh round. `focus` re-anchors the question card once it mounts:
   *  true for user-driven starts/restarts, false when a round appears without a
   *  gesture so focus isn't yanked from the page top. */
  load(round: Q[], focus: boolean) {
    this.round = round;
    this.index = 0;
    this.chosen = null;
    this.correct = 0;
    this.#pullFocus = focus;
  }

  /** Lock in an answer for the current question (a no-op once answered). */
  choose(option: string) {
    if (this.chosen !== null || !this.current) return;
    this.chosen = option;
    if (option === this.current.answer) this.correct += 1;
  }

  /** Advance to the next question, pulling focus to its card. */
  next() {
    this.chosen = null;
    this.index += 1;
    this.#pullFocus = true;
  }

  /** The semantic state of an option, for the view to colour. */
  optionState(option: string): OptionState {
    if (this.chosen === null) return "idle";
    if (option === this.current?.answer) return "answer";
    if (option === this.chosen) return "chosen";
    return "muted";
  }

  /** Number keys 1-N answer; space/enter advances once answered. Inert on the
   *  done screen and between rounds. Shared by every drill's `<svelte:window>`. */
  handleKey(event: KeyboardEvent) {
    // Auto-repeat from a held key is never a deliberate second action: drop it so
    // holding a digit or space/enter can't chain an answer/advance. Today's
    // safety is incidental (a held digit no-ops once chosen, a held Enter stalls
    // on Number() coercion); this makes it explicit. Mirrors the Reviewer and
    // PlacementTest handlers; the shared engine is where the guard belongs so
    // the three drills can't drift on it.
    if (event.repeat) return;
    if (this.done || !this.current) return;
    const n = Number(event.key);
    if (this.chosen === null && n >= 1 && n <= this.current.options.length) {
      this.choose(this.current.options[n - 1]);
    } else if (
      this.chosen !== null &&
      (event.key === "Enter" || event.key === " ") &&
      !onInteractiveTarget(event)
    ) {
      // Advance only when the key isn't aimed at a focused control (the
      // change-range/topic button, header nav): else preventDefault + next()
      // would hijack that control's own Enter/Space activation. Mirrors the
      // Reviewer. Digits stay global; they don't collide with activation.
      event.preventDefault();
      this.next();
    }
  }

  /** Register the focus-on-advance effect. Call once from the view's init (it
   *  uses `$effect`, so it must run during component initialisation). Re-anchors
   *  focus on the bound card after each focus-worthy transition. */
  focusOnAdvance() {
    $effect(() => {
      void this.index;
      const el = this.card;
      if (el && this.#pullFocus) {
        el.focus({ preventScroll: true });
        this.#pullFocus = false;
      }
    });
  }
}
