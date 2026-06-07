// Generates the repo social preview card (../../.github/social-preview.svg + .png,
// 1280×640): the Evolonix mark + wordmark over the brand gradient, with the package
// name as the tagline and a one-line description — the same recipe as the splash
// screens / favicon.
//
// The showcase app owns the brand tooling (sharp + fonts), so this script lives
// here but writes to the monorepo-root .github/ where the preview is referenced.
//
// The card uses live <text> (Manrope), so the SVG stays the editable source of
// truth; rasterising the PNG needs Manrope available to the renderer (bundled at
// scripts/fonts/Manrope-Bold.ttf and commonly installed system-wide).
//
// Run with: npm run generate:social

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
// scripts -> showcase -> apps -> repo root, then into .github
const outDir = join(__dirname, "..", "..", "..", ".github");
mkdirSync(outDir, { recursive: true });

// --- Card content ---
const WORDMARK = "Evolonix";
const TAGLINE = "@evolonix/react-router-next";
const CATEGORIES = "Next.js-style filesystem routing for React Router 7";
const FONT = "Manrope, 'SF Pro Display', Helvetica, Arial, sans-serif";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="640" viewBox="0 0 1280 640">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a0a14" />
      <stop offset="1" stop-color="#0e0820" />
    </linearGradient>
    <radialGradient id="glow-purple" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#a855f7" stop-opacity="0.55" />
      <stop offset="1" stop-color="#a855f7" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glow-magenta" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#d946ef" stop-opacity="0.45" />
      <stop offset="1" stop-color="#d946ef" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glow-cyan" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#22d3ee" stop-opacity="0.5" />
      <stop offset="1" stop-color="#22d3ee" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Base -->
  <rect width="1280" height="640" fill="url(#bg)" />

  <!-- Atmospheric glows -->
  <circle cx="200" cy="120" r="380" fill="url(#glow-purple)" />
  <circle cx="1080" cy="540" r="420" fill="url(#glow-cyan)" />
  <circle cx="700" cy="320" r="320" fill="url(#glow-magenta)" />

  <!-- Faint grid texture (subtle structure) -->
  <g stroke="#ffffff" stroke-opacity="0.04" stroke-width="1">
    <line x1="0" y1="160" x2="1280" y2="160" />
    <line x1="0" y1="320" x2="1280" y2="320" />
    <line x1="0" y1="480" x2="1280" y2="480" />
    <line x1="320" y1="0" x2="320" y2="640" />
    <line x1="640" y1="0" x2="640" y2="640" />
    <line x1="960" y1="0" x2="960" y2="640" />
  </g>

  <!-- Brand mark + wordmark (logo at 1em, gap, wordmark in Manrope) -->
  <g transform="translate(230, 200)">
    <g transform="scale(2.5)">
      <rect y="0" width="64" height="12.4" rx="6.2" fill="#a855f7" />
      <rect y="25.8" width="44" height="12.4" rx="6.2" fill="#d946ef" />
      <rect y="51.6" width="64" height="12.4" rx="6.2" fill="#22d3ee" />
    </g>
    <text x="196" y="138" font-family="${FONT}" font-weight="700" font-size="160" letter-spacing="-4" fill="#ffffff">${WORDMARK}</text>
  </g>

  <!-- Tagline (package name) -->
  <text x="640" y="460" text-anchor="middle" font-family="${FONT}" font-weight="500" font-size="38" letter-spacing="-1" fill="#cbd5e1">${TAGLINE}</text>

  <!-- Description -->
  <text x="640" y="524" text-anchor="middle" font-family="${FONT}" font-weight="500" font-size="22" letter-spacing="3" fill="#94a3b8">${CATEGORIES}</text>
</svg>`;

writeFileSync(join(outDir, "social-preview.svg"), svg + "\n");
await sharp(Buffer.from(svg)).png().toFile(join(outDir, "social-preview.png"));

console.log("Generated .github/social-preview.svg and .png (1280×640)");
