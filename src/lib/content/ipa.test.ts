import { describe, expect, it } from "vitest";
import { toIpa } from "./ipa";

describe("toIpa", () => {
  it("transcribes per letter, wrapped in slashes", () => {
    expect(toIpa("вода")).toBe("/ʋoda/");
    expect(toIpa("здраво")).toBe("/zdraʋo/");
  });

  it("expands affricate letters", () => {
    expect(toIpa("ћирилица")).toBe("/tɕirilitsa/");
  });

  it("keeps spaces between words", () => {
    expect(toIpa("добро јутро")).toBe("/dobro jutro/");
  });

  it("passes unmapped boundary characters through, like toLatin", () => {
    expect(toIpa("како-тако")).toBe("/kako-tako/");
  });
});
