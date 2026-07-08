/**
 * Mobile double-tap guard. After a reveal/advance swaps a fresh button under the
 * finger, an accidental second tap can act on whatever the first tap just put
 * there; this swallows taps for a brief window so it can't. Coarse-pointer only,
 * so the desktop keyboard/mouse flow (where there's no double-tap) is never
 * throttled.
 *
 * Shared by the Reviewer and the PlacementTest so the cooldown length and the
 * coarse-pointer rule stay in lockstep. Both screens swap a button under the
 * finger and so need the identical guard. Mirrors how DrillSession centralises
 * the drills' shared interaction guards in `lib/study`.
 *
 * A plain closure factory, not a `.svelte.ts` rune: `lockedUntil` gates control
 * flow and never drives the view, so there's no reactive state to model (unlike
 * DrillSession, whose round/index/choice render). `locked()` reads the clock
 * live on each call.
 */
const TAP_COOLDOWN_MS = 350;

export function createTapLock() {
  let lockedUntil = 0;
  const isTouch = () => window.matchMedia("(pointer: coarse)").matches;
  return {
    /** True while a coarse-pointer tap should be swallowed. */
    locked: () => isTouch() && performance.now() < lockedUntil,
    /** Arm the cooldown (coarse pointers only; a no-op on mouse/keyboard). */
    lock: () => {
      if (isTouch()) lockedUntil = performance.now() + TAP_COOLDOWN_MS;
    },
  };
}
