import { word } from "~/lib/content/word";

const n = "noun" as const;

export const places = [
  word({
    cyrillic: "град",
    gender: "m",
    english: "city",
    topic: "places",
    pos: n,
    mnemonic:
      "град ↔ the '-grad' in 'Belgrade' — an old word for a walled town.",
    examples: [
      {
        cyrillic: "Београд је највећи град у Србији.",
        english: "Belgrade is the biggest city in Serbia.",
      },
    ],
  }),
  word({
    cyrillic: "село",
    gender: "n",
    english: "village",
    topic: "places",
    pos: n,
    examples: [
      {
        cyrillic: "Село је мирно и тихо.",
        english: "The village is calm and quiet.",
      },
    ],
  }),
  word({
    cyrillic: "држава",
    gender: "f",
    english: "country / state",
    topic: "places",
    pos: n,
    mnemonic: "From држати ('to hold') — a state 'holds' its land together.",
    examples: [
      {
        cyrillic: "Србија је мала држава.",
        english: "Serbia is a small country.",
      },
    ],
  }),
  word({
    cyrillic: "свет",
    gender: "m",
    english: "world",
    topic: "places",
    pos: n,
    examples: [
      {
        cyrillic: "Желим да путујем око света.",
        english: "I want to travel around the world.",
      },
    ],
  }),
  word({
    cyrillic: "улица",
    gender: "f",
    english: "street",
    topic: "places",
    pos: n,
    examples: [
      {
        cyrillic: "Његова кућа је у тихој улици.",
        english: "His house is on a quiet street.",
      },
    ],
  }),
  word({
    cyrillic: "трг",
    gender: "m",
    english: "square",
    topic: "places",
    pos: n,
    examples: [
      {
        cyrillic: "Трг је пун туриста.",
        english: "The square is full of tourists.",
      },
    ],
  }),
  word({
    cyrillic: "мост",
    gender: "m",
    english: "bridge",
    topic: "places",
    pos: n,
    mnemonic: "Looks like English 'most', but мост means 'bridge'.",
    examples: [
      {
        cyrillic: "Мост повезује две обале реке.",
        english: "The bridge connects the two banks of the river.",
      },
    ],
  }),
  word({
    cyrillic: "зграда",
    gender: "f",
    english: "building",
    topic: "places",
    pos: n,
    mnemonic: "From градити ('to build') — cf. град ('city').",
    examples: [
      {
        cyrillic: "Ова зграда има десет спратова.",
        english: "This building has ten floors.",
      },
    ],
  }),
  word({
    cyrillic: "продавница",
    gender: "f",
    english: "shop / store",
    topic: "places",
    pos: n,
    mnemonic: "From продавати ('to sell') — a place where things are sold.",
    examples: [
      {
        cyrillic: "Продавница ради до девет увече.",
        english: "The shop is open until nine in the evening.",
      },
    ],
  }),
  word({
    cyrillic: "пијаца",
    gender: "f",
    english: "market",
    topic: "places",
    pos: n,
    mnemonic: "пијаца ↔ Italian 'piazza' — a market square.",
    examples: [
      {
        cyrillic: "На пијаци купујем свеже поврће.",
        english: "At the market I buy fresh vegetables.",
      },
    ],
  }),
  word({
    cyrillic: "ресторан",
    gender: "m",
    english: "restaurant",
    topic: "places",
    pos: n,
    examples: [
      {
        cyrillic: "Резервисао сам сто у ресторану.",
        english: "I reserved a table at the restaurant.",
      },
    ],
  }),
  word({
    cyrillic: "кафић",
    gender: "m",
    english: "café",
    topic: "places",
    pos: n,
    examples: [
      {
        cyrillic: "Нашли смо се у кафићу.",
        english: "We met up at the café.",
      },
    ],
  }),
  word({
    cyrillic: "хотел",
    gender: "m",
    english: "hotel",
    topic: "places",
    pos: n,
    examples: [
      {
        cyrillic: "Хотел је близу плаже.",
        english: "The hotel is near the beach.",
      },
    ],
  }),
  word({
    cyrillic: "пошта",
    gender: "f",
    english: "post office",
    topic: "places",
    pos: n,
    examples: [
      {
        cyrillic: "Платио сам рачуне у пошти.",
        english: "I paid the bills at the post office.",
      },
    ],
  }),
  word({
    cyrillic: "банка",
    gender: "f",
    english: "bank",
    topic: "places",
    pos: n,
    examples: [
      {
        cyrillic: "Подигао сам новац у банци.",
        english: "I withdrew money at the bank.",
      },
    ],
  }),
  word({
    cyrillic: "апотека",
    gender: "f",
    english: "pharmacy",
    accept: ["chemist", "drugstore"],
    topic: "places",
    pos: n,
    mnemonic: "апотека ↔ 'apothecary' (Greek 'apothēkē', a storehouse).",
    examples: [
      {
        cyrillic: "Лек се купује у апотеци.",
        english: "The medicine is bought at the pharmacy.",
      },
    ],
  }),
  word({
    cyrillic: "пекара",
    gender: "f",
    english: "bakery",
    topic: "places",
    pos: n,
    mnemonic: "From пећи ('to bake') — where bread is baked.",
    examples: [
      {
        cyrillic: "Мирис хлеба долази из пекаре.",
        english: "The smell of bread comes from the bakery.",
      },
    ],
  }),
  word({
    cyrillic: "болница",
    gender: "f",
    english: "hospital",
    topic: "places",
    pos: n,
    mnemonic: "From бол ('pain') — a place for the ailing.",
    examples: [
      {
        cyrillic: "Лежао је у болници недељу дана.",
        english: "He was in the hospital for a week.",
      },
    ],
  }),
  word({
    cyrillic: "школа",
    gender: "f",
    english: "school",
    topic: "places",
    pos: n,
    examples: [
      {
        cyrillic: "Деца иду у школу аутобусом.",
        english: "The children go to school by bus.",
      },
    ],
  }),
  word({
    cyrillic: "библиотека",
    gender: "f",
    english: "library",
    topic: "places",
    pos: n,
    mnemonic: "Greek 'biblion' ('book') — cf. 'bibliography'.",
    examples: [
      {
        cyrillic: "Позајмио сам књигу из библиотеке.",
        english: "I borrowed a book from the library.",
      },
    ],
  }),
  word({
    cyrillic: "музеј",
    gender: "m",
    english: "museum",
    topic: "places",
    pos: n,
    examples: [
      {
        cyrillic: "Музеј је затворен понедељком.",
        english: "The museum is closed on Mondays.",
      },
    ],
  }),
  word({
    cyrillic: "биоскоп",
    gender: "m",
    english: "cinema",
    accept: ["movie theater"],
    topic: "places",
    pos: n,
    mnemonic:
      "Greek 'bios' ('life') + 'skopein' ('to view') — a 'life-viewer'.",
    examples: [
      {
        cyrillic: "Вечерас идемо у биоскоп.",
        english: "Tonight we're going to the cinema.",
      },
    ],
  }),
  word({
    cyrillic: "позориште",
    gender: "n",
    english: "theater",
    topic: "places",
    pos: n,
    examples: [
      {
        cyrillic: "Глумци наступају у позоришту.",
        english: "The actors perform at the theater.",
      },
    ],
  }),
  word({
    cyrillic: "црква",
    gender: "f",
    english: "church",
    topic: "places",
    pos: n,
    mnemonic: "црква ↔ 'church' / Scottish 'kirk' (Greek 'kyriakón').",
    examples: [
      {
        cyrillic: "Стара црква има високи торањ.",
        english: "The old church has a tall tower.",
      },
    ],
  }),
  word({
    cyrillic: "парк",
    gender: "m",
    english: "park",
    topic: "places",
    pos: n,
    examples: [
      {
        cyrillic: "Шетамо псе у парку.",
        english: "We walk the dogs in the park.",
      },
    ],
  }),
  word({
    cyrillic: "теретана",
    gender: "f",
    english: "gym",
    topic: "places",
    pos: n,
    mnemonic: "From терет ('load, weight') — where you lift weights.",
    examples: [
      {
        cyrillic: "Вежбам у теретани три пута недељно.",
        english: "I work out at the gym three times a week.",
      },
    ],
  }),
  word({
    cyrillic: "базен",
    gender: "m",
    english: "swimming pool",
    accept: ["pool"],
    topic: "places",
    pos: n,
    examples: [
      {
        cyrillic: "Деца пливају у базену.",
        english: "The children swim in the pool.",
      },
    ],
  }),
  word({
    cyrillic: "плажа",
    gender: "f",
    english: "beach",
    topic: "places",
    pos: n,
    examples: [
      {
        cyrillic: "Лети проводимо дане на плажи.",
        english: "In summer we spend days at the beach.",
      },
    ],
  }),
  word({
    cyrillic: "аеродром",
    gender: "m",
    english: "airport",
    topic: "places",
    pos: n,
    mnemonic: "Greek 'aero' ('air') + 'dromos' ('course') — where planes run.",
    examples: [
      {
        cyrillic: "Авион полеће са аеродрома.",
        english: "The plane takes off from the airport.",
      },
    ],
  }),
  word({
    cyrillic: "станица",
    gender: "f",
    english: "station",
    topic: "places",
    pos: n,
    mnemonic: "From стати ('to stop') — where the bus stops.",
    examples: [
      {
        cyrillic: "Чекам аутобус на станици.",
        english: "I'm waiting for the bus at the station.",
      },
    ],
  }),
];
