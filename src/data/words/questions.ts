import { word } from "~/lib/content/word";

const pron = "pronoun" as const;

export const questions = [
  word({
    cyrillic: "ко",
    english: "who",
    topic: "questions",
    pos: pron,
    mnemonic: "ко ↔ 'who' / Latin 'quis' — Serbian's к- matches English 'wh-'.",
    examples: [
      {
        cyrillic: "Ко је на вратима?",
        english: "Who is at the door?",
      },
    ],
  }),
  word({
    cyrillic: "шта",
    english: "what",
    topic: "questions",
    pos: pron,
    examples: [
      {
        cyrillic: "Шта радиш данас?",
        english: "What are you doing today?",
      },
    ],
  }),
  word({
    cyrillic: "где",
    english: "where",
    topic: "questions",
    examples: [
      {
        cyrillic: "Где живиш?",
        english: "Where do you live?",
      },
    ],
  }),
  word({
    cyrillic: "када",
    english: "when",
    topic: "questions",
    examples: [
      {
        cyrillic: "Када почиње филм?",
        english: "When does the movie start?",
      },
    ],
  }),
  word({
    cyrillic: "зашто",
    english: "why",
    topic: "questions",
    mnemonic: "за ('for') + што ('what') — literally 'for what?'.",
    examples: [
      {
        cyrillic: "Зашто касниш?",
        english: "Why are you late?",
      },
    ],
  }),
  word({
    cyrillic: "како",
    english: "how",
    topic: "questions",
    examples: [
      {
        cyrillic: "Како се осећаш?",
        english: "How do you feel?",
      },
    ],
  }),
  word({
    cyrillic: "који",
    english: "which",
    topic: "questions",
    pos: pron,
    examples: [
      {
        cyrillic: "Који аутобус иде до центра?",
        english: "Which bus goes to the center?",
      },
    ],
  }),
  word({
    cyrillic: "колико",
    english: "how much / how many",
    topic: "questions",
    examples: [
      {
        cyrillic: "Колико имаш година?",
        english: "How old are you?",
      },
    ],
  }),
  word({
    cyrillic: "чији",
    english: "whose",
    topic: "questions",
    pos: pron,
    examples: [
      {
        cyrillic: "Чији је ово капут?",
        english: "Whose coat is this?",
      },
    ],
  }),
  word({
    cyrillic: "куда",
    english: "where to / which way",
    topic: "questions",
    mnemonic: "куда asks 'which way' (motion); где asks 'where' (location).",
    examples: [
      {
        cyrillic: "Куда идеш?",
        english: "Where are you going?",
      },
    ],
  }),
];
