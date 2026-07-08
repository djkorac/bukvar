import { describe, expect, it } from "vitest";
import { DrillSession } from "./drill-session.svelte";

type Q = { id: string; options: string[]; answer: string };

const q = (id: string, answer: string, options: string[]): Q => ({
  id,
  answer,
  options,
});

const round: Q[] = [q("1", "A", ["A", "B", "C"]), q("2", "Y", ["X", "Y", "Z"])];

// A bare KeyboardEvent stand-in: handleKey reads `key`/`repeat`/`target` and may
// call preventDefault. The Vitest env is Node, so there's no real KeyboardEvent.
// `target` mimics a focused control by carrying a `closest` (see interactiveKey).
const key = (k: string, repeat = false, target?: unknown): KeyboardEvent =>
  ({ key: k, repeat, target, preventDefault() {} }) as unknown as KeyboardEvent;

// A keydown aimed at a focused button/link: its `closest` matches the
// interactive selector, so onInteractiveTarget must keep the handler off it.
const interactiveKey = (k: string): KeyboardEvent =>
  key(k, false, { closest: () => ({}) });

const loaded = () => {
  const s = new DrillSession<Q>();
  s.load(round, false);
  return s;
};

describe("DrillSession.load", () => {
  it("starts at the first question with a clean tally", () => {
    const s = loaded();
    expect(s.current?.id).toBe("1");
    expect(s.index).toBe(0);
    expect(s.chosen).toBeNull();
    expect(s.correct).toBe(0);
    expect(s.done).toBe(false);
  });

  it("is not done before any round is loaded", () => {
    expect(new DrillSession<Q>().done).toBe(false);
  });
});

describe("DrillSession.choose", () => {
  it("tallies a correct answer and records the choice", () => {
    const s = loaded();
    s.choose("A");
    expect(s.chosen).toBe("A");
    expect(s.correct).toBe(1);
  });

  it("records a wrong answer without crediting it", () => {
    const s = loaded();
    s.choose("B");
    expect(s.chosen).toBe("B");
    expect(s.correct).toBe(0);
  });

  it("ignores a second choice for the same question", () => {
    const s = loaded();
    s.choose("B");
    s.choose("A");
    expect(s.chosen).toBe("B");
    expect(s.correct).toBe(0);
  });
});

describe("DrillSession.next", () => {
  it("advances to the next question and clears the choice", () => {
    const s = loaded();
    s.choose("A");
    s.next();
    expect(s.current?.id).toBe("2");
    expect(s.chosen).toBeNull();
  });

  it("runs off the end into the done state", () => {
    const s = loaded();
    s.next();
    s.next();
    expect(s.current).toBeUndefined();
    expect(s.done).toBe(true);
  });
});

describe("DrillSession.optionState", () => {
  it("is idle for every option before an answer", () => {
    const s = loaded();
    expect(s.optionState("A")).toBe("idle");
    expect(s.optionState("B")).toBe("idle");
  });

  it("marks the answer, the wrong choice, and the rest once answered", () => {
    const s = loaded();
    s.choose("B");
    expect(s.optionState("A")).toBe("answer"); // the correct one is always surfaced
    expect(s.optionState("B")).toBe("chosen"); // the learner's wrong pick
    expect(s.optionState("C")).toBe("muted"); // the untouched distractor
  });
});

describe("DrillSession.handleKey", () => {
  it("answers via the matching number key", () => {
    const s = loaded();
    s.handleKey(key("2"));
    expect(s.chosen).toBe("B");
  });

  it("ignores a number key past the option count", () => {
    const s = loaded();
    s.handleKey(key("4"));
    expect(s.chosen).toBeNull();
  });

  it("ignores an auto-repeat keydown so a held key can't chain an action", () => {
    const s = loaded();
    s.handleKey(key("2", true));
    expect(s.chosen).toBeNull();
  });

  it("advances on space or enter once answered", () => {
    const s = loaded();
    s.handleKey(key("1"));
    s.handleKey(key(" "));
    expect(s.current?.id).toBe("2");
  });

  it("does not advance when Enter/Space is aimed at a focused control", () => {
    const s = loaded();
    s.handleKey(key("1"));
    s.handleKey(interactiveKey(" "));
    s.handleKey(interactiveKey("Enter"));
    expect(s.current?.id).toBe("1");
  });

  it("does nothing once the round is done", () => {
    const s = loaded();
    s.next();
    s.next();
    s.handleKey(key("1"));
    expect(s.correct).toBe(0);
  });
});
