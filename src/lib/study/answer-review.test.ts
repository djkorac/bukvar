import { describe, expect, it } from "vitest";
import type { StudyItem } from "~/lib/content/types";
import { reviewTyped, SKIP_LABEL } from "./answer-review";

const item: StudyItem = {
  id: "w-kuca",
  kind: "word",
  front: "кућа",
  frontSub: "kuća",
  back: "house",
  topic: "home",
};

describe("reviewTyped", () => {
  it("records a correct answer as the learner typed it", () => {
    expect(reviewTyped(item, "correct", "house")).toEqual({
      id: "w-kuca",
      prompt: "кућа",
      promptSub: "kuća",
      chosen: "house",
      correct: "house",
      isCorrect: true,
    });
  });

  it("shows the canonical spelling for a near-miss, not the learner's typo", () => {
    // A typo still counts as recalled, but a ✓ row must never display the
    // misspelling, so `chosen` is the answer, not the input.
    expect(reviewTyped(item, "near", "hose")).toMatchObject({
      chosen: "house",
      isCorrect: true,
    });
  });

  it("keeps the learner's input for a wrong answer", () => {
    expect(reviewTyped(item, "wrong", "horse")).toMatchObject({
      chosen: "horse",
      isCorrect: false,
    });
  });

  it("reads an empty (skipped) answer as the skip label and scores it wrong", () => {
    expect(reviewTyped(item, "wrong", "   ")).toMatchObject({
      chosen: SKIP_LABEL,
      isCorrect: false,
    });
  });
});
