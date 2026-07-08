import { word } from "~/lib/content/word";

const n = "noun" as const;

export const food = [
  word({
    cyrillic: "храна",
    gender: "f",
    english: "food",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Домаћа храна је најукуснија.",
        english: "Homemade food is the tastiest.",
      },
    ],
  }),
  word({
    cyrillic: "пиће",
    gender: "n",
    english: "drink",
    accept: ["beverage"],
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Шта желиш за пиће?",
        english: "What would you like to drink?",
      },
    ],
  }),
  word({
    cyrillic: "доручак",
    gender: "m",
    english: "breakfast",
    topic: "food",
    pos: n,
    mnemonic: "до ('before') + ручак ('lunch') — the pre-lunch meal.",
    examples: [
      {
        cyrillic: "Доручак је најважнији оброк.",
        english: "Breakfast is the most important meal.",
      },
    ],
  }),
  word({
    cyrillic: "ручак",
    gender: "m",
    english: "lunch",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Ручак је готов у подне.",
        english: "Lunch is ready at noon.",
      },
    ],
  }),
  word({
    cyrillic: "вечера",
    gender: "f",
    english: "dinner",
    topic: "food",
    pos: n,
    mnemonic: "From вече ('evening') — the evening meal.",
    examples: [
      {
        cyrillic: "Вечера је била изврсна.",
        english: "Dinner was excellent.",
      },
    ],
  }),
  word({
    cyrillic: "вода",
    gender: "f",
    english: "water",
    topic: "food",
    pos: n,
    mnemonic: "вода ↔ 'water' / Greek 'hydro-'.",
    examples: [
      {
        cyrillic: "Вода кључа на сто степени.",
        english: "Water boils at a hundred degrees.",
      },
    ],
  }),
  word({
    cyrillic: "кафа",
    gender: "f",
    english: "coffee",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Волим јаку кафу ујутру.",
        english: "I like strong coffee in the morning.",
      },
    ],
  }),
  word({
    cyrillic: "чај",
    gender: "m",
    english: "tea",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Чај од нане смирује стомак.",
        english: "Mint tea soothes the stomach.",
      },
    ],
  }),
  word({
    cyrillic: "млеко",
    gender: "n",
    english: "milk",
    topic: "food",
    pos: n,
    mnemonic: "млеко ↔ 'milk' / German 'Milch'.",
    examples: [
      {
        cyrillic: "Деца пију млеко свако јутро.",
        english: "Children drink milk every morning.",
      },
    ],
  }),
  word({
    cyrillic: "сок",
    gender: "m",
    english: "juice",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Наручио сам сок од јабуке.",
        english: "I ordered apple juice.",
      },
    ],
  }),
  word({
    cyrillic: "пиво",
    gender: "n",
    english: "beer",
    topic: "food",
    pos: n,
    mnemonic: "From пити ('to drink') — beer is simply 'the drink'.",
    examples: [
      {
        cyrillic: "Хладно пиво прија лети.",
        english: "Cold beer is nice in summer.",
      },
    ],
  }),
  word({
    cyrillic: "вино",
    gender: "n",
    english: "wine",
    topic: "food",
    pos: n,
    mnemonic: "вино ↔ 'wine' / Latin 'vinum'.",
    examples: [
      {
        cyrillic: "Уз вечеру служе црвено вино.",
        english: "They serve red wine with dinner.",
      },
    ],
  }),
  word({
    cyrillic: "хлеб",
    gender: "m",
    english: "bread",
    topic: "food",
    pos: n,
    mnemonic: "хлеб ↔ English 'loaf' (both from an old Germanic word).",
    examples: [
      {
        cyrillic: "Купи свеж хлеб у пекари.",
        english: "Buy fresh bread at the bakery.",
      },
    ],
  }),
  word({
    cyrillic: "месо",
    gender: "n",
    english: "meat",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Не једем месо, ја сам вегетаријанац.",
        english: "I don't eat meat, I'm a vegetarian.",
      },
    ],
  }),
  word({
    cyrillic: "риба",
    gender: "f",
    english: "fish",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Риба је здрава и лагана.",
        english: "Fish is healthy and light.",
      },
    ],
  }),
  word({
    cyrillic: "сир",
    gender: "m",
    english: "cheese",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "На пијаци продају домаћи сир.",
        english: "At the market they sell homemade cheese.",
      },
    ],
  }),
  word({
    cyrillic: "путер",
    gender: "m",
    english: "butter",
    topic: "food",
    pos: n,
    mnemonic: "путер ↔ German 'Butter' / English 'butter'.",
    examples: [
      {
        cyrillic: "Намажи путер на хлеб.",
        english: "Spread butter on the bread.",
      },
    ],
  }),
  word({
    cyrillic: "јогурт",
    gender: "m",
    english: "yogurt",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Доручкујем јогурт и воће.",
        english: "I have yogurt and fruit for breakfast.",
      },
    ],
  }),
  word({
    cyrillic: "јаје",
    gender: "n",
    english: "egg",
    topic: "food",
    pos: n,
    mnemonic: "јаје ↔ Latin 'ovum' (oval, ovary) — both mean 'egg'.",
    examples: [
      {
        cyrillic: "Скувао сам јаје за доручак.",
        english: "I boiled an egg for breakfast.",
      },
    ],
  }),
  word({
    cyrillic: "со",
    gender: "f",
    english: "salt",
    topic: "food",
    pos: n,
    mnemonic: "со ↔ Latin 'sal' / 'salt' — the л reappears in соли (gen.).",
    examples: [
      {
        cyrillic: "Додај мало соли у супу.",
        english: "Add a little salt to the soup.",
      },
    ],
  }),
  word({
    cyrillic: "бибер",
    gender: "m",
    english: "pepper (spice)",
    topic: "food",
    pos: n,
    mnemonic: "бибер ↔ Latin 'piper' ('pepper').",
    examples: [
      {
        cyrillic: "Зачини јело бибером.",
        english: "Season the dish with pepper.",
      },
    ],
  }),
  word({
    cyrillic: "шећер",
    gender: "m",
    english: "sugar",
    topic: "food",
    pos: n,
    mnemonic: "шећер ↔ 'sugar' — both from Sanskrit 'śarkarā' via Persian.",
    examples: [
      {
        cyrillic: "Пијем кафу без шећера.",
        english: "I drink coffee without sugar.",
      },
    ],
  }),
  word({
    cyrillic: "уље",
    gender: "n",
    english: "oil",
    topic: "food",
    pos: n,
    mnemonic: "уље ↔ Latin 'oleum' ('oil', oleo-).",
    examples: [
      {
        cyrillic: "Маслиново уље је здраво.",
        english: "Olive oil is healthy.",
      },
    ],
  }),
  word({
    cyrillic: "брашно",
    gender: "n",
    english: "flour",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "За колач су потребни брашно и јаја.",
        english: "For the cake you need flour and eggs.",
      },
    ],
  }),
  word({
    cyrillic: "пиринач",
    gender: "m",
    english: "rice",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Кувај пиринач десет минута.",
        english: "Cook the rice for ten minutes.",
      },
    ],
  }),
  word({
    cyrillic: "супа",
    gender: "f",
    english: "soup",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Топла супа греје зими.",
        english: "Warm soup warms you up in winter.",
      },
    ],
  }),
  word({
    cyrillic: "мед",
    gender: "m",
    english: "honey",
    topic: "food",
    pos: n,
    mnemonic:
      "мед ↔ English 'mead', the honey-wine — but мед means the honey itself.",
    examples: [
      {
        cyrillic: "Стави мед уместо шећера.",
        english: "Add honey instead of sugar.",
      },
    ],
  }),
  word({
    cyrillic: "колач",
    gender: "m",
    english: "cake / pastry",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Бака је испекла колач.",
        english: "Grandma baked a cake.",
      },
    ],
  }),
  word({
    cyrillic: "чоколада",
    gender: "f",
    english: "chocolate",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Деца обожавају чоколаду.",
        english: "Children adore chocolate.",
      },
    ],
  }),
  word({
    cyrillic: "сладолед",
    gender: "m",
    english: "ice cream",
    topic: "food",
    pos: n,
    mnemonic: "слад- ('sweet') + лед ('ice') — literally 'sweet-ice'.",
    examples: [
      {
        cyrillic: "Лети једемо сладолед.",
        english: "In summer we eat ice cream.",
      },
    ],
  }),
  word({
    cyrillic: "кекс",
    gender: "m",
    english: "cookie / biscuit",
    topic: "food",
    pos: n,
    mnemonic: "Borrowed from English 'cakes' — reshaped into one word.",
    examples: [
      {
        cyrillic: "Уз чај волим кекс.",
        english: "I like a biscuit with tea.",
      },
    ],
  }),
  word({
    cyrillic: "воће",
    gender: "n",
    english: "fruit",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Свеже воће је пуно витамина.",
        english: "Fresh fruit is full of vitamins.",
      },
    ],
  }),
  word({
    cyrillic: "јабука",
    gender: "f",
    english: "apple",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Једна јабука дневно је здрава.",
        english: "An apple a day is healthy.",
      },
    ],
  }),
  word({
    cyrillic: "банана",
    gender: "f",
    english: "banana",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Мајмуни воле банане.",
        english: "Monkeys love bananas.",
      },
    ],
  }),
  word({
    cyrillic: "поморанџа",
    gender: "f",
    english: "orange (fruit)",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Исцедио сам поморанџу за сок.",
        english: "I squeezed an orange for juice.",
      },
    ],
  }),
  word({
    cyrillic: "лимун",
    gender: "m",
    english: "lemon",
    topic: "food",
    pos: n,
    mnemonic: "лимун ↔ 'lemon' — both via Arabic 'laymūn'.",
    examples: [
      {
        cyrillic: "Додај кришку лимуна у чај.",
        english: "Add a slice of lemon to the tea.",
      },
    ],
  }),
  word({
    cyrillic: "грожђе",
    gender: "n",
    english: "grapes",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Од грожђа се прави вино.",
        english: "Wine is made from grapes.",
      },
    ],
  }),
  word({
    cyrillic: "јагода",
    gender: "f",
    english: "strawberry",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Јагоде зру у мају.",
        english: "Strawberries ripen in May.",
      },
    ],
  }),
  word({
    cyrillic: "трешња",
    gender: "f",
    english: "cherry",
    topic: "food",
    pos: n,
    mnemonic: "трешња ↔ 'cherry' / Latin 'cerasus'.",
    examples: [
      {
        cyrillic: "Трешње су слатке и црвене.",
        english: "Cherries are sweet and red.",
      },
    ],
  }),
  word({
    cyrillic: "крушка",
    gender: "f",
    english: "pear",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Ова крушка је сочна.",
        english: "This pear is juicy.",
      },
    ],
  }),
  word({
    cyrillic: "шљива",
    gender: "f",
    english: "plum",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Од шљива се прави ракија.",
        english: "Rakija is made from plums.",
      },
    ],
  }),
  word({
    cyrillic: "лубеница",
    gender: "f",
    english: "watermelon",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Лети је лубеница освежавајућа.",
        english: "In summer watermelon is refreshing.",
      },
    ],
  }),
  word({
    cyrillic: "поврће",
    gender: "n",
    english: "vegetables",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Поврће је богато влакнима.",
        english: "Vegetables are rich in fiber.",
      },
    ],
  }),
  word({
    cyrillic: "кромпир",
    gender: "m",
    english: "potato",
    topic: "food",
    pos: n,
    mnemonic:
      "кромпир ↔ German dialect 'Grundbirne' — literally a 'ground-pear'.",
    examples: [
      {
        cyrillic: "Испекли смо кромпир у рерни.",
        english: "We baked potatoes in the oven.",
      },
    ],
  }),
  word({
    cyrillic: "парадајз",
    gender: "m",
    english: "tomato",
    topic: "food",
    pos: n,
    mnemonic: "парадајз ↔ Austrian German 'Paradeiser' — a 'paradise apple'.",
    examples: [
      {
        cyrillic: "Зрео парадајз је сладак.",
        english: "A ripe tomato is sweet.",
      },
    ],
  }),
  word({
    cyrillic: "краставац",
    gender: "m",
    english: "cucumber",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Краставац иде у салату.",
        english: "Cucumber goes in the salad.",
      },
    ],
  }),
  word({
    cyrillic: "паприка",
    gender: "f",
    english: "pepper (vegetable)",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Пуњена паприка је традиционално јело.",
        english: "Stuffed pepper is a traditional dish.",
      },
    ],
  }),
  word({
    cyrillic: "лук",
    gender: "m",
    english: "onion",
    topic: "food",
    pos: n,
    mnemonic: "Looks like English 'luck', but лук means 'onion'.",
    examples: [
      {
        cyrillic: "Лук ме тера на сузе.",
        english: "Onion makes me cry.",
      },
    ],
  }),
  word({
    cyrillic: "шаргарепа",
    gender: "f",
    english: "carrot",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Зечеви грицкају шаргарепу.",
        english: "Rabbits nibble carrots.",
      },
    ],
  }),
  word({
    cyrillic: "купус",
    gender: "m",
    english: "cabbage",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Сарма се прави од купуса.",
        english: "Sarma is made from cabbage.",
      },
    ],
  }),
  word({
    cyrillic: "пасуљ",
    gender: "m",
    english: "beans",
    topic: "food",
    pos: n,
    examples: [
      {
        cyrillic: "Пасуљ је омиљено зимско јело.",
        english: "Beans are a favorite winter dish.",
      },
    ],
  }),
];
