import { word } from "~/lib/content/word";

const pron = "pronoun" as const;

export const pronouns = [
  word({
    cyrillic: "ја",
    english: "I",
    topic: "pronouns",
    pos: pron,
    examples: [
      {
        cyrillic: "Ја сам из Србије.",
        english: "I am from Serbia.",
      },
    ],
  }),
  word({
    cyrillic: "ти",
    english: "you (singular)",
    topic: "pronouns",
    pos: pron,
    mnemonic: "A cousin of Latin 'tu' and old English 'thou' — informal 'you'.",
    examples: [
      {
        cyrillic: "Ти си мој најбољи пријатељ.",
        english: "You are my best friend.",
      },
    ],
  }),
  word({
    cyrillic: "он",
    english: "he",
    topic: "pronouns",
    pos: pron,
    examples: [
      {
        cyrillic: "Он ради у болници.",
        english: "He works at a hospital.",
      },
    ],
  }),
  word({
    cyrillic: "она",
    english: "she",
    topic: "pronouns",
    pos: pron,
    mnemonic: "он (he) + -а → она (she).",
    examples: [
      {
        cyrillic: "Она говори три језика.",
        english: "She speaks three languages.",
      },
    ],
  }),
  word({
    cyrillic: "оно",
    english: "it",
    topic: "pronouns",
    pos: pron,
    examples: [
      {
        cyrillic: "Дете спава; оно је уморно.",
        english: "The child is sleeping; it is tired.",
      },
    ],
  }),
  word({
    cyrillic: "ми",
    english: "we",
    topic: "pronouns",
    pos: pron,
    mnemonic: "Sounds like English 'me', but the subject ми means 'we'.",
    examples: [
      {
        cyrillic: "Ми идемо на море.",
        english: "We are going to the seaside.",
      },
    ],
  }),
  word({
    cyrillic: "ви",
    english: "you (plural / formal)",
    topic: "pronouns",
    pos: pron,
    mnemonic:
      "Matches French 'vous' / Latin 'vos' — the polite or plural 'you'.",
    examples: [
      {
        cyrillic: "Ви сте врло љубазни.",
        english: "You are very kind.",
      },
    ],
  }),
  word({
    cyrillic: "они",
    english: "they",
    topic: "pronouns",
    pos: pron,
    examples: [
      {
        cyrillic: "Они живе у Новом Саду.",
        english: "They live in Novi Sad.",
      },
    ],
  }),
  word({
    cyrillic: "мој",
    english: "my / mine",
    topic: "pronouns",
    pos: pron,
    mnemonic: "мој sounds like 'my' — and means exactly that.",
    examples: [
      {
        cyrillic: "Ово је мој телефон.",
        english: "This is my phone.",
      },
    ],
  }),
  word({
    cyrillic: "твој",
    english: "your / yours",
    topic: "pronouns",
    pos: pron,
    mnemonic: "Pairs with ти, like English 'thy' goes with 'thou'.",
    examples: [
      {
        cyrillic: "Да ли је ово твој кофер?",
        english: "Is this your suitcase?",
      },
    ],
  }),
  word({
    cyrillic: "наш",
    english: "our / ours",
    topic: "pronouns",
    pos: pron,
    examples: [
      {
        cyrillic: "Наш град је веома стар.",
        english: "Our city is very old.",
      },
    ],
  }),
  word({
    cyrillic: "ваш",
    english: "your / yours (plural)",
    topic: "pronouns",
    pos: pron,
    examples: [
      {
        cyrillic: "Где је ваш аутомобил?",
        english: "Where is your car?",
      },
    ],
  }),
  word({
    cyrillic: "његов",
    english: "his",
    topic: "pronouns",
    pos: pron,
    examples: [
      {
        cyrillic: "Његов брат живи у Берлину.",
        english: "His brother lives in Berlin.",
      },
    ],
  }),
  word({
    cyrillic: "њен",
    english: "her / hers",
    topic: "pronouns",
    pos: pron,
    examples: [
      {
        cyrillic: "Њен муж је доктор.",
        english: "Her husband is a doctor.",
      },
    ],
  }),
  word({
    cyrillic: "њихов",
    english: "their / theirs",
    topic: "pronouns",
    pos: pron,
    examples: [
      {
        cyrillic: "Њихов стан је близу центра.",
        english: "Their apartment is near the center.",
      },
    ],
  }),
  word({
    cyrillic: "ово",
    english: "this",
    topic: "pronouns",
    pos: pron,
    examples: [
      {
        cyrillic: "Ово је одличан ресторан.",
        english: "This is an excellent restaurant.",
      },
    ],
  }),
  word({
    cyrillic: "то",
    english: "that",
    topic: "pronouns",
    pos: pron,
    examples: [
      {
        cyrillic: "То није моја торба.",
        english: "That is not my bag.",
      },
    ],
  }),
];
