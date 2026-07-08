import { word } from "~/lib/content/word";

const n = "noun" as const;

export const work = [
  word({
    cyrillic: "посао",
    gender: "m",
    english: "job / work",
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Нашао је нови посао.",
        english: "He found a new job.",
      },
    ],
  }),
  word({
    cyrillic: "занимање",
    gender: "n",
    english: "occupation",
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Које је твоје занимање?",
        english: "What is your occupation?",
      },
    ],
  }),
  word({
    cyrillic: "фирма",
    gender: "f",
    english: "company / firm",
    accept: ["business"],
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Ради у великој фирми.",
        english: "He works at a big company.",
      },
    ],
  }),
  word({
    cyrillic: "канцеларија",
    gender: "f",
    english: "office",
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Његова канцеларија је на трећем спрату.",
        english: "His office is on the third floor.",
      },
    ],
  }),
  word({
    cyrillic: "шеф",
    gender: "m",
    english: "boss",
    topic: "work",
    pos: n,
    mnemonic: "шеф ↔ French 'chef' / English 'chief' — the one in charge.",
    examples: [
      {
        cyrillic: "Шеф је одобрио мој одмор.",
        english: "The boss approved my vacation.",
      },
    ],
  }),
  word({
    cyrillic: "радник",
    gender: "m",
    english: "worker",
    topic: "work",
    pos: n,
    mnemonic: "From радити ('to work') — the -ник marks the doer (cf. путник).",
    examples: [
      {
        cyrillic: "Сваки радник заслужује одмор.",
        english: "Every worker deserves a rest.",
      },
    ],
  }),
  word({
    cyrillic: "пензија",
    gender: "f",
    english: "pension / retirement",
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Деда је отишао у пензију.",
        english: "Grandpa went into retirement.",
      },
    ],
  }),
  word({
    cyrillic: "лекар",
    gender: "m",
    english: "doctor",
    accept: ["physician"],
    topic: "work",
    pos: n,
    mnemonic: "From лек ('medicine') — the -ар marks the specialist.",
    examples: [
      {
        cyrillic: "Лекар ми је преписао лек.",
        english: "The doctor prescribed me medicine.",
      },
    ],
  }),
  word({
    cyrillic: "учитељ",
    gender: "m",
    english: "teacher",
    topic: "work",
    pos: n,
    mnemonic: "From учити ('to teach') — the teacher; the learner is ученик.",
    examples: [
      {
        cyrillic: "Наш учитељ је врло стрпљив.",
        english: "Our teacher is very patient.",
      },
    ],
  }),
  word({
    cyrillic: "професор",
    gender: "m",
    english: "professor",
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Професор предаје историју.",
        english: "The professor teaches history.",
      },
    ],
  }),
  word({
    cyrillic: "ученик",
    gender: "m",
    english: "pupil",
    accept: ["student"],
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Ученик је положио испит.",
        english: "The pupil passed the exam.",
      },
    ],
  }),
  word({
    cyrillic: "студент",
    gender: "m",
    english: "student",
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Студент учи за испит.",
        english: "The student is studying for the exam.",
      },
    ],
  }),
  word({
    cyrillic: "инжењер",
    gender: "m",
    english: "engineer",
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Инжењер је пројектовао мост.",
        english: "The engineer designed the bridge.",
      },
    ],
  }),
  word({
    cyrillic: "адвокат",
    gender: "m",
    english: "lawyer",
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Адвокат брани свог клијента.",
        english: "The lawyer defends his client.",
      },
    ],
  }),
  word({
    cyrillic: "судија",
    gender: "m",
    english: "judge",
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Судија је донео пресуду.",
        english: "The judge delivered the verdict.",
      },
    ],
  }),
  word({
    cyrillic: "полицајац",
    gender: "m",
    english: "police officer",
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Полицајац је зауставио ауто.",
        english: "The police officer stopped the car.",
      },
    ],
  }),
  word({
    cyrillic: "ватрогасац",
    gender: "m",
    english: "firefighter",
    topic: "work",
    pos: n,
    mnemonic: "ватра ('fire') + гасити ('to extinguish') — a 'fire-queller'.",
    examples: [
      {
        cyrillic: "Ватрогасац је угасио пожар.",
        english: "The firefighter put out the fire.",
      },
    ],
  }),
  word({
    cyrillic: "војник",
    gender: "m",
    english: "soldier",
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Војник чува границу.",
        english: "The soldier guards the border.",
      },
    ],
  }),
  word({
    cyrillic: "кувар",
    gender: "m",
    english: "cook / chef",
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Кувар припрема специјалитет.",
        english: "The cook is preparing a specialty.",
      },
    ],
  }),
  word({
    cyrillic: "конобар",
    gender: "m",
    english: "waiter",
    accept: ["server"],
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Конобар је донео мени.",
        english: "The waiter brought the menu.",
      },
    ],
  }),
  word({
    cyrillic: "продавац",
    gender: "m",
    english: "salesperson",
    accept: ["salesman", "seller"],
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Продавац ми је показао ципеле.",
        english: "The salesperson showed me shoes.",
      },
    ],
  }),
  word({
    cyrillic: "пекар",
    gender: "m",
    english: "baker",
    topic: "work",
    pos: n,
    mnemonic: "From пећи ('to bake') — the one who bakes.",
    examples: [
      {
        cyrillic: "Пекар меси хлеб у зору.",
        english: "The baker kneads bread at dawn.",
      },
    ],
  }),
  word({
    cyrillic: "месар",
    gender: "m",
    english: "butcher",
    topic: "work",
    pos: n,
    mnemonic: "From месо ('meat') — the meat specialist.",
    examples: [
      {
        cyrillic: "Месар сече месо.",
        english: "The butcher cuts meat.",
      },
    ],
  }),
  word({
    cyrillic: "фризер",
    gender: "m",
    english: "hairdresser",
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Фризер ми је ошишао косу.",
        english: "The hairdresser cut my hair.",
      },
    ],
  }),
  word({
    cyrillic: "пилот",
    gender: "m",
    english: "pilot",
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Пилот је слетео безбедно.",
        english: "The pilot landed safely.",
      },
    ],
  }),
  word({
    cyrillic: "новинар",
    gender: "m",
    english: "journalist",
    topic: "work",
    pos: n,
    mnemonic:
      "From новине ('newspaper'), itself from нов ('new') — a reporter of the new.",
    examples: [
      {
        cyrillic: "Новинар је написао чланак.",
        english: "The journalist wrote an article.",
      },
    ],
  }),
  word({
    cyrillic: "глумац",
    gender: "m",
    english: "actor",
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Глумац игра главну улогу.",
        english: "The actor plays the lead role.",
      },
    ],
  }),
  word({
    cyrillic: "писац",
    gender: "m",
    english: "writer",
    topic: "work",
    pos: n,
    mnemonic: "From писати ('to write') — a writer.",
    examples: [
      {
        cyrillic: "Писац потписује своју књигу.",
        english: "The writer signs his book.",
      },
    ],
  }),
  word({
    cyrillic: "уметник",
    gender: "m",
    english: "artist",
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Уметник слика портрет.",
        english: "The artist paints a portrait.",
      },
    ],
  }),
  word({
    cyrillic: "директор",
    gender: "m",
    english: "director / manager",
    topic: "work",
    pos: n,
    examples: [
      {
        cyrillic: "Директор води састанак.",
        english: "The director leads the meeting.",
      },
    ],
  }),
];
