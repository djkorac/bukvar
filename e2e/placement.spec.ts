import { expect, test } from "@playwright/test";
import { alphabet } from "../src/data/alphabet";
import { LEVELS } from "../src/data/levels";
import { SECTION_PROBES } from "../src/lib/study/placement";
import { startFresh } from "./helpers";

/**
 * The placement test, taken for real (the review-session spec only skips it):
 * a returning reader aces the script probes, declines every vocabulary probe,
 * and must come out placed past the alphabet (`markLevelKnown` writing real
 * card rows to IndexedDB) with the first lesson made of words, not letters.
 * The unit suite covers the probe/seeding logic (`lib/study/placement.ts`) in
 * isolation; this covers the island driving those writes in the built bundle.
 *
 * Probes are randomized, but every answer is computable: the script answer via
 * the corpus' 1:1 Cyrillic→Latin mapping, and the typed vocabulary probes via
 * the always-present "I don't know" decline.
 */

// Cyrillic→Latin for answering script probes off the displayed glyph.
const toLatin = new Map(alphabet.map((l) => [l.cyrillic, l.latin]));

test.beforeEach(async ({ page }) => {
  await startFresh(page);
});

test("places a Cyrillic reader past the alphabet and persists it", async ({
  page,
}) => {
  // ~95 deliberate question clicks; triple the default timeout.
  test.slow();

  await page.getByRole("button", { name: "Take the check" }).click();

  // Script axis: read each probe's glyph off the card and click its Latin
  // equivalent. Read the probe count from the header instead of hard-coding it.
  const header = page.getByText(/Reading check · \d+ of \d+/);
  await expect(header).toBeVisible();
  const probeTotal = Number(
    (await header.textContent())?.match(/of (\d+)/)?.[1],
  );
  expect(probeTotal).toBeGreaterThan(0);

  for (let i = 0; i < probeTotal; i++) {
    await expect(
      page.getByText(`Reading check · ${i + 1} of ${probeTotal}`),
    ).toBeVisible();
    // The glyph is the paragraph right after the "Which letter is this?"
    // label. Match the label exactly: the sr-only live region also contains
    // that phrase, so a substring match would resolve to two elements.
    const glyph = await page
      .getByText("Which letter is this?", { exact: true })
      .locator("xpath=following-sibling::p[1]")
      .textContent();
    const latin = toLatin.get(glyph?.trim() ?? "");
    expect(latin, `no Latin mapping for probe glyph ${glyph}`).toBeTruthy();
    // Option buttons read "<Latin> <keyboard digit>", e.g. "Lj 3".
    await page
      .getByRole("button", { name: new RegExp(`^${latin} \\d$`) })
      .click();
  }

  // Vocabulary axis: sections run in curriculum order, so the first is the
  // first word level. Decline every probe; no section may be marked known.
  const vocabHeader = page.getByText(
    new RegExp(`Vocabulary · topic 1 of \\d+ · ${LEVELS[1].name}`),
  );
  await expect(vocabHeader).toBeVisible();
  // Upper bound on declines: every topic sampled to its cap (short topics
  // sample fewer, so real runs need at most this many). Capping the clicks
  // turns a regression where decline stops advancing into a quick expect
  // failure below, instead of spinning to the tripled test timeout. When every
  // topic samples its full quota the run uses exactly maxDeclines clicks, so
  // the loop must allow that many and only then require the results screen.
  const topicTotal = Number(
    (await vocabHeader.textContent())?.match(/of (\d+)/)?.[1],
  );
  const maxDeclines = topicTotal * SECTION_PROBES;
  const decline = page.getByRole("button", { name: /^I don't know/ });
  const results = page.getByText("All set!");
  for (let i = 0; i < maxDeclines; i++) {
    await expect(decline.or(results).first()).toBeVisible();
    if (await results.isVisible()) break;
    await decline.click();
  }
  await expect(
    results,
    "vocab never reached results — decline stopped advancing",
  ).toBeVisible();

  // The verdict: reads Cyrillic, every vocabulary section failed, so the
  // projected start is the first word level with zero topics cleared.
  await expect(page.getByText("You can read Cyrillic")).toBeVisible();
  await expect(
    // Anchored: the island's sr-only live region voices the same sentence.
    page.getByText(
      new RegExp(`^We'll start you around Level 2 · ${LEVELS[1].name}\\.$`),
    ),
  ).toBeVisible();
  await expect(
    page.getByText(new RegExp(`You cleared 0 of ${LEVELS.length - 1} topics`)),
  ).toBeVisible();
  // The recap tallies a perfect reading section against the declined rest.
  await expect(page.getByText("How you did")).toBeVisible();
  await expect(
    page.getByText(new RegExp(`^${probeTotal} / \\d+ correct$`)),
  ).toBeVisible();

  // Start the session: the alphabet was seeded known (confirming reviews land
  // tomorrow onward, today stays clear), so the first lesson must be new word
  // cards: the word-prompt answer box, not the letter one.
  await page.getByRole("button", { name: "Start learning" }).click();
  await expect(page.getByText(/^Card 1 of \d+$/)).toBeVisible();
  await expect(
    page.getByPlaceholder("Type the meaning in English"),
  ).toBeVisible();

  // Reload: the placement result lives in IndexedDB, so onboarding must not
  // reappear and the reviewer must resume the word lesson.
  await page.reload();
  await expect(page.getByText("Take the check")).toHaveCount(0);
  await expect(page.getByText(/^Card \d+ of \d+$/)).toBeVisible();
  await expect(
    page.getByPlaceholder("Type the meaning in English"),
  ).toBeVisible();
});
