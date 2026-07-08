import { word } from "~/lib/content/word";

const a = "adjective" as const;

export const adjectives = [
  // Value & relation
  word({
    cyrillic: "богат",
    english: "rich",
    accept: ["wealthy"],
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Његов ујак је богат.",
        english: "His uncle is rich.",
      },
    ],
  }),
  word({
    cyrillic: "сиромашан",
    english: "poor",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Тај крај је сиромашан.",
        english: "That area is poor.",
      },
    ],
  }),
  word({
    cyrillic: "скуп",
    english: "expensive",
    accept: ["pricey", "costly"],
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Овај телефон је скуп.",
        english: "This phone is expensive.",
      },
    ],
  }),
  word({
    cyrillic: "јефтин",
    english: "cheap",
    accept: ["inexpensive"],
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Овај хотел је јефтин.",
        english: "This hotel is cheap.",
      },
    ],
  }),
  word({
    cyrillic: "важан",
    english: "important",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Овај састанак је важан.",
        english: "This meeting is important.",
      },
    ],
  }),
  word({
    cyrillic: "потребан",
    english: "necessary",
    accept: ["needed", "required"],
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Пасош је потребан за путовање.",
        english: "A passport is necessary for travel.",
      },
    ],
  }),
  word({
    cyrillic: "користан",
    english: "useful",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Овај алат је користан.",
        english: "This tool is useful.",
      },
    ],
  }),
  word({
    cyrillic: "познат",
    english: "famous / known",
    accept: ["well-known"],
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Он је познат глумац.",
        english: "He is a famous actor.",
      },
    ],
  }),
  word({
    cyrillic: "непознат",
    english: "unknown",
    topic: "adjectives",
    pos: a,
    mnemonic: "не- ('un-') + познат ('known') — Serbian's не- = English 'un-'.",
    examples: [
      {
        cyrillic: "Број је непознат.",
        english: "The number is unknown.",
      },
    ],
  }),
  word({
    cyrillic: "исти",
    english: "same",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Носимо исти капут.",
        english: "We're wearing the same coat.",
      },
    ],
  }),
  word({
    cyrillic: "сличан",
    english: "similar",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Твој план је сличан мом.",
        english: "Your plan is similar to mine.",
      },
    ],
  }),
  word({
    cyrillic: "различит",
    english: "different",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Сваки човек је различит.",
        english: "Every person is different.",
      },
    ],
  }),
  word({
    cyrillic: "обичан",
    english: "ordinary",
    accept: ["usual", "regular"],
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Био је то обичан дан.",
        english: "It was an ordinary day.",
      },
    ],
  }),
  word({
    cyrillic: "посебан",
    english: "special",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Данас је посебан дан.",
        english: "Today is a special day.",
      },
    ],
  }),
  word({
    cyrillic: "главни",
    english: "main",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Где је главни улаз?",
        english: "Where is the main entrance?",
      },
    ],
  }),
  word({
    cyrillic: "последњи",
    english: "last",
    accept: ["final"],
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Ово је последњи аутобус.",
        english: "This is the last bus.",
      },
    ],
  }),
  word({
    cyrillic: "цео",
    english: "whole / entire",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Појео је цео колач.",
        english: "He ate the whole cake.",
      },
    ],
  }),

  // Possibility & ease of understanding
  word({
    cyrillic: "могућ",
    english: "possible",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Тај исход је могућ.",
        english: "That outcome is possible.",
      },
    ],
  }),
  word({
    cyrillic: "немогућ",
    english: "impossible",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Тај задатак је немогућ.",
        english: "That task is impossible.",
      },
    ],
  }),
  word({
    cyrillic: "сигуран",
    english: "sure / safe",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Сигуран сам да ће доћи.",
        english: "I'm sure he'll come.",
      },
    ],
  }),
  word({
    cyrillic: "опасан",
    english: "dangerous",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Овај пут је опасан ноћу.",
        english: "This road is dangerous at night.",
      },
    ],
  }),
  word({
    cyrillic: "јасан",
    english: "clear",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Твој одговор је јасан.",
        english: "Your answer is clear.",
      },
    ],
  }),
  word({
    cyrillic: "једноставан",
    english: "simple",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Рецепт је једноставан.",
        english: "The recipe is simple.",
      },
    ],
  }),
  word({
    cyrillic: "компликован",
    english: "complicated",
    accept: ["complex"],
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Овај проблем је компликован.",
        english: "This problem is complicated.",
      },
    ],
  }),
  word({
    cyrillic: "занимљив",
    english: "interesting",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Филм је био занимљив.",
        english: "The movie was interesting.",
      },
    ],
  }),
  word({
    cyrillic: "досадан",
    english: "boring",
    accept: ["dull"],
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Састанак је био досадан.",
        english: "The meeting was boring.",
      },
    ],
  }),
  word({
    cyrillic: "смешан",
    english: "funny",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Његов виц је смешан.",
        english: "His joke is funny.",
      },
    ],
  }),
  word({
    cyrillic: "озбиљан",
    english: "serious",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Ово је озбиљан проблем.",
        english: "This is a serious problem.",
      },
    ],
  }),
  word({
    cyrillic: "пријатан",
    english: "pleasant",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Његов осмех је пријатан.",
        english: "His smile is pleasant.",
      },
    ],
  }),
  word({
    cyrillic: "модеран",
    english: "modern",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Њихов стан је модеран.",
        english: "Their apartment is modern.",
      },
    ],
  }),

  // Taste
  word({
    cyrillic: "укусан",
    english: "tasty",
    accept: ["delicious"],
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Ручак је био укусан.",
        english: "Lunch was tasty.",
      },
    ],
  }),
  word({
    cyrillic: "сладак",
    english: "sweet",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Овај колач је сладак.",
        english: "This cake is sweet.",
      },
    ],
  }),
  word({
    cyrillic: "горак",
    english: "bitter",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Лек је горак.",
        english: "The medicine is bitter.",
      },
    ],
  }),
  word({
    cyrillic: "кисео",
    english: "sour",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Овај јогурт је кисео.",
        english: "This yogurt is sour.",
      },
    ],
  }),
  word({
    cyrillic: "слан",
    english: "salty",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Сир је превише слан.",
        english: "The cheese is too salty.",
      },
    ],
  }),
  word({
    cyrillic: "љут",
    english: "spicy / angry",
    topic: "adjectives",
    pos: a,
    mnemonic: "Means both 'spicy' (food) and 'angry' (a person).",
    examples: [
      {
        cyrillic: "Овај сос је љут.",
        english: "This sauce is spicy.",
      },
    ],
  }),

  // More qualities
  word({
    cyrillic: "танак",
    english: "thin",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Лед на језеру је танак.",
        english: "The ice on the lake is thin.",
      },
    ],
  }),
  word({
    cyrillic: "густ",
    english: "dense / thick",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Дим је био густ.",
        english: "The smoke was thick.",
      },
    ],
  }),
  word({
    cyrillic: "свеж",
    english: "fresh",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Овај хлеб је свеж.",
        english: "This bread is fresh.",
      },
    ],
  }),
  word({
    cyrillic: "зрео",
    english: "ripe / mature",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Овај плод је зрео.",
        english: "This fruit is ripe.",
      },
    ],
  }),
  word({
    cyrillic: "сиров",
    english: "raw",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Овај кромпир је још сиров.",
        english: "This potato is still raw.",
      },
    ],
  }),
  word({
    cyrillic: "печен",
    english: "baked / roasted",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Хлеб је свеже печен.",
        english: "The bread is freshly baked.",
      },
    ],
  }),
  word({
    cyrillic: "покварен",
    english: "broken / spoiled",
    accept: ["rotten"],
    topic: "adjectives",
    pos: a,
    mnemonic: "Means both 'broken' (a machine) and 'spoiled' (food).",
    examples: [
      {
        cyrillic: "Фрижидер је покварен.",
        english: "The fridge is broken.",
      },
    ],
  }),
  word({
    cyrillic: "чудан",
    english: "strange",
    accept: ["weird", "odd"],
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Чуо сам чудан звук.",
        english: "I heard a strange sound.",
      },
    ],
  }),
  word({
    cyrillic: "стваран",
    english: "real",
    accept: ["actual", "genuine"],
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Његов страх је сасвим стваран.",
        english: "His fear is completely real.",
      },
    ],
  }),
  word({
    cyrillic: "тачан",
    english: "correct / accurate",
    accept: ["right"],
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Твој одговор је тачан.",
        english: "Your answer is correct.",
      },
    ],
  }),
  word({
    cyrillic: "погрешан",
    english: "wrong",
    accept: ["incorrect"],
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Овај број је погрешан.",
        english: "This number is wrong.",
      },
    ],
  }),
  word({
    cyrillic: "чест",
    english: "frequent",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Снег је чест зими.",
        english: "Snow is frequent in winter.",
      },
    ],
  }),
  word({
    cyrillic: "редак",
    english: "rare",
    accept: ["uncommon"],
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Овај цвет је редак.",
        english: "This flower is rare.",
      },
    ],
  }),
  word({
    cyrillic: "згодан",
    english: "good-looking / handy",
    topic: "adjectives",
    pos: a,
    mnemonic: "Means both 'good-looking' and 'handy / convenient'.",
    examples: [
      {
        cyrillic: "Он је згодан момак.",
        english: "He is a good-looking guy.",
      },
    ],
  }),
  word({
    cyrillic: "нормалан",
    english: "normal",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "То је сасвим нормалан осећај.",
        english: "That's a completely normal feeling.",
      },
    ],
  }),
  word({
    cyrillic: "природан",
    english: "natural",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Овај сок је потпуно природан.",
        english: "This juice is completely natural.",
      },
    ],
  }),
  word({
    cyrillic: "општи",
    english: "general",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Постоји општи интерес за то.",
        english: "There is a general interest in it.",
      },
    ],
  }),
  word({
    cyrillic: "личан",
    english: "personal",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Овај податак је личан.",
        english: "This piece of information is personal.",
      },
    ],
  }),
  word({
    cyrillic: "приватан",
    english: "private",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Ово је приватан разговор.",
        english: "This is a private conversation.",
      },
    ],
  }),
  word({
    cyrillic: "јаван",
    english: "public",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Парк је јаван простор.",
        english: "A park is a public space.",
      },
    ],
  }),
  word({
    cyrillic: "званичан",
    english: "official",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Ово је званичан документ.",
        english: "This is an official document.",
      },
    ],
  }),
  word({
    cyrillic: "доњи",
    english: "lower",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Доњи спрат је празан.",
        english: "The lower floor is empty.",
      },
    ],
  }),
  word({
    cyrillic: "горњи",
    english: "upper",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Горњи спрат има терасу.",
        english: "The upper floor has a terrace.",
      },
    ],
  }),
  word({
    cyrillic: "предњи",
    english: "front",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Предњи ред је резервисан.",
        english: "The front row is reserved.",
      },
    ],
  }),
  word({
    cyrillic: "задњи",
    english: "rear / back",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Задњи точак је нов.",
        english: "The rear wheel is new.",
      },
    ],
  }),
  word({
    cyrillic: "глув",
    english: "deaf",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Деда је мало глув.",
        english: "Grandpa is a bit deaf.",
      },
    ],
  }),
  word({
    cyrillic: "слеп",
    english: "blind",
    topic: "adjectives",
    pos: a,
    examples: [
      {
        cyrillic: "Његов пас је слеп на једно око.",
        english: "His dog is blind in one eye.",
      },
    ],
  }),
];
