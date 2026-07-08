import { expect, test } from "@playwright/test";
import { skipPlacement, startFresh } from "./helpers";

/**
 * One real end-to-end pass over the load-bearing surface: the reviewer island at
 * `/app`, driven through the production build in real Chromium against the
 * browser's own IndexedDB. The unit suite covers `lib/study` etc. in isolation
 * (on fake-indexeddb); this covers the seam those tests can't: Dexie + Svelte 5
 * runes + the DOM + real IndexedDB meeting in the built bundle.
 *
 * The path is the default beginner one (type mode, Cyrillic prompts): skip the
 * placement test, then clear the first lesson. The first card is typed correctly
 * (exercising the answer box, the matcher, and a ✓ on the recap scorecard) and
 * the rest are answered with "I don't know" (answer-independent, so no per-card
 * gloss is needed). Either way the full grade→persist→advance loop runs and
 * writes to IndexedDB for real.
 */

test.beforeEach(async ({ page }) => {
  await startFresh(page);
});

test("completes a first review session and persists onboarding", async ({
  page,
}) => {
  // First run lands on the placement test's intro. Skip the check and start
  // from the beginning with Cyrillic prompts.
  await skipPlacement(page);

  // The first lesson is one batch of new (letter) cards, the alphabet in azbuka
  // order, so card 1 is А → "a". Read the batch size from the counter instead of
  // hard-coding it.
  // Anchored: the reviewer's sr-only live region voices "Card 1 of 5: А, а",
  // so an unanchored match would hit both it and the visible counter.
  const counter = page.getByText(/^Card \d+ of \d+$/);
  await expect(counter).toBeVisible();
  const total = Number((await counter.textContent())?.match(/of (\d+)/)?.[1]);
  expect(total).toBeGreaterThan(0);

  // Card 1: type the correct Latin letter. Exercises the answer box + Check
  // submit + the matcher's "correct" verdict, and seeds a ✓ recap row.
  await page.getByPlaceholder("Type the Latin letter").fill("a");
  await page.getByRole("button", { name: /Check/ }).click();
  // Exact: the live region voices "Correct. The answer is a." at the same time.
  await expect(page.getByText("Correct", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Continue/ }).click();

  // The rest: skip with "I don't know", answer-independent.
  for (let i = 1; i < total; i++) {
    await page.getByRole("button", { name: /I don't know/ }).click();
    await page.getByRole("button", { name: /Continue/ }).click();
  }

  // The session-complete screen, confirming the grade→advance→done loop ran end
  // to end and the cards were actually graded (not just rendered).
  await expect(page.getByText("Свака част!")).toBeVisible();
  await expect(
    page.getByText(new RegExp(`You reviewed ${total} cards? this session`)),
  ).toBeVisible();

  // The end-of-session recap, tallying the one card we got right against the
  // batch: proof the typed answer flowed through to the scorecard.
  await expect(page.getByText("How you did")).toBeVisible();
  await expect(
    page.getByText(new RegExp(`1 / ${total} correct`)),
  ).toBeVisible();

  // Reload: onboarding was written to IndexedDB, so the placement test must not
  // reappear and the reviewer must resume past it. This is the real-IndexedDB
  // persistence assertion the fake-indexeddb unit tests can't make.
  await page.reload();
  await expect(page.getByText("Take the check")).toHaveCount(0);
  await expect(
    page
      .getByText("Свака част!")
      .or(page.getByText(/^Card \d+ of \d+$/))
      .first(),
  ).toBeVisible();
});

test("surfaces a failed undo on the done screen", async ({ page }) => {
  await skipPlacement(page);

  // Clear the whole first lesson so the last grade lands on the done screen with
  // its Undo button still live (a misclick on the session's last card lands
  // here, the only place the reviewing-branch commit-error alert isn't mounted).
  const counter = page.getByText(/^Card \d+ of \d+$/);
  await expect(counter).toBeVisible();
  const total = Number((await counter.textContent())?.match(/of (\d+)/)?.[1]);
  for (let i = 0; i < total; i++) {
    await page.getByRole("button", { name: /I don't know/ }).click();
    await page.getByRole("button", { name: /Continue/ }).click();
  }
  await expect(page.getByText("Свака част!")).toBeVisible();

  // Make the next IndexedDB write fail, as a mid-session quota/eviction error
  // would, so the undo's `rw` transaction aborts and rejects. undoGrade deletes
  // the review-log row, so breaking `delete` is enough; Dexie caches the native
  // `IDBDatabase.transaction` at open time, so overriding that wouldn't bite.
  await page.evaluate(() => {
    IDBObjectStore.prototype.delete = function (
      this: IDBObjectStore,
      _query: IDBValidKey | IDBKeyRange,
    ): IDBRequest {
      throw new DOMException("forced write failure", "InvalidStateError");
    };
  });

  // The failed undo must not be silent on the done screen: the alert renders by
  // the Undo button, which stays reinstated so the learner can retry.
  await page.getByRole("button", { name: /Undo last grade/ }).click();
  await expect(page.getByRole("alert")).toContainText(
    "We couldn't undo your last grade",
  );
  await expect(
    page.getByRole("button", { name: /Undo last grade/ }),
  ).toBeVisible();
});
