/**
 * Serbian cardinal number names, generated from the digits.
 *
 * A learner can study седам (7), десет (10) and седамдесет (70) as separate word
 * cards, but no card teaches the *composition*: that седамдесет три is 73. This
 * derives the spoken name of any number 0-999,999 from its value, the same
 * "author nothing, derive it" approach as the Latin/IPA pipelines (`toLatin`,
 * `toIpa`): there is one set of rules, so a name can never drift from its number.
 *
 * The forms are the nominative *counting* forms: what you say reading a number
 * aloud (a price, a year, a phone number). Serbian also inflects numerals for
 * case and has paucal agreement with the counted noun (два сата vs пет сати,
 * двадесет једном особом); that belongs to a sentence and is deliberately out of
 * scope for naming a bare number. Two quirks of the counting forms are kept,
 * because they surface the moment you count past twenty:
 *
 *  - **gender on 1 and 2.** Before the feminine хиљада, "one"/"two" go feminine
 *    (две хиљаде, двадесет једна хиљада). The bare remainder uses the masculine
 *    citation forms (двадесет један, сто два).
 *  - **paucal on хиљада.** The thousand-word agrees with its count: хиљаду (1),
 *    хиљаде (the 2-4 paucal), хиљада otherwise (0, 5+, and the teens): две
 *    хиљаде but пет хиљада, двадесет две хиљаде but двадесет пет хиљада.
 *
 * The conjunction и is dropped throughout (двадесет један, not двадесет и
 * један), the standard compositional style.
 */

/** Largest number this names; the drill never asks beyond it. */
export const MAX_NUMBER = 999_999;

// 0-9 in their masculine citation forms; 1 and 2 also have the feminine forms
// below, used only before the feminine хиљада.
const UNITS = [
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
const UNITS_FEM: Record<number, string> = { 1: "једна", 2: "две" };

// 10-19, indexed by n - 10. The teens are a closed, irregular set.
const TEENS = [
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

// Tens, indexed by the tens digit; [0]/[1] are unused (0 and the teens are
// handled separately). шездесет/четрдесет carry the standard assimilated spelling.
const TENS = [
  "",
  "",
  "двадесет",
  "тридесет",
  "четрдесет",
  "педесет",
  "шездесет",
  "седамдесет",
  "осамдесет",
  "деведесет",
];

// Hundreds, indexed by the hundreds digit. Irregular: двеста/триста and the
// fused четиристо/петсто… forms, not a regular "<unit> сто".
const HUNDREDS = [
  "",
  "сто",
  "двеста",
  "триста",
  "четиристо",
  "петсто",
  "шестсто",
  "седамсто",
  "осамсто",
  "деветсто",
];

/** A units digit 1-9; 1 and 2 take a feminine form before хиљада, 3-9 don't. */
const unit = (n: number, feminine: boolean): string =>
  (feminine && UNITS_FEM[n]) || UNITS[n];

/** Name a number 1-99. */
const below100 = (n: number, feminine: boolean): string => {
  if (n < 10) return unit(n, feminine);
  if (n < 20) return TEENS[n - 10];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return ones === 0 ? TENS[tens] : `${TENS[tens]} ${unit(ones, feminine)}`;
};

/** Name a number 1-999. */
const below1000 = (n: number, feminine: boolean): string => {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (hundreds) parts.push(HUNDREDS[hundreds]);
  if (rest) parts.push(below100(rest, feminine));
  return parts.join(" ");
};

/**
 * The form of хиљада agreeing with a thousands-count of 2-999: the paucal
 * хиљаде for counts ending in 2-4 (but not 12-14), хиљада otherwise. (A count
 * of exactly 1 is the idiomatic хиљаду, handled at the call site.)
 */
const thousandWord = (count: number): string => {
  const lastTwo = count % 100;
  const last = count % 10;
  const paucal = last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14);
  return paucal ? "хиљаде" : "хиљада";
};

/**
 * The Serbian counting name of `n`, in Cyrillic. Throws for anything that isn't
 * an integer in 0-{@link MAX_NUMBER}. The corpus pipeline never feeds it one,
 * so a bad input is a caller bug worth surfacing, not a silent empty string.
 */
export const numberToCyrillic = (n: number): string => {
  if (!Number.isInteger(n) || n < 0 || n > MAX_NUMBER) {
    throw new RangeError(
      `numberToCyrillic: ${n} is not an integer in 0-${MAX_NUMBER}`,
    );
  }
  if (n === 0) return "нула";

  const thousands = Math.floor(n / 1000);
  const rest = n % 1000;
  const parts: string[] = [];

  if (thousands === 1) {
    // "хиљаду", never "једна хиљада", the idiomatic form for exactly 1000.
    parts.push("хиљаду");
  } else if (thousands > 1) {
    // The count is feminine (agrees with хиљада): две/једна, not два/један.
    parts.push(below1000(thousands, true), thousandWord(thousands));
  }
  if (rest) parts.push(below1000(rest, false));

  return parts.join(" ");
};
