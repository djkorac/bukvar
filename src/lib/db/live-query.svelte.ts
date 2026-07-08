/**
 * Bridge a Dexie `liveQuery` to a Svelte 5 rune: a reactive `current` value that
 * re-emits on every write to the tables the querier touches, plus an `errored`
 * flag so a rejected read can't pass silently. The Svelte 5 equivalent of
 * dexie-react-hooks' `useLiveQuery`, spelled for runes (mirrors how
 * `drill-session.svelte.ts` is a composable rune module rather than a hook).
 *
 * A bare `liveQuery(...).subscribe(next)` (the shape three dashboard islands
 * had independently grown) supplies no error callback, so a rejected
 * IndexedDB read (private browsing, eviction, full quota) errors the
 * observable, terminates the subscription, and is swallowed, stranding the
 * widget on a fake "Loading…" forever. Worse, an errored liveQuery is *terminal*:
 * it does not auto-recover on the next write, so recovery needs an explicit
 * re-subscribe, which `retry()` provides. Wiring the error arm here once means
 * the next island can't forget it.
 *
 * Put all async in the `querier` (not in a `.subscribe` callback): liveQuery's
 * error channel then covers the whole read, and there is no stray unhandled
 * rejection. On error, `current` holds its last-good value (a brief staleness)
 * rather than snapping back to `initial`.
 *
 * Call during component init: it registers `onMount`, so the subscription is
 * browser-only (these islands are `client:only`) and is torn down on destroy.
 */
import { liveQuery } from "dexie";
import { onMount } from "svelte";

export interface LiveValue<T> {
  /** Latest emitted value; `initial` until the first emission, last-good after an error. */
  readonly current: T;
  /** True once the query has rejected. The subscription is then dormant until `retry()`. */
  readonly errored: boolean;
  /** Re-subscribe after an error. An idempotent re-read; safe to call when not errored. */
  retry(): void;
}

export function liveValue<T>(
  querier: () => T | Promise<T>,
  initial: T,
): LiveValue<T> {
  let current = $state(initial);
  let errored = $state(false);
  let sub: { unsubscribe(): void } | undefined;

  const start = (): void => {
    errored = false;
    sub = liveQuery(querier).subscribe(
      (value) => {
        current = value;
      },
      (err) => {
        console.error("liveQuery read failed", err);
        errored = true;
      },
    );
  };

  onMount(() => {
    start();
    return () => sub?.unsubscribe();
  });

  return {
    get current() {
      return current;
    },
    get errored() {
      return errored;
    },
    retry() {
      sub?.unsubscribe();
      start();
    },
  };
}
