# Contributing to Bukvar

Thanks for helping build an open way to learn Serbian. The most valuable
contributions are **corpus fixes and additions** (words, mnemonics, example
sentences) and **bug fixes**.

## Setup

```sh
corepack enable      # Bukvar uses Yarn 4 via corepack
yarn install
yarn dev             # http://localhost:4321
```

Useful scripts: `yarn test`, `yarn typecheck`, `yarn lint`, `yarn fix`
(auto-format), `yarn build`, `yarn icons` (regenerate brand assets),
`yarn corpus:review` (export the whole corpus to `corpus-review.csv`).

## Adding or fixing words

The corpus lives in `src/data/words/<topic>.ts`, one file per topic. Each entry
uses the **`word()`** helper: you write only the meaning-bearing fields.

```ts
word({ cyrillic: "књига", english: "book", topic: "school" })
// derived: id "word-knjiga", latin "knjiga", ipa "/kɲiɡa/"
```

- **You only author `cyrillic`, `english`, `topic`** (+ optional `pos`). The
  Latin form, broad IPA, and id are derived in `src/lib/content/` so they can't
  drift.
- Overrides exist for rare cases: `latin`, `ipa` (e.g. to add an accent the
  rules can't infer), and `slug` (only when two words fold to the same id, e.g.
  кожа vs коза; see `word.ts`).
- Spelling is **standard ekavian** Serbian. Adjectives in the **masculine
  singular** citation form; verbs in the **infinitive**.
- Ids are stable keys for a learner's saved progress, so don't rename an
  existing word's `cyrillic`/`latin` casually.

### Licensing rule (important)

The corpus is **GPL-3.0, the same as the code** (one license for the repo).
That only holds because every entry is **original work**. You may use
Wiktionary, Wikidata, frequency lists, or Tatoeba as a **reference while
authoring**, but **never paste their text verbatim** into the data: that would
pull in CC BY-SA / CC BY obligations. Keep glosses short and factual; write
example sentences yourself.

## Architecture

The substantive logic is framework-agnostic TypeScript in `src/lib`
(`srs`, `db`, `study`, `content`); Svelte is only the view layer for the
reviewer island; Astro renders the static content/SEO pages. Keep new logic in
`lib` (with a test) rather than in `.svelte`/`.astro` files.

## Pull requests

- Run `yarn fix && yarn typecheck && yarn test` before opening a PR.
- Keep corpus PRs focused (one topic or theme) so they're easy to review.
- Adding a brand-new topic? Add it to the `Topic` union in
  `src/lib/content/types.ts`, the aggregator in `src/data/words/index.ts`, and
  the labels/order in `src/pages/words/index.astro`.

By contributing you agree to license your work under GPL-3.0.
