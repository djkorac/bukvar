import { word } from "~/lib/content/word";

const v = "verb" as const;
const impf = "impf" as const;
const pf = "pf" as const;
const both = "both" as const;

export const verbs = [
  // Making, work
  word({
    cyrillic: "радити",
    aspect: impf,
    english: "to work / to do",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Радим у канцеларији.",
        english: "I work in an office.",
      },
    ],
  }),
  word({
    cyrillic: "правити",
    aspect: impf,
    pair: "направити",
    english: "to make",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Правим колаче за рођендан.",
        english: "I'm making cakes for the birthday.",
      },
    ],
  }),
  word({
    cyrillic: "направити",
    aspect: pf,
    pair: "правити",
    english: "to make / to do",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Направио сам грешку.",
        english: "I made a mistake.",
      },
    ],
  }),
  word({
    cyrillic: "градити",
    aspect: impf,
    pair: "изградити",
    english: "to build",
    accept: ["construct"],
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Граде нову зграду.",
        english: "They're building a new building.",
      },
    ],
  }),
  word({
    cyrillic: "поправити",
    aspect: pf,
    pair: "поправљати",
    english: "to fix / to repair",
    accept: ["mend"],
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Поправио је ауто.",
        english: "He fixed the car.",
      },
    ],
  }),
  word({
    cyrillic: "сломити",
    aspect: pf,
    pair: "ломити",
    english: "to break",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Сломио је руку.",
        english: "He broke his arm.",
      },
    ],
  }),
  word({
    cyrillic: "отворити",
    aspect: pf,
    pair: "отварати",
    english: "to open",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Отворили су нову продавницу.",
        english: "They opened a new shop.",
      },
    ],
  }),
  word({
    cyrillic: "затворити",
    aspect: pf,
    pair: "затварати",
    english: "to close",
    accept: ["shut"],
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Затвори врата за собом.",
        english: "Close the door behind you.",
      },
    ],
  }),
  word({
    cyrillic: "чистити",
    aspect: impf,
    pair: "очистити",
    english: "to clean",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Чистим стан суботом.",
        english: "I clean the apartment on Saturdays.",
      },
    ],
  }),
  word({
    cyrillic: "прати",
    aspect: impf,
    pair: "опрати",
    english: "to wash",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Перем судове после ручка.",
        english: "I wash the dishes after lunch.",
      },
    ],
  }),
  word({
    cyrillic: "спремати",
    aspect: impf,
    pair: "спремити",
    english: "to prepare / to tidy",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Спремам вечеру.",
        english: "I'm preparing dinner.",
      },
    ],
  }),
  word({
    cyrillic: "цртати",
    aspect: impf,
    pair: "нацртати",
    english: "to draw",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Дете црта кућу.",
        english: "The child draws a house.",
      },
    ],
  }),
  word({
    cyrillic: "писати",
    aspect: impf,
    pair: "написати",
    english: "to write",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Пишем писмо пријатељу.",
        english: "I'm writing a letter to a friend.",
      },
    ],
  }),
  word({
    cyrillic: "читати",
    aspect: impf,
    pair: "прочитати",
    english: "to read",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Читам књигу пред спавање.",
        english: "I read a book before bed.",
      },
    ],
  }),
  word({
    cyrillic: "бројати",
    aspect: impf,
    pair: "избројати",
    english: "to count",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Дете броји до десет.",
        english: "The child counts to ten.",
      },
    ],
  }),
  word({
    cyrillic: "играти",
    aspect: impf,
    english: "to play",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Деца играју фудбал.",
        english: "The children play football.",
      },
    ],
  }),
  word({
    cyrillic: "певати",
    aspect: impf,
    pair: "отпевати",
    english: "to sing",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Птице певају ујутру.",
        english: "Birds sing in the morning.",
      },
    ],
  }),

  // Giving, taking, having
  word({
    cyrillic: "дати",
    aspect: pf,
    pair: "давати",
    english: "to give",
    topic: "verbs",
    pos: v,
    mnemonic: "дати ↔ Latin 'dare' (donate, date).",
    examples: [
      {
        cyrillic: "Дај ми ту књигу.",
        english: "Give me that book.",
      },
    ],
  }),
  word({
    cyrillic: "узети",
    aspect: pf,
    pair: "узимати",
    english: "to take",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Узми један колач.",
        english: "Take a cake.",
      },
    ],
  }),
  word({
    cyrillic: "држати",
    aspect: impf,
    english: "to hold",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Држи ме за руку.",
        english: "Hold my hand.",
      },
    ],
  }),
  word({
    cyrillic: "носити",
    aspect: impf,
    english: "to carry / to wear",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Носим торбу на рамену.",
        english: "I carry the bag on my shoulder.",
      },
    ],
  }),
  word({
    cyrillic: "бацити",
    aspect: pf,
    pair: "бацати",
    english: "to throw",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Баци лопту.",
        english: "Throw the ball.",
      },
    ],
  }),
  word({
    cyrillic: "донети",
    aspect: pf,
    pair: "доносити",
    english: "to bring",
    topic: "verbs",
    pos: v,
    mnemonic: "до- ('to') + нети ('carry') — bring; cf. однети ('carry away').",
    examples: [
      {
        cyrillic: "Донеси ми воду, молим те.",
        english: "Bring me water, please.",
      },
    ],
  }),
  word({
    cyrillic: "однети",
    aspect: pf,
    pair: "односити",
    english: "to take away",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Однеси тањире у кухињу.",
        english: "Take the plates to the kitchen.",
      },
    ],
  }),
  word({
    cyrillic: "послати",
    aspect: pf,
    pair: "слати",
    english: "to send",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Послаћу ти поруку.",
        english: "I'll send you a message.",
      },
    ],
  }),
  word({
    cyrillic: "примити",
    aspect: pf,
    pair: "примати",
    english: "to receive",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Примио сам твоје писмо.",
        english: "I received your letter.",
      },
    ],
  }),
  word({
    cyrillic: "показати",
    aspect: pf,
    pair: "показивати",
    english: "to show",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Покажи ми пут.",
        english: "Show me the way.",
      },
    ],
  }),
  word({
    cyrillic: "ставити",
    aspect: pf,
    pair: "стављати",
    english: "to put",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Стави књигу на полицу.",
        english: "Put the book on the shelf.",
      },
    ],
  }),

  // Money & getting
  word({
    cyrillic: "купити",
    aspect: pf,
    pair: "куповати",
    english: "to buy",
    accept: ["purchase"],
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Купио сам нове ципеле.",
        english: "I bought new shoes.",
      },
    ],
  }),
  word({
    cyrillic: "продати",
    aspect: pf,
    pair: "продавати",
    english: "to sell",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Продали су стару кућу.",
        english: "They sold the old house.",
      },
    ],
  }),
  word({
    cyrillic: "платити",
    aspect: pf,
    pair: "плаћати",
    english: "to pay",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Платио сам рачун.",
        english: "I paid the bill.",
      },
    ],
  }),
  word({
    cyrillic: "коштати",
    aspect: impf,
    english: "to cost",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Колико кошта ова јакна?",
        english: "How much does this jacket cost?",
      },
    ],
  }),
  word({
    cyrillic: "штедети",
    aspect: impf,
    pair: "уштедети",
    english: "to save",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Штедим новац за путовање.",
        english: "I'm saving money for a trip.",
      },
    ],
  }),
  word({
    cyrillic: "трошити",
    aspect: impf,
    pair: "потрошити",
    english: "to spend",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Троши превише на одећу.",
        english: "He spends too much on clothes.",
      },
    ],
  }),
  word({
    cyrillic: "добити",
    aspect: pf,
    pair: "добијати",
    english: "to get / to win",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Добио сам поклон.",
        english: "I got a present.",
      },
    ],
  }),
  word({
    cyrillic: "изгубити",
    aspect: pf,
    pair: "губити",
    english: "to lose",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Изгубио сам новчаник.",
        english: "I lost my wallet.",
      },
    ],
  }),

  // Helping, seeking, process
  word({
    cyrillic: "помоћи",
    aspect: pf,
    pair: "помагати",
    english: "to help",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Можеш ли да ми помогнеш?",
        english: "Can you help me?",
      },
    ],
  }),
  word({
    cyrillic: "чекати",
    aspect: impf,
    pair: "сачекати",
    english: "to wait",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Чекам аутобус већ пола сата.",
        english: "I've been waiting for the bus for half an hour.",
      },
    ],
  }),
  word({
    cyrillic: "тражити",
    aspect: impf,
    pair: "потражити",
    english: "to look for / to seek",
    accept: ["search for"],
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Тражим кључеве.",
        english: "I'm looking for the keys.",
      },
    ],
  }),
  word({
    cyrillic: "наћи",
    aspect: pf,
    pair: "налазити",
    english: "to find",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Нашао сам решење.",
        english: "I found a solution.",
      },
    ],
  }),
  word({
    cyrillic: "почети",
    aspect: pf,
    pair: "почињати",
    english: "to begin",
    accept: ["start"],
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Филм ће почети у осам.",
        english: "The movie will begin at eight.",
      },
    ],
  }),
  word({
    cyrillic: "завршити",
    aspect: pf,
    pair: "завршавати",
    english: "to finish",
    accept: ["end", "complete"],
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Завршио сам посао.",
        english: "I finished the work.",
      },
    ],
  }),
  word({
    cyrillic: "наставити",
    aspect: pf,
    pair: "настављати",
    english: "to continue",
    accept: ["carry on"],
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Настави да читаш.",
        english: "Continue reading.",
      },
    ],
  }),
  word({
    cyrillic: "престати",
    aspect: pf,
    pair: "престајати",
    english: "to stop",
    accept: ["quit", "cease"],
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Престани да причаш.",
        english: "Stop talking.",
      },
    ],
  }),
  word({
    cyrillic: "успети",
    aspect: pf,
    pair: "успевати",
    english: "to succeed",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Успео сам на испиту.",
        english: "I succeeded on the exam.",
      },
    ],
  }),

  // Communication & decisions
  word({
    cyrillic: "објаснити",
    aspect: pf,
    pair: "објашњавати",
    english: "to explain",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Објасни ми ово правило.",
        english: "Explain this rule to me.",
      },
    ],
  }),
  word({
    cyrillic: "описати",
    aspect: pf,
    pair: "описивати",
    english: "to describe",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Опиши свој дан.",
        english: "Describe your day.",
      },
    ],
  }),
  word({
    cyrillic: "превести",
    aspect: pf,
    pair: "преводити",
    english: "to translate",
    topic: "verbs",
    pos: v,
    mnemonic: "пре- ('across') + вести ('lead') — to carry across = translate.",
    examples: [
      {
        cyrillic: "Преведи ову реченицу.",
        english: "Translate this sentence.",
      },
    ],
  }),
  word({
    cyrillic: "понављати",
    aspect: impf,
    pair: "поновити",
    english: "to repeat",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Понавља исту грешку.",
        english: "He repeats the same mistake.",
      },
    ],
  }),
  word({
    cyrillic: "вежбати",
    aspect: impf,
    english: "to practice / exercise",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Вежбам сваког јутра.",
        english: "I exercise every morning.",
      },
    ],
  }),
  word({
    cyrillic: "проверити",
    aspect: pf,
    pair: "проверавати",
    english: "to check",
    accept: ["verify"],
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Провери да ли су врата закључана.",
        english: "Check whether the door is locked.",
      },
    ],
  }),
  word({
    cyrillic: "изабрати",
    aspect: pf,
    pair: "бирати",
    english: "to choose",
    accept: ["pick", "select"],
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Изабери једну боју.",
        english: "Choose one color.",
      },
    ],
  }),
  word({
    cyrillic: "одлучити",
    aspect: pf,
    pair: "одлучивати",
    english: "to decide",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Одлучио сам да останем.",
        english: "I decided to stay.",
      },
    ],
  }),
  word({
    cyrillic: "договорити се",
    aspect: pf,
    pair: "договарати се",
    english: "to agree / arrange",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Договорили смо се за сутра.",
        english: "We arranged for tomorrow.",
      },
    ],
  }),
  word({
    cyrillic: "обећати",
    aspect: pf,
    pair: "обећавати",
    english: "to promise",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Обећао сам да ћу доћи.",
        english: "I promised I would come.",
      },
    ],
  }),
  word({
    cyrillic: "дозволити",
    aspect: pf,
    pair: "дозвољавати",
    english: "to allow",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Родитељи су ми дозволили да изађем.",
        english: "My parents allowed me to go out.",
      },
    ],
  }),
  word({
    cyrillic: "одбити",
    aspect: pf,
    pair: "одбијати",
    english: "to refuse / reject",
    accept: ["decline", "turn down"],
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Одбио је понуду.",
        english: "He refused the offer.",
      },
    ],
  }),
  word({
    cyrillic: "прихватити",
    aspect: pf,
    pair: "прихватати",
    english: "to accept",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Прихватио сам позив.",
        english: "I accepted the invitation.",
      },
    ],
  }),
  word({
    cyrillic: "понудити",
    aspect: pf,
    pair: "нудити",
    english: "to offer",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Понудили су ми посао.",
        english: "They offered me a job.",
      },
    ],
  }),
  word({
    cyrillic: "приметити",
    aspect: pf,
    pair: "примећивати",
    english: "to notice",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Приметио сам грешку.",
        english: "I noticed a mistake.",
      },
    ],
  }),
  word({
    cyrillic: "сазнати",
    aspect: pf,
    pair: "сазнавати",
    english: "to find out",
    accept: ["learn"],
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Сазнао сам добру вест.",
        english: "I found out good news.",
      },
    ],
  }),
  word({
    cyrillic: "мерити",
    aspect: impf,
    pair: "измерити",
    english: "to measure",
    topic: "verbs",
    pos: v,
    mnemonic: "мерити ↔ Latin 'metiri' / Greek 'metron' (meter).",
    examples: [
      {
        cyrillic: "Меримо собу за тепих.",
        english: "We're measuring the room for a carpet.",
      },
    ],
  }),
  word({
    cyrillic: "користити",
    aspect: impf,
    pair: "искористити",
    english: "to use",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Користим телефон за све.",
        english: "I use my phone for everything.",
      },
    ],
  }),

  // Social & getting around
  word({
    cyrillic: "поздравити",
    aspect: pf,
    pair: "поздрављати",
    english: "to greet",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Поздрави госте на улазу.",
        english: "Greet the guests at the entrance.",
      },
    ],
  }),
  word({
    cyrillic: "честитати",
    aspect: both,
    english: "to congratulate",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Честитам ти на успеху.",
        english: "I congratulate you on your success.",
      },
    ],
  }),
  word({
    cyrillic: "посетити",
    aspect: pf,
    pair: "посећивати",
    english: "to visit",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Посетили смо бабу и деду.",
        english: "We visited grandma and grandpa.",
      },
    ],
  }),
  word({
    cyrillic: "остати",
    aspect: pf,
    pair: "остајати",
    english: "to stay",
    accept: ["remain"],
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Остани још мало.",
        english: "Stay a little longer.",
      },
    ],
  }),
  word({
    cyrillic: "журити",
    aspect: impf,
    pair: "пожурити",
    english: "to hurry",
    accept: ["rush"],
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Журим на посао.",
        english: "I'm hurrying to work.",
      },
    ],
  }),
  word({
    cyrillic: "поручити",
    aspect: pf,
    pair: "поручивати",
    english: "to order",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Поручили смо пицу.",
        english: "We ordered a pizza.",
      },
    ],
  }),
  word({
    cyrillic: "резервисати",
    aspect: both,
    english: "to reserve / book",
    accept: ["make a reservation"],
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Резервисао сам сто за двоје.",
        english: "I reserved a table for two.",
      },
    ],
  }),
  word({
    cyrillic: "препоручити",
    aspect: pf,
    pair: "препоручивати",
    english: "to recommend",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Препоручио сам овај ресторан.",
        english: "I recommended this restaurant.",
      },
    ],
  }),
  word({
    cyrillic: "зарадити",
    aspect: pf,
    pair: "зарађивати",
    english: "to earn",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Зарадио је довољно за одмор.",
        english: "He earned enough for a vacation.",
      },
    ],
  }),
  word({
    cyrillic: "поделити",
    aspect: pf,
    pair: "делити",
    english: "to share / divide",
    accept: ["split"],
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Поделили смо колач на четири дела.",
        english: "We divided the cake into four parts.",
      },
    ],
  }),

  // Handling objects
  word({
    cyrillic: "пробудити",
    aspect: pf,
    pair: "будити",
    english: "to wake (someone)",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Пробуди ме у седам.",
        english: "Wake me at seven.",
      },
    ],
  }),
  word({
    cyrillic: "обући се",
    aspect: pf,
    pair: "облачити се",
    english: "to get dressed",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Обуци се, излазимо.",
        english: "Get dressed, we're going out.",
      },
    ],
  }),
  word({
    cyrillic: "укључити",
    aspect: pf,
    pair: "укључивати",
    english: "to turn on",
    topic: "verbs",
    pos: v,
    mnemonic:
      "у- ('in') + кључ ('key') — switch in; cf. искључити ('turn off').",
    examples: [
      {
        cyrillic: "Укључи светло.",
        english: "Turn on the light.",
      },
    ],
  }),
  word({
    cyrillic: "искључити",
    aspect: pf,
    pair: "искључивати",
    english: "to turn off",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Искључи телевизор.",
        english: "Turn off the television.",
      },
    ],
  }),
  word({
    cyrillic: "пустити",
    aspect: pf,
    pair: "пуштати",
    english: "to let / release",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Пусти ме да прођем.",
        english: "Let me through.",
      },
    ],
  }),
  word({
    cyrillic: "ухватити",
    aspect: pf,
    pair: "хватати",
    english: "to catch",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Ухвати лопту!",
        english: "Catch the ball!",
      },
    ],
  }),
  word({
    cyrillic: "вући",
    aspect: impf,
    english: "to pull",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Вуци уже јаче.",
        english: "Pull the rope harder.",
      },
    ],
  }),
  word({
    cyrillic: "гурати",
    aspect: impf,
    english: "to push",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Гурај колица полако.",
        english: "Push the cart slowly.",
      },
    ],
  }),
  word({
    cyrillic: "дићи",
    aspect: pf,
    pair: "дизати",
    english: "to lift / raise",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Дигни руку ако знаш.",
        english: "Raise your hand if you know.",
      },
    ],
  }),
  word({
    cyrillic: "спустити",
    aspect: pf,
    pair: "спуштати",
    english: "to lower",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Спусти кофер на под.",
        english: "Put the suitcase down on the floor.",
      },
    ],
  }),
  word({
    cyrillic: "закључати",
    aspect: pf,
    pair: "закључавати",
    english: "to lock",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Закључај врата кад изађеш.",
        english: "Lock the door when you leave.",
      },
    ],
  }),
  word({
    cyrillic: "зауставити",
    aspect: pf,
    pair: "заустављати",
    english: "to stop (something)",
    topic: "verbs",
    pos: v,
    examples: [
      {
        cyrillic: "Заустави ауто овде.",
        english: "Stop the car here.",
      },
    ],
  }),
];
