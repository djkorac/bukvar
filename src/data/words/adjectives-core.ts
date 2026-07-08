import { word } from "~/lib/content/word";

const a = "adjective" as const;

export const adjectivesCore = [
  // Size & shape
  word({
    cyrillic: "велики",
    english: "big / large",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Београд је велики град.",
        english: "Belgrade is a big city.",
      },
    ],
  }),
  word({
    cyrillic: "мали",
    english: "small / little",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Имам мали стан.",
        english: "I have a small apartment.",
      },
    ],
  }),
  word({
    cyrillic: "висок",
    english: "tall / high",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Мој брат је висок.",
        english: "My brother is tall.",
      },
    ],
  }),
  word({
    cyrillic: "низак",
    english: "low / short",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Овај сто је низак.",
        english: "This table is low.",
      },
    ],
  }),
  word({
    cyrillic: "дугачак",
    english: "long",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Пут је био дугачак.",
        english: "The road was long.",
      },
    ],
  }),
  word({
    cyrillic: "кратак",
    english: "short",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Филм је био кратак.",
        english: "The movie was short.",
      },
    ],
  }),
  word({
    cyrillic: "широк",
    english: "wide",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Овај пут је широк.",
        english: "This road is wide.",
      },
    ],
  }),
  word({
    cyrillic: "узак",
    english: "narrow",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Ходник је узак.",
        english: "The hallway is narrow.",
      },
    ],
  }),
  word({
    cyrillic: "дубок",
    english: "deep",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Базен је дубок.",
        english: "The pool is deep.",
      },
    ],
  }),
  word({
    cyrillic: "дебео",
    english: "fat / thick",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Његов мачак је дебео и лењ.",
        english: "His cat is fat and lazy.",
      },
    ],
  }),
  word({
    cyrillic: "мршав",
    english: "thin / skinny",
    accept: ["slim", "slender"],
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Пас је био мршав и гладан.",
        english: "The dog was thin and hungry.",
      },
    ],
  }),
  word({
    cyrillic: "округао",
    english: "round",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Сто у кухињи је округао.",
        english: "The kitchen table is round.",
      },
    ],
  }),
  word({
    cyrillic: "раван",
    english: "flat / even",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Терен је потпуно раван.",
        english: "The terrain is completely flat.",
      },
    ],
  }),
  word({
    cyrillic: "прав",
    english: "straight",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Лењир је савршено прав.",
        english: "The ruler is perfectly straight.",
      },
    ],
  }),
  word({
    cyrillic: "крив",
    english: "crooked / guilty",
    topic: "adjectives-core",
    pos: a,
    mnemonic: "Means both 'crooked' and 'guilty / at fault'.",
    examples: [
      {
        cyrillic: "Он је крив за несрећу.",
        english: "He is at fault for the accident.",
      },
    ],
  }),

  // Quality & condition
  word({
    cyrillic: "добар",
    english: "good",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Овај ресторан је добар.",
        english: "This restaurant is good.",
      },
    ],
  }),
  word({
    cyrillic: "лош",
    english: "bad",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Сигнал је данас лош.",
        english: "The signal is bad today.",
      },
    ],
  }),
  word({
    cyrillic: "леп",
    english: "nice / beautiful",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Данас је леп дан.",
        english: "Today is a nice day.",
      },
    ],
  }),
  word({
    cyrillic: "ружан",
    english: "ugly",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Тај капут је ружан.",
        english: "That coat is ugly.",
      },
    ],
  }),
  word({
    cyrillic: "нов",
    english: "new",
    topic: "adjectives-core",
    pos: a,
    mnemonic: "нов ↔ 'new' / Latin 'novus' (novel, novelty).",
    examples: [
      {
        cyrillic: "Мој телефон је нов.",
        english: "My phone is new.",
      },
    ],
  }),
  word({
    cyrillic: "стар",
    english: "old",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Мој деда је стар.",
        english: "My grandfather is old.",
      },
    ],
  }),
  word({
    cyrillic: "млад",
    english: "young",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Он је још млад.",
        english: "He is still young.",
      },
    ],
  }),
  word({
    cyrillic: "чист",
    english: "clean",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Под је чист.",
        english: "The floor is clean.",
      },
    ],
  }),
  word({
    cyrillic: "прљав",
    english: "dirty",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Ауто је прљав.",
        english: "The car is dirty.",
      },
    ],
  }),
  word({
    cyrillic: "пун",
    english: "full",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Аутобус је пун.",
        english: "The bus is full.",
      },
    ],
  }),
  word({
    cyrillic: "празан",
    english: "empty",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Фрижидер је празан.",
        english: "The fridge is empty.",
      },
    ],
  }),
  word({
    cyrillic: "мокар",
    english: "wet",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Кишобран је мокар.",
        english: "The umbrella is wet.",
      },
    ],
  }),
  word({
    cyrillic: "сув",
    english: "dry",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Пешкир је сув.",
        english: "The towel is dry.",
      },
    ],
  }),
  word({
    cyrillic: "оштар",
    english: "sharp",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Зуб ајкуле је оштар.",
        english: "A shark's tooth is sharp.",
      },
    ],
  }),
  word({
    cyrillic: "мек",
    english: "soft",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Овај кревет је мек.",
        english: "This bed is soft.",
      },
    ],
  }),
  word({
    cyrillic: "тврд",
    english: "hard",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Хлеб је постао тврд.",
        english: "The bread became hard.",
      },
    ],
  }),
  word({
    cyrillic: "топао",
    english: "warm",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Чај је још топао.",
        english: "The tea is still warm.",
      },
    ],
  }),
  word({
    cyrillic: "хладан",
    english: "cold",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Ветар је хладан.",
        english: "The wind is cold.",
      },
    ],
  }),
  word({
    cyrillic: "светао",
    english: "bright / light",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Стан је светао и простран.",
        english: "The apartment is bright and spacious.",
      },
    ],
  }),
  word({
    cyrillic: "таман",
    english: "dark",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Ходник је таман.",
        english: "The hallway is dark.",
      },
    ],
  }),

  // Speed, strength, difficulty
  word({
    cyrillic: "брз",
    english: "fast",
    accept: ["quick"],
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Овај воз је брз.",
        english: "This train is fast.",
      },
    ],
  }),
  word({
    cyrillic: "спор",
    english: "slow",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Интернет је данас спор.",
        english: "The internet is slow today.",
      },
    ],
  }),
  word({
    cyrillic: "јак",
    english: "strong",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Овај чај је јак.",
        english: "This tea is strong.",
      },
    ],
  }),
  word({
    cyrillic: "слаб",
    english: "weak",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Његов аргумент је слаб.",
        english: "His argument is weak.",
      },
    ],
  }),
  word({
    cyrillic: "тежак",
    english: "heavy / difficult",
    accept: ["hard", "tough"],
    topic: "adjectives-core",
    pos: a,
    mnemonic: "Means both 'heavy' and 'difficult'.",
    examples: [
      {
        cyrillic: "Овај кофер је тежак.",
        english: "This suitcase is heavy.",
      },
    ],
  }),
  word({
    cyrillic: "лак",
    english: "easy / light",
    topic: "adjectives-core",
    pos: a,
    mnemonic: "Means both 'easy' and 'light' — the opposite of тежак.",
    examples: [
      {
        cyrillic: "Испит је био лак.",
        english: "The exam was easy.",
      },
    ],
  }),

  // Sound
  word({
    cyrillic: "гласан",
    english: "loud",
    accept: ["noisy"],
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Овај мотор је гласан.",
        english: "This motorcycle is loud.",
      },
    ],
  }),
  word({
    cyrillic: "тих",
    english: "quiet",
    accept: ["silent"],
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Комшилук је тих ноћу.",
        english: "The neighborhood is quiet at night.",
      },
    ],
  }),

  // States of a person
  word({
    cyrillic: "срећан",
    english: "happy",
    accept: ["glad"],
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Срећан сам што те видим.",
        english: "I'm happy to see you.",
      },
    ],
  }),
  word({
    cyrillic: "тужан",
    english: "sad",
    accept: ["unhappy"],
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Зашто си тужан?",
        english: "Why are you sad?",
      },
    ],
  }),
  word({
    cyrillic: "уморан",
    english: "tired",
    accept: ["exhausted"],
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Уморан сам после посла.",
        english: "I'm tired after work.",
      },
    ],
  }),
  word({
    cyrillic: "гладан",
    english: "hungry",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Гладан сам, идемо да једемо.",
        english: "I'm hungry, let's go eat.",
      },
    ],
  }),
  word({
    cyrillic: "жедан",
    english: "thirsty",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Жедан сам, дај ми воде.",
        english: "I'm thirsty, give me some water.",
      },
    ],
  }),
  word({
    cyrillic: "болестан",
    english: "sick / ill",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Остао је код куће јер је болестан.",
        english: "He stayed home because he's sick.",
      },
    ],
  }),
  word({
    cyrillic: "здрав",
    english: "healthy",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Мој деда је још увек здрав.",
        english: "My grandfather is still healthy.",
      },
    ],
  }),
  word({
    cyrillic: "жив",
    english: "alive",
    topic: "adjectives-core",
    pos: a,
    mnemonic: "жив ↔ Latin 'vivus' (vivid, vivacious).",
    examples: [
      {
        cyrillic: "Пацијент је жив.",
        english: "The patient is alive.",
      },
    ],
  }),
  word({
    cyrillic: "мртав",
    english: "dead",
    topic: "adjectives-core",
    pos: a,
    mnemonic: "мртав ↔ Latin 'mortuus' (mortal, mortuary).",
    examples: [
      {
        cyrillic: "Стари храст је мртав.",
        english: "The old oak is dead.",
      },
    ],
  }),
  word({
    cyrillic: "слободан",
    english: "free",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Да ли си слободан вечерас?",
        english: "Are you free tonight?",
      },
    ],
  }),
  word({
    cyrillic: "заузет",
    english: "busy / occupied",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Тренутно сам заузет.",
        english: "I'm busy at the moment.",
      },
    ],
  }),
  word({
    cyrillic: "спреман",
    english: "ready",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Ручак је спреман.",
        english: "Lunch is ready.",
      },
    ],
  }),

  // Character
  word({
    cyrillic: "паметан",
    english: "smart",
    accept: ["clever", "intelligent"],
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Он је веома паметан.",
        english: "He is very smart.",
      },
    ],
  }),
  word({
    cyrillic: "глуп",
    english: "stupid",
    accept: ["dumb"],
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "То је био глуп потез.",
        english: "That was a stupid move.",
      },
    ],
  }),
  word({
    cyrillic: "мудар",
    english: "wise",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Деда је мудар човек.",
        english: "Grandpa is a wise man.",
      },
    ],
  }),
  word({
    cyrillic: "луд",
    english: "crazy",
    accept: ["mad"],
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Тај план је луд.",
        english: "That plan is crazy.",
      },
    ],
  }),
  word({
    cyrillic: "храбар",
    english: "brave",
    accept: ["courageous"],
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Војник је био храбар.",
        english: "The soldier was brave.",
      },
    ],
  }),
  word({
    cyrillic: "љубазан",
    english: "kind / polite",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Продавац је био љубазан.",
        english: "The salesman was kind.",
      },
    ],
  }),
  word({
    cyrillic: "груб",
    english: "rude / rough",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Његов тон је био груб.",
        english: "His tone was rude.",
      },
    ],
  }),
  word({
    cyrillic: "нежан",
    english: "gentle / tender",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Његов додир је нежан.",
        english: "His touch is gentle.",
      },
    ],
  }),
  word({
    cyrillic: "строг",
    english: "strict",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Наш учитељ је строг.",
        english: "Our teacher is strict.",
      },
    ],
  }),
  word({
    cyrillic: "вредан",
    english: "hardworking / valuable",
    topic: "adjectives-core",
    pos: a,
    mnemonic: "Means both 'hardworking' and 'valuable'.",
    examples: [
      {
        cyrillic: "Он је вредан радник.",
        english: "He is a hardworking worker.",
      },
    ],
  }),
  word({
    cyrillic: "лењ",
    english: "lazy",
    topic: "adjectives-core",
    pos: a,
    examples: [
      {
        cyrillic: "Мој брат је лењ ујутру.",
        english: "My brother is lazy in the morning.",
      },
    ],
  }),
];
