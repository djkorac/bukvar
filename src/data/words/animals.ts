import { word } from "~/lib/content/word";

const n = "noun" as const;

export const animals = [
  word({
    cyrillic: "животиња",
    gender: "f",
    english: "animal",
    topic: "animals",
    pos: n,
    mnemonic: "From живот ('life') — a living creature.",
    examples: [
      {
        cyrillic: "Лав је дивља животиња.",
        english: "The lion is a wild animal.",
      },
    ],
  }),
  word({
    cyrillic: "пас",
    gender: "m",
    english: "dog",
    topic: "animals",
    pos: n,
    examples: [
      {
        cyrillic: "Пас лаје на пролазнике.",
        english: "The dog barks at passersby.",
      },
    ],
  }),
  word({
    cyrillic: "мачка",
    gender: "f",
    english: "cat",
    topic: "animals",
    pos: n,
    examples: [
      {
        cyrillic: "Мачка спава на прозору.",
        english: "The cat is sleeping on the windowsill.",
      },
    ],
  }),
  word({
    cyrillic: "коњ",
    gender: "m",
    english: "horse",
    topic: "animals",
    pos: n,
    examples: [
      {
        cyrillic: "Коњ галопира преко поља.",
        english: "The horse gallops across the field.",
      },
    ],
  }),
  word({
    cyrillic: "крава",
    gender: "f",
    english: "cow",
    topic: "animals",
    pos: n,
    examples: [
      {
        cyrillic: "Крава даје млеко.",
        english: "The cow gives milk.",
      },
    ],
  }),
  word({
    cyrillic: "свиња",
    gender: "f",
    english: "pig",
    topic: "animals",
    pos: n,
    mnemonic: "свиња ↔ English 'swine'.",
    examples: [
      {
        cyrillic: "Свиња се ваља у блату.",
        english: "The pig wallows in the mud.",
      },
    ],
  }),
  word({
    cyrillic: "овца",
    gender: "f",
    english: "sheep",
    topic: "animals",
    pos: n,
    mnemonic: "овца ↔ Latin 'ovis' (ovine) / English 'ewe'.",
    examples: [
      {
        cyrillic: "Овца има густу вуну.",
        english: "The sheep has thick wool.",
      },
    ],
  }),
  word({
    cyrillic: "коза",
    gender: "f",
    english: "goat",
    topic: "animals",
    pos: n,
    mnemonic: "One letter from кожа ('skin') — коза is the goat.",
    examples: [
      {
        cyrillic: "Коза пасе на брду.",
        english: "The goat grazes on the hill.",
      },
    ],
  }),
  word({
    cyrillic: "кокошка",
    gender: "f",
    english: "hen / chicken",
    topic: "animals",
    pos: n,
    examples: [
      {
        cyrillic: "Кокошка носи јаја.",
        english: "The hen lays eggs.",
      },
    ],
  }),
  word({
    cyrillic: "петао",
    gender: "m",
    english: "rooster",
    topic: "animals",
    pos: n,
    examples: [
      {
        cyrillic: "Петао кукуриче у зору.",
        english: "The rooster crows at dawn.",
      },
    ],
  }),
  word({
    cyrillic: "патка",
    gender: "f",
    english: "duck",
    topic: "animals",
    pos: n,
    examples: [
      {
        cyrillic: "Патка плива по језеру.",
        english: "The duck swims on the lake.",
      },
    ],
  }),
  word({
    cyrillic: "птица",
    gender: "f",
    english: "bird",
    topic: "animals",
    pos: n,
    examples: [
      {
        cyrillic: "Птица је свила гнездо у дрвету.",
        english: "The bird built a nest in the tree.",
      },
    ],
  }),
  word({
    cyrillic: "миш",
    gender: "m",
    english: "mouse",
    topic: "animals",
    pos: n,
    mnemonic: "миш ↔ 'mouse' / Latin 'mus'.",
    examples: [
      {
        cyrillic: "Миш се сакрио иза ормана.",
        english: "The mouse hid behind the wardrobe.",
      },
    ],
  }),
  word({
    cyrillic: "зец",
    gender: "m",
    english: "rabbit",
    topic: "animals",
    pos: n,
    examples: [
      {
        cyrillic: "Зец брзо трчи.",
        english: "The rabbit runs fast.",
      },
    ],
  }),
  word({
    cyrillic: "вук",
    gender: "m",
    english: "wolf",
    topic: "animals",
    pos: n,
    mnemonic: "вук ↔ English 'wolf' (Latin 'lupus').",
    examples: [
      {
        cyrillic: "Вук завија у ноћи.",
        english: "The wolf howls in the night.",
      },
    ],
  }),
  word({
    cyrillic: "лисица",
    gender: "f",
    english: "fox",
    topic: "animals",
    pos: n,
    examples: [
      {
        cyrillic: "Лисица је лукава животиња.",
        english: "The fox is a cunning animal.",
      },
    ],
  }),
  word({
    cyrillic: "медвед",
    gender: "m",
    english: "bear",
    topic: "animals",
    pos: n,
    mnemonic: "мед ('honey') + the root 'to eat' — a bear is a 'honey-eater'.",
    examples: [
      {
        cyrillic: "Медвед спава целу зиму.",
        english: "The bear sleeps all winter.",
      },
    ],
  }),
  word({
    cyrillic: "лав",
    gender: "m",
    english: "lion",
    topic: "animals",
    pos: n,
    mnemonic: "лав ↔ Greek 'leon' / Latin 'leo'.",
    examples: [
      {
        cyrillic: "Лав је краљ животиња.",
        english: "The lion is the king of animals.",
      },
    ],
  }),
  word({
    cyrillic: "тигар",
    gender: "m",
    english: "tiger",
    topic: "animals",
    pos: n,
    examples: [
      {
        cyrillic: "Тигар има пругасто крзно.",
        english: "The tiger has striped fur.",
      },
    ],
  }),
  word({
    cyrillic: "слон",
    gender: "m",
    english: "elephant",
    topic: "animals",
    pos: n,
    examples: [
      {
        cyrillic: "Слон има дугачку сурлу.",
        english: "The elephant has a long trunk.",
      },
    ],
  }),
  word({
    cyrillic: "мајмун",
    gender: "m",
    english: "monkey",
    topic: "animals",
    pos: n,
    examples: [
      {
        cyrillic: "Мајмун се пење на дрво.",
        english: "The monkey climbs the tree.",
      },
    ],
  }),
  word({
    cyrillic: "змија",
    gender: "f",
    english: "snake",
    topic: "animals",
    pos: n,
    mnemonic:
      "Related to земља ('earth') — the creature that crawls the ground.",
    examples: [
      {
        cyrillic: "Змија је отровна.",
        english: "The snake is venomous.",
      },
    ],
  }),
  word({
    cyrillic: "жаба",
    gender: "f",
    english: "frog",
    topic: "animals",
    pos: n,
    examples: [
      {
        cyrillic: "Жаба скаче поред баре.",
        english: "The frog hops by the pond.",
      },
    ],
  }),
  word({
    cyrillic: "пчела",
    gender: "f",
    english: "bee",
    topic: "animals",
    pos: n,
    examples: [
      {
        cyrillic: "Пчела сакупља нектар.",
        english: "The bee collects nectar.",
      },
    ],
  }),
  word({
    cyrillic: "мрав",
    gender: "m",
    english: "ant",
    topic: "animals",
    pos: n,
    examples: [
      {
        cyrillic: "Мрав носи мрвицу хлеба.",
        english: "The ant carries a breadcrumb.",
      },
    ],
  }),
  word({
    cyrillic: "паук",
    gender: "m",
    english: "spider",
    topic: "animals",
    pos: n,
    examples: [
      {
        cyrillic: "Паук плете мрежу у углу.",
        english: "The spider weaves a web in the corner.",
      },
    ],
  }),
  word({
    cyrillic: "лептир",
    gender: "m",
    english: "butterfly",
    topic: "animals",
    pos: n,
    examples: [
      {
        cyrillic: "Лептир слеће на цвет.",
        english: "The butterfly lands on a flower.",
      },
    ],
  }),
];
