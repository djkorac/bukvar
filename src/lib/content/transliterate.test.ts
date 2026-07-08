import { describe, expect, it } from "vitest";
import { asciiSlug, toLatin } from "./transliterate";

describe("toLatin", () => {
  it("transliterates lowercase words 1:1", () => {
    expect(toLatin("здраво")).toBe("zdravo");
    expect(toLatin("вода")).toBe("voda");
    expect(toLatin("ћирилица")).toBe("ćirilica");
  });

  it("handles digraph letters and spaces", () => {
    expect(toLatin("љубав")).toBe("ljubav");
    expect(toLatin("добро јутро")).toBe("dobro jutro");
  });

  it("preserves case", () => {
    expect(toLatin("Београд")).toBe("Beograd");
  });

  it("casts digraphs by context: title-case alone, all-caps in a run", () => {
    // Title-case (sentence-initial / proper noun) keeps the title-case digraph.
    expect(toLatin("Љубав")).toBe("Ljubav");
    expect(toLatin("Џеп")).toBe("Džep");
    // All-caps words take the all-caps digraph, including a trailing one.
    expect(toLatin("ЉУБАВ")).toBe("LJUBAV");
    expect(toLatin("ЊЕГОШ")).toBe("NJEGOŠ");
    expect(toLatin("КОЊ")).toBe("KONJ");
    // A lone capital letter has no uppercase neighbour, so it stays title-case.
    expect(toLatin("Њ")).toBe("Nj");
  });
});

describe("asciiSlug", () => {
  it("folds Serbian Latin diacritics to ASCII", () => {
    expect(asciiSlug("doviđenja")).toBe("dovidjenja");
    expect(asciiSlug("žena")).toBe("zena");
    expect(asciiSlug("čovek")).toBe("covek");
    expect(asciiSlug("kuća")).toBe("kuca");
  });

  it("turns spaces into hyphens", () => {
    expect(asciiSlug("dobro jutro")).toBe("dobro-jutro");
  });

  it("derives ids that match the established word ids", () => {
    // Guards against silently changing keys that index a learner's saved cards.
    expect(`word-${asciiSlug(toLatin("ићи"))}`).toBe("word-ici");
    expect(`word-${asciiSlug(toLatin("ноћ"))}`).toBe("word-noc");
  });
});
