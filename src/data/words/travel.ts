import { word } from "~/lib/content/word";

const n = "noun" as const;

export const travel = [
  word({
    cyrillic: "пут",
    gender: "m",
    english: "road / way / trip",
    topic: "travel",
    pos: n,
    mnemonic:
      "One word for 'road', 'way', and 'trip' — also a 'time' (први пут).",
    examples: [
      {
        cyrillic: "Пут до мора траје пет сати.",
        english: "The trip to the sea takes five hours.",
      },
    ],
  }),
  word({
    cyrillic: "путовање",
    gender: "n",
    english: "journey / travel",
    topic: "travel",
    pos: n,
    examples: [
      {
        cyrillic: "Путовање возом је опуштајуће.",
        english: "Train travel is relaxing.",
      },
    ],
  }),
  word({
    cyrillic: "одмор",
    gender: "m",
    english: "vacation / rest",
    accept: ["holiday"],
    topic: "travel",
    pos: n,
    mnemonic:
      "From the root of умор ('tiredness') — time off from being tired.",
    examples: [
      {
        cyrillic: "Идемо на одмор у Грчку.",
        english: "We're going on vacation to Greece.",
      },
    ],
  }),
  word({
    cyrillic: "ауто",
    gender: "m",
    english: "car",
    accept: ["automobile"],
    topic: "travel",
    pos: n,
    examples: [
      {
        cyrillic: "Паркирао сам ауто испред зграде.",
        english: "I parked the car in front of the building.",
      },
    ],
  }),
  word({
    cyrillic: "аутобус",
    gender: "m",
    english: "bus",
    topic: "travel",
    pos: n,
    examples: [
      {
        cyrillic: "Аутобус касни десет минута.",
        english: "The bus is ten minutes late.",
      },
    ],
  }),
  word({
    cyrillic: "воз",
    gender: "m",
    english: "train",
    topic: "travel",
    pos: n,
    examples: [
      {
        cyrillic: "Воз за Будимпешту креће у подне.",
        english: "The train to Budapest leaves at noon.",
      },
    ],
  }),
  word({
    cyrillic: "трамвај",
    gender: "m",
    english: "tram",
    topic: "travel",
    pos: n,
    examples: [
      {
        cyrillic: "Трамвај пролази кроз центар.",
        english: "The tram passes through the center.",
      },
    ],
  }),
  word({
    cyrillic: "авион",
    gender: "m",
    english: "airplane",
    accept: ["plane"],
    topic: "travel",
    pos: n,
    mnemonic: "авион ↔ French 'avion' (Latin 'avis', a bird).",
    examples: [
      {
        cyrillic: "Авион слеће за пола сата.",
        english: "The plane lands in half an hour.",
      },
    ],
  }),
  word({
    cyrillic: "брод",
    gender: "m",
    english: "ship / boat",
    topic: "travel",
    pos: n,
    examples: [
      {
        cyrillic: "Брод плови низ Дунав.",
        english: "The ship sails down the Danube.",
      },
    ],
  }),
  word({
    cyrillic: "бицикл",
    gender: "m",
    english: "bicycle",
    accept: ["bike"],
    topic: "travel",
    pos: n,
    examples: [
      {
        cyrillic: "Возим бицикл сваког викенда.",
        english: "I ride a bicycle every weekend.",
      },
    ],
  }),
  word({
    cyrillic: "мотор",
    gender: "m",
    english: "motorcycle / engine",
    topic: "travel",
    pos: n,
    mnemonic: "Means both 'motorcycle' and 'engine'.",
    examples: [
      {
        cyrillic: "Купио је нови мотор.",
        english: "He bought a new motorcycle.",
      },
    ],
  }),
  word({
    cyrillic: "такси",
    gender: "m",
    english: "taxi",
    topic: "travel",
    pos: n,
    examples: [
      {
        cyrillic: "Позвао сам такси до аеродрома.",
        english: "I called a taxi to the airport.",
      },
    ],
  }),
  word({
    cyrillic: "карта",
    gender: "f",
    english: "ticket / map / card",
    topic: "travel",
    pos: n,
    mnemonic: "карта ↔ Latin 'charta' — source of English 'card' and 'chart'.",
    examples: [
      {
        cyrillic: "Купио сам карту за воз.",
        english: "I bought a ticket for the train.",
      },
    ],
  }),
  word({
    cyrillic: "пасош",
    gender: "m",
    english: "passport",
    topic: "travel",
    pos: n,
    examples: [
      {
        cyrillic: "Заборавио сам пасош код куће.",
        english: "I forgot my passport at home.",
      },
    ],
  }),
  word({
    cyrillic: "кофер",
    gender: "m",
    english: "suitcase",
    topic: "travel",
    pos: n,
    mnemonic: "кофер ↔ German 'Koffer' / English 'coffer'.",
    examples: [
      {
        cyrillic: "Спаковао сам кофер за пут.",
        english: "I packed the suitcase for the trip.",
      },
    ],
  }),
  word({
    cyrillic: "торба",
    gender: "f",
    english: "bag",
    topic: "travel",
    pos: n,
    examples: [
      {
        cyrillic: "Носи тешку торбу преко рамена.",
        english: "She carries a heavy bag over her shoulder.",
      },
    ],
  }),
  word({
    cyrillic: "мапа",
    gender: "f",
    english: "map",
    topic: "travel",
    pos: n,
    examples: [
      {
        cyrillic: "Погледали смо мапу да нађемо пут.",
        english: "We looked at the map to find the way.",
      },
    ],
  }),
  word({
    cyrillic: "бензин",
    gender: "m",
    english: "gasoline / petrol",
    accept: ["gas"],
    topic: "travel",
    pos: n,
    examples: [
      {
        cyrillic: "Цена бензина је поново порасла.",
        english: "The price of gas has risen again.",
      },
    ],
  }),
  word({
    cyrillic: "точак",
    gender: "m",
    english: "wheel",
    topic: "travel",
    pos: n,
    examples: [
      {
        cyrillic: "Бицикл има два точка.",
        english: "A bicycle has two wheels.",
      },
    ],
  }),
  word({
    cyrillic: "возач",
    gender: "m",
    english: "driver",
    topic: "travel",
    pos: n,
    mnemonic: "возити ('to drive') + -ач ('doer') — 'one who drives'.",
    examples: [
      {
        cyrillic: "Возач аутобуса је био љубазан.",
        english: "The bus driver was kind.",
      },
    ],
  }),
  word({
    cyrillic: "путник",
    gender: "m",
    english: "passenger / traveler",
    topic: "travel",
    pos: n,
    mnemonic: "пут ('road') + -ник — 'one on the road'.",
    examples: [
      {
        cyrillic: "Сваки путник мора имати карту.",
        english: "Every passenger must have a ticket.",
      },
    ],
  }),
  word({
    cyrillic: "кашњење",
    gender: "n",
    english: "delay",
    topic: "travel",
    pos: n,
    mnemonic: "From касно ('late') — a lateness.",
    examples: [
      {
        cyrillic: "Лет има кашњење од два сата.",
        english: "The flight has a two-hour delay.",
      },
    ],
  }),
  word({
    cyrillic: "гужва",
    gender: "f",
    english: "crowd / traffic jam",
    accept: ["traffic"],
    topic: "travel",
    pos: n,
    examples: [
      {
        cyrillic: "У саобраћају је велика гужва.",
        english: "There's a big traffic jam.",
      },
    ],
  }),
  word({
    cyrillic: "улаз",
    gender: "m",
    english: "entrance",
    topic: "travel",
    pos: n,
    mnemonic:
      "у- ('in') + лаз ('going') — a way in; pairs with излаз ('exit').",
    examples: [
      {
        cyrillic: "Улаз у зграду је са стране.",
        english: "The entrance to the building is on the side.",
      },
    ],
  }),
  word({
    cyrillic: "излаз",
    gender: "m",
    english: "exit",
    topic: "travel",
    pos: n,
    examples: [
      {
        cyrillic: "Где је излаз из гараже?",
        english: "Where is the exit from the garage?",
      },
    ],
  }),
];
