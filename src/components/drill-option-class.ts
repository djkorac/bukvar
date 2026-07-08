import type { OptionState } from "~/lib/study/drill-session.svelte";

/**
 * Option colours by semantic state. Shared by the three drills (alphabet,
 * numbers, topics), which render byte-identical option buttons, and keyed by the
 * engine's `OptionState`. The branching that picks the state lives in the engine
 * (`DrillSession.optionState`); this is just the state→colour lookup, kept in the
 * view layer so Tailwind stays out of the engine.
 */
export const OPTION_CLASS: Record<OptionState, string> = {
  idle: "border-border hover:bg-primary-soft",
  answer: "border-primary bg-primary text-on-primary",
  chosen: "border-accent text-accent",
  muted: "border-border opacity-50",
};
