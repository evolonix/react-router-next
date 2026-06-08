// Generates the brand rasters from the Evolonix mark — the three brand bars,
// centred on a square and inset to the same safe-zone padding as favicon.svg:
//
//   logo.png (1024px)            — general-purpose raster on a full dark square
//   apple-touch-icon.png (180px) — iOS home-screen icon (iOS adds its own mask)
//   icon-192.png / icon-512.png  — manifest icons, "any maskable" (the bars sit
//                                  well inside the safe zone, so Android can mask
//                                  to any shape without clipping them)
//
// Run with: npm run generate:icons

import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public");
mkdirSync(outDir, { recursive: true });

const BG = "#0b0b12";
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

// Mark coverage: the fraction of the canvas the mark spans. The bars sit in the
// central 36 of a 64 box — i.e. 14/64 (≈21.9%) padding on every side, matching
// favicon.svg's safe-zone inset.
const COVERAGE = 36 / 64;

// The bare mark — three brand bars in their own tight 32×36 box. Compositing the
// mark (rather than baking the inset into fixed coordinates) keeps every raster
// in sync with this one geometry no matter what size we render.
const markSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 36">
  <rect x="0" y="0" width="32" height="7" rx="3.5" fill="#a855f7" />
  <rect x="0" y="14.5" width="22" height="7" rx="3.5" fill="#d946ef" />
  <rect x="0" y="29" width="32" height="7" rx="3.5" fill="#22d3ee" />
</svg>`,
);

// Render the mark to a transparent square of the given size (aspect preserved).
const renderMark = (size) =>
  sharp(markSvg)
    .resize(size, size, { fit: "contain", background: TRANSPARENT })
    .png()
    .toBuffer();

// Mark centred on a square `background`, inset to COVERAGE so it carries the
// same safe-zone padding as favicon.svg.
async function compose(size, background) {
  const inner = Math.round(size * COVERAGE);
  const offset = Math.round((size - inner) / 2);
  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: await renderMark(inner), top: offset, left: offset }])
    .png()
    .toBuffer();
}

const jobs = [
  // General-purpose raster of the mark on a full dark square.
  [await compose(1024, BG), "logo.png"],
  // Apple touch icon — iOS applies its own rounded mask.
  [await compose(180, BG), "apple-touch-icon.png"],
  // Maskable PWA icons — mark kept within the central safe zone.
  [await compose(192, BG), "icon-192.png"],
  [await compose(512, BG), "icon-512.png"],
];

for (const [buf, file] of jobs) {
  // Flatten to opaque RGB and tag sRGB so viewers colour-manage the dark
  // background correctly (an untagged PNG gets read in the display's wide-gamut
  // space and renders lighter).
  await sharp(buf)
    .flatten({ background: BG })
    .withIccProfile("srgb")
    .png()
    .toFile(join(outDir, file));
  console.log(`  ${file}`);
}

console.log("\nGenerated brand PNGs in public/");
