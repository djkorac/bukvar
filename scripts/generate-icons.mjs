import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/**
 * Rasterizes the brand mark into the PNG app icons the PWA manifest needs, plus
 * the social share (Open Graph) image. Run with `yarn icons` after changing the
 * logo. Outputs are committed to `public/` so the build stays sharp-free.
 *
 * The SVG sources are *outlined* (text → <path>) by scripts/outline-brand.mjs,
 * so this step needs no fonts and renders identically on any host. If you change
 * the glyph, wordmark, or tagline itself, re-run `yarn brand` first;
 * for a pure geometry/colour tweak, edit the SVG sources and re-run `yarn icons`.
 */

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));

const render = async (src, size) =>
  sharp(await readFile(root(src)), { density: 512 })
    .resize(size, size)
    .png()
    .toBuffer();

// public/icon.svg is also the served manifest icon; the maskable source is
// raster-only (the maskable + Apple icons need a full-bleed, unrounded square).
const outputs = [
  ["public/icon-192.png", await render("public/icon.svg", 192)],
  ["public/icon-512.png", await render("public/icon.svg", 512)],
  [
    "public/icon-maskable-512.png",
    await render("scripts/brand/maskable.svg", 512),
  ],
  [
    "public/apple-touch-icon.png",
    await render("scripts/brand/maskable.svg", 180),
  ],
];

for (const [path, buffer] of outputs) {
  await writeFile(root(path), buffer);
  console.log(`wrote ${path} (${buffer.length} bytes)`);
}

const og = await sharp(await readFile(root("scripts/brand/og.svg")), {
  density: 96,
})
  .resize(1200, 630)
  .png()
  .toBuffer();
await writeFile(root("public/og.png"), og);
console.log(`wrote public/og.png (${og.length} bytes)`);
