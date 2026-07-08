import { word } from "~/lib/content/word";

const n = "noun" as const;

export const general = [
  word({
    cyrillic: "ствар",
    gender: "f",
    english: "thing",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Понеси само најважније ствари.",
        english: "Bring only the most important things.",
      },
    ],
  }),
  word({
    cyrillic: "предмет",
    gender: "m",
    english: "object / subject",
    accept: ["item"],
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Који ти је омиљени предмет у школи?",
        english: "What's your favorite subject in school?",
      },
    ],
  }),
  word({
    cyrillic: "део",
    gender: "m",
    english: "part",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Ово је најбољи део филма.",
        english: "This is the best part of the movie.",
      },
    ],
  }),
  word({
    cyrillic: "врста",
    gender: "f",
    english: "kind / type",
    accept: ["sort"],
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Која је ово врста дрвета?",
        english: "What kind of tree is this?",
      },
    ],
  }),
  word({
    cyrillic: "начин",
    gender: "m",
    english: "way / manner",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Постоји лакши начин.",
        english: "There's an easier way.",
      },
    ],
  }),
  word({
    cyrillic: "облик",
    gender: "m",
    english: "shape / form",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Облак има облик срца.",
        english: "The cloud is shaped like a heart.",
      },
    ],
  }),
  word({
    cyrillic: "боја",
    gender: "f",
    english: "color",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Која ти је омиљена боја?",
        english: "What's your favorite color?",
      },
    ],
  }),
  word({
    cyrillic: "величина",
    gender: "f",
    english: "size",
    topic: "general",
    pos: n,
    mnemonic:
      "From велик ('big') — the -ина makes measure-nouns: висина, дужина, тежина.",
    examples: [
      {
        cyrillic: "Које величине су ципеле?",
        english: "What size are the shoes?",
      },
    ],
  }),
  word({
    cyrillic: "тежина",
    gender: "f",
    english: "weight",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Тежина кофера је превелика.",
        english: "The weight of the suitcase is too much.",
      },
    ],
  }),
  word({
    cyrillic: "висина",
    gender: "f",
    english: "height",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Боји се висине.",
        english: "He's afraid of heights.",
      },
    ],
  }),
  word({
    cyrillic: "дужина",
    gender: "f",
    english: "length",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Измери дужину стола.",
        english: "Measure the length of the table.",
      },
    ],
  }),
  word({
    cyrillic: "количина",
    gender: "f",
    english: "amount / quantity",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Потребна је велика количина воде.",
        english: "A large amount of water is needed.",
      },
    ],
  }),
  word({
    cyrillic: "место",
    gender: "n",
    english: "place",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Ово је савршено место за одмор.",
        english: "This is a perfect place for a rest.",
      },
    ],
  }),
  word({
    cyrillic: "простор",
    gender: "m",
    english: "space",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "У соби има пуно простора.",
        english: "There's a lot of space in the room.",
      },
    ],
  }),
  word({
    cyrillic: "ред",
    gender: "m",
    english: "order / row / queue",
    topic: "general",
    pos: n,
    mnemonic:
      "'Order', 'row', and 'queue' — and 'у реду' means 'OK / all right'.",
    examples: [
      {
        cyrillic: "Чекамо у дугом реду.",
        english: "We're waiting in a long queue.",
      },
    ],
  }),
  word({
    cyrillic: "група",
    gender: "f",
    english: "group",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Путујемо у великој групи.",
        english: "We're traveling in a large group.",
      },
    ],
  }),
  word({
    cyrillic: "крај",
    gender: "m",
    english: "end",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Дошли смо до краја пута.",
        english: "We came to the end of the road.",
      },
    ],
  }),
  word({
    cyrillic: "почетак",
    gender: "m",
    english: "beginning",
    topic: "general",
    pos: n,
    mnemonic: "From почети ('to begin') — the start of something.",
    examples: [
      {
        cyrillic: "На почетку је било тешко.",
        english: "At the beginning it was hard.",
      },
    ],
  }),
  word({
    cyrillic: "средина",
    gender: "f",
    english: "middle",
    accept: ["center", "centre"],
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Сто стоји у средини собе.",
        english: "The table stands in the middle of the room.",
      },
    ],
  }),
  word({
    cyrillic: "врх",
    gender: "m",
    english: "top / peak",
    accept: ["summit", "tip"],
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Попели смо се на врх планине.",
        english: "We climbed to the top of the mountain.",
      },
    ],
  }),
  word({
    cyrillic: "дно",
    gender: "n",
    english: "bottom",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Кључ је пао на дно језера.",
        english: "The key fell to the bottom of the lake.",
      },
    ],
  }),
  word({
    cyrillic: "разлика",
    gender: "f",
    english: "difference",
    topic: "general",
    pos: n,
    mnemonic: "From различит ('different') — the difference between things.",
    examples: [
      {
        cyrillic: "Не видим разлику.",
        english: "I don't see the difference.",
      },
    ],
  }),
  word({
    cyrillic: "веза",
    gender: "f",
    english: "connection",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Веза је лоша, не чујем те.",
        english: "The connection is bad, I can't hear you.",
      },
    ],
  }),
  word({
    cyrillic: "однос",
    gender: "m",
    english: "relationship",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Имају добар однос.",
        english: "They have a good relationship.",
      },
    ],
  }),
  word({
    cyrillic: "ниво",
    gender: "m",
    english: "level",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Његов ниво српског је одличан.",
        english: "His level of Serbian is excellent.",
      },
    ],
  }),
  word({
    cyrillic: "степен",
    gender: "m",
    english: "degree / step",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Температура је порасла за пет степени.",
        english: "The temperature rose by five degrees.",
      },
    ],
  }),
  word({
    cyrillic: "значење",
    gender: "n",
    english: "meaning",
    topic: "general",
    pos: n,
    mnemonic: "From значити ('to mean') — the meaning of something.",
    examples: [
      {
        cyrillic: "Које је значење ове речи?",
        english: "What is the meaning of this word?",
      },
    ],
  }),
  word({
    cyrillic: "знак",
    gender: "m",
    english: "sign",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Саобраћајни знак је јасан.",
        english: "The traffic sign is clear.",
      },
    ],
  }),
  word({
    cyrillic: "ситуација",
    gender: "f",
    english: "situation",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Ситуација је компликована.",
        english: "The situation is complicated.",
      },
    ],
  }),
  word({
    cyrillic: "стање",
    gender: "n",
    english: "state / condition",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Кућа је у добром стању.",
        english: "The house is in good condition.",
      },
    ],
  }),
  word({
    cyrillic: "услов",
    gender: "m",
    english: "condition",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Под једним условом.",
        english: "On one condition.",
      },
    ],
  }),
  word({
    cyrillic: "могућност",
    gender: "f",
    english: "possibility",
    topic: "general",
    pos: n,
    mnemonic:
      "From могућ ('possible') — the -ост makes abstract nouns, like вредност ('value').",
    examples: [
      {
        cyrillic: "Постоји могућност кише.",
        english: "There's a possibility of rain.",
      },
    ],
  }),
  word({
    cyrillic: "потреба",
    gender: "f",
    english: "need",
    topic: "general",
    pos: n,
    mnemonic: "From требати ('to need') — a need.",
    examples: [
      {
        cyrillic: "Храна је основна потреба.",
        english: "Food is a basic need.",
      },
    ],
  }),
  word({
    cyrillic: "план",
    gender: "m",
    english: "plan",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Имам план за викенд.",
        english: "I have a plan for the weekend.",
      },
    ],
  }),
  word({
    cyrillic: "систем",
    gender: "m",
    english: "system",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Систем добро функционише.",
        english: "The system works well.",
      },
    ],
  }),
  word({
    cyrillic: "процес",
    gender: "m",
    english: "process",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Учење је дуг процес.",
        english: "Learning is a long process.",
      },
    ],
  }),
  word({
    cyrillic: "резултат",
    gender: "m",
    english: "result",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Резултат је био изненађујући.",
        english: "The result was surprising.",
      },
    ],
  }),
  word({
    cyrillic: "последица",
    gender: "f",
    english: "consequence",
    topic: "general",
    pos: n,
    mnemonic: "From после ('after') — what comes after; a consequence.",
    examples: [
      {
        cyrillic: "Свака акција има последицу.",
        english: "Every action has a consequence.",
      },
    ],
  }),
  word({
    cyrillic: "узрок",
    gender: "m",
    english: "cause",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Узрок пожара је непознат.",
        english: "The cause of the fire is unknown.",
      },
    ],
  }),
  word({
    cyrillic: "корист",
    gender: "f",
    english: "benefit / use",
    accept: ["advantage"],
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Од тога нема никакве користи.",
        english: "There's no use in that.",
      },
    ],
  }),
  word({
    cyrillic: "штета",
    gender: "f",
    english: "damage / pity",
    topic: "general",
    pos: n,
    mnemonic: "Means both 'damage' and 'a pity' — 'Штета!' = 'What a shame!'.",
    examples: [
      {
        cyrillic: "Штета што ниси дошао.",
        english: "It's a pity you didn't come.",
      },
    ],
  }),
  word({
    cyrillic: "вредност",
    gender: "f",
    english: "value",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Уметничко дело има велику вредност.",
        english: "The artwork has great value.",
      },
    ],
  }),
  word({
    cyrillic: "квалитет",
    gender: "m",
    english: "quality",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Квалитет је важнији од количине.",
        english: "Quality is more important than quantity.",
      },
    ],
  }),
  word({
    cyrillic: "искуство",
    gender: "n",
    english: "experience",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Има пуно радног искуства.",
        english: "He has a lot of work experience.",
      },
    ],
  }),
  word({
    cyrillic: "навика",
    gender: "f",
    english: "habit",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Лоше навике се тешко мењају.",
        english: "Bad habits are hard to change.",
      },
    ],
  }),
  word({
    cyrillic: "правило",
    gender: "n",
    english: "rule",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Свака игра има правила.",
        english: "Every game has rules.",
      },
    ],
  }),
  word({
    cyrillic: "закон",
    gender: "m",
    english: "law",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Сви су једнаки пред законом.",
        english: "Everyone is equal before the law.",
      },
    ],
  }),
  word({
    cyrillic: "слобода",
    gender: "f",
    english: "freedom",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Слобода је драгоцена.",
        english: "Freedom is precious.",
      },
    ],
  }),
  word({
    cyrillic: "друштво",
    gender: "n",
    english: "society / company",
    topic: "general",
    pos: n,
    mnemonic: "From друг ('friend') — your company, and society at large.",
    examples: [
      {
        cyrillic: "Волим друштво пријатеља.",
        english: "I enjoy the company of friends.",
      },
    ],
  }),
  word({
    cyrillic: "влада",
    gender: "f",
    english: "government",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Влада је донела нови закон.",
        english: "The government passed a new law.",
      },
    ],
  }),
  word({
    cyrillic: "вест",
    gender: "f",
    english: "news",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Имам добру вест за тебе.",
        english: "I have good news for you.",
      },
    ],
  }),
  word({
    cyrillic: "догађај",
    gender: "m",
    english: "event",
    topic: "general",
    pos: n,
    examples: [
      {
        cyrillic: "Тај догађај је променио све.",
        english: "That event changed everything.",
      },
    ],
  }),
];
