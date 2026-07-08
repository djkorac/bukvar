import { State } from "ts-fsrs";
import { alphabet } from "~/data/alphabet";
import {
  type CurriculumPhase,
  LEVELS,
  type Level,
  PHASES,
  type PhaseId,
} from "~/data/levels";
import { words } from "~/data/words";
import { topicPageForTopic, wordsForTopics } from "~/lib/content/corpus";
import type { Topic } from "~/lib/content/types";

/**
 * Pure read-only queries over the {@link LEVELS} model: which level an item
 * belongs to, the items in a level, and a progress summary derived from card
 * states. No storage and no UI. The IndexedDB read lives in
 * `lib/study/levels.ts`, which feeds plain snapshots into {@link summarizeLevels}
 * so the bucketing and current-level logic stay unit-testable in isolation.
 */

export { type CurriculumPhase, LEVELS, type Level, PHASES, type PhaseId };

const levelIndexById = new Map<Topic, number>(LEVELS.map((l, i) => [l.id, i]));
const levelByTopic = new Map<Topic, Level>(LEVELS.map((l) => [l.topic, l]));
const letterIds = new Set<string>(alphabet.map((l) => l.id));
const wordTopicById = new Map<string, Topic>(words.map((w) => [w.id, w.topic]));
const phaseByTopic = new Map<Topic, PhaseId>(
  PHASES.flatMap((p) => p.topics.map((t) => [t, p.id] as const)),
);
const wordCountByTopic = new Map<Topic, number>();
for (const w of words) {
  wordCountByTopic.set(w.topic, (wordCountByTopic.get(w.topic) ?? 0) + 1);
}

/** Display name of a topic's level, e.g. `verbs-core` → "Common verbs". */
export const levelName = (topic: Topic): string =>
  levelByTopic.get(topic)?.name ?? topic;

/** The curriculum phase a topic's level belongs to (used to color its tag). */
export const phaseOfTopic = (topic: Topic): PhaseId =>
  phaseByTopic.get(topic) ?? "survival";

/** 1-based level number (its position in curriculum order). */
export const levelNumber = (level: Level): number =>
  (levelIndexById.get(level.id) ?? 0) + 1;

/** A browse/drill navigation link shown on a level card. */
export interface LevelLink {
  href: string;
  /** Short action label, e.g. "Browse words" / "Drill". */
  label: string;
}

/**
 * The navigation links for a level card on /levels. Every word level gets an
 * SRS-neutral drill (`/practice?topic=`), plus a "browse the word list" link
 * when the level has a topic landing page. The function-word and grab-bag
 * levels (`grammar`, `general`, `everyday`) have none, so they show drill only.
 * The alphabet level points at its combined reference + drill page instead,
 * where both actions already live.
 */
export const levelLinks = (level: Level): LevelLink[] => {
  if (level.topic === "alphabet") {
    return [{ href: "/alphabet", label: "Open alphabet" }];
  }
  const links: LevelLink[] = [];
  const page = topicPageForTopic(level.topic);
  if (page) {
    links.push({ href: `/words/topics/${page.slug}`, label: "Browse words" });
  }
  links.push({ href: `/practice?topic=${level.topic}`, label: "Drill" });
  return links;
};

/** The level an item belongs to: letters → the alphabet level, words → by topic. */
export const levelOf = (itemId: string): Level | undefined => {
  if (letterIds.has(itemId)) return levelByTopic.get("alphabet");
  const topic = wordTopicById.get(itemId);
  return topic ? levelByTopic.get(topic) : undefined;
};

/**
 * Number of items in a level. A static corpus property, so it reads from a
 * precomputed tally rather than building (and discarding) the full id list,
 * unlike {@link levelItemIds}, whose order and contents its callers actually need.
 */
const levelSize = (level: Level): number =>
  level.topic === "alphabet"
    ? alphabet.length
    : (wordCountByTopic.get(level.topic) ?? 0);

/** Item ids in a level, in study order (letters by azbuka, words by `rank`). */
export const levelItemIds = (level: Level): string[] => {
  if (level.topic === "alphabet") {
    // `alphabet` is authored in `order` (1..30 = array position), so no re-sort
    // is needed here, matching wordsForTopics (commit 0ec62e6).
    return alphabet.map((l) => l.id);
  }
  return wordsForTopics([level.topic]).map((w) => w.id);
};

/** A card's learning bucket. New = never reviewed; known = graduated to Review. */
export type CardClass = "new" | "learning" | "known";

/** Minimal card state needed to classify and tally progress (storage-agnostic). */
export interface CardSnapshot {
  itemId: string;
  reps: number;
  state: State;
}

export const classifyCard = ({
  reps,
  state,
}: Pick<CardSnapshot, "reps" | "state">): CardClass =>
  reps === 0 ? "new" : state === State.Review ? "known" : "learning";

export interface LevelProgress {
  level: Level;
  total: number;
  new: number;
  learning: number;
  known: number;
}

export interface LevelSummary {
  levels: LevelProgress[];
  /**
   * Derived, never stored: the level the learner is on, their active frontier
   * (the deepest level still being learned), or, with nothing in progress, the
   * first level not yet fully known.
   */
  currentLevelId: Topic;
}

/**
 * Bucket card snapshots into per-level new/learning/known counts. `total` comes
 * from the corpus (so it is correct even for levels with no card rows yet), and
 * `new` is derived as `total − known − learning`, robust to missing rows
 * (pre-seed) and stale rows alike. The current level is the learner's active
 * frontier (see {@link LevelSummary.currentLevelId}).
 */
export const summarizeLevels = (snapshots: CardSnapshot[]): LevelSummary => {
  const progress = new Map<Topic, LevelProgress>(
    LEVELS.map((level) => [
      level.id,
      {
        level,
        total: levelSize(level),
        new: 0,
        learning: 0,
        known: 0,
      },
    ]),
  );

  let deepestLearning = -1;
  for (const snap of snapshots) {
    const level = levelOf(snap.itemId);
    if (!level) continue;
    const p = progress.get(level.id);
    if (!p) continue;
    const klass = classifyCard(snap);
    if (klass === "known") p.known += 1;
    else if (klass === "learning") {
      p.learning += 1;
      deepestLearning = Math.max(
        deepestLearning,
        levelIndexById.get(level.id) ?? -1,
      );
    }
  }

  // Map preserves LEVELS insertion order, so values() is already in level order.
  const levelProgress = [...progress.values()];
  for (const p of levelProgress) {
    p.new = Math.max(0, p.total - p.known - p.learning);
  }

  // The current level keys off *learning* cards, not merely "started" ones: the
  // placement test seeds known cards (reps > 0, Review) across many topics, and
  // those must not drag the current level to the deepest word the learner merely
  // recognizes. So it's the active frontier (deepest level still being learned),
  // else the first level not yet fully known (matching the placement test's
  // projected start), else the last level once everything is known.
  const firstUnfinished = levelProgress.find((p) => p.known < p.total);
  const currentLevelId =
    deepestLearning >= 0
      ? LEVELS[deepestLearning].id
      : (firstUnfinished ?? levelProgress[levelProgress.length - 1]).level.id;

  return { levels: levelProgress, currentLevelId };
};
