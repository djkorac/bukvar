import { word } from "~/lib/content/word";

const n = "noun" as const;

export const school = [
  word({
    cyrillic: "књига",
    gender: "f",
    english: "book",
    topic: "school",
    pos: n,
    examples: [
      {
        cyrillic: "Ова књига има петсто страна.",
        english: "This book has five hundred pages.",
      },
    ],
  }),
  word({
    cyrillic: "свеска",
    gender: "f",
    english: "notebook",
    topic: "school",
    pos: n,
    examples: [
      {
        cyrillic: "Записао сам белешке у свеску.",
        english: "I wrote notes in my notebook.",
      },
    ],
  }),
  word({
    cyrillic: "оловка",
    gender: "f",
    english: "pencil",
    topic: "school",
    pos: n,
    mnemonic: "From олово ('lead', the metal) — like a pencil's 'lead'.",
    examples: [
      {
        cyrillic: "Оловка ми се сломила.",
        english: "My pencil broke.",
      },
    ],
  }),
  word({
    cyrillic: "папир",
    gender: "m",
    english: "paper",
    topic: "school",
    pos: n,
    examples: [
      {
        cyrillic: "Треба ми лист папира.",
        english: "I need a sheet of paper.",
      },
    ],
  }),
  word({
    cyrillic: "табла",
    gender: "f",
    english: "board",
    topic: "school",
    pos: n,
    mnemonic: "табла ↔ Latin 'tabula' (table, tablet).",
    examples: [
      {
        cyrillic: "Учитељ пише на табли.",
        english: "The teacher writes on the board.",
      },
    ],
  }),
  word({
    cyrillic: "клупа",
    gender: "f",
    english: "desk / bench",
    topic: "school",
    pos: n,
    examples: [
      {
        cyrillic: "Ученици седе у клупама.",
        english: "The pupils sit at their desks.",
      },
    ],
  }),
  word({
    cyrillic: "ранац",
    gender: "m",
    english: "backpack",
    accept: ["rucksack"],
    topic: "school",
    pos: n,
    examples: [
      {
        cyrillic: "Спаковао је ранац за школу.",
        english: "He packed his backpack for school.",
      },
    ],
  }),
  word({
    cyrillic: "лекција",
    gender: "f",
    english: "lesson",
    topic: "school",
    pos: n,
    examples: [
      {
        cyrillic: "Научили смо нову лекцију.",
        english: "We learned a new lesson.",
      },
    ],
  }),
  word({
    cyrillic: "час",
    gender: "m",
    english: "class / lesson",
    topic: "school",
    pos: n,
    mnemonic: "Means a 'class', but also an 'hour' or 'moment'.",
    examples: [
      {
        cyrillic: "Час математике почиње у осам.",
        english: "The math class starts at eight.",
      },
    ],
  }),
  word({
    cyrillic: "испит",
    gender: "m",
    english: "exam",
    topic: "school",
    pos: n,
    examples: [
      {
        cyrillic: "Положио сам испит из историје.",
        english: "I passed the history exam.",
      },
    ],
  }),
  word({
    cyrillic: "оцена",
    gender: "f",
    english: "grade / mark",
    topic: "school",
    pos: n,
    examples: [
      {
        cyrillic: "Добио је одличну оцену.",
        english: "He got an excellent grade.",
      },
    ],
  }),
  word({
    cyrillic: "задатак",
    gender: "m",
    english: "task / assignment",
    topic: "school",
    pos: n,
    examples: [
      {
        cyrillic: "Овај задатак је тежак.",
        english: "This task is difficult.",
      },
    ],
  }),
  word({
    cyrillic: "реч",
    gender: "f",
    english: "word",
    topic: "school",
    pos: n,
    mnemonic:
      "Feminine despite ending in a consonant — an i-stem, like ноћ and ствар.",
    examples: [
      {
        cyrillic: "Не знам ову реч.",
        english: "I don't know this word.",
      },
    ],
  }),
  word({
    cyrillic: "реченица",
    gender: "f",
    english: "sentence",
    topic: "school",
    pos: n,
    examples: [
      {
        cyrillic: "Ова реченица нема смисла.",
        english: "This sentence makes no sense.",
      },
    ],
  }),
  word({
    cyrillic: "питање",
    gender: "n",
    english: "question",
    topic: "school",
    pos: n,
    mnemonic: "From питати ('to ask') — a question.",
    examples: [
      {
        cyrillic: "То је добро питање.",
        english: "That's a good question.",
      },
    ],
  }),
  word({
    cyrillic: "одговор",
    gender: "m",
    english: "answer",
    topic: "school",
    pos: n,
    examples: [
      {
        cyrillic: "Његов одговор је био тачан.",
        english: "His answer was correct.",
      },
    ],
  }),
  word({
    cyrillic: "прича",
    gender: "f",
    english: "story",
    topic: "school",
    pos: n,
    examples: [
      {
        cyrillic: "Деда прича занимљиву причу.",
        english: "Grandpa is telling an interesting story.",
      },
    ],
  }),
  word({
    cyrillic: "број",
    gender: "m",
    english: "number",
    topic: "school",
    pos: n,
    examples: [
      {
        cyrillic: "Који је твој број телефона?",
        english: "What's your phone number?",
      },
    ],
  }),
  word({
    cyrillic: "страна",
    gender: "f",
    english: "page / side",
    topic: "school",
    pos: n,
    mnemonic: "Means both a 'page' and a 'side'.",
    examples: [
      {
        cyrillic: "Отвори књигу на десетој страни.",
        english: "Open the book to page ten.",
      },
    ],
  }),
  word({
    cyrillic: "речник",
    gender: "m",
    english: "dictionary",
    topic: "school",
    pos: n,
    examples: [
      {
        cyrillic: "Тражим реч у речнику.",
        english: "I'm looking up a word in the dictionary.",
      },
    ],
  }),
  word({
    cyrillic: "буквар",
    gender: "m",
    english: "primer / first reading book",
    topic: "school",
    pos: n,
    mnemonic:
      "From буква in its archaic sense 'letter' (modern Serbian: слово); cf. буквално, 'literally'.",
    examples: [
      {
        cyrillic: "Деца уче да читају из буквара.",
        english: "Children learn to read from the primer.",
      },
    ],
  }),
  word({
    cyrillic: "знање",
    gender: "n",
    english: "knowledge",
    topic: "school",
    pos: n,
    mnemonic: "From знати ('to know') — knowledge.",
    examples: [
      {
        cyrillic: "Знање је моћ.",
        english: "Knowledge is power.",
      },
    ],
  }),
  word({
    cyrillic: "пример",
    gender: "m",
    english: "example",
    topic: "school",
    pos: n,
    examples: [
      {
        cyrillic: "Дај ми један пример.",
        english: "Give me an example.",
      },
    ],
  }),
];
