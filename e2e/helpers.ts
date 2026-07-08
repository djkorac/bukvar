import { expect, type Page } from "@playwright/test";

/**
 * Start a test from a fresh IndexedDB at `/app`, so each run begins at
 * first-run onboarding rather than inheriting a previous run's deck.
 * (Playwright already isolates storage per test context, but be explicit: a
 * leaked DB would silently skip onboarding.)
 */
export async function startFresh(page: Page): Promise<void> {
  await page.goto("/app");
  await page.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        const req = indexedDB.deleteDatabase("bukvar");
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
        req.onblocked = () => resolve();
      }),
  );
  await page.reload();
}

/**
 * Complete first-run onboarding the quick way: skip the placement check and
 * start from the beginning with Cyrillic prompts, landing in the first lesson.
 */
export async function skipPlacement(page: Page): Promise<void> {
  await expect(
    page.getByRole("button", { name: "Take the check" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Skip" }).click();
  await page.getByRole("button", { name: /Ћирилица/ }).click();
}
