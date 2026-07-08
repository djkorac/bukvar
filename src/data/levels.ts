import type { Topic } from "~/lib/content/types";

/**
 * The curriculum split into ordered, named **levels**: a lightweight
 * presentation/sequencing layer over the existing per-item `rank`, giving the
 * learner a "where am I / what's next" map. This is *not* a scheduler: FSRS
 * still owns difficulty and timing (see `docs/roadmap.md`, Phase 3).
 *
 * Levels are 1:1 with the authored curriculum {@link Topic}s, in curriculum
 * order, with the alphabet folded in as the first level. Keeping the mapping
 * topic-based (rather than `rank`-range spans) makes it drift-resistant: a word
 * added to a topic automatically joins that topic's level, and every item still
 * belongs to exactly one level via its `topic`. This file is the single source
 * of truth for level order and display names. The dictionary page derives its
 * headings from it too.
 */
export interface Level {
  /** Stable id; equal to the level's {@link Topic} (e.g. `greetings`). */
  id: Topic;
  /** Display name (English UI chrome). */
  name: string;
  /** The topic whose items belong to this level (`alphabet` = the letters). */
  topic: Topic;
}

const level = (topic: Topic, name: string): Level => ({
  id: topic,
  name,
  topic,
});

/**
 * Ordered levels. The order is the curriculum/introduction order and matches
 * `src/data/words/index.ts`; the alphabet is the first level ("Alphabet"),
 * then one level per word topic.
 */
export const LEVELS: Level[] = [
  level("alphabet", "Alphabet"),
  level("greetings", "Greetings"),
  level("phrases", "Common phrases"),
  level("pronouns", "Pronouns"),
  level("questions", "Question words"),
  level("grammar", "Grammar words"),
  level("numbers", "Numbers"),
  level("verbs-core", "Common verbs"),
  level("adjectives-core", "Common adjectives"),
  level("colours", "Colours"),
  level("people", "People & family"),
  level("body", "Body"),
  level("time", "Time & days"),
  level("food", "Food & drink"),
  level("home", "Home"),
  level("places", "Places & getting around"),
  level("travel", "Travel & transport"),
  level("clothing", "Clothing"),
  level("animals", "Animals"),
  level("nature", "Nature & weather"),
  level("directions", "Directions"),
  level("feelings", "Feelings & ideas"),
  level("work", "Work & jobs"),
  level("school", "School & language"),
  level("money", "Money & shopping"),
  level("tech", "Technology"),
  level("general", "General & abstract"),
  level("everyday", "Everyday"),
  level("verbs", "More verbs"),
  level("adjectives", "More adjectives"),
];

/**
 * Curriculum **phases**: a coarser grouping of the levels into a handful of
 * stages (survival → mastery), used to color the level tag on review cards so
 * the learner senses where in the journey a card sits. Each phase owns a
 * contiguous run of levels in curriculum order, and together the phases
 * partition every level exactly once (asserted in the levels test). Purely a
 * presentation grouping. Like {@link LEVELS}, it schedules nothing.
 */
export type PhaseId =
  | "azbuka"
  | "survival"
  | "core"
  | "life"
  | "ideas"
  | "mastery";

export interface CurriculumPhase {
  id: PhaseId;
  /** Display name (English UI chrome). */
  name: string;
  /** The level topics in this phase, a contiguous slice of {@link LEVELS}. */
  topics: Topic[];
}

export const PHASES: CurriculumPhase[] = [
  { id: "azbuka", name: "Alphabet", topics: ["alphabet"] },
  {
    id: "survival",
    name: "Survival",
    topics: [
      "greetings",
      "phrases",
      "pronouns",
      "questions",
      "grammar",
      "numbers",
    ],
  },
  {
    id: "core",
    name: "Core vocabulary",
    topics: ["verbs-core", "adjectives-core", "colours"],
  },
  {
    id: "life",
    name: "Everyday life",
    topics: [
      "people",
      "body",
      "time",
      "food",
      "home",
      "places",
      "travel",
      "clothing",
      "animals",
      "nature",
      "directions",
    ],
  },
  {
    id: "ideas",
    name: "Ideas & society",
    topics: [
      "feelings",
      "work",
      "school",
      "money",
      "tech",
      "general",
      "everyday",
    ],
  },
  { id: "mastery", name: "Mastery", topics: ["verbs", "adjectives"] },
];
