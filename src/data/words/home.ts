import { word } from "~/lib/content/word";

const n = "noun" as const;

export const home = [
  word({
    cyrillic: "кућа",
    gender: "f",
    english: "house",
    topic: "home",
    pos: n,
    examples: [
      {
        cyrillic: "Њихова кућа има леп врт.",
        english: "Their house has a nice garden.",
      },
    ],
  }),
  word({
    cyrillic: "стан",
    gender: "m",
    english: "apartment / flat",
    topic: "home",
    pos: n,
    examples: [
      {
        cyrillic: "Изнајмљујемо стан у центру.",
        english: "We rent an apartment in the center.",
      },
    ],
  }),
  word({
    cyrillic: "соба",
    gender: "f",
    english: "room",
    topic: "home",
    pos: n,
    examples: [
      {
        cyrillic: "Моја соба гледа на двориште.",
        english: "My room faces the courtyard.",
      },
    ],
  }),
  word({
    cyrillic: "кухиња",
    gender: "f",
    english: "kitchen",
    topic: "home",
    pos: n,
    mnemonic: "кухиња ↔ 'kitchen' / 'cuisine' (Latin 'coquina').",
    examples: [
      {
        cyrillic: "Мирис из кухиње је диван.",
        english: "The smell from the kitchen is wonderful.",
      },
    ],
  }),
  word({
    cyrillic: "купатило",
    gender: "n",
    english: "bathroom",
    topic: "home",
    pos: n,
    mnemonic: "From купати ('to bathe') — the bathing room.",
    examples: [
      {
        cyrillic: "У купатилу нема топле воде.",
        english: "There's no hot water in the bathroom.",
      },
    ],
  }),
  word({
    cyrillic: "ходник",
    gender: "m",
    english: "hallway",
    topic: "home",
    pos: n,
    mnemonic: "From ходати ('to walk') — a passage you walk through.",
    examples: [
      {
        cyrillic: "Ципеле остављамо у ходнику.",
        english: "We leave our shoes in the hallway.",
      },
    ],
  }),
  word({
    cyrillic: "врата",
    gender: "n",
    english: "door",
    topic: "home",
    pos: n,
    mnemonic: "Always plural — врата ('door') takes a plural verb.",
    examples: [
      {
        cyrillic: "Затвори врата, хладно је.",
        english: "Close the door, it's cold.",
      },
    ],
  }),
  word({
    cyrillic: "прозор",
    gender: "m",
    english: "window",
    topic: "home",
    pos: n,
    examples: [
      {
        cyrillic: "Отвори прозор да уђе ваздух.",
        english: "Open the window to let some air in.",
      },
    ],
  }),
  word({
    cyrillic: "зид",
    gender: "m",
    english: "wall",
    topic: "home",
    pos: n,
    examples: [
      {
        cyrillic: "На зиду виси слика.",
        english: "A picture hangs on the wall.",
      },
    ],
  }),
  word({
    cyrillic: "под",
    gender: "m",
    english: "floor",
    topic: "home",
    pos: n,
    examples: [
      {
        cyrillic: "Под је направљен од дрвета.",
        english: "The floor is made of wood.",
      },
    ],
  }),
  word({
    cyrillic: "кров",
    gender: "m",
    english: "roof",
    topic: "home",
    pos: n,
    examples: [
      {
        cyrillic: "Снег је прекрио кров.",
        english: "Snow covered the roof.",
      },
    ],
  }),
  word({
    cyrillic: "кључ",
    gender: "m",
    english: "key",
    topic: "home",
    pos: n,
    mnemonic: "кључ ↔ Latin 'clavis' ('key'; cf. 'clef', 'clavicle').",
    examples: [
      {
        cyrillic: "Изгубио сам кључ од стана.",
        english: "I lost the key to the apartment.",
      },
    ],
  }),
  word({
    cyrillic: "сто",
    gender: "m",
    english: "table",
    topic: "home",
    pos: n,
    mnemonic: "Also means 'hundred' — same spelling, two different words.",
    examples: [
      {
        cyrillic: "Ручак је на столу.",
        english: "Lunch is on the table.",
      },
    ],
  }),
  word({
    cyrillic: "столица",
    gender: "f",
    english: "chair",
    topic: "home",
    pos: n,
    mnemonic: "столица ↔ English 'stool' — something to sit on.",
    examples: [
      {
        cyrillic: "Седни на столицу поред мене.",
        english: "Sit down on the chair next to me.",
      },
    ],
  }),
  word({
    cyrillic: "кревет",
    gender: "m",
    english: "bed",
    topic: "home",
    pos: n,
    examples: [
      {
        cyrillic: "Намести кревет ујутру.",
        english: "Make the bed in the morning.",
      },
    ],
  }),
  word({
    cyrillic: "орман",
    gender: "m",
    english: "wardrobe / cupboard",
    accept: ["closet"],
    topic: "home",
    pos: n,
    mnemonic: "орман ↔ French 'armoire' (Latin 'armarium').",
    examples: [
      {
        cyrillic: "Окачи капут у орман.",
        english: "Hang the coat in the wardrobe.",
      },
    ],
  }),
  word({
    cyrillic: "полица",
    gender: "f",
    english: "shelf",
    topic: "home",
    pos: n,
    examples: [
      {
        cyrillic: "Књиге стоје на полици.",
        english: "The books are on the shelf.",
      },
    ],
  }),
  word({
    cyrillic: "лампа",
    gender: "f",
    english: "lamp",
    topic: "home",
    pos: n,
    examples: [
      {
        cyrillic: "Упали лампу, мрачно је.",
        english: "Turn on the lamp, it's dark.",
      },
    ],
  }),
  word({
    cyrillic: "огледало",
    gender: "n",
    english: "mirror",
    topic: "home",
    pos: n,
    mnemonic: "From гледати ('to look') — the thing you look into.",
    examples: [
      {
        cyrillic: "Огледало у купатилу је замагљено.",
        english: "The mirror in the bathroom is foggy.",
      },
    ],
  }),
  word({
    cyrillic: "тепих",
    gender: "m",
    english: "carpet / rug",
    topic: "home",
    pos: n,
    examples: [
      {
        cyrillic: "Меки тепих прекрива под.",
        english: "A soft carpet covers the floor.",
      },
    ],
  }),
  word({
    cyrillic: "завеса",
    gender: "f",
    english: "curtain",
    accept: ["drapes"],
    topic: "home",
    pos: n,
    examples: [
      {
        cyrillic: "Навуци завесу пре спавања.",
        english: "Draw the curtain before bed.",
      },
    ],
  }),
  word({
    cyrillic: "чаша",
    gender: "f",
    english: "glass",
    topic: "home",
    pos: n,
    examples: [
      {
        cyrillic: "Сипај воду у чашу.",
        english: "Pour water into the glass.",
      },
    ],
  }),
  word({
    cyrillic: "тањир",
    gender: "m",
    english: "plate",
    topic: "home",
    pos: n,
    examples: [
      {
        cyrillic: "Стави храну на тањир.",
        english: "Put the food on the plate.",
      },
    ],
  }),
  word({
    cyrillic: "кашика",
    gender: "f",
    english: "spoon",
    topic: "home",
    pos: n,
    examples: [
      {
        cyrillic: "Супа се једе кашиком.",
        english: "Soup is eaten with a spoon.",
      },
    ],
  }),
  word({
    cyrillic: "виљушка",
    gender: "f",
    english: "fork",
    topic: "home",
    pos: n,
    examples: [
      {
        cyrillic: "Узми виљушку и нож.",
        english: "Take a fork and a knife.",
      },
    ],
  }),
  word({
    cyrillic: "нож",
    gender: "m",
    english: "knife",
    topic: "home",
    pos: n,
    examples: [
      {
        cyrillic: "Овај нож је врло оштар.",
        english: "This knife is very sharp.",
      },
    ],
  }),
  word({
    cyrillic: "шерпа",
    gender: "f",
    english: "pot",
    accept: ["saucepan"],
    topic: "home",
    pos: n,
    examples: [
      {
        cyrillic: "Вода у шерпи кључа.",
        english: "The water in the pot is boiling.",
      },
    ],
  }),
  word({
    cyrillic: "фрижидер",
    gender: "m",
    english: "fridge",
    accept: ["refrigerator"],
    topic: "home",
    pos: n,
    mnemonic: "фрижидер ↔ English 'fridge' / 'refrigerator'.",
    examples: [
      {
        cyrillic: "Млеко стоји у фрижидеру.",
        english: "The milk is in the fridge.",
      },
    ],
  }),
  word({
    cyrillic: "шпорет",
    gender: "m",
    english: "stove",
    accept: ["cooker"],
    topic: "home",
    pos: n,
    mnemonic: "шпорет ↔ German 'Sparherd' — an economical cooking stove.",
    examples: [
      {
        cyrillic: "Скувај чај на шпорету.",
        english: "Make tea on the stove.",
      },
    ],
  }),
  word({
    cyrillic: "пешкир",
    gender: "m",
    english: "towel",
    topic: "home",
    pos: n,
    examples: [
      {
        cyrillic: "Обриши руке пешкиром.",
        english: "Dry your hands with the towel.",
      },
    ],
  }),
  word({
    cyrillic: "сапун",
    gender: "m",
    english: "soap",
    topic: "home",
    pos: n,
    mnemonic: "сапун ↔ Latin 'sapo' / English 'soap'.",
    examples: [
      {
        cyrillic: "Опери руке сапуном и водом.",
        english: "Wash your hands with soap and water.",
      },
    ],
  }),
];
