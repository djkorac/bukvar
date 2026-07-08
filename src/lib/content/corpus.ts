import { alphabet } from "~/data/alphabet";
import { LEVELS } from "~/data/levels";
import { TOPIC_PAGES, type TopicPage } from "~/data/topic-pages";
import { words } from "~/data/words";
import type {
  CardKind,
  LetterEntry,
  Topic,
  WordEntry,
} from "~/lib/content/types";

/**
 * Read-only queries over the corpus that power the static dictionary pages and
 * their cross-linking (word ↔ the letters that spell it, letter ↔ the words
 * that use it). Pure functions over the seed data: no storage, no UI.
 */

/** URL slug for a letter, e.g. `letter-be` → `be` (route: /alphabet/be). */
export const letterSlug = (id: string): string => id.replace(/^letter-/, "");

/** URL slug for a word, e.g. `word-zdravo` → `zdravo` (route: /words/zdravo). */
export const wordSlug = (id: string): string => id.replace(/^word-/, "");

const byLetterSlug = new Map(alphabet.map((l) => [letterSlug(l.id), l]));
const byWordSlug = new Map(words.map((w) => [wordSlug(w.id), w]));
const byLetterId = new Map(alphabet.map((l) => [l.id, l]));
const byWordId = new Map(words.map((w) => [w.id, w]));
const byWordCyrillic = new Map(words.map((w) => [w.cyrillic, w]));
const byCyrillicLower = new Map(alphabet.map((l) => [l.cyrillicLower, l]));

export const getLetterBySlug = (slug: string): LetterEntry | undefined =>
  byLetterSlug.get(slug);

export const getWordBySlug = (slug: string): WordEntry | undefined =>
  byWordSlug.get(slug);

/** Resolve a stored card's raw id (`letter-…` / `word-…`) to its corpus entry. */
export const getLetterById = (id: string): LetterEntry | undefined =>
  byLetterId.get(id);

export const getWordById = (id: string): WordEntry | undefined =>
  byWordId.get(id);

/** A word entry by its exact Cyrillic spelling. Resolves an aspect `pair` to
 * its headword. Last entry wins on the rare spelling collision (e.g. сто
 * numeral/noun); a words.test.ts guard keeps every `pair` target unambiguous so
 * this caller never hits one. */
export const getWordByCyrillic = (cyrillic: string): WordEntry | undefined =>
  byWordCyrillic.get(cyrillic);

/**
 * The static detail page for a stored card (letter or word), by its id: the
 * surface that explains the item (mnemonic, examples, letter↔word links). Lets
 * any kind+id list (the leech list, the reviewer) link a card to a closer look.
 */
export const cardHref = (kind: CardKind, itemId: string): string =>
  kind === "letter"
    ? `/alphabet/${letterSlug(itemId)}`
    : `/words/${wordSlug(itemId)}`;

/** Distinct letters appearing in a word's Cyrillic spelling, in reading order. */
export const lettersInWord = (word: WordEntry): LetterEntry[] => {
  const seen = new Set<string>();
  const out: LetterEntry[] = [];
  for (const ch of word.cyrillic.toLowerCase()) {
    const letter = byCyrillicLower.get(ch);
    if (letter && !seen.has(letter.id)) {
      seen.add(letter.id);
      out.push(letter);
    }
  }
  return out;
};

/** Starter words whose Cyrillic spelling contains the given letter. */
export const wordsWithLetter = (letter: LetterEntry): WordEntry[] =>
  words.filter((w) => w.cyrillic.toLowerCase().includes(letter.cyrillicLower));

/** Words in any of the given topics, in curriculum (`rank`) order. */
export const wordsForTopics = (topics: Topic[]): WordEntry[] => {
  // `words` is built rank-ascending (data/words/index.ts) and filter preserves
  // order, so no re-sort is needed here.
  const set = new Set(topics);
  return words.filter((w) => set.has(w.topic));
};

// Each topic is owned by at most one page (asserted in topic-pages.test.ts), so
// this flat map is unambiguous. Used by the /words hub to link each themed
// group heading to its landing page.
const topicPageByTopic = new Map<Topic, TopicPage>(
  TOPIC_PAGES.flatMap((page) => page.topics.map((t) => [t, page] as const)),
);

/** The landing page that owns a topic, if any (`grammar` etc. have none). */
export const topicPageForTopic = (topic: Topic): TopicPage | undefined =>
  topicPageByTopic.get(topic);

/** A themed section of the /words dictionary hub. */
export interface DictionaryGroup {
  /** Section heading (English UI chrome). */
  label: string;
  /** The landing-page slug this section links to, if it has one. */
  slug?: string;
  /** The section's words, in curriculum (`rank`) order. */
  words: WordEntry[];
}

/**
 * The themed sections of the /words dictionary hub, grouped by the landing page
 * each {@link import("~/data/levels").Level} resolves to rather than per level.
 * The curriculum's core/overflow pacing split (`verbs-core` + `verbs`, and the
 * adjectives pair) collapses into the one page that lists both, so each heading
 * and its single link agree; page-less topics (`grammar`, `general`, `everyday`)
 * stay their own unlinked group. A group's position follows its first curriculum
 * appearance; words within it follow `rank` order. The alphabet (its own
 * /alphabet reference) and any wordless group are dropped.
 */
export const dictionaryGroups = (): DictionaryGroup[] => {
  const titleCase = (slug: string) =>
    slug.charAt(0).toUpperCase() + slug.slice(1);
  type Acc = { label: string; slug?: string; topics: Topic[] };
  const byKey = new Map<string, Acc>();
  const ordered: Acc[] = [];
  for (const level of LEVELS) {
    if (level.topic === "alphabet") continue;
    const slug = topicPageForTopic(level.topic)?.slug;
    const key = slug ?? level.topic;
    const existing = byKey.get(key);
    if (existing) {
      // A second level on one page is a merged core/overflow pair: use a
      // neutral, page-derived heading covering both ("Verbs"), not either
      // per-level name ("Common verbs"/"More verbs").
      existing.topics.push(level.topic);
      existing.label = titleCase(key);
    } else {
      const group: Acc = { label: level.name, slug, topics: [level.topic] };
      byKey.set(key, group);
      ordered.push(group);
    }
  }
  return ordered
    .map(({ label, slug, topics }) => ({
      label,
      slug,
      words: wordsForTopics(topics),
    }))
    .filter((g) => g.words.length > 0);
};
