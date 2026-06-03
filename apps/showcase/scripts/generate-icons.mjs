// Generates the PWA app icons (home-screen / install) from the Evolonix mark:
// the three brand bars centered on a full-bleed brand-dark square.
//
//   icon-192.png / icon-512.png  — manifest icons, "any maskable" (the bars sit
//                                  well inside the maskable safe zone, so Android
//                                  can mask to any shape without clipping them).
//   apple-touch-icon.png (180px) — iOS home-screen icon (iOS applies its own
//                                  rounded mask, so we render full-bleed).
//
// Run with: npm run generate:icons

import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public");
mkdirSync(outDir, { recursive: true });

// Brand bars in a 64×64 box (matches public/favicon.svg, minus its rounded frame
// since iOS/Android supply their own masks).
function buildSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#0b0b12" />
  <rect x="16" y="14" width="32" height="7" rx="3.5" fill="#a855f7" />
  <rect x="16" y="28.5" width="22" height="7" rx="3.5" fill="#d946ef" />
  <rect x="16" y="43" width="32" height="7" rx="3.5" fill="#22d3ee" />
</svg>`;
}

const ICONS = [
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
  { file: "apple-touch-icon.png", size: 180 },
];

for (const { file, size } of ICONS) {
  await sharp(Buffer.from(buildSvg(size)))
    .png()
    .toFile(join(outDir, file));
  console.log(`  ${file.padEnd(22)} ${size}×${size}`);
}

console.log(`\nGenerated ${ICONS.length} app icons in public/`);
