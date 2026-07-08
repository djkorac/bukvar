import { word } from "~/lib/content/word";

const v = "verb" as const;
const impf = "impf" as const;
const pf = "pf" as const;
const both = "both" as const;

export const verbsCore = [
  // Being, becoming, existence
  word({
    cyrillic: "бити",
    aspect: impf,
    english: "to be",
    topic: "verbs-core",
    pos: v,
    mnemonic: "бити ↔ English 'be' (the same ancient root).",
    examples: [
      {
        cyrillic: "Желим да будем срећан.",
        english: "I want to be happy.",
      },
    ],
  }),
  word({
    cyrillic: "имати",
    aspect: impf,
    english: "to have",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Имам две сестре.",
        english: "I have two sisters.",
      },
    ],
  }),
  word({
    cyrillic: "постати",
    aspect: pf,
    pair: "постајати",
    english: "to become",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Жели да постане лекар.",
        english: "He wants to become a doctor.",
      },
    ],
  }),
  word({
    cyrillic: "постојати",
    aspect: impf,
    english: "to exist",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Да ли ванземаљци постоје?",
        english: "Do aliens exist?",
      },
    ],
  }),
  word({
    cyrillic: "значити",
    aspect: impf,
    english: "to mean",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Шта значи ова реч?",
        english: "What does this word mean?",
      },
    ],
  }),
  word({
    cyrillic: "требати",
    aspect: impf,
    english: "to need",
    accept: ["require"],
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Треба ми твоја помоћ.",
        english: "I need your help.",
      },
    ],
  }),
  word({
    cyrillic: "морати",
    aspect: impf,
    english: "to have to / must",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Морам да идем кући.",
        english: "I have to go home.",
      },
    ],
  }),
  word({
    cyrillic: "моћи",
    aspect: impf,
    english: "to be able / can",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Не могу да отворим врата.",
        english: "I can't open the door.",
      },
    ],
  }),
  word({
    cyrillic: "смети",
    aspect: impf,
    english: "to be allowed",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Смем ли да уђем?",
        english: "May I come in?",
      },
    ],
  }),
  word({
    cyrillic: "хтети",
    aspect: impf,
    english: "to want",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Хоћу чашу воде.",
        english: "I want a glass of water.",
      },
    ],
  }),
  word({
    cyrillic: "желети",
    aspect: impf,
    pair: "пожелети",
    english: "to wish / to want",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Желим ти срећан рођендан.",
        english: "I wish you a happy birthday.",
      },
    ],
  }),

  // Motion
  word({
    cyrillic: "ићи",
    aspect: impf,
    english: "to go",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Идем у школу пешке.",
        english: "I go to school on foot.",
      },
    ],
  }),
  word({
    cyrillic: "доћи",
    aspect: pf,
    pair: "долазити",
    english: "to come",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Дођи код мене вечерас.",
        english: "Come to my place tonight.",
      },
    ],
  }),
  word({
    cyrillic: "отићи",
    aspect: pf,
    pair: "одлазити",
    english: "to leave / go away",
    accept: ["depart"],
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Морам да одем раније.",
        english: "I have to leave earlier.",
      },
    ],
  }),
  word({
    cyrillic: "ући",
    aspect: pf,
    pair: "улазити",
    english: "to enter",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Уђи и седи.",
        english: "Come in and sit down.",
      },
    ],
  }),
  word({
    cyrillic: "изаћи",
    aspect: pf,
    pair: "излазити",
    english: "to go out / exit",
    topic: "verbs-core",
    pos: v,
    mnemonic: "из- ('out') + ићи ('go') — to go out; cf. ући ('go in').",
    examples: [
      {
        cyrillic: "Изашли смо у град.",
        english: "We went out into town.",
      },
    ],
  }),
  word({
    cyrillic: "прећи",
    aspect: pf,
    pair: "прелазити",
    english: "to cross",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Пређи улицу на семафору.",
        english: "Cross the street at the traffic light.",
      },
    ],
  }),
  word({
    cyrillic: "вратити",
    aspect: pf,
    pair: "враћати",
    english: "to return / give back",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Врати ми књигу сутра.",
        english: "Return my book tomorrow.",
      },
    ],
  }),
  word({
    cyrillic: "стићи",
    aspect: pf,
    pair: "стизати",
    english: "to arrive",
    accept: ["reach"],
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Воз је стигао на време.",
        english: "The train arrived on time.",
      },
    ],
  }),
  word({
    cyrillic: "кренути",
    aspect: pf,
    pair: "кретати",
    english: "to set off",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Кренули смо рано ујутру.",
        english: "We set off early in the morning.",
      },
    ],
  }),
  word({
    cyrillic: "путовати",
    aspect: impf,
    english: "to travel",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Волим да путујем светом.",
        english: "I love traveling the world.",
      },
    ],
  }),
  word({
    cyrillic: "возити",
    aspect: impf,
    english: "to drive",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Он вози брзо.",
        english: "He drives fast.",
      },
    ],
  }),
  word({
    cyrillic: "ходати",
    aspect: impf,
    english: "to walk",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Ходамо сваког јутра.",
        english: "We walk every morning.",
      },
    ],
  }),
  word({
    cyrillic: "шетати",
    aspect: impf,
    pair: "прошетати",
    english: "to stroll",
    accept: ["walk"],
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Шетамо парком увече.",
        english: "We stroll through the park in the evening.",
      },
    ],
  }),
  word({
    cyrillic: "трчати",
    aspect: impf,
    english: "to run",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Трчим у парку викендом.",
        english: "I run in the park on weekends.",
      },
    ],
  }),
  word({
    cyrillic: "летети",
    aspect: impf,
    english: "to fly",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Птице лете на југ.",
        english: "Birds fly south.",
      },
    ],
  }),
  word({
    cyrillic: "пливати",
    aspect: impf,
    english: "to swim",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Деца пливају у мору.",
        english: "The children swim in the sea.",
      },
    ],
  }),
  word({
    cyrillic: "скакати",
    aspect: impf,
    pair: "скочити",
    english: "to jump",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Деца скачу од радости.",
        english: "The children jump for joy.",
      },
    ],
  }),
  word({
    cyrillic: "пасти",
    aspect: pf,
    pair: "падати",
    english: "to fall",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Пази да не паднеш.",
        english: "Be careful not to fall.",
      },
    ],
  }),

  // Posture & rest
  word({
    cyrillic: "устати",
    aspect: pf,
    pair: "устајати",
    english: "to get up",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Устао сам у шест ујутру.",
        english: "I got up at six in the morning.",
      },
    ],
  }),
  word({
    cyrillic: "седети",
    aspect: impf,
    english: "to sit",
    topic: "verbs-core",
    pos: v,
    mnemonic: "седети ↔ 'sit' / Latin 'sedere' (sedentary).",
    examples: [
      {
        cyrillic: "Седим поред прозора.",
        english: "I sit by the window.",
      },
    ],
  }),
  word({
    cyrillic: "стајати",
    aspect: impf,
    english: "to stand",
    topic: "verbs-core",
    pos: v,
    mnemonic: "стајати ↔ 'stand' / Latin 'stare' (stable, station).",
    examples: [
      {
        cyrillic: "Стојим у реду.",
        english: "I'm standing in line.",
      },
    ],
  }),
  word({
    cyrillic: "лежати",
    aspect: impf,
    english: "to lie",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Пас лежи на тепиху.",
        english: "The dog lies on the carpet.",
      },
    ],
  }),
  word({
    cyrillic: "спавати",
    aspect: impf,
    english: "to sleep",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Беба спава мирно.",
        english: "The baby sleeps peacefully.",
      },
    ],
  }),
  word({
    cyrillic: "дисати",
    aspect: impf,
    english: "to breathe",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Дубоко удахни и диши полако.",
        english: "Take a deep breath and breathe slowly.",
      },
    ],
  }),

  // Eating, cooking
  word({
    cyrillic: "јести",
    aspect: impf,
    pair: "појести",
    english: "to eat",
    topic: "verbs-core",
    pos: v,
    mnemonic: "јести ↔ 'eat' / Latin 'edere' (edible).",
    examples: [
      {
        cyrillic: "Једем доручак у седам.",
        english: "I eat breakfast at seven.",
      },
    ],
  }),
  word({
    cyrillic: "пити",
    aspect: impf,
    pair: "попити",
    english: "to drink",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Пијем воду цео дан.",
        english: "I drink water all day.",
      },
    ],
  }),
  word({
    cyrillic: "кувати",
    aspect: impf,
    pair: "скувати",
    english: "to cook",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Мама кува ручак.",
        english: "Mom is cooking lunch.",
      },
    ],
  }),
  word({
    cyrillic: "пробати",
    aspect: both,
    english: "to try / to taste",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Пробај ову супу.",
        english: "Try this soup.",
      },
    ],
  }),

  // Speaking
  word({
    cyrillic: "говорити",
    aspect: impf,
    english: "to speak / to talk",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Говорим три језика.",
        english: "I speak three languages.",
      },
    ],
  }),
  word({
    cyrillic: "рећи",
    aspect: pf,
    english: "to say",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Реци ми истину.",
        english: "Tell me the truth.",
      },
    ],
  }),
  word({
    cyrillic: "казати",
    aspect: both,
    english: "to tell",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Кажи ми шта се десило.",
        english: "Tell me what happened.",
      },
    ],
  }),
  word({
    cyrillic: "причати",
    aspect: impf,
    pair: "испричати",
    english: "to chat / to tell",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Причамо до касно у ноћ.",
        english: "We chat until late at night.",
      },
    ],
  }),
  word({
    cyrillic: "разговарати",
    aspect: impf,
    english: "to converse",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Разговарамо о послу.",
        english: "We're talking about work.",
      },
    ],
  }),
  word({
    cyrillic: "питати",
    aspect: impf,
    pair: "упитати",
    english: "to ask",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Питам те за савет.",
        english: "I'm asking you for advice.",
      },
    ],
  }),
  word({
    cyrillic: "одговорити",
    aspect: pf,
    pair: "одговарати",
    english: "to answer",
    accept: ["reply", "respond"],
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Одговори на питање.",
        english: "Answer the question.",
      },
    ],
  }),
  word({
    cyrillic: "звати",
    aspect: impf,
    pair: "позвати",
    english: "to call",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Зови ме сутра.",
        english: "Call me tomorrow.",
      },
    ],
  }),
  word({
    cyrillic: "викати",
    aspect: impf,
    english: "to shout",
    accept: ["yell"],
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Немој да вичеш на мене.",
        english: "Don't shout at me.",
      },
    ],
  }),

  // Thinking, knowing
  word({
    cyrillic: "знати",
    aspect: impf,
    english: "to know",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Знам одговор.",
        english: "I know the answer.",
      },
    ],
  }),
  word({
    cyrillic: "мислити",
    aspect: impf,
    english: "to think",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Мислим да си у праву.",
        english: "I think you're right.",
      },
    ],
  }),
  word({
    cyrillic: "веровати",
    aspect: impf,
    english: "to believe",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Верујем ти.",
        english: "I believe you.",
      },
    ],
  }),
  word({
    cyrillic: "разумети",
    aspect: both,
    english: "to understand",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Разумем твој проблем.",
        english: "I understand your problem.",
      },
    ],
  }),
  word({
    cyrillic: "учити",
    aspect: impf,
    pair: "научити",
    english: "to study / to learn",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Учим српски сваког дана.",
        english: "I study Serbian every day.",
      },
    ],
  }),
  word({
    cyrillic: "научити",
    aspect: pf,
    pair: "учити",
    english: "to learn",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Научио сам нову реч.",
        english: "I learned a new word.",
      },
    ],
  }),
  word({
    cyrillic: "заборавити",
    aspect: pf,
    pair: "заборављати",
    english: "to forget",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Заборавио сам кључеве.",
        english: "I forgot the keys.",
      },
    ],
  }),
  word({
    cyrillic: "сетити се",
    aspect: pf,
    pair: "сећати се",
    english: "to remember",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Не могу да се сетим имена.",
        english: "I can't remember the name.",
      },
    ],
  }),

  // Perception & feeling
  word({
    cyrillic: "видети",
    aspect: both,
    english: "to see",
    topic: "verbs-core",
    pos: v,
    mnemonic: "видети ↔ Latin 'videre' (video, vision).",
    examples: [
      {
        cyrillic: "Видим планине у даљини.",
        english: "I see the mountains in the distance.",
      },
    ],
  }),
  word({
    cyrillic: "гледати",
    aspect: impf,
    pair: "погледати",
    english: "to watch / to look",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Гледамо филм.",
        english: "We're watching a movie.",
      },
    ],
  }),
  word({
    cyrillic: "чути",
    aspect: both,
    english: "to hear",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Чујеш ли ту музику?",
        english: "Do you hear that music?",
      },
    ],
  }),
  word({
    cyrillic: "слушати",
    aspect: impf,
    english: "to listen",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Слушам музику док радим.",
        english: "I listen to music while I work.",
      },
    ],
  }),
  word({
    cyrillic: "осећати",
    aspect: impf,
    pair: "осетити",
    english: "to feel",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Осећам се уморно.",
        english: "I feel tired.",
      },
    ],
  }),
  word({
    cyrillic: "волети",
    aspect: impf,
    english: "to love / to like",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Волим да читам књиге.",
        english: "I love reading books.",
      },
    ],
  }),
  word({
    cyrillic: "мрзети",
    aspect: impf,
    english: "to hate",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Мрзим да устајем рано.",
        english: "I hate getting up early.",
      },
    ],
  }),
  word({
    cyrillic: "радовати се",
    aspect: impf,
    english: "to be glad",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Радујем се путовању.",
        english: "I'm looking forward to the trip.",
      },
    ],
  }),
  word({
    cyrillic: "бринути",
    aspect: impf,
    english: "to worry",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Не брини за мене.",
        english: "Don't worry about me.",
      },
    ],
  }),
  word({
    cyrillic: "надати се",
    aspect: impf,
    english: "to hope",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Надам се да ћеш доћи.",
        english: "I hope you'll come.",
      },
    ],
  }),
  word({
    cyrillic: "смејати се",
    aspect: impf,
    english: "to laugh",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Смејемо се његовим шалама.",
        english: "We laugh at his jokes.",
      },
    ],
  }),
  word({
    cyrillic: "плакати",
    aspect: impf,
    english: "to cry",
    topic: "verbs-core",
    pos: v,
    examples: [
      {
        cyrillic: "Беба плаче кад је гладна.",
        english: "The baby cries when it's hungry.",
      },
    ],
  }),
];
