/**
 * PWA install affordance, framework-agnostic. The browser landscape splits three
 * ways and this module hides that split behind one small surface:
 *
 * - **Chromium** (most of Android + desktop Chrome/Edge) fires
 *   `beforeinstallprompt`, which we stash and replay from our own button, a true
 *   one-tap install.
 * - **iOS/iPadOS** Safari (and every iOS browser, since all are WebKit) exposes
 *   no install API at all: the only path is the user's Share → "Add to Home
 *   Screen", so the most we can do is *instruct*. Installing also happens to be
 *   the only way IndexedDB survives Safari's 7-day eviction (see `lib/db/persist`).
 * - **Everything else** (Firefox, desktop Safari's Add-to-Dock) has no in-page
 *   affordance worth showing.
 *
 * `beforeinstallprompt` can fire before any island hydrates, so the event is
 * captured by a tiny inline script in `BaseLayout.astro` (keyed off
 * {@link INSTALL_GLOBAL}) and read back here.
 */

/** Window property the BaseLayout inline capture script writes the stash to. */
export const INSTALL_GLOBAL = "__bukvarInstall";

/** Window event the capture script dispatches when the stash changes. */
export const INSTALL_CHANGE_EVENT = "bukvar:installchange";

/** The non-standard event Chromium fires when the app becomes installable. */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** Shape of the stash the inline capture script maintains on `window`. */
interface InstallStash {
  /** The deferred Chromium prompt, or null once consumed / never offered. */
  event: BeforeInstallPromptEvent | null;
  /** True once `appinstalled` has fired this session. */
  installed: boolean;
}

export type InstallPlatform = "chromium" | "ios" | "other";

export interface InstallState {
  /** A deferred Chromium prompt is available to replay from our own button. */
  canPrompt: boolean;
  /** Already running as an installed app (or `appinstalled` fired this session). */
  isStandalone: boolean;
  /** Coarse platform bucket that decides which affordance to render. */
  platform: InstallPlatform;
}

const getStash = (): InstallStash | null => {
  if (typeof window === "undefined") return null;
  const stash = (window as unknown as Record<string, InstallStash | undefined>)[
    INSTALL_GLOBAL
  ];
  return stash ?? null;
};

/** True when the app is launched from the home screen / an installed window. */
export const isStandalone = (): boolean => {
  if (typeof window === "undefined") return false;
  if (getStash()?.installed) return true;
  if (window.matchMedia?.("(display-mode: standalone)").matches) return true;
  // iOS Safari's non-standard flag (it has no display-mode: standalone support).
  return (
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
};

/** True for an iOS/iPadOS device, including iPadOS 13+, which reports as a Mac. */
const isIos = (): boolean => {
  if (typeof navigator === "undefined") return false;
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) return true;
  // A touch-capable "Mac" is really an iPad masquerading as desktop Safari.
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
};

const detectPlatform = (): InstallPlatform => {
  if (typeof window === "undefined") return "other";
  // A live or future Chromium prompt: the stash holds one, or the event exists on
  // this engine (so we can surface the button once it fires).
  if (getStash()?.event || "onbeforeinstallprompt" in window) return "chromium";
  if (isIos()) return "ios";
  return "other";
};

export const getInstallState = (): InstallState => ({
  canPrompt: !!getStash()?.event,
  isStandalone: isStandalone(),
  platform: detectPlatform(),
});

/**
 * Replay the stashed Chromium prompt. Resolves to the user's choice, or
 * `"unavailable"` when there's no deferred prompt (iOS, already installed, or it
 * was already consumed). The browser only lets a prompt be used once, so the
 * stash is cleared either way. Never rejects. A browser-side prompt failure
 * resolves to `"dismissed"` so callers always get a defined outcome.
 */
export const promptInstall = async (): Promise<
  "accepted" | "dismissed" | "unavailable"
> => {
  const stash = getStash();
  const event = stash?.event;
  if (!stash || !event) return "unavailable";
  stash.event = null;
  // Mirror the capture script: every stash mutation dispatches the change event,
  // so a `canPrompt` subscriber sees the prompt go away the moment it's consumed.
  window.dispatchEvent(new Event(INSTALL_CHANGE_EVENT));
  try {
    await event.prompt();
    const { outcome } = await event.userChoice;
    return outcome;
  } catch {
    // The engine can refuse to replay the deferred prompt (e.g. lost user-gesture
    // context). The stash is already cleared, so report a defined outcome rather
    // than rejecting, honouring the documented return contract.
    return "dismissed";
  }
};

/** Subscribe to install-state changes (a prompt arrived, or the app installed). */
export const onInstallChange = (callback: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(INSTALL_CHANGE_EVENT, callback);
  return () => window.removeEventListener(INSTALL_CHANGE_EVENT, callback);
};
