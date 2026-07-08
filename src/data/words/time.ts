import { word } from "~/lib/content/word";

const n = "noun" as const;

export const time = [
  word({
    cyrillic: "време",
    gender: "n",
    english: "time / weather",
    topic: "time",
    pos: n,
    mnemonic: "Means both 'time' and 'weather' — context decides which.",
    examples: [
      {
        cyrillic: "Време брзо пролази.",
        english: "Time passes quickly.",
      },
    ],
  }),
  word({
    cyrillic: "тренутак",
    gender: "m",
    english: "moment",
    topic: "time",
    pos: n,
    examples: [
      {
        cyrillic: "Сачекај тренутак, молим те.",
        english: "Wait a moment, please.",
      },
    ],
  }),
  word({
    cyrillic: "секунда",
    gender: "f",
    english: "second",
    topic: "time",
    pos: n,
    examples: [
      {
        cyrillic: "Свака секунда се рачуна.",
        english: "Every second counts.",
      },
    ],
  }),
  word({
    cyrillic: "минут",
    gender: "m",
    english: "minute",
    topic: "time",
    pos: n,
    examples: [
      {
        cyrillic: "Стижем за пет минута.",
        english: "I'm arriving in five minutes.",
      },
    ],
  }),
  word({
    cyrillic: "сат",
    gender: "m",
    english: "hour / clock",
    topic: "time",
    pos: n,
    mnemonic: "Means both 'hour' and 'clock'.",
    examples: [
      {
        cyrillic: "Сат на зиду је стао.",
        english: "The clock on the wall stopped.",
      },
    ],
  }),
  word({
    cyrillic: "дан",
    gender: "m",
    english: "day",
    topic: "time",
    pos: n,
    examples: [
      {
        cyrillic: "Данас је диван дан.",
        english: "Today is a lovely day.",
      },
    ],
  }),
  word({
    cyrillic: "недеља",
    gender: "f",
    english: "week / Sunday",
    topic: "time",
    pos: n,
    mnemonic: "Means both 'week' and 'Sunday' — literally the 'no-work' day.",
    examples: [
      {
        cyrillic: "Видимо се следеће недеље.",
        english: "See you next week.",
      },
    ],
  }),
  word({
    cyrillic: "месец",
    gender: "m",
    english: "month / moon",
    topic: "time",
    pos: n,
    mnemonic:
      "Means both 'month' and 'moon' (as English 'month' came from 'moon').",
    examples: [
      {
        cyrillic: "Идући месец путујем у Италију.",
        english: "Next month I'm traveling to Italy.",
      },
    ],
  }),
  word({
    cyrillic: "година",
    gender: "f",
    english: "year",
    topic: "time",
    pos: n,
    examples: [
      {
        cyrillic: "Нова година почиње у јануару.",
        english: "The new year begins in January.",
      },
    ],
  }),
  word({
    cyrillic: "век",
    gender: "m",
    english: "century",
    topic: "time",
    pos: n,
    examples: [
      {
        cyrillic: "Живимо у двадесет првом веку.",
        english: "We live in the twenty-first century.",
      },
    ],
  }),
  word({
    cyrillic: "јутро",
    gender: "n",
    english: "morning",
    topic: "time",
    pos: n,
    examples: [
      {
        cyrillic: "Свако јутро пијем кафу.",
        english: "Every morning I drink coffee.",
      },
    ],
  }),
  word({
    cyrillic: "подне",
    gender: "n",
    english: "noon",
    accept: ["midday"],
    topic: "time",
    pos: n,
    examples: [
      {
        cyrillic: "Састанак је заказан за подне.",
        english: "The meeting is scheduled for noon.",
      },
    ],
  }),
  word({
    cyrillic: "вече",
    gender: "n",
    english: "evening",
    topic: "time",
    pos: n,
    examples: [
      {
        cyrillic: "Свако вече шетамо поред реке.",
        english: "Every evening we walk by the river.",
      },
    ],
  }),
  word({
    cyrillic: "ноћ",
    gender: "f",
    english: "night",
    topic: "time",
    pos: n,
    mnemonic: "ноћ ↔ 'night' / Latin 'nox' (nocturnal).",
    examples: [
      {
        cyrillic: "Ноћ је била тиха и хладна.",
        english: "The night was quiet and cold.",
      },
    ],
  }),
  word({
    cyrillic: "поноћ",
    gender: "f",
    english: "midnight",
    topic: "time",
    pos: n,
    mnemonic: "по- + ноћ ('night') — the middle of the night.",
    examples: [
      {
        cyrillic: "Воз стиже тачно у поноћ.",
        english: "The train arrives exactly at midnight.",
      },
    ],
  }),
  word({
    cyrillic: "данас",
    english: "today",
    topic: "time",
    examples: [
      {
        cyrillic: "Данас имам пуно посла.",
        english: "Today I have a lot of work.",
      },
    ],
  }),
  word({
    cyrillic: "сутра",
    english: "tomorrow",
    topic: "time",
    examples: [
      {
        cyrillic: "Сутра идемо на излет.",
        english: "Tomorrow we're going on a trip.",
      },
    ],
  }),
  word({
    cyrillic: "јуче",
    english: "yesterday",
    topic: "time",
    examples: [
      {
        cyrillic: "Јуче је падала киша.",
        english: "Yesterday it rained.",
      },
    ],
  }),
  word({
    cyrillic: "прекосутра",
    english: "the day after tomorrow",
    topic: "time",
    mnemonic: "преко ('past') + сутра — 'past tomorrow'.",
    examples: [
      {
        cyrillic: "Испит је прекосутра.",
        english: "The exam is the day after tomorrow.",
      },
    ],
  }),
  word({
    cyrillic: "прекјуче",
    english: "the day before yesterday",
    topic: "time",
    mnemonic: "преко ('past') + јуче ('yesterday') — 'past yesterday'.",
    examples: [
      {
        cyrillic: "Стигли су прекјуче.",
        english: "They arrived the day before yesterday.",
      },
    ],
  }),
  word({
    cyrillic: "сада",
    english: "now",
    topic: "time",
    examples: [
      {
        cyrillic: "Сада немам времена.",
        english: "I don't have time right now.",
      },
    ],
  }),
  word({
    cyrillic: "одмах",
    english: "right away / immediately",
    topic: "time",
    examples: [
      {
        cyrillic: "Дођи одмах, важно је!",
        english: "Come right away, it's important!",
      },
    ],
  }),
  word({
    cyrillic: "ускоро",
    english: "soon",
    topic: "time",
    examples: [
      {
        cyrillic: "Ускоро ће пасти мрак.",
        english: "It will get dark soon.",
      },
    ],
  }),
  word({
    cyrillic: "рано",
    english: "early",
    topic: "time",
    examples: [
      {
        cyrillic: "Устајем рано сваког дана.",
        english: "I get up early every day.",
      },
    ],
  }),
  word({
    cyrillic: "касно",
    english: "late",
    topic: "time",
    examples: [
      {
        cyrillic: "Стигли смо касно на воз.",
        english: "We arrived late for the train.",
      },
    ],
  }),
  word({
    cyrillic: "датум",
    gender: "m",
    english: "date",
    topic: "time",
    pos: n,
    examples: [
      {
        cyrillic: "Који је данас датум?",
        english: "What's today's date?",
      },
    ],
  }),
  word({
    cyrillic: "празник",
    gender: "m",
    english: "holiday",
    topic: "time",
    pos: n,
    mnemonic: "From празан ('empty') — a day free of work.",
    examples: [
      {
        cyrillic: "Божић је велики празник.",
        english: "Christmas is a big holiday.",
      },
    ],
  }),
  word({
    cyrillic: "рођендан",
    gender: "m",
    english: "birthday",
    topic: "time",
    pos: n,
    mnemonic: "рођен ('born') + дан ('day') — a 'born-day'.",
    examples: [
      {
        cyrillic: "Прославили смо њен рођендан.",
        english: "We celebrated her birthday.",
      },
    ],
  }),
  word({
    cyrillic: "понедељак",
    gender: "m",
    english: "Monday",
    topic: "time",
    pos: n,
    mnemonic: "по + недеља — the day after недеља ('Sunday').",
    examples: [
      {
        cyrillic: "Понедељак је тежак дан.",
        english: "Monday is a hard day.",
      },
    ],
  }),
  word({
    cyrillic: "уторак",
    gender: "m",
    english: "Tuesday",
    topic: "time",
    pos: n,
    examples: [
      {
        cyrillic: "Имам час клавира у уторак.",
        english: "I have a piano lesson on Tuesday.",
      },
    ],
  }),
  word({
    cyrillic: "среда",
    gender: "f",
    english: "Wednesday",
    topic: "time",
    pos: n,
    mnemonic: "The 'middle' of the week — from средина ('middle').",
    examples: [
      {
        cyrillic: "Среда је средина недеље.",
        english: "Wednesday is the middle of the week.",
      },
    ],
  }),
  word({
    cyrillic: "четвртак",
    gender: "m",
    english: "Thursday",
    topic: "time",
    pos: n,
    mnemonic: "From четврти ('fourth') — the fourth day.",
    examples: [
      {
        cyrillic: "Четвртак је четврти дан.",
        english: "Thursday is the fourth day.",
      },
    ],
  }),
  word({
    cyrillic: "петак",
    gender: "m",
    english: "Friday",
    topic: "time",
    pos: n,
    mnemonic: "From пети ('fifth') — the fifth day.",
    examples: [
      {
        cyrillic: "Петак је пети дан недеље.",
        english: "Friday is the fifth day of the week.",
      },
    ],
  }),
  word({
    cyrillic: "субота",
    gender: "f",
    english: "Saturday",
    topic: "time",
    pos: n,
    mnemonic: "субота ↔ 'Sabbath' (Hebrew shabbat).",
    examples: [
      {
        cyrillic: "Суботом идемо у куповину.",
        english: "On Saturdays we go shopping.",
      },
    ],
  }),
  word({
    cyrillic: "пролеће",
    gender: "n",
    english: "spring",
    topic: "time",
    pos: n,
    examples: [
      {
        cyrillic: "У пролеће цвета воће.",
        english: "In spring the fruit blossoms.",
      },
    ],
  }),
  word({
    cyrillic: "лето",
    gender: "n",
    english: "summer",
    topic: "time",
    pos: n,
    examples: [
      {
        cyrillic: "Лето је најтоплије годишње доба.",
        english: "Summer is the warmest season.",
      },
    ],
  }),
  word({
    cyrillic: "јесен",
    gender: "f",
    english: "autumn / fall",
    topic: "time",
    pos: n,
    examples: [
      {
        cyrillic: "У јесен пада лишће.",
        english: "In autumn the leaves fall.",
      },
    ],
  }),
  word({
    cyrillic: "зима",
    gender: "f",
    english: "winter",
    topic: "time",
    pos: n,
    mnemonic: "зима ↔ Latin 'hiems' — the root of 'hibernate'.",
    examples: [
      {
        cyrillic: "Зима је хладна и снежна.",
        english: "Winter is cold and snowy.",
      },
    ],
  }),
];
