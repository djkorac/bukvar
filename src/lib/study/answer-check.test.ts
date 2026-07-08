import { describe, expect, it } from "vitest";
import { Rating } from "~/lib/srs/scheduler";
import {
  acceptedAnswers,
  checkAnswer,
  gradeForOutcome,
  normalizeAnswer,
} from "~/lib/study/answer-check";

describe("normalizeAnswer", () => {
  it("lowercases, trims, and collapses whitespace", () => {
    expect(normalizeAnswer("  Hello ")).toBe("hello");
    expect(normalizeAnswer("good\tmorning  there")).toBe("good morning there");
  });

  it("folds diacritics", () => {
    expect(normalizeAnswer("café")).toBe("cafe");
    expect(normalizeAnswer("Ž")).toBe("z");
    expect(normalizeAnswer("Dž")).toBe("dz");
  });

  it("folds all punctuation, internal included, to single spaces", () => {
    expect(normalizeAnswer("“hello!”")).toBe("hello");
    // The comma in a phrase is punctuation, not a separator to preserve.
    expect(normalizeAnswer("bill, please")).toBe("bill please");
    expect(normalizeAnswer("the bill, please")).toBe("bill please");
  });

  it("expands common contractions so they match their long form", () => {
    expect(normalizeAnswer("what's your name?")).toBe("what is your name");
    expect(normalizeAnswer("what is your name")).toBe("what is your name");
    expect(normalizeAnswer("don't")).toBe("do not");
    // Curly apostrophes (mobile autocorrect) expand too.
    expect(normalizeAnswer("you’re welcome")).toBe("you are welcome");
  });

  it("expands apostrophe-less contractions ('dont', 'whats', 'youre') too", () => {
    expect(normalizeAnswer("dont")).toBe("do not");
    expect(normalizeAnswer("whats your name")).toBe("what is your name");
    expect(normalizeAnswer("youre welcome")).toBe("you are welcome");
    expect(normalizeAnswer("i dont know")).toBe("i do not know");
  });

  it("leaves apostrophe-less spellings that are real words untouched", () => {
    // Only the apostrophe form expands; "its"/"were"/"ill" stay as typed, so a
    // real word isn't silently rewritten into a contraction.
    expect(normalizeAnswer("its")).toBe("its");
    expect(normalizeAnswer("were")).toBe("were");
    expect(normalizeAnswer("ill")).toBe("ill");
    expect(normalizeAnswer("it's")).toBe("it is");
    expect(normalizeAnswer("we're")).toBe("we are");
  });

  it("drops a leading infinitive marker or article", () => {
    expect(normalizeAnswer("to be")).toBe("be");
    expect(normalizeAnswer("the bill")).toBe("bill");
    expect(normalizeAnswer("a lot")).toBe("lot");
    // Only a *leading* whole word is stripped; "tomato" is untouched.
    expect(normalizeAnswer("tomato")).toBe("tomato");
  });
});

describe("acceptedAnswers", () => {
  it("accepts each slash-separated synonym and the whole gloss", () => {
    const set = acceptedAnswers("hen / chicken");
    expect(set.has("hen")).toBe(true);
    expect(set.has("chicken")).toBe(true);
    expect(set.has("hen chicken")).toBe(true);
  });

  it("treats a comma as phrase punctuation, not a synonym separator", () => {
    // "the bill, please" is one phrase; typing just "please" is not the answer.
    const set = acceptedAnswers("the bill, please");
    expect(set.has("bill please")).toBe(true);
    expect(set.has("please")).toBe(false);
    expect(set.has("bill")).toBe(false);
  });

  it("ignores parenthetical register/grammar tags", () => {
    expect([...acceptedAnswers("you (singular)")]).toContain("you");
    const advs = acceptedAnswers("well / good (adv.)");
    expect(advs.has("well")).toBe(true);
    expect(advs.has("good")).toBe(true);
    expect([...acceptedAnswers("(question particle)")]).toContain(
      "question particle",
    );
  });

  it("does not split a '/' inside a parenthetical tag into its own answer", () => {
    // "/" separates synonyms only at the top level; inside the tag it joins two
    // register labels, so "formal"/"plural" are not standalone meanings of "you".
    const set = acceptedAnswers("you (plural / formal)");
    expect(set.has("you")).toBe(true);
    expect(set.has("formal")).toBe(false);
    expect(set.has("plural")).toBe(false);
  });

  it("accepts a parenthetical clarifier both with and without its content", () => {
    const set = acceptedAnswers("straight (ahead)");
    expect(set.has("straight")).toBe(true);
    expect(set.has("straight ahead")).toBe(true);
  });
});

describe("checkAnswer", () => {
  it("matches case- and whitespace-insensitively", () => {
    expect(checkAnswer("  HELLO ", "hello")).toBe("correct");
  });

  it("accepts any authored synonym", () => {
    expect(checkAnswer("chicken", "hen / chicken")).toBe("correct");
    expect(checkAnswer("hen", "hen / chicken")).toBe("correct");
  });

  it("ignores phrase punctuation like the comma in a phrase", () => {
    expect(checkAnswer("the bill please", "the bill, please")).toBe("correct");
    expect(checkAnswer("the bill, please", "the bill, please")).toBe("correct");
  });

  it("accepts a contraction or its expanded form interchangeably", () => {
    expect(checkAnswer("what is your name", "what's your name?")).toBe(
      "correct",
    );
    expect(checkAnswer("what's your name", "what's your name?")).toBe(
      "correct",
    );
    expect(checkAnswer("i do not know", "I don't know")).toBe("correct");
  });

  it("accepts an apostrophe-less contraction against a contraction gloss", () => {
    // The most common slip: recalling the phrase but dropping the apostrophe.
    expect(checkAnswer("whats your name", "what's your name?")).toBe("correct");
    expect(checkAnswer("i dont know", "I don't know")).toBe("correct");
    expect(checkAnswer("dont worry", "don't worry")).toBe("correct");
    expect(checkAnswer("youre welcome", "you're welcome")).toBe("correct");
  });

  it("accepts a verb with or without the infinitive marker", () => {
    expect(checkAnswer("be", "to be")).toBe("correct");
    expect(checkAnswer("to be", "to be")).toBe("correct");
    expect(checkAnswer("must", "to have to / must")).toBe("correct");
    expect(checkAnswer("have to", "to have to / must")).toBe("correct");
  });

  it("accepts hidden alternates without displaying them in the gloss", () => {
    // The gloss stays "excuse me (formal)"; "sorry" is an unshown synonym.
    expect(
      checkAnswer("sorry", "excuse me (formal)", ["sorry", "pardon"]),
    ).toBe("correct");
    expect(
      checkAnswer("where is the bathroom", "where is the toilet?", [
        "where is the bathroom",
      ]),
    ).toBe("correct");
    // Without the alternate, the same input is not accepted.
    expect(checkAnswer("sorry", "excuse me (formal)")).toBe("wrong");
  });

  it("accepts the core meaning despite a parenthetical tag", () => {
    expect(checkAnswer("you", "you (plural / formal)")).toBe("correct");
    expect(checkAnswer("good", "well / good (adv.)")).toBe("correct");
    // ...but a bare label from inside the tag is not the answer.
    expect(checkAnswer("formal", "you (plural / formal)")).toBe("wrong");
  });

  it("is diacritic-tolerant", () => {
    expect(checkAnswer("cafe", "café")).toBe("correct");
    // Letter cards type the Latin form; the gloss is the Latin glyph.
    expect(checkAnswer("z", "Ž")).toBe("correct");
    expect(checkAnswer("ž", "Ž")).toBe("correct");
    expect(checkAnswer("dz", "Dž")).toBe("correct");
    // "Đ" has no NFD decomposition, so the conventional digraph is reached via
    // the Ђ card's accept list, not the diacritic fold.
    expect(checkAnswer("dj", "Đ", ["dj"])).toBe("correct");
    expect(checkAnswer("dj", "Đ")).toBe("wrong");
  });

  it("treats a one-character typo as a near miss", () => {
    expect(checkAnswer("chiken", "hen / chicken")).toBe("near");
    expect(checkAnswer("helo", "hello")).toBe("near");
  });

  it("does not soften short answers (avoids unrelated near matches)", () => {
    // "go" is one edit from "no", but both are too short to call a typo.
    expect(checkAnswer("go", "no / not")).toBe("wrong");
  });

  it("does not soften a longer input against a short answer either", () => {
    // The length guard is symmetric: a 3-letter input is one edit from a real
    // 2-letter gloss, but it's a different word, not a typo. (он→"he", на→"on",
    // оно→"it" are all in the corpus.)
    expect(checkAnswer("she", "he")).toBe("wrong");
    expect(checkAnswer("one", "on")).toBe("wrong");
    expect(checkAnswer("its", "it")).toBe("wrong");
  });

  it("rejects a genuinely wrong answer", () => {
    expect(checkAnswer("dog", "hello")).toBe("wrong");
    expect(checkAnswer("", "hello")).toBe("wrong");
  });
});

describe("gradeForOutcome", () => {
  it("maps outcomes to FSRS grades", () => {
    expect(gradeForOutcome("correct")).toBe(Rating.Good);
    expect(gradeForOutcome("near")).toBe(Rating.Hard);
    expect(gradeForOutcome("wrong")).toBe(Rating.Again);
  });
});
