import { word } from "~/lib/content/word";

const a = "adjective" as const;

export const colours = [
  word({
    cyrillic: "црвен",
    english: "red",
    topic: "colours",
    pos: a,
    examples: [
      {
        cyrillic: "Семафор је сада црвен.",
        english: "The traffic light is red now.",
      },
    ],
  }),
  word({
    cyrillic: "плав",
    english: "blue",
    topic: "colours",
    pos: a,
    examples: [
      {
        cyrillic: "Његов капут је плав.",
        english: "His coat is blue.",
      },
    ],
  }),
  word({
    cyrillic: "зелен",
    english: "green",
    topic: "colours",
    pos: a,
    examples: [
      {
        cyrillic: "Овај чај је зелен.",
        english: "This tea is green.",
      },
    ],
  }),
  word({
    cyrillic: "жут",
    english: "yellow",
    topic: "colours",
    pos: a,
    examples: [
      {
        cyrillic: "Лимун је жут и кисео.",
        english: "The lemon is yellow and sour.",
      },
    ],
  }),
  word({
    cyrillic: "наранџаст",
    english: "orange (colour)",
    topic: "colours",
    pos: a,
    mnemonic:
      "From наранџа ('orange' fruit) — same source as English 'orange'.",
    examples: [
      {
        cyrillic: "Залазак сунца је наранџаст.",
        english: "The sunset is orange.",
      },
    ],
  }),
  word({
    cyrillic: "љубичаст",
    english: "purple",
    topic: "colours",
    pos: a,
    mnemonic: "From љубичица, the 'violet' flower — purple like a violet.",
    examples: [
      {
        cyrillic: "Њен шал је љубичаст.",
        english: "Her scarf is purple.",
      },
    ],
  }),
  word({
    cyrillic: "розе",
    english: "pink",
    topic: "colours",
    pos: a,
    mnemonic:
      "розе ↔ French 'rose' — pink like a rose; borrowed, so it never declines.",
    examples: [
      {
        cyrillic: "Њен телефон је розе.",
        english: "Her phone is pink.",
      },
    ],
  }),
  word({
    cyrillic: "браон",
    english: "brown",
    topic: "colours",
    pos: a,
    mnemonic:
      "браон ↔ German 'braun' / English 'brown'; borrowed, so it never declines.",
    examples: [
      {
        cyrillic: "Мој каиш је браон.",
        english: "My belt is brown.",
      },
    ],
  }),
  word({
    cyrillic: "црн",
    english: "black",
    topic: "colours",
    pos: a,
    examples: [
      {
        cyrillic: "Његов ауто је црн.",
        english: "His car is black.",
      },
    ],
  }),
  word({
    cyrillic: "бео",
    english: "white",
    topic: "colours",
    pos: a,
    mnemonic: "бео = 'white'; Београд literally means 'white city'.",
    examples: [
      {
        cyrillic: "Снег је чист и бео.",
        english: "The snow is clean and white.",
      },
    ],
  }),
  word({
    cyrillic: "сив",
    english: "grey",
    topic: "colours",
    pos: a,
    examples: [
      {
        cyrillic: "Слон је велик и сив.",
        english: "The elephant is big and grey.",
      },
    ],
  }),
  word({
    cyrillic: "златан",
    english: "golden",
    accept: ["gold"],
    topic: "colours",
    pos: a,
    mnemonic: "From злато ('gold') — the same ancient root as English 'gold'.",
    examples: [
      {
        cyrillic: "Њен прстен је златан.",
        english: "Her ring is golden.",
      },
    ],
  }),
];
