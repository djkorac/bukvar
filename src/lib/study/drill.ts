/**
 * The shared multiple-choice machinery behind every recognition exercise: the
 * alphabet drill, the placement test's vocabulary probes, and topic practice.
 * Pure functions with an injectable RNG so each consumer stays unit-testable;
 * callers omit `rng` to get `Math.random`.
 */

export type Rng = () => number;

/** Fisher-Yates shuffle with an injectable RNG (does not mutate the input). */
export const shuffle = <T>(items: T[], rng: Rng = Math.random): T[] => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

/**
 * Options for one question: the correct answer plus up to `optionCount - 1`
 * distractor values, shuffled together. Distractors are deduplicated by
 * *value* (never the answer, never each other), which matters for word
 * glosses, where distinct entries can share an English gloss (letter Latin
 * forms are unique, so there dedup merely excludes the answer itself).
 *
 * `pools` are tried in priority order: earlier pools are exhausted (in
 * shuffled order) before later ones are drawn from, so a caller can prefer
 * same-topic distractors and fall back to the whole corpus. Short pools yield
 * fewer options, never duplicates.
 */
export const buildOptions = <T>(
  answer: string,
  pools: T[][],
  toValue: (item: T) => string,
  optionCount: number,
  rng: Rng = Math.random,
): string[] => {
  const want = Math.max(0, optionCount - 1);
  const seen = new Set([answer]);
  const distractors: string[] = [];
  for (const pool of pools) {
    if (distractors.length >= want) break;
    for (const item of shuffle(pool, rng)) {
      if (distractors.length >= want) break;
      const value = toValue(item);
      if (seen.has(value)) continue;
      seen.add(value);
      distractors.push(value);
    }
  }
  return shuffle([answer, ...distractors], rng);
};
