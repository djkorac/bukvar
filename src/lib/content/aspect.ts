import type { Aspect } from "~/lib/content/types";

/** Human-readable aspect names, for the word page and the reviewer's reveal. */
export const ASPECT_LABEL: Record<Aspect, string> = {
  impf: "imperfective",
  pf: "perfective",
  both: "biaspectual",
};

/**
 * Label of a verb's aspectual counterpart, derived from the verb's own aspect
 * (a pair is between the two opposite aspects). Used by the word page and the
 * reviewer's reveal to describe the `pair` partner.
 *
 * A pair only exists between pf and impf (`words.test.ts` forbids one on a
 * biaspectual verb), so the `both` branch is defensive and never renders.
 */
export function counterpartAspectLabel(aspect: Aspect | undefined): string {
  if (aspect === "pf") return ASPECT_LABEL.impf;
  if (aspect === "impf") return ASPECT_LABEL.pf;
  return ASPECT_LABEL.both;
}
