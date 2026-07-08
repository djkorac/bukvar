import { word } from "~/lib/content/word";

const n = "noun" as const;

export const money = [
  word({
    cyrillic: "новац",
    gender: "m",
    english: "money",
    topic: "money",
    pos: n,
    examples: [
      {
        cyrillic: "Немам довољно новца.",
        english: "I don't have enough money.",
      },
    ],
  }),
  word({
    cyrillic: "динар",
    gender: "m",
    english: "dinar",
    topic: "money",
    pos: n,
    mnemonic: "динар ↔ the Roman 'denarius' — an ancient silver coin.",
    examples: [
      {
        cyrillic: "Хлеб кошта осамдесет динара.",
        english: "Bread costs eighty dinars.",
      },
    ],
  }),
  word({
    cyrillic: "евро",
    gender: "m",
    english: "euro",
    topic: "money",
    pos: n,
    examples: [
      {
        cyrillic: "Карта кошта десет евра.",
        english: "The ticket costs ten euros.",
      },
    ],
  }),
  word({
    cyrillic: "цена",
    gender: "f",
    english: "price",
    topic: "money",
    pos: n,
    examples: [
      {
        cyrillic: "Која је цена ове јакне?",
        english: "What is the price of this jacket?",
      },
    ],
  }),
  word({
    cyrillic: "рачун",
    gender: "m",
    english: "bill / account",
    topic: "money",
    pos: n,
    mnemonic: "Means both 'bill' and 'account'.",
    examples: [
      {
        cyrillic: "Конобар је донео рачун.",
        english: "The waiter brought the bill.",
      },
    ],
  }),
  word({
    cyrillic: "готовина",
    gender: "f",
    english: "cash",
    topic: "money",
    pos: n,
    mnemonic: "From готов ('ready') — 'ready money', i.e. cash.",
    examples: [
      {
        cyrillic: "Плаћам готовином, не картицом.",
        english: "I pay in cash, not by card.",
      },
    ],
  }),
  word({
    cyrillic: "картица",
    gender: "f",
    english: "card",
    topic: "money",
    pos: n,
    examples: [
      {
        cyrillic: "Платио сам картицом.",
        english: "I paid by card.",
      },
    ],
  }),
  word({
    cyrillic: "новчаник",
    gender: "m",
    english: "wallet",
    topic: "money",
    pos: n,
    mnemonic: "From новац ('money') — the thing that holds your money.",
    examples: [
      {
        cyrillic: "Заборавио сам новчаник код куће.",
        english: "I forgot my wallet at home.",
      },
    ],
  }),
  word({
    cyrillic: "банкомат",
    gender: "m",
    english: "ATM",
    topic: "money",
    pos: n,
    examples: [
      {
        cyrillic: "Подигао сам новац са банкомата.",
        english: "I withdrew money from the ATM.",
      },
    ],
  }),
  word({
    cyrillic: "попуст",
    gender: "m",
    english: "discount",
    topic: "money",
    pos: n,
    examples: [
      {
        cyrillic: "Добио сам попуст од десет посто.",
        english: "I got a ten percent discount.",
      },
    ],
  }),
  word({
    cyrillic: "продаја",
    gender: "f",
    english: "sale",
    topic: "money",
    pos: n,
    mnemonic: "From продати ('to sell').",
    examples: [
      {
        cyrillic: "Кућа је на продају.",
        english: "The house is for sale.",
      },
    ],
  }),
  word({
    cyrillic: "куповина",
    gender: "f",
    english: "shopping / purchase",
    topic: "money",
    pos: n,
    mnemonic: "From купити ('to buy').",
    examples: [
      {
        cyrillic: "Идем у куповину после посла.",
        english: "I'm going shopping after work.",
      },
    ],
  }),
  word({
    cyrillic: "поклон",
    gender: "m",
    english: "gift / present",
    topic: "money",
    pos: n,
    examples: [
      {
        cyrillic: "Купио сам поклон за маму.",
        english: "I bought a gift for my mom.",
      },
    ],
  }),
  word({
    cyrillic: "плата",
    gender: "f",
    english: "salary",
    topic: "money",
    pos: n,
    examples: [
      {
        cyrillic: "Плата ми стиже првог у месецу.",
        english: "My salary arrives on the first of the month.",
      },
    ],
  }),
  word({
    cyrillic: "порез",
    gender: "m",
    english: "tax",
    topic: "money",
    pos: n,
    examples: [
      {
        cyrillic: "Сви морају да плаћају порез.",
        english: "Everyone has to pay tax.",
      },
    ],
  }),
  word({
    cyrillic: "дуг",
    gender: "m",
    english: "debt",
    topic: "money",
    pos: n,
    examples: [
      {
        cyrillic: "Вратио је дуг на време.",
        english: "He repaid the debt on time.",
      },
    ],
  }),
  word({
    cyrillic: "кредит",
    gender: "m",
    english: "loan / credit",
    topic: "money",
    pos: n,
    examples: [
      {
        cyrillic: "Узели су кредит за стан.",
        english: "They took out a loan for an apartment.",
      },
    ],
  }),
];
