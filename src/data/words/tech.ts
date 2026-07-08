import { word } from "~/lib/content/word";

const n = "noun" as const;

export const tech = [
  word({
    cyrillic: "телефон",
    gender: "m",
    english: "telephone",
    topic: "tech",
    pos: n,
    examples: [
      {
        cyrillic: "Заборавио сам телефон у ауту.",
        english: "I forgot my phone in the car.",
      },
    ],
  }),
  word({
    cyrillic: "мобилни",
    gender: "m",
    english: "mobile / cell phone",
    accept: ["mobile phone", "cell"],
    topic: "tech",
    pos: n,
    examples: [
      {
        cyrillic: "Мој мобилни је остао без батерије.",
        english: "My cell phone ran out of battery.",
      },
    ],
  }),
  word({
    cyrillic: "рачунар",
    gender: "m",
    english: "computer",
    topic: "tech",
    pos: n,
    mnemonic:
      "From рачунати ('to calculate') — just as English 'computer' comes from 'compute'.",
    examples: [
      {
        cyrillic: "Рачунар ми је спор.",
        english: "My computer is slow.",
      },
    ],
  }),
  word({
    cyrillic: "лаптоп",
    gender: "m",
    english: "laptop",
    topic: "tech",
    pos: n,
    examples: [
      {
        cyrillic: "Носим лаптоп на посао.",
        english: "I carry my laptop to work.",
      },
    ],
  }),
  word({
    cyrillic: "екран",
    gender: "m",
    english: "screen",
    topic: "tech",
    pos: n,
    examples: [
      {
        cyrillic: "Екран телефона је напукао.",
        english: "The phone's screen cracked.",
      },
    ],
  }),
  word({
    cyrillic: "тастатура",
    gender: "f",
    english: "keyboard",
    topic: "tech",
    pos: n,
    examples: [
      {
        cyrillic: "Тастатура има српска слова.",
        english: "The keyboard has Serbian letters.",
      },
    ],
  }),
  word({
    cyrillic: "интернет",
    gender: "m",
    english: "internet",
    topic: "tech",
    pos: n,
    examples: [
      {
        cyrillic: "Без интернета не могу да радим.",
        english: "I can't work without the internet.",
      },
    ],
  }),
  word({
    cyrillic: "имејл",
    gender: "m",
    english: "email",
    topic: "tech",
    pos: n,
    examples: [
      {
        cyrillic: "Послао сам ти имејл.",
        english: "I sent you an email.",
      },
    ],
  }),
  word({
    cyrillic: "порука",
    gender: "f",
    english: "message",
    topic: "tech",
    pos: n,
    examples: [
      {
        cyrillic: "Добио сам поруку од шефа.",
        english: "I got a message from my boss.",
      },
    ],
  }),
  word({
    cyrillic: "лозинка",
    gender: "f",
    english: "password",
    topic: "tech",
    pos: n,
    examples: [
      {
        cyrillic: "Заборавио сам лозинку.",
        english: "I forgot my password.",
      },
    ],
  }),
  word({
    cyrillic: "камера",
    gender: "f",
    english: "camera",
    topic: "tech",
    pos: n,
    examples: [
      {
        cyrillic: "Камера на телефону је одлична.",
        english: "The camera on the phone is excellent.",
      },
    ],
  }),
  word({
    cyrillic: "телевизор",
    gender: "m",
    english: "television",
    topic: "tech",
    pos: n,
    examples: [
      {
        cyrillic: "Гледамо вести на телевизору.",
        english: "We watch the news on the television.",
      },
    ],
  }),
  word({
    cyrillic: "радио",
    gender: "m",
    english: "radio",
    topic: "tech",
    pos: n,
    examples: [
      {
        cyrillic: "Слушам радио у ауту.",
        english: "I listen to the radio in the car.",
      },
    ],
  }),
  word({
    cyrillic: "музика",
    gender: "f",
    english: "music",
    topic: "tech",
    pos: n,
    examples: [
      {
        cyrillic: "Волим да слушам музику.",
        english: "I love listening to music.",
      },
    ],
  }),
  word({
    cyrillic: "фотографија",
    gender: "f",
    english: "photograph",
    accept: ["photo"],
    topic: "tech",
    pos: n,
    mnemonic: "фото ('light') + графија ('writing') — 'drawing with light'.",
    examples: [
      {
        cyrillic: "Окачио је фотографију на зид.",
        english: "He hung a photograph on the wall.",
      },
    ],
  }),
];
