import { word } from "~/lib/content/word";

const n = "noun" as const;

export const people = [
  word({
    cyrillic: "мајка",
    gender: "f",
    english: "mother",
    accept: ["mom"],
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Моја мајка кува одличан ручак.",
        english: "My mother cooks an excellent lunch.",
      },
    ],
  }),
  word({
    cyrillic: "отац",
    gender: "m",
    english: "father",
    accept: ["dad"],
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Његов отац ради као лекар.",
        english: "His father works as a doctor.",
      },
    ],
  }),
  word({
    cyrillic: "брат",
    gender: "m",
    english: "brother",
    topic: "people",
    pos: n,
    mnemonic:
      "Looks like English 'brat', but брат means 'brother' (Latin 'frater').",
    examples: [
      {
        cyrillic: "Мој брат је старији од мене.",
        english: "My brother is older than me.",
      },
    ],
  }),
  word({
    cyrillic: "сестра",
    gender: "f",
    english: "sister",
    topic: "people",
    pos: n,
    mnemonic: "сестра ↔ 'sister' / Latin 'soror'.",
    examples: [
      {
        cyrillic: "Моја сестра студира медицину.",
        english: "My sister studies medicine.",
      },
    ],
  }),
  word({
    cyrillic: "син",
    gender: "m",
    english: "son",
    topic: "people",
    pos: n,
    mnemonic: "Looks like English 'sin', but син means 'son'.",
    examples: [
      {
        cyrillic: "Њихов син иде у школу.",
        english: "Their son goes to school.",
      },
    ],
  }),
  word({
    cyrillic: "ћерка",
    gender: "f",
    english: "daughter",
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Њена ћерка лепо пева.",
        english: "Her daughter sings beautifully.",
      },
    ],
  }),
  word({
    cyrillic: "дете",
    gender: "n",
    english: "child",
    accept: ["kid"],
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Дете се игра у парку.",
        english: "The child is playing in the park.",
      },
    ],
  }),
  word({
    cyrillic: "беба",
    gender: "f",
    english: "baby",
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Беба спава цело поподне.",
        english: "The baby sleeps all afternoon.",
      },
    ],
  }),
  word({
    cyrillic: "баба",
    gender: "f",
    english: "grandmother",
    accept: ["grandma", "granny", "nan"],
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Баба прави најбољу питу.",
        english: "Grandma makes the best pie.",
      },
    ],
  }),
  word({
    cyrillic: "деда",
    gender: "m",
    english: "grandfather",
    accept: ["grandpa", "granddad"],
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Деда чита новине свако јутро.",
        english: "Grandpa reads the newspaper every morning.",
      },
    ],
  }),
  word({
    cyrillic: "унук",
    gender: "m",
    english: "grandson",
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Унук помаже деди у башти.",
        english: "The grandson helps grandpa in the garden.",
      },
    ],
  }),
  word({
    cyrillic: "унука",
    gender: "f",
    english: "granddaughter",
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Унука личи на бабу.",
        english: "The granddaughter looks like her grandmother.",
      },
    ],
  }),
  word({
    cyrillic: "муж",
    gender: "m",
    english: "husband",
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Њен муж кува викендом.",
        english: "Her husband cooks on weekends.",
      },
    ],
  }),
  word({
    cyrillic: "жена",
    gender: "f",
    english: "woman / wife",
    topic: "people",
    pos: n,
    mnemonic: "жена ↔ Greek 'gyne-' (gynecology) — a woman or wife.",
    examples: [
      {
        cyrillic: "Та жена је врло паметна.",
        english: "That woman is very smart.",
      },
    ],
  }),
  word({
    cyrillic: "породица",
    gender: "f",
    english: "family",
    topic: "people",
    pos: n,
    mnemonic: "Built on род ('kin') — the same root as рођак ('relative').",
    examples: [
      {
        cyrillic: "Наша породица је велика.",
        english: "Our family is large.",
      },
    ],
  }),
  word({
    cyrillic: "родитељи",
    gender: "m",
    english: "parents",
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Моји родитељи живе на селу.",
        english: "My parents live in the countryside.",
      },
    ],
  }),
  word({
    cyrillic: "деца",
    gender: "f",
    english: "children",
    accept: ["kids"],
    topic: "people",
    pos: n,
    mnemonic:
      "Collective noun — feminine in agreement (добра деца), but takes a plural verb (деца се играју).",
    examples: [
      {
        cyrillic: "Деца се играју напољу.",
        english: "The children are playing outside.",
      },
    ],
  }),
  word({
    cyrillic: "рођак",
    gender: "m",
    english: "relative / cousin",
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Мој рођак долази из Чикага.",
        english: "My cousin is coming from Chicago.",
      },
    ],
  }),
  word({
    cyrillic: "човек",
    gender: "m",
    english: "man / person",
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Тај човек ради у банци.",
        english: "That man works at a bank.",
      },
    ],
  }),
  word({
    cyrillic: "особа",
    gender: "f",
    english: "person",
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Она је веома драга особа.",
        english: "She is a very kind person.",
      },
    ],
  }),
  word({
    cyrillic: "момак",
    gender: "m",
    english: "young man / boyfriend",
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Њен момак свира гитару.",
        english: "Her boyfriend plays the guitar.",
      },
    ],
  }),
  word({
    cyrillic: "девојка",
    gender: "f",
    english: "girl / girlfriend",
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Та девојка учи српски.",
        english: "That girl is learning Serbian.",
      },
    ],
  }),
  word({
    cyrillic: "пријатељ",
    gender: "m",
    english: "friend",
    topic: "people",
    pos: n,
    mnemonic:
      "пријатељ ↔ English 'friend' — both from an ancient root meaning 'dear'.",
    examples: [
      {
        cyrillic: "Мој пријатељ долази сутра.",
        english: "My friend is coming tomorrow.",
      },
    ],
  }),
  word({
    cyrillic: "друг",
    gender: "m",
    english: "friend / companion",
    topic: "people",
    pos: n,
    mnemonic: "Looks like English 'drug', but друг means 'friend / companion'.",
    examples: [
      {
        cyrillic: "Друг из детињства ме је посетио.",
        english: "A childhood friend visited me.",
      },
    ],
  }),
  word({
    cyrillic: "сусед",
    gender: "m",
    english: "neighbor",
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Наш сусед има великог пса.",
        english: "Our neighbor has a big dog.",
      },
    ],
  }),
  word({
    cyrillic: "гост",
    gender: "m",
    english: "guest",
    topic: "people",
    pos: n,
    mnemonic: "гост ↔ 'guest' / Latin 'hospes' (hospitality).",
    examples: [
      {
        cyrillic: "Вечерас нам долази гост.",
        english: "A guest is coming to us tonight.",
      },
    ],
  }),
  word({
    cyrillic: "господин",
    gender: "m",
    english: "gentleman / Mr.",
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Господин Петровић је адвокат.",
        english: "Mr. Petrović is a lawyer.",
      },
    ],
  }),
  word({
    cyrillic: "госпођа",
    gender: "f",
    english: "lady / Mrs.",
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Госпођа Јовановић предаје хемију.",
        english: "Mrs. Jovanović teaches chemistry.",
      },
    ],
  }),
  word({
    cyrillic: "народ",
    gender: "m",
    english: "people / nation",
    topic: "people",
    pos: n,
    examples: [
      {
        cyrillic: "Српски народ слави славу.",
        english: "The Serbian people celebrate the slava.",
      },
    ],
  }),
  word({
    cyrillic: "име",
    gender: "n",
    english: "name",
    topic: "people",
    pos: n,
    mnemonic: "име ↔ 'name' / Latin 'nomen'.",
    examples: [
      {
        cyrillic: "Моје име је Никола.",
        english: "My name is Nikola.",
      },
    ],
  }),
  word({
    cyrillic: "презиме",
    gender: "n",
    english: "surname",
    topic: "people",
    pos: n,
    mnemonic: "пре- ('before') + име ('name') — the family name.",
    examples: [
      {
        cyrillic: "Његово презиме је тешко за изговор.",
        english: "His surname is hard to pronounce.",
      },
    ],
  }),
];
