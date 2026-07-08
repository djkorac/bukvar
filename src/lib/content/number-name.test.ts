import { describe, expect, it } from "vitest";
import { MAX_NUMBER, numberToCyrillic } from "./number-name";

describe("numberToCyrillic", () => {
  it("names zero and the units", () => {
    const units = [
      "нула",
      "један",
      "два",
      "три",
      "четири",
      "пет",
      "шест",
      "седам",
      "осам",
      "девет",
    ];
    units.forEach((name, n) => {
      expect(numberToCyrillic(n)).toBe(name);
    });
  });

  it("names the teens (the irregular 10-19)", () => {
    const teens = [
      "десет",
      "једанаест",
      "дванаест",
      "тринаест",
      "четрнаест",
      "петнаест",
      "шеснаест",
      "седамнаест",
      "осамнаест",
      "деветнаест",
    ];
    teens.forEach((name, i) => {
      expect(numberToCyrillic(10 + i)).toBe(name);
    });
  });

  it("names the round tens", () => {
    expect(numberToCyrillic(20)).toBe("двадесет");
    expect(numberToCyrillic(30)).toBe("тридесет");
    expect(numberToCyrillic(40)).toBe("четрдесет");
    expect(numberToCyrillic(50)).toBe("педесет");
    expect(numberToCyrillic(60)).toBe("шездесет");
    expect(numberToCyrillic(90)).toBe("деведесет");
  });

  it("composes tens with units (the седамдесет три → 73 case)", () => {
    expect(numberToCyrillic(21)).toBe("двадесет један");
    expect(numberToCyrillic(42)).toBe("четрдесет два");
    expect(numberToCyrillic(73)).toBe("седамдесет три");
    expect(numberToCyrillic(99)).toBe("деведесет девет");
  });

  it("names the irregular hundreds", () => {
    expect(numberToCyrillic(100)).toBe("сто");
    expect(numberToCyrillic(200)).toBe("двеста");
    expect(numberToCyrillic(300)).toBe("триста");
    expect(numberToCyrillic(400)).toBe("четиристо");
    expect(numberToCyrillic(500)).toBe("петсто");
    expect(numberToCyrillic(600)).toBe("шестсто");
    expect(numberToCyrillic(900)).toBe("деветсто");
  });

  it("composes hundreds with the rest", () => {
    expect(numberToCyrillic(101)).toBe("сто један");
    expect(numberToCyrillic(102)).toBe("сто два");
    expect(numberToCyrillic(365)).toBe("триста шездесет пет");
    expect(numberToCyrillic(999)).toBe("деветсто деведесет девет");
  });

  it("uses the idiomatic хиљаду for exactly one thousand, then composes", () => {
    expect(numberToCyrillic(1000)).toBe("хиљаду");
    expect(numberToCyrillic(1001)).toBe("хиљаду један");
    expect(numberToCyrillic(1100)).toBe("хиљаду сто");
    expect(numberToCyrillic(1234)).toBe("хиљаду двеста тридесет четири");
    expect(numberToCyrillic(1999)).toBe("хиљаду деветсто деведесет девет");
  });

  it("makes the thousands count feminine (две/једна, not два/један)", () => {
    expect(numberToCyrillic(2000)).toBe("две хиљаде");
    expect(numberToCyrillic(21000)).toBe("двадесет једна хиљада");
    expect(numberToCyrillic(22000)).toBe("двадесет две хиљаде");
    expect(numberToCyrillic(102000)).toBe("сто две хиљаде");
  });

  it("agrees хиљада / хиљаде / хиљада with the paucal of the count", () => {
    expect(numberToCyrillic(2000)).toContain("хиљаде"); // 2-4 → paucal
    expect(numberToCyrillic(3000)).toBe("три хиљаде");
    expect(numberToCyrillic(4000)).toBe("четири хиљаде");
    expect(numberToCyrillic(5000)).toBe("пет хиљада"); // 5+ → genitive plural
    expect(numberToCyrillic(11000)).toBe("једанаест хиљада"); // teens → not paucal
    expect(numberToCyrillic(12000)).toBe("дванаест хиљада");
    expect(numberToCyrillic(14000)).toBe("четрнаест хиљада");
    expect(numberToCyrillic(25000)).toBe("двадесет пет хиљада");
  });

  it("names large numbers all the way to the ceiling", () => {
    expect(numberToCyrillic(100000)).toBe("сто хиљада");
    expect(numberToCyrillic(123456)).toBe(
      "сто двадесет три хиљаде четиристо педесет шест",
    );
    expect(numberToCyrillic(MAX_NUMBER)).toBe(
      "деветсто деведесет девет хиљада деветсто деведесет девет",
    );
  });

  it("rejects anything outside 0-MAX_NUMBER or non-integer", () => {
    expect(() => numberToCyrillic(-1)).toThrow(RangeError);
    expect(() => numberToCyrillic(MAX_NUMBER + 1)).toThrow(RangeError);
    expect(() => numberToCyrillic(3.5)).toThrow(RangeError);
    expect(() => numberToCyrillic(Number.NaN)).toThrow(RangeError);
  });

  // Safety net against a gap in any lookup table: every number in range must
  // produce a non-empty name of Cyrillic letters and spaces only: no leftover
  // "undefined" from an out-of-range index, no stray digits or punctuation.
  it("produces a clean name for every number in range", () => {
    const allowed = /^[Ѐ-ӿ ]+$/; // Cyrillic block + space
    for (let n = 0; n <= MAX_NUMBER; n++) {
      const name = numberToCyrillic(n);
      if (!allowed.test(name)) {
        throw new Error(`numberToCyrillic(${n}) = ${JSON.stringify(name)}`);
      }
    }
  });
});
