import { State } from "ts-fsrs";
import { describe, expect, it } from "vitest";
import { alphabet } from "~/data/alphabet";
import { words } from "~/data/words";
import {
  classifyCard,
  LEVELS,
  type Level,
  levelItemIds,
  levelLinks,
  levelName,
  levelNumber,
  levelOf,
  PHASES,
  phaseOfTopic,
  summarizeLevels,
} from "~/lib/content/levels";
import { TOPICS, type Topic } from "~/lib/content/types";
import { parsePracticeTopics } from "~/lib/study/practice";

// Fail loudly if a level the test depends on disappears from the model.
const levelByTopic = (topic: Topic): Level => {
  const level = LEVELS.find((l) => l.topic === topic);
  if (!level) throw new Error(`no level for topic ${topic}`);
  return level;
};

describe("LEVELS", () => {
  it("covers the whole Topic union exactly once, with no duplicates", () => {
    // Asserting against the full TOPICS union (not just word-used topics) is the
    // point: a Topic added to the union but never given a level would otherwise
    // slip past every test and hit levelName's silent `?? topic` fallback.
    const levelTopics = LEVELS.map((l) => l.topic);
    expect(new Set(levelTopics).size).toBe(levelTopics.length);
    expect(new Set(levelTopics)).toEqual(new Set(TOPICS));
  });

  it("starts with the alphabet level as level 1", () => {
    expect(LEVELS[0].topic).toBe("alphabet");
    expect(levelNumber(LEVELS[0])).toBe(1);
  });

  it("ids equal their topic", () => {
    for (const level of LEVELS) {
      expect(level.id).toBe(level.topic);
    }
  });
});

describe("PHASES", () => {
  it("partition the whole Topic union exactly once", () => {
    const phaseTopics = PHASES.flatMap((p) => p.topics);
    expect(new Set(phaseTopics).size).toBe(phaseTopics.length);
    expect(new Set(phaseTopics)).toEqual(new Set(TOPICS));
  });

  it("phaseOfTopic resolves a phase for every level", () => {
    const phaseIds = new Set(PHASES.map((p) => p.id));
    for (const level of LEVELS) {
      expect(phaseIds.has(phaseOfTopic(level.topic))).toBe(true);
    }
  });

  it("keep curriculum order — phases are contiguous slices of LEVELS", () => {
    const order = LEVELS.map((l) => l.topic);
    const flattened = PHASES.flatMap((p) => p.topics);
    expect(flattened).toEqual(order);
  });
});

describe("levelName", () => {
  it("returns the level's display name for a topic", () => {
    expect(levelName("verbs-core")).toBe("Common verbs");
    expect(levelName("greetings")).toBe("Greetings");
  });
});

describe("levelOf", () => {
  it("maps every word to the level for its topic", () => {
    for (const w of words) {
      expect(levelOf(w.id)?.topic).toBe(w.topic);
    }
  });

  it("maps every letter to the alphabet level", () => {
    for (const l of alphabet) {
      expect(levelOf(l.id)?.topic).toBe("alphabet");
    }
  });

  it("returns undefined for an unknown id", () => {
    expect(levelOf("word-does-not-exist")).toBeUndefined();
  });
});

describe("levelItemIds", () => {
  it("returns every letter for the alphabet level, in azbuka order", () => {
    const ids = levelItemIds(LEVELS[0]);
    expect(ids).toHaveLength(alphabet.length);
    expect(ids[0]).toBe("letter-a");
  });

  it("returns a topic's words sorted by rank", () => {
    const expected = words
      .filter((w) => w.topic === "greetings")
      .sort((a, b) => a.rank - b.rank)
      .map((w) => w.id);
    expect(levelItemIds(levelByTopic("greetings"))).toEqual(expected);
  });
});

describe("levelLinks", () => {
  it("gives a word level with a topic page both a browse and a drill link", () => {
    expect(levelLinks(levelByTopic("greetings"))).toEqual([
      { href: "/words/topics/greetings", label: "Browse words" },
      { href: "/practice?topic=greetings", label: "Drill" },
    ]);
  });

  it("browses via the page slug, not the topic", () => {
    // people → the "family" page slug; verbs-core → the merged "verbs" page.
    expect(levelLinks(levelByTopic("people"))[0]).toEqual({
      href: "/words/topics/family",
      label: "Browse words",
    });
    expect(levelLinks(levelByTopic("verbs-core"))[0].href).toBe(
      "/words/topics/verbs",
    );
  });

  it("gives the pageless levels a drill link only", () => {
    for (const topic of ["grammar", "general", "everyday"] as Topic[]) {
      expect(levelLinks(levelByTopic(topic))).toEqual([
        { href: `/practice?topic=${topic}`, label: "Drill" },
      ]);
    }
  });

  it("points the alphabet level at its combined reference + drill page", () => {
    expect(levelLinks(LEVELS[0])).toEqual([
      { href: "/alphabet", label: "Open alphabet" },
    ]);
  });

  it("every word level's drill link drives the practice drill for that level", () => {
    for (const level of LEVELS) {
      if (level.topic === "alphabet") continue;
      const drill = levelLinks(level).find((l) => l.label === "Drill");
      const query = drill?.href.split("?")[1] ?? "";
      const topic = new URLSearchParams(query).get("topic");
      expect(parsePracticeTopics(topic)).toEqual([level.topic]);
    }
  });
});

describe("classifyCard", () => {
  it("classifies by reps and FSRS state", () => {
    expect(classifyCard({ reps: 0, state: State.New })).toBe("new");
    expect(classifyCard({ reps: 1, state: State.Learning })).toBe("learning");
    expect(classifyCard({ reps: 4, state: State.Relearning })).toBe("learning");
    expect(classifyCard({ reps: 2, state: State.Review })).toBe("known");
  });
});

describe("summarizeLevels", () => {
  it("totals match the corpus; everything is new and level 1 is current when nothing is started", () => {
    const summary = summarizeLevels([]);
    const alphabetLevel = summary.levels[0];
    expect(summary.levels).toHaveLength(LEVELS.length);
    expect(alphabetLevel.total).toBe(alphabet.length);
    expect(alphabetLevel.new).toBe(alphabet.length);
    expect(alphabetLevel.learning).toBe(0);
    expect(alphabetLevel.known).toBe(0);
    expect(summary.currentLevelId).toBe("alphabet");
  });

  it("buckets known/learning and derives new as the remainder", () => {
    const ids = levelItemIds(levelByTopic("greetings"));
    const summary = summarizeLevels([
      { itemId: ids[0], reps: 2, state: State.Review },
      { itemId: ids[1], reps: 1, state: State.Learning },
    ]);
    const p = summary.levels.find((x) => x.level.topic === "greetings");
    expect(p?.known).toBe(1);
    expect(p?.learning).toBe(1);
    expect(p?.new).toBe((p?.total ?? 0) - 2);
  });

  it("current level is the deepest one still being learned", () => {
    const startedId = levelItemIds(levelByTopic("verbs"))[0];
    const summary = summarizeLevels([
      { itemId: startedId, reps: 1, state: State.Learning },
    ]);
    expect(summary.currentLevelId).toBe("verbs");
  });

  it("a placement-seeded known card doesn't make a late level current", () => {
    // Reader who cleared the alphabet and the first word level, with one stray
    // correct answer seeded known (reps > 0, Review) in the very last level,
    // exactly what the placement test produces. The current level must be the
    // first un-cleared level, not the last one (the reported bug).
    const knownLevel = (topic: Topic) =>
      levelItemIds(levelByTopic(topic)).map((itemId) => ({
        itemId,
        reps: 2,
        state: State.Review,
      }));
    const stray = levelItemIds(LEVELS[LEVELS.length - 1])[0];
    const summary = summarizeLevels([
      ...knownLevel("alphabet"),
      ...knownLevel(LEVELS[1].topic),
      { itemId: stray, reps: 2, state: State.Review },
    ]);
    expect(summary.currentLevelId).toBe(LEVELS[2].topic);
  });
});
