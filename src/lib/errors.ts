/** Best-effort human-readable message from an unknown caught value. */
export const errorMessage = (e: unknown): string =>
  e instanceof Error ? e.message : String(e);
