import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import type { BackupFile } from "../src/lib/db/backup";
import { skipPlacement, startFresh } from "./helpers";

/**
 * The data-safety round-trip: in a local-first app IndexedDB is the only copy
 * of a learner's progress, and export/import is the only way to keep or move
 * it. Earn some progress, export it, factory-reset, import the same file, and
 * the progress must be back. The unit suite covers serialize/parse/import on
 * fake-indexeddb (`lib/db/backup.test.ts`); this covers the seam it can't
 * (the real file download, the file-input upload, the `window.confirm` gates,
 * and `resetAllData` re-running onboarding) in the built bundle.
 */

test.beforeEach(async ({ page }) => {
  await startFresh(page);
});

test("round-trips progress through export, reset, and import", async ({
  page,
}, testInfo) => {
  // Onboard and earn real progress: card 1 typed correctly, card 2 declined.
  // Two cards with review history is what the round-trip must preserve.
  await skipPlacement(page);
  await page.getByPlaceholder("Type the Latin letter").fill("a");
  await page.getByRole("button", { name: /Check/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /I don't know/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  // Anchored: after card 1 (typed) and card 2 (declined) the reviewer is on
  // card 3; its sr-only live region voices "Card 3 of {batchSize}: В, в". The
  // assertion pins only the position; the total floats with the batch size.
  await expect(page.getByText(/^Card 3 of \d+$/)).toBeVisible();

  // Export from settings, capturing the real browser download.
  await page.goto("/settings");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export progress" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(
    /^bukvar-backup-\d{4}-\d{2}-\d{2}\.json$/,
  );
  await expect(page.getByText("Backup downloaded.")).toBeVisible();

  // The exported file must be a valid backup carrying exactly the progress
  // made: two reviewed cards, their review log, and the onboarded flag.
  const file = testInfo.outputPath("bukvar-backup.json");
  await download.saveAs(file);
  const backup = JSON.parse(readFileSync(file, "utf-8")) as BackupFile;
  expect(backup.format).toBe("bukvar-backup");
  expect(backup.version).toBe(1);
  expect(backup.cards.length).toBeGreaterThan(0);
  expect(backup.cards.filter((c) => c.fsrs.reps > 0)).toHaveLength(2);
  expect(backup.reviews.length).toBeGreaterThanOrEqual(2);
  expect(backup.settings).toContainEqual({ key: "onboarded", value: true });

  // Factory reset, behind its confirm. Settings are wiped too, so /app must
  // re-run first-run onboarding; the placement intro is back.
  let resetConfirm = "";
  page.once("dialog", (dialog) => {
    resetConfirm = dialog.message();
    void dialog.accept();
  });
  await page.getByRole("button", { name: "Reset everything" }).click();
  await page.waitForURL("**/app");
  expect(resetConfirm).toContain("Reset everything to a clean slate?");
  await expect(
    page.getByRole("button", { name: "Take the check" }),
  ).toBeVisible();

  // Import the exported file (the input is hidden behind the label, so set it
  // directly), behind its own confirm.
  await page.goto("/settings");
  let importConfirm = "";
  page.once("dialog", (dialog) => {
    importConfirm = dialog.message();
    void dialog.accept();
  });
  await page.locator('input[type="file"]').setInputFiles(file);
  await expect(
    page.getByText("Progress imported. Reload to see it."),
  ).toBeVisible();
  expect(importConfirm).toMatch(/Import \d+ cards\?/);

  // The progress is back: onboarding stays done (settings restored) and the
  // reviewer resumes a session instead of starting over.
  await page.goto("/app");
  await expect(page.getByText("Take the check")).toHaveCount(0);
  await expect(
    page
      .getByText(/^Card \d+ of \d+$/)
      .or(page.getByText("Свака част!"))
      .first(),
  ).toBeVisible();

  // And the card rows themselves round-tripped: the two reviewed cards are in
  // real IndexedDB again; a fresh re-seed would have zero.
  const progressed = await page.evaluate(
    () =>
      new Promise<number>((resolve, reject) => {
        const open = indexedDB.open("bukvar");
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const db = open.result;
          const req = db.transaction("cards").objectStore("cards").getAll();
          req.onerror = () => {
            db.close();
            reject(req.error);
          };
          req.onsuccess = () => {
            const count = req.result.filter((c) => c.fsrs.reps > 0).length;
            db.close();
            resolve(count);
          };
        };
      }),
  );
  expect(progressed).toBe(2);
});
