/**
 * Serialize a JSON-LD object for an inline `<script type="application/ld+json">`.
 * Escapes `<` to `\u003c` so a value can't terminate the script block early; the
 * only breakout vectors inside a `<script>` element are a literal `</script>` and
 * the `<!-- … <script` comment-script pattern, and both need a `<`, so escaping it
 * is sufficient. The data is the trusted build-time corpus rendered to static HTML,
 * so this is drift-proofing, not a live XSS guard.
 */
export const safeJsonLd = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, "\\u003c");
