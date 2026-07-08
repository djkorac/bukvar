import { describe, expect, it } from "vitest";
import { TOPIC_PAGES, TOPICS_WITHOUT_PAGE } from "~/data/topic-pages";
import { words } from "~/data/words";
import { topicPageForTopic, wordsForTopics } from "~/lib/content/corpus";
import type { Topic } from "~/lib/content/types";

const corpusTopics = new Set<Topic>(words.map((w) => w.topic));
corpusTopics.add("alphabet");

describe("TOPIC_PAGES", () => {
  it("has unique slugs", () => {
    const slugs = TOPIC_PAGES.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("authors title, description and intro for every page", () => {
    for (const page of TOPIC_PAGES) {
      expect(page.title.length).toBeGreaterThan(0);
      expect(page.intro.length).toBeGreaterThan(0);
      // Keep the meta description a usable length: floored well below the real
      // 93-char minimum to catch an accidental stub/truncation without
      // constraining concise prose, capped at Google's ~160-char SERP cutoff.
      expect(page.description.length).toBeGreaterThanOrEqual(50);
      expect(page.description.length).toBeLessThanOrEqual(160);
      expect(page.topics.length).toBeGreaterThan(0);
    }
  });

  it("owns each topic by at most one page", () => {
    const owned = TOPIC_PAGES.flatMap((p) => p.topics);
    expect(new Set(owned).size).toBe(owned.length);
  });

  it("resolves to at least one word per page", () => {
    for (const page of TOPIC_PAGES) {
      expect(wordsForTopics(page.topics).length).toBeGreaterThan(0);
    }
  });

  it("partitions every corpus topic into a page or a deliberate exclusion", () => {
    const owned = TOPIC_PAGES.flatMap((p) => p.topics);
    const excluded = TOPICS_WITHOUT_PAGE;

    // No duplicates within the exclusions, and no topic both owned and excluded.
    expect(new Set(excluded).size).toBe(excluded.length);
    expect(owned.some((t) => excluded.includes(t))).toBe(false);

    // Together they cover the whole corpus exactly. Adding a new topic forces a
    // decision here (give it a page or exclude it) rather than silently dropping.
    expect(new Set([...owned, ...excluded])).toEqual(corpusTopics);
  });

  it("excludes the alphabet (it has its own /alphabet reference)", () => {
    expect(TOPICS_WITHOUT_PAGE).toContain("alphabet");
    expect(topicPageForTopic("alphabet")).toBeUndefined();
  });
});

describe("topicPageForTopic", () => {
  it("maps an owned topic to its page and an excluded one to undefined", () => {
    expect(topicPageForTopic("food")?.slug).toBe("food");
    expect(topicPageForTopic("people")?.slug).toBe("family");
    // Merged core/overflow both resolve to the same page.
    expect(topicPageForTopic("verbs-core")?.slug).toBe("verbs");
    expect(topicPageForTopic("verbs")?.slug).toBe("verbs");
    expect(topicPageForTopic("grammar")).toBeUndefined();
  });
});
