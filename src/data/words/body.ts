import { word } from "~/lib/content/word";

const n = "noun" as const;

export const body = [
  word({
    cyrillic: "глава",
    gender: "f",
    english: "head",
    topic: "body",
    pos: n,
    examples: [
      {
        cyrillic: "Боли ме глава.",
        english: "I have a headache.",
      },
    ],
  }),
  word({
    cyrillic: "коса",
    gender: "f",
    english: "hair",
    topic: "body",
    pos: n,
    examples: [
      {
        cyrillic: "Њена коса је дуга и црна.",
        english: "Her hair is long and black.",
      },
    ],
  }),
  word({
    cyrillic: "лице",
    gender: "n",
    english: "face",
    topic: "body",
    pos: n,
    mnemonic: "Looks like English 'lice', but лице means 'face'.",
    examples: [
      {
        cyrillic: "Опери лице пре спавања.",
        english: "Wash your face before bed.",
      },
    ],
  }),
  word({
    cyrillic: "око",
    gender: "n",
    english: "eye",
    topic: "body",
    pos: n,
    mnemonic: "око ↔ Latin 'oculus' (ocular, monocle).",
    examples: [
      {
        cyrillic: "Нешто ми је упало у око.",
        english: "Something got in my eye.",
      },
    ],
  }),
  word({
    cyrillic: "обрва",
    gender: "f",
    english: "eyebrow",
    topic: "body",
    pos: n,
    mnemonic: "обрва ↔ English 'brow'.",
    examples: [
      {
        cyrillic: "Подигла је једну обрву.",
        english: "She raised one eyebrow.",
      },
    ],
  }),
  word({
    cyrillic: "нос",
    gender: "m",
    english: "nose",
    topic: "body",
    pos: n,
    mnemonic: "нос ↔ 'nose' / Latin 'nasus' (nasal).",
    examples: [
      {
        cyrillic: "Цури ми нос од прехладе.",
        english: "My nose is running from a cold.",
      },
    ],
  }),
  word({
    cyrillic: "уво",
    gender: "n",
    english: "ear",
    topic: "body",
    pos: n,
    mnemonic: "уво ↔ Latin 'auris' (aural, auditory).",
    examples: [
      {
        cyrillic: "Шапнуо ми је нешто на уво.",
        english: "He whispered something in my ear.",
      },
    ],
  }),
  word({
    cyrillic: "уста",
    gender: "n",
    english: "mouth",
    topic: "body",
    pos: n,
    mnemonic: "Always plural — уста ('mouth') takes a plural verb.",
    examples: [
      {
        cyrillic: "Отвори уста, рекао је зубар.",
        english: "Open your mouth, said the dentist.",
      },
    ],
  }),
  word({
    cyrillic: "зуб",
    gender: "m",
    english: "tooth",
    topic: "body",
    pos: n,
    examples: [
      {
        cyrillic: "Перем зубе сваког јутра.",
        english: "I brush my teeth every morning.",
      },
    ],
  }),
  word({
    cyrillic: "језик",
    gender: "m",
    english: "tongue / language",
    topic: "body",
    pos: n,
    mnemonic: "Means both 'tongue' and 'language' (like French 'langue').",
    examples: [
      {
        cyrillic: "Српски језик има седам падежа.",
        english: "The Serbian language has seven cases.",
      },
    ],
  }),
  word({
    cyrillic: "образ",
    gender: "m",
    english: "cheek",
    topic: "body",
    pos: n,
    examples: [
      {
        cyrillic: "Пољубила га је у образ.",
        english: "She kissed him on the cheek.",
      },
    ],
  }),
  word({
    cyrillic: "брада",
    gender: "f",
    english: "chin / beard",
    topic: "body",
    pos: n,
    mnemonic: "брада ↔ 'beard' / Latin 'barba' (barber).",
    examples: [
      {
        cyrillic: "Пустио је дугу браду.",
        english: "He grew a long beard.",
      },
    ],
  }),
  word({
    cyrillic: "грло",
    gender: "n",
    english: "throat",
    topic: "body",
    pos: n,
    examples: [
      {
        cyrillic: "Попиј чај за упаљено грло.",
        english: "Drink tea for a sore throat.",
      },
    ],
  }),
  word({
    cyrillic: "врат",
    gender: "m",
    english: "neck",
    topic: "body",
    pos: n,
    examples: [
      {
        cyrillic: "Окренуо је врат улево.",
        english: "He turned his neck to the left.",
      },
    ],
  }),
  word({
    cyrillic: "раме",
    gender: "n",
    english: "shoulder",
    topic: "body",
    pos: n,
    examples: [
      {
        cyrillic: "Тапшао ме је по рамену.",
        english: "He patted me on the shoulder.",
      },
    ],
  }),
  word({
    cyrillic: "леђа",
    gender: "n",
    english: "back",
    topic: "body",
    pos: n,
    mnemonic: "Always plural — боле ме леђа = 'my back hurts'.",
    examples: [
      {
        cyrillic: "Боле ме леђа од седења.",
        english: "My back hurts from sitting.",
      },
    ],
  }),
  word({
    cyrillic: "груди",
    gender: "f",
    english: "chest",
    topic: "body",
    pos: n,
    examples: [
      {
        cyrillic: "Груди му се шире док удише.",
        english: "His chest expands as he breathes in.",
      },
    ],
  }),
  word({
    cyrillic: "стомак",
    gender: "m",
    english: "stomach / belly",
    accept: ["tummy"],
    topic: "body",
    pos: n,
    mnemonic: "стомак ↔ English 'stomach' (Greek 'stomachos').",
    examples: [
      {
        cyrillic: "Беба има пун стомак.",
        english: "The baby has a full belly.",
      },
    ],
  }),
  word({
    cyrillic: "рука",
    gender: "f",
    english: "hand / arm",
    topic: "body",
    pos: n,
    examples: [
      {
        cyrillic: "Подигни десну руку.",
        english: "Raise your right hand.",
      },
    ],
  }),
  word({
    cyrillic: "лакат",
    gender: "m",
    english: "elbow",
    topic: "body",
    pos: n,
    examples: [
      {
        cyrillic: "Ударио сам лакат о сто.",
        english: "I hit my elbow on the table.",
      },
    ],
  }),
  word({
    cyrillic: "прст",
    gender: "m",
    english: "finger",
    topic: "body",
    pos: n,
    mnemonic: "No vowel — the р carries the syllable (say it 'pr-st').",
    examples: [
      {
        cyrillic: "Посекао сам прст ножем.",
        english: "I cut my finger with a knife.",
      },
    ],
  }),
  word({
    cyrillic: "нокат",
    gender: "m",
    english: "nail",
    topic: "body",
    pos: n,
    examples: [
      {
        cyrillic: "Сломила је нокат.",
        english: "She broke a nail.",
      },
    ],
  }),
  word({
    cyrillic: "нога",
    gender: "f",
    english: "leg / foot",
    topic: "body",
    pos: n,
    examples: [
      {
        cyrillic: "Прекрстио је ноге.",
        english: "He crossed his legs.",
      },
    ],
  }),
  word({
    cyrillic: "колено",
    gender: "n",
    english: "knee",
    topic: "body",
    pos: n,
    examples: [
      {
        cyrillic: "Пао је и повредио колено.",
        english: "He fell and injured his knee.",
      },
    ],
  }),
  word({
    cyrillic: "стопало",
    gender: "n",
    english: "foot",
    topic: "body",
    pos: n,
    mnemonic: "From стопа ('footstep') — like English 'step'.",
    examples: [
      {
        cyrillic: "Стопало ми је утрнуло.",
        english: "My foot went numb.",
      },
    ],
  }),
  word({
    cyrillic: "срце",
    gender: "n",
    english: "heart",
    topic: "body",
    pos: n,
    mnemonic: "срце ↔ Latin 'cor / cordis' (cardiac, core).",
    examples: [
      {
        cyrillic: "Срце брзо куца од трчања.",
        english: "The heart beats fast from running.",
      },
    ],
  }),
  word({
    cyrillic: "мозак",
    gender: "m",
    english: "brain",
    topic: "body",
    pos: n,
    examples: [
      {
        cyrillic: "Мозак троши пуно енергије.",
        english: "The brain uses a lot of energy.",
      },
    ],
  }),
  word({
    cyrillic: "кожа",
    gender: "f",
    english: "skin",
    topic: "body",
    pos: n,
    slug: "kozha",
    mnemonic: "Just one letter from коза ('goat') — mind the ж vs з.",
    examples: [
      {
        cyrillic: "Има врло осетљиву кожу.",
        english: "She has very sensitive skin.",
      },
    ],
  }),
  word({
    cyrillic: "крв",
    gender: "f",
    english: "blood",
    topic: "body",
    pos: n,
    examples: [
      {
        cyrillic: "Изгубио је много крви.",
        english: "He lost a lot of blood.",
      },
    ],
  }),
  word({
    cyrillic: "кост",
    gender: "f",
    english: "bone",
    topic: "body",
    pos: n,
    examples: [
      {
        cyrillic: "Пас глође кост.",
        english: "The dog is gnawing a bone.",
      },
    ],
  }),
];
