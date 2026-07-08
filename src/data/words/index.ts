import type { WordEntry } from "~/lib/content/types";
import { adjectives } from "./adjectives";
import { adjectivesCore } from "./adjectives-core";
import { animals } from "./animals";
import { body } from "./body";
import { clothing } from "./clothing";
import { colours } from "./colours";
import { directions } from "./directions";
import { everyday } from "./everyday";
import { feelings } from "./feelings";
import { food } from "./food";
import { general } from "./general";
import { grammar } from "./grammar";
import { greetings } from "./greetings";
import { home } from "./home";
import { money } from "./money";
import { nature } from "./nature";
import { numbers } from "./numbers";
import { people } from "./people";
import { phrases } from "./phrases";
import { places } from "./places";
import { pronouns } from "./pronouns";
import { questions } from "./questions";
import { school } from "./school";
import { tech } from "./tech";
import { time } from "./time";
import { travel } from "./travel";
import { verbs } from "./verbs";
import { verbsCore } from "./verbs-core";
import { work } from "./work";

/**
 * The vocabulary corpus, assembled from per-topic files (each hand-authored via
 * `word()`, which derives Latin/IPA/id). The order below is the curriculum /
 * introduction order and it determines each entry's `rank`: the survival
 * foundation first (greetings, phrases, question + function words, numbers, then
 * the *core* verbs and adjectives), then the concrete themes, with the long tail
 * of less-common verbs and adjectives last; those are mostly grammar difficulty,
 * not recognition difficulty, but they're the least essential to meet early.
 *
 * `verbsCore`/`adjectivesCore` are the high-utility slices split out of the big
 * `verbs`/`adjectives` files so each is a coherent level (see `data/levels.ts`).
 *
 * Growing toward ~1,000 in reviewed batches; every entry is hand-reviewed.
 */
const curriculum = [
  ...greetings,
  ...phrases,
  ...pronouns,
  ...questions,
  ...grammar,
  ...numbers,
  ...verbsCore,
  ...adjectivesCore,
  ...colours,
  ...people,
  ...body,
  ...time,
  ...food,
  ...home,
  ...places,
  ...travel,
  ...clothing,
  ...animals,
  ...nature,
  ...directions,
  ...feelings,
  ...work,
  ...school,
  ...money,
  ...tech,
  ...general,
  ...everyday,
  ...verbs,
  ...adjectives,
];

export const words: WordEntry[] = curriculum.map((entry, index) => ({
  ...entry,
  rank: index + 1,
}));
