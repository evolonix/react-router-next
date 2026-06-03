// Generates iOS PWA launch ("splash") screens: the Evolonix logo mark + wordmark
// centered on the brand gradient background.
//
// iOS does not auto-generate launch screens from the manifest the way Android does,
// so we render one PNG per device resolution/orientation and emit the matching
// <link rel="apple-touch-startup-image"> tags for index.html.
//
// Run with: npm run generate:splash

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public", "splash");
mkdirSync(outDir, { recursive: true });

// Manrope 700 — the wordmark is converted to outlined paths so rendering needs no
// installed font and looks identical on every machine.
const fontBuf = readFileSync(join(__dirname, "fonts", "Manrope-Bold.ttf"));
const font = opentype.parse(
  fontBuf.buffer.slice(
    fontBuf.byteOffset,
    fontBuf.byteOffset + fontBuf.byteLength,
  ),
);

// Unique device profiles keyed by their CSS (device-width × device-height @ ratio).
// One media query covers every device sharing the same triple, so we key by the
// triple, not by model name. Covers recent iPhones and iPads.
const PROFILES = [
  { label: "iphone-se", w: 375, h: 667, ratio: 2 },
  { label: "iphone-8plus", w: 414, h: 736, ratio: 3 },
  { label: "iphone-x", w: 375, h: 812, ratio: 3 },
  { label: "iphone-xr", w: 414, h: 896, ratio: 2 },
  { label: "iphone-xsmax", w: 414, h: 896, ratio: 3 },
  { label: "iphone-12", w: 390, h: 844, ratio: 3 },
  { label: "iphone-12promax", w: 428, h: 926, ratio: 3 },
  { label: "iphone-14pro", w: 393, h: 852, ratio: 3 },
  { label: "iphone-15promax", w: 430, h: 932, ratio: 3 },
  { label: "iphone-16pro", w: 402, h: 874, ratio: 3 },
  { label: "iphone-16promax", w: 440, h: 956, ratio: 3 },
  { label: "ipad", w: 768, h: 1024, ratio: 2 },
  { label: "ipad-105", w: 834, h: 1112, ratio: 2 },
  { label: "ipad-109", w: 820, h: 1180, ratio: 2 },
  { label: "ipad-11", w: 834, h: 1194, ratio: 2 },
  { label: "ipad-129", w: 1024, h: 1366, ratio: 2 },
];

// Build the full SVG for a canvas of W×H device pixels.
function buildSvg(W, H) {
  const S = Math.min(W, H);
  const maxD = Math.max(W, H);

  // --- Centered lockup: logo mark stacked above the "Evolonix" wordmark ---
  const logo = Math.round(S * 0.2); // logo box is square (source viewBox 64×64)

  let fontSize = S * 0.13;
  let bb = font.getPath("Evolonix", 0, 0, fontSize).getBoundingBox();
  const maxWordmark = W * 0.82;
  if (bb.x2 - bb.x1 > maxWordmark) {
    fontSize *= maxWordmark / (bb.x2 - bb.x1);
    bb = font.getPath("Evolonix", 0, 0, fontSize).getBoundingBox();
  }
  const wmHeight = bb.y2 - bb.y1;

  const gap = logo * 0.45;
  const totalH = logo + gap + wmHeight;
  const originY = (H - totalH) / 2;

  const logoX = (W - logo) / 2;
  const logoScale = logo / 64;

  // Place the wordmark's glyph top just below the logo (glyph top = baseline + y1, y1 < 0).
  const baseline = originY + logo + gap - bb.y1;
  const wm = font.getPath("Evolonix", 0, baseline, fontSize);
  const wmBox = wm.getBoundingBox();
  const wmX = (W - (wmBox.x2 - wmBox.x1)) / 2 - wmBox.x1;
  const wmPath = wm.toPathData(2);

  // --- Background recipe from .github/social-preview.svg ---
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a0a14" />
      <stop offset="1" stop-color="#0e0820" />
    </linearGradient>
    <radialGradient id="glow-purple" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#a855f7" stop-opacity="0.4" />
      <stop offset="1" stop-color="#a855f7" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glow-magenta" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#d946ef" stop-opacity="0.22" />
      <stop offset="1" stop-color="#d946ef" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glow-cyan" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#22d3ee" stop-opacity="0.38" />
      <stop offset="1" stop-color="#22d3ee" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#0b0b12" />
  <rect width="${W}" height="${H}" fill="url(#bg)" fill-opacity="0.8" />

  <circle cx="${W * 0.12}" cy="${H * 0.14}" r="${maxD * 0.42}" fill="url(#glow-purple)" />
  <circle cx="${W * 0.88}" cy="${H * 0.86}" r="${maxD * 0.46}" fill="url(#glow-cyan)" />
  <circle cx="${W * 0.5}" cy="${H * 0.42}" r="${maxD * 0.3}" fill="url(#glow-magenta)" />

  <g stroke="#ffffff" stroke-opacity="0.04" stroke-width="1">
    <line x1="0" y1="${H * 0.25}" x2="${W}" y2="${H * 0.25}" />
    <line x1="0" y1="${H * 0.5}" x2="${W}" y2="${H * 0.5}" />
    <line x1="0" y1="${H * 0.75}" x2="${W}" y2="${H * 0.75}" />
    <line x1="${W * 0.25}" y1="0" x2="${W * 0.25}" y2="${H}" />
    <line x1="${W * 0.5}" y1="0" x2="${W * 0.5}" y2="${H}" />
    <line x1="${W * 0.75}" y1="0" x2="${W * 0.75}" y2="${H}" />
  </g>

  <g transform="translate(${logoX}, ${originY}) scale(${logoScale})">
    <rect y="0" width="64" height="12.4" rx="6.2" fill="#a855f7" />
    <rect y="25.8" width="44" height="12.4" rx="6.2" fill="#d946ef" />
    <rect y="51.6" width="64" height="12.4" rx="6.2" fill="#22d3ee" />
  </g>

  <path transform="translate(${wmX}, 0)" d="${wmPath}" fill="#ffffff" />
</svg>`;
}

const links = [];

for (const { label, w, h, ratio } of PROFILES) {
  for (const orientation of ["portrait", "landscape"]) {
    const isPortrait = orientation === "portrait";
    const pxW = (isPortrait ? w : h) * ratio;
    const pxH = (isPortrait ? h : w) * ratio;
    const file = `splash-${w}x${h}-${ratio}x-${orientation}.png`;

    await sharp(Buffer.from(buildSvg(pxW, pxH)))
      .png()
      .toFile(join(outDir, file));

    links.push(
      `<link rel="apple-touch-startup-image" media="(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: ${orientation})" href="/splash/${file}" />`,
    );
    console.log(
      `  ${label.padEnd(16)} ${orientation.padEnd(9)} ${pxW}×${pxH}  →  ${file}`,
    );
  }
}

// Write the <link> tags so they can be pasted/diffed against index.html.
// Kept under scripts/ (not public/) so it is not deployed with the site.
writeFileSync(join(__dirname, "splash-links.html"), links.join("\n") + "\n");

console.log(`\nGenerated ${links.length} splash images in public/splash/`);
console.log(
  "apple-touch-startup-image tags written to scripts/splash-links.html",
);
