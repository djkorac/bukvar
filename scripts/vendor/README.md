# Vendored frequency list

`sr_50k.txt` is a **build-time asset only** — it feeds `scripts/freq-report.ts`,
an authoring-time report (`yarn freq:report`) that looks each corpus lemma up in
the list and prints coverage. Frequency is **not** a shipped property: the app
reads no per-word rank, so nothing is materialized into `src/data`, and this
list is imported by no bundle. It's a curation reference (e.g. judging which
verbs/adjectives are common enough for a "core" level).

## Provenance

- **Source:** [hermitdave/FrequencyWords](https://github.com/hermitdave/FrequencyWords)
- **File:** `content/2018/sr/sr_50k.txt` (Serbian, top 50,000 forms)
- **Derived from:** OpenSubtitles (via the OPUS project)
- **Retrieved:** 2026-06-05
- **Format:** one `surface_form count` per line, ranked most-frequent first
  (line _N_ = frequency rank _N_). Predominantly Serbian Latin; our Cyrillic
  lemmas are transliterated to match (`scripts/lib/freq-match.ts`).

## License

MIT — see `LICENSE.FrequencyWords`. MIT is compatible with this repo's GPL-3.0,
and imposes no attribution burden at runtime. We use the list purely as a
**frequency lookup** while authoring: no upstream prose is committed. This keeps
the corpus's "author, don't paste" guarantee intact (see the repo `CLAUDE.md`).

## Refreshing

Re-download the file above, then run `yarn freq:report` to see the updated
coverage against the current corpus.
