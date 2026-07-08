import { describe, expect, it } from "vitest";
import { alphabet } from "~/data/alphabet";
import { words } from "~/data/words";
import { toLatin } from "~/lib/content/transliterate";
import { State } from "~/lib/srs/scheduler";
import { letterPromptForm, toStudyItem } from "~/lib/study/session";

describe("toStudyItem", () => {
  it("threads pos and examples from a word onto the study item", () => {
    const withPos = words.find((w) => w.pos);
    const withExamples = words.find((w) => w.examples && w.examples.length > 0);
    // Narrow (and fail loudly) if the corpus ever drops these fixtures.
    if (!withPos || !withExamples) {
      throw new Error("corpus fixture missing a word with pos and/or examples");
    }

    const posItem = toStudyItem(withPos.id, "word", "cyrillic");
    expect(posItem?.pos).toBe(withPos.pos);

    const exItem = toStudyItem(withExamples.id, "word", "cyrillic");
    expect(exItem?.examples).toEqual(withExamples.examples);
  });

  it("gives letter cards no pos or transliteration, but surfaces the illustrative word as an example", () => {
    const item = toStudyItem("letter-a", "letter", "cyrillic");
    expect(item?.kind).toBe("letter");
    expect(item?.pos).toBeUndefined();
    // A letter's Latin form is its `back`, so there's no separate reading aid.
    expect(item?.transliteration).toBeUndefined();
    // The example word reuses the word example boxes, with a 1:1-derived Latin.
    const letterA = alphabet.find((l) => l.id === "letter-a");
    if (!letterA) throw new Error("corpus fixture missing letter-a");
    expect(item?.examples).toEqual([
      {
        cyrillic: letterA.example,
        latin: toLatin(letterA.example),
        english: letterA.exampleEn,
      },
    ]);
  });
});

describe("letterPromptForm", () => {
  it("never italicizes a card that hasn't graduated", () => {
    for (const state of [State.New, State.Learning, State.Relearning]) {
      expect(letterPromptForm(state, () => 0)).toBe("upright");
    }
  });

  it("italicizes a graduated card when the draw lands under the share", () => {
    expect(letterPromptForm(State.Review, () => 0)).toBe("italic");
  });

  it("keeps graduated cards mostly upright", () => {
    expect(letterPromptForm(State.Review, () => 0.9)).toBe("upright");
  });
});
