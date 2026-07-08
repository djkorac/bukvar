import { word } from "~/lib/content/word";

const n = "noun" as const;

export const feelings = [
  word({
    cyrillic: "љубав",
    gender: "f",
    english: "love",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Љубав је најлепше осећање.",
        english: "Love is the most beautiful feeling.",
      },
    ],
  }),
  word({
    cyrillic: "срећа",
    gender: "f",
    english: "happiness / luck",
    topic: "feelings",
    pos: n,
    mnemonic: "Means both 'happiness' and 'luck' — cf. срећан ('happy').",
    examples: [
      {
        cyrillic: "Срећа не зависи од новца.",
        english: "Happiness doesn't depend on money.",
      },
    ],
  }),
  word({
    cyrillic: "радост",
    gender: "f",
    english: "joy",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Њено лице је блистало од радости.",
        english: "Her face beamed with joy.",
      },
    ],
  }),
  word({
    cyrillic: "туга",
    gender: "f",
    english: "sadness",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Осећам тугу због растанка.",
        english: "I feel sadness over the parting.",
      },
    ],
  }),
  word({
    cyrillic: "страх",
    gender: "m",
    english: "fear",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Страх од висине је чест.",
        english: "Fear of heights is common.",
      },
    ],
  }),
  word({
    cyrillic: "бес",
    gender: "m",
    english: "anger / rage",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Није могао да сакрије бес.",
        english: "He couldn't hide his anger.",
      },
    ],
  }),
  word({
    cyrillic: "нада",
    gender: "f",
    english: "hope",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Никад не губи наду.",
        english: "Never lose hope.",
      },
    ],
  }),
  word({
    cyrillic: "брига",
    gender: "f",
    english: "worry / care",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Деца су највећа брига родитеља.",
        english: "Children are parents' greatest worry.",
      },
    ],
  }),
  word({
    cyrillic: "понос",
    gender: "m",
    english: "pride",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Осећа понос због свог сина.",
        english: "He feels pride in his son.",
      },
    ],
  }),
  word({
    cyrillic: "осећај",
    gender: "m",
    english: "feeling",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Имао сам осећај да нешто није у реду.",
        english: "I had a feeling that something was wrong.",
      },
    ],
  }),
  word({
    cyrillic: "жеља",
    gender: "f",
    english: "wish / desire",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Његова жеља се остварила.",
        english: "His wish came true.",
      },
    ],
  }),
  word({
    cyrillic: "мисао",
    gender: "f",
    english: "thought",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Та мисао ме не напушта.",
        english: "That thought won't leave me.",
      },
    ],
  }),
  word({
    cyrillic: "идеја",
    gender: "f",
    english: "idea",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Имам сјајну идеју!",
        english: "I have a great idea!",
      },
    ],
  }),
  word({
    cyrillic: "сан",
    gender: "m",
    english: "dream / sleep",
    topic: "feelings",
    pos: n,
    mnemonic: "сан ↔ Latin 'somnus' (insomnia).",
    examples: [
      {
        cyrillic: "Синоћ сам имао чудан сан.",
        english: "Last night I had a strange dream.",
      },
    ],
  }),
  word({
    cyrillic: "мир",
    gender: "m",
    english: "peace / calm",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Желим само мир и тишину.",
        english: "I just want peace and quiet.",
      },
    ],
  }),
  word({
    cyrillic: "рат",
    gender: "m",
    english: "war",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Рат доноси само патњу.",
        english: "War brings only suffering.",
      },
    ],
  }),
  word({
    cyrillic: "истина",
    gender: "f",
    english: "truth",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Истина увек изађе на видело.",
        english: "The truth always comes out.",
      },
    ],
  }),
  word({
    cyrillic: "лаж",
    gender: "f",
    english: "lie",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "То је обична лаж.",
        english: "That's a plain lie.",
      },
    ],
  }),
  word({
    cyrillic: "живот",
    gender: "m",
    english: "life",
    topic: "feelings",
    pos: n,
    mnemonic: "Root of 'life' — also in жив ('alive') and животиња ('animal').",
    examples: [
      {
        cyrillic: "Живот је пун изненађења.",
        english: "Life is full of surprises.",
      },
    ],
  }),
  word({
    cyrillic: "смрт",
    gender: "f",
    english: "death",
    topic: "feelings",
    pos: n,
    mnemonic: "смрт ↔ Latin 'mors' (mortal) — cf. мртав ('dead').",
    examples: [
      {
        cyrillic: "Смрт је део живота.",
        english: "Death is a part of life.",
      },
    ],
  }),
  word({
    cyrillic: "здравље",
    gender: "n",
    english: "health",
    topic: "feelings",
    pos: n,
    mnemonic:
      "Root of 'health' — also in здраво ('hello') and здрав ('healthy').",
    examples: [
      {
        cyrillic: "Здравље је најважније.",
        english: "Health is the most important thing.",
      },
    ],
  }),
  word({
    cyrillic: "болест",
    gender: "f",
    english: "illness / disease",
    accept: ["sickness"],
    topic: "feelings",
    pos: n,
    mnemonic: "Root of 'pain/illness' — also in бол, болница, болестан.",
    examples: [
      {
        cyrillic: "Грип је заразна болест.",
        english: "The flu is a contagious illness.",
      },
    ],
  }),
  word({
    cyrillic: "снага",
    gender: "f",
    english: "strength",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Снага воље је важна.",
        english: "Willpower is important.",
      },
    ],
  }),
  word({
    cyrillic: "проблем",
    gender: "m",
    english: "problem",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Реши проблем корак по корак.",
        english: "Solve the problem step by step.",
      },
    ],
  }),
  word({
    cyrillic: "разлог",
    gender: "m",
    english: "reason",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Нема разлога за бригу.",
        english: "There's no reason to worry.",
      },
    ],
  }),
  word({
    cyrillic: "циљ",
    gender: "m",
    english: "goal / aim",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Његов циљ је да заврши факултет.",
        english: "His goal is to finish university.",
      },
    ],
  }),
  word({
    cyrillic: "успех",
    gender: "m",
    english: "success",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Успех долази са трудом.",
        english: "Success comes with effort.",
      },
    ],
  }),
  word({
    cyrillic: "грешка",
    gender: "f",
    english: "mistake / error",
    topic: "feelings",
    pos: n,
    examples: [
      {
        cyrillic: "Свако прави грешке.",
        english: "Everyone makes mistakes.",
      },
    ],
  }),
];
