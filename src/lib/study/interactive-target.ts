/**
 * True when a keydown is aimed at a control that carries its own Enter/Space
 * activation (a button, link, or form field). A window-level shortcut handler
 * must defer to it on those keys: acting anyway cancels the control's native
 * activation (Enter fires on keydown, which preventDefault kills) or doubles up
 * on Space (buttons activate on keyup, past the keydown's preventDefault). Keys
 * with no native activation (the digit grades) stay global and don't gate here.
 *
 * Shared by the Reviewer and the drill engine so their two window-level
 * keydown handlers can't drift on which targets are hands-off.
 */
export function onInteractiveTarget(event: KeyboardEvent): boolean {
  // Duck-typed on `closest`, not `instanceof Element`, so the pure drill-engine
  // unit test can drive it in Node where `Element` is undefined; only elements
  // carry `closest`, so the match is equivalent.
  const target = event.target;
  return (
    target != null &&
    "closest" in target &&
    (target as Element).closest(
      "button, a, input, textarea, select, [contenteditable]",
    ) !== null
  );
}
