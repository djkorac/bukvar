import { word } from "~/lib/content/word";

export const directions = [
  word({
    cyrillic: "лево",
    english: "left",
    topic: "directions",
    mnemonic: "лево ↔ Latin 'laevus' (left).",
    examples: [
      {
        cyrillic: "Скрени лево на углу.",
        english: "Turn left at the corner.",
      },
    ],
  }),
  word({
    cyrillic: "десно",
    english: "right",
    topic: "directions",
    mnemonic: "десно ↔ Latin 'dexter' (right; dexterous).",
    examples: [
      {
        cyrillic: "Продавница је десно од банке.",
        english: "The shop is to the right of the bank.",
      },
    ],
  }),
  word({
    cyrillic: "право",
    english: "straight (ahead)",
    topic: "directions",
    examples: [
      {
        cyrillic: "Иди право до семафора.",
        english: "Go straight to the traffic light.",
      },
    ],
  }),
  word({
    cyrillic: "напред",
    english: "forward",
    accept: ["ahead"],
    topic: "directions",
    mnemonic: "на + пред ('front') — forward; назад uses зад ('back').",
    examples: [
      {
        cyrillic: "Корак напред, два корака назад.",
        english: "One step forward, two steps back.",
      },
    ],
  }),
  word({
    cyrillic: "назад",
    english: "back / backward",
    topic: "directions",
    examples: [
      {
        cyrillic: "Врати се назад истим путем.",
        english: "Go back the same way.",
      },
    ],
  }),
  word({
    cyrillic: "горе",
    english: "up / above",
    topic: "directions",
    examples: [
      {
        cyrillic: "Погледај горе у небо.",
        english: "Look up at the sky.",
      },
    ],
  }),
  word({
    cyrillic: "доле",
    english: "down / below",
    topic: "directions",
    examples: [
      {
        cyrillic: "Сачекај ме доле.",
        english: "Wait for me downstairs.",
      },
    ],
  }),
  word({
    cyrillic: "овде",
    english: "here",
    topic: "directions",
    examples: [
      {
        cyrillic: "Овде нема никога.",
        english: "There's no one here.",
      },
    ],
  }),
  word({
    cyrillic: "тамо",
    english: "there",
    topic: "directions",
    examples: [
      {
        cyrillic: "Стави торбу тамо.",
        english: "Put the bag over there.",
      },
    ],
  }),
  word({
    cyrillic: "близу",
    english: "near / close",
    topic: "directions",
    examples: [
      {
        cyrillic: "Школа је близу куће.",
        english: "The school is close to the house.",
      },
    ],
  }),
  word({
    cyrillic: "далеко",
    english: "far",
    topic: "directions",
    examples: [
      {
        cyrillic: "Аеродром је далеко од центра.",
        english: "The airport is far from the center.",
      },
    ],
  }),
  word({
    cyrillic: "унутра",
    english: "inside",
    topic: "directions",
    examples: [
      {
        cyrillic: "Хладно је, уђимо унутра.",
        english: "It's cold, let's go inside.",
      },
    ],
  }),
  word({
    cyrillic: "напољу",
    english: "outside",
    topic: "directions",
    examples: [
      {
        cyrillic: "Остави ципеле напољу.",
        english: "Leave the shoes outside.",
      },
    ],
  }),
  word({
    cyrillic: "поред",
    english: "next to / beside",
    topic: "directions",
    examples: [
      {
        cyrillic: "Седи поред мене.",
        english: "Sit next to me.",
      },
    ],
  }),
  word({
    cyrillic: "испод",
    english: "under / below",
    topic: "directions",
    mnemonic:
      "под ('under') prefixed; same set: изнад (над), испред (пред), иза (за).",
    examples: [
      {
        cyrillic: "Мачка се сакрила испод стола.",
        english: "The cat hid under the table.",
      },
    ],
  }),
  word({
    cyrillic: "изнад",
    english: "above / over",
    topic: "directions",
    examples: [
      {
        cyrillic: "Слика виси изнад кревета.",
        english: "The picture hangs above the bed.",
      },
    ],
  }),
  word({
    cyrillic: "испред",
    english: "in front of",
    topic: "directions",
    examples: [
      {
        cyrillic: "Чекам те испред зграде.",
        english: "I'm waiting for you in front of the building.",
      },
    ],
  }),
  word({
    cyrillic: "иза",
    english: "behind",
    topic: "directions",
    examples: [
      {
        cyrillic: "Башта је иза куће.",
        english: "The garden is behind the house.",
      },
    ],
  }),
  word({
    cyrillic: "између",
    english: "between",
    topic: "directions",
    mnemonic: "из + међу ('among') — between.",
    examples: [
      {
        cyrillic: "Седим између две особе.",
        english: "I'm sitting between two people.",
      },
    ],
  }),
];
