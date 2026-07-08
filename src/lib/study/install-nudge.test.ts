import { describe, expect, it } from "vitest";
import {
  evaluateInstallNudge,
  INSTALL_NUDGE_DELAY_DAYS,
  INSTALL_NUDGE_SNOOZE_DAYS,
} from "~/lib/study/install-nudge";

const DAY = 86_400_000;
const NOW = new Date("2026-06-07T12:00:00").getTime();
const daysAgo = (n: number) => NOW - n * DAY;

describe("evaluateInstallNudge", () => {
  it("stays quiet when there's no study activity to protect", () => {
    const r = evaluateInstallNudge({
      now: NOW,
      firstActivityAt: null,
      snoozedAt: null,
    });
    expect(r.show).toBe(false);
  });

  it("stays quiet on the learner's very first day", () => {
    const r = evaluateInstallNudge({
      now: NOW,
      firstActivityAt: daysAgo(INSTALL_NUDGE_DELAY_DAYS - 0.5),
      snoozedAt: null,
    });
    expect(r.show).toBe(false);
  });

  it("nudges once the learner has come back past the delay", () => {
    const r = evaluateInstallNudge({
      now: NOW,
      firstActivityAt: daysAgo(INSTALL_NUDGE_DELAY_DAYS + 1),
      snoozedAt: null,
    });
    expect(r.show).toBe(true);
  });

  it("stays quiet during the snooze window after a dismissal", () => {
    const r = evaluateInstallNudge({
      now: NOW,
      firstActivityAt: daysAgo(200),
      snoozedAt: daysAgo(INSTALL_NUDGE_SNOOZE_DAYS - 1),
    });
    expect(r.show).toBe(false);
  });

  it("nudges again once the snooze window expires", () => {
    const r = evaluateInstallNudge({
      now: NOW,
      firstActivityAt: daysAgo(200),
      snoozedAt: daysAgo(INSTALL_NUDGE_SNOOZE_DAYS + 1),
    });
    expect(r.show).toBe(true);
  });
});
