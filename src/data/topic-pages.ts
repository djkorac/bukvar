import type { Topic } from "~/lib/content/types";

/**
 * Curated **topic landing pages**: the public, crawlable "Serbian words for
 * food / family / travel" pages that target long-tail search intent. This is a
 * deliberately *selective* SEO layer over the corpus {@link Topic}s, not a
 * mechanical 1:1 mirror of {@link import("~/data/levels").LEVELS}:
 *
 * - The **alphabet** is excluded: it already has `/alphabet`.
 * - The grab-bag/grammatical topics (`grammar`, `general`, `everyday`) are
 *   excluded: they aren't a theme a learner searches for, and a bare list of
 *   them would be thin, low-intent content.
 * - The **core/overflow splits** are merged back together: `verbs-core` +
 *   `verbs` become one "Serbian verbs" page, same for adjectives. That split is
 *   a curriculum artifact (which slice is taught first), not a browsing
 *   taxonomy. Nobody searches for "more Serbian verbs".
 *
 * Each page carries hand-written, original `title`/`description`/`intro` prose
 * (never pasted from a source) so the page
 * is genuinely useful and not a thin duplicate of the `/words` index, which
 * already lists every word grouped by these same themes.
 *
 * Coverage is asserted in `topic-pages.test.ts`: every corpus topic is either
 * owned by exactly one page here or listed in {@link TOPICS_WITHOUT_PAGE}, so
 * adding a new topic forces a deliberate decision (give it a page or exclude it)
 * rather than silently dropping out of the SEO surface.
 */
export interface TopicPage {
  /** URL slug; the page lives at `/words/topics/{slug}`. */
  slug: string;
  /** `<h1>` and the meta/OG title (BaseLayout appends " — Bukvar"). */
  title: string;
  /** Meta description (~155 chars). Original prose. */
  description: string;
  /** On-page intro paragraph. Original prose; the page's unique, indexable text. */
  intro: string;
  /** The corpus topic(s) whose words this page lists, in curriculum order. */
  topics: Topic[];
}

export const TOPIC_PAGES: TopicPage[] = [
  {
    slug: "greetings",
    title: "Serbian greetings",
    description:
      "Essential Serbian greetings in Cyrillic and Latin — hello, goodbye, please and thank you — with pronunciation and example sentences.",
    intro:
      "The first words to learn in any language: how to say hello, goodbye, please and thank you in Serbian. Each greeting is shown in both Cyrillic and Latin script with its pronunciation and a short example.",
    topics: ["greetings"],
  },
  {
    slug: "phrases",
    title: "Common Serbian phrases",
    description:
      "Everyday Serbian phrases for getting by — yes, no, sorry, I don't understand — in both scripts with pronunciation.",
    intro:
      "Short, high-frequency phrases that carry a conversation: agreeing, apologising, asking someone to repeat themselves. These are the lines you reach for before you know any grammar.",
    topics: ["phrases"],
  },
  {
    slug: "pronouns",
    title: "Serbian pronouns",
    description:
      "Serbian personal pronouns — I, you, he, she, we, they — in Cyrillic and Latin with pronunciation and examples.",
    intro:
      "Serbian pronouns stand in for people and things: I, you, he, she, we, they, and the possessives. They turn up in almost every sentence, so they're worth learning early.",
    topics: ["pronouns"],
  },
  {
    slug: "questions",
    title: "Serbian question words",
    description:
      "Serbian question words — who, what, where, when, why, how — in both scripts with pronunciation and examples.",
    intro:
      "The question words — who, what, where, when, why and how — let you ask for anything you don't yet have the vocabulary to describe. A small set that opens up a lot of conversations.",
    topics: ["questions"],
  },
  {
    slug: "numbers",
    title: "Serbian numbers",
    description:
      "Count in Serbian: the numbers in Cyrillic and Latin with pronunciation and example sentences.",
    intro:
      "Counting in Serbian, from one upward, with the everyday numbers you need for prices, time and quantities. Shown in both scripts with pronunciation.",
    topics: ["numbers"],
  },
  {
    slug: "verbs",
    title: "Serbian verbs",
    description:
      "High-frequency Serbian verbs in the infinitive — to be, to have, to go, to want — in both scripts with pronunciation and examples.",
    intro:
      "The verbs that do the most work in Serbian: to be, to have, to go, to want, to know. They're listed in the infinitive — the form you'll find in a dictionary — with examples that show them in use.",
    topics: ["verbs-core", "verbs"],
  },
  {
    slug: "adjectives",
    title: "Serbian adjectives",
    description:
      "Common Serbian adjectives — big, small, good, new — in the masculine singular, with pronunciation and examples.",
    intro:
      "Describing words for size, quality and colour, given in the masculine singular form. Pair them with the nouns from the other lists to start building real sentences.",
    topics: ["adjectives-core", "adjectives"],
  },
  {
    slug: "colours",
    title: "Serbian colours",
    description:
      "The colours in Serbian — red, blue, green, yellow — in Cyrillic and Latin with pronunciation and examples.",
    intro:
      "The basic colours in Serbian, a compact and memorable set that's easy to drill. Each is shown in both scripts with its pronunciation.",
    topics: ["colours"],
  },
  {
    slug: "family",
    title: "Serbian words for family & people",
    description:
      "Serbian family and people vocabulary — mother, father, friend, child — in both scripts with pronunciation and examples.",
    intro:
      "The words for family members and the people around you: mother, father, brother, sister, friend, child. Among the first nouns most learners want, and the easiest to practise with people you know.",
    topics: ["people"],
  },
  {
    slug: "body",
    title: "Serbian words for the body",
    description:
      "Parts of the body in Serbian — head, hand, eye, heart — in Cyrillic and Latin with pronunciation and examples.",
    intro:
      "Parts of the body in Serbian, from head to hand. Useful at the doctor's, and a concrete set you can point to while you learn.",
    topics: ["body"],
  },
  {
    slug: "time",
    title: "Serbian words for time & days",
    description:
      "Telling time in Serbian — days of the week, today, tomorrow, hour — in both scripts with pronunciation.",
    intro:
      "Talking about time in Serbian: the days of the week, today and tomorrow, morning and night. The vocabulary for making plans and reading a schedule.",
    topics: ["time"],
  },
  {
    slug: "food",
    title: "Serbian words for food & drink",
    description:
      "Serbian food and drink vocabulary — bread, water, coffee, meat — in Cyrillic and Latin with pronunciation and examples.",
    intro:
      "Food and drink in Serbian, from bread and water to coffee and the dishes you'll meet at the table. Handy for shopping, ordering, and reading a menu.",
    topics: ["food"],
  },
  {
    slug: "home",
    title: "Serbian words for the home",
    description:
      "Household Serbian vocabulary — house, door, table, kitchen — in both scripts with pronunciation and examples.",
    intro:
      "The rooms and everyday objects of a home in Serbian: door, window, table, bed, kitchen. The names of the things immediately around you, which makes them easy to rehearse.",
    topics: ["home"],
  },
  {
    slug: "places",
    title: "Serbian words for places",
    description:
      "Serbian words for places around town — city, street, shop, station — in Cyrillic and Latin with pronunciation.",
    intro:
      "Places around town in Serbian: the city, the street, the shop, the station. The vocabulary for finding your way and saying where you're going.",
    topics: ["places"],
  },
  {
    slug: "travel",
    title: "Serbian travel vocabulary",
    description:
      "Serbian travel words — ticket, airport, hotel, bus — in both scripts with pronunciation and example sentences.",
    intro:
      "Words for getting around in Serbian: tickets and timetables, the airport, the bus, the hotel. The vocabulary a traveller reaches for first.",
    topics: ["travel"],
  },
  {
    slug: "clothing",
    title: "Serbian words for clothing",
    description:
      "Clothing vocabulary in Serbian — shirt, shoes, coat, dress — in Cyrillic and Latin with pronunciation.",
    intro:
      "What you wear, in Serbian: shirt, trousers, shoes, coat. Useful for shopping and for describing people.",
    topics: ["clothing"],
  },
  {
    slug: "animals",
    title: "Serbian words for animals",
    description:
      "Serbian animal names — dog, cat, bird, horse — in both scripts with pronunciation and example sentences.",
    intro:
      "The names of common animals in Serbian, from pets to farm and wild animals. A concrete, memorable set that's especially good for learning with children.",
    topics: ["animals"],
  },
  {
    slug: "nature",
    title: "Serbian words for nature & weather",
    description:
      "Serbian nature and weather words — sun, rain, tree, river — in Cyrillic and Latin with pronunciation.",
    intro:
      "The natural world and the weather in Serbian: sun and rain, tree and river, mountain and sea. Vocabulary for small talk and for the outdoors.",
    topics: ["nature"],
  },
  {
    slug: "directions",
    title: "Serbian words for directions",
    description:
      "Serbian directions — left, right, here, there, near — in both scripts with pronunciation and examples.",
    intro:
      "Giving and following directions in Serbian: left and right, here and there, near and far. A small set that's essential the moment you're lost.",
    topics: ["directions"],
  },
  {
    slug: "feelings",
    title: "Serbian words for feelings & ideas",
    description:
      "Serbian words for feelings and abstract ideas — happy, tired, love, fear — in both scripts with pronunciation.",
    intro:
      "Words for how you feel and the ideas behind them: happy and tired, love and fear. The vocabulary that lets a conversation move past the purely practical.",
    topics: ["feelings"],
  },
  {
    slug: "work",
    title: "Serbian words for work & jobs",
    description:
      "Serbian work and job vocabulary — work, office, money, boss — in Cyrillic and Latin with pronunciation.",
    intro:
      "The language of work in Serbian: the job itself, the office, colleagues and pay. Useful for introducing yourself and talking about your day.",
    topics: ["work"],
  },
  {
    slug: "school",
    title: "Serbian words for school & language",
    description:
      "Serbian school and language vocabulary — book, word, teacher, learn — in both scripts with pronunciation.",
    intro:
      "Vocabulary for school and for learning a language itself: book and word, teacher and student, to read and to write. The words you'll use to talk about studying Serbian.",
    topics: ["school"],
  },
  {
    slug: "money",
    title: "Serbian words for money & shopping",
    description:
      "Serbian money and shopping vocabulary — price, to buy, cheap, store — in both scripts with pronunciation.",
    intro:
      "Money and shopping in Serbian: prices and paying, buying and selling, cheap and expensive. The vocabulary for the market and the checkout.",
    topics: ["money"],
  },
  {
    slug: "tech",
    title: "Serbian words for technology",
    description:
      "Serbian technology vocabulary — phone, computer, internet — in Cyrillic and Latin with pronunciation.",
    intro:
      "Everyday technology in Serbian: the phone, the computer, the internet. Modern words you'll see on screens and hear in ordinary conversation.",
    topics: ["tech"],
  },
];

/**
 * Corpus topics that deliberately have **no** landing page, with the reason.
 * Together with the topics owned by {@link TOPIC_PAGES} these must cover every
 * corpus topic exactly once (asserted in `topic-pages.test.ts`).
 */
export const TOPICS_WITHOUT_PAGE: Topic[] = [
  "alphabet", // has its own reference at /alphabet
  "grammar", // function words; not a theme a learner searches for
  "general", // abstract grab-bag; low search intent, would read as thin
  "everyday", // grab-bag of leftovers; same
];
