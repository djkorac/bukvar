import type { Gender } from "~/lib/content/types";

/** Human-readable gender names, for the word page and the reviewer's reveal. */
export const GENDER_LABEL: Record<Gender, string> = {
  m: "masculine",
  f: "feminine",
  n: "neuter",
};
