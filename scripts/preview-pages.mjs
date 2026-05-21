#!/usr/bin/env node
/**
 * Serves the assembled `dist-pages/` artifact at the same `/react-router-next/`
 * base path GitHub Pages uses, so the landing page's inter-app links resolve
 * and each bundler demo loads its own asset bundle correctly.
 *
 * Run after `npm run build` (or `npm run build:pages` if the per-app dists
 * already exist):
 *
 *   npm run preview:pages
 *
 * Then visit http://localhost:4444/react-router-next/.
 */
import { createServer } from "node:http";
import { existsSync, mkdirSync, lstatSync, symlinkSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = resolve(dirname(__filename), "..");
const DIST_PAGES = join(ROOT, "dist-pages");
const PREVIEW_DIR = join(ROOT, ".preview-pages");
const MOUNT = "react-router-next";
const PORT = Number(process.env.PORT) || 4444;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json",
  ".txt": "text/plain; charset=utf-8",
};

// Per-demo SPA roots. A request under `/react-router-next/<demo>/<some/path>`
// falls back to `/react-router-next/<demo>/index.html` when no file matches —
// matching what GH Pages does via each demo's own 404.html redirect script.
const SPA_PREFIXES = ["vite", "rsbuild", "webpack"].map(
  (d) => `/${MOUNT}/${d}/`,
);

function ensureSymlink() {
  if (!existsSync(DIST_PAGES)) {
    console.error(
      `[preview:pages] ${DIST_PAGES} not found. Run \`npm run build\` first.`,
    );
    process.exit(1);
  }
  mkdirSync(PREVIEW_DIR, { recursive: true });
  const link = join(PREVIEW_DIR, MOUNT);
  try {
    lstatSync(link);
    return; // exists (symlink or dir — leave it)
  } catch {
    // doesn't exist — create
  }
  symlinkSync("../dist-pages", link, "dir");
}

async function tryServe(res, filePath) {
  try {
    const s = await stat(filePath);
    if (s.isDirectory()) filePath = join(filePath, "index.html");
    const data = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": MIME[extname(filePath)] || "application/octet-stream",
    });
    res.end(data);
    return true;
  } catch {
    return false;
  }
}

ensureSymlink();

const server = createServer(async (req, res) => {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);

  if (urlPath === "/") {
    res.writeHead(302, { Location: `/${MOUNT}/` });
    res.end();
    return;
  }

  let filePath = join(PREVIEW_DIR, urlPath);
  if (urlPath.endsWith("/")) filePath = join(filePath, "index.html");

  if (await tryServe(res, filePath)) return;

  // Per-demo SPA fallback.
  const spa = SPA_PREFIXES.find((p) => urlPath.startsWith(p));
  if (spa) {
    const fallback = join(PREVIEW_DIR, spa, "index.html");
    if (await tryServe(res, fallback)) return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(`404 Not Found: ${urlPath}\n`);
});

server.listen(PORT, () => {
  console.log(
    `\n  preview:pages → http://localhost:${PORT}/${MOUNT}/\n  press ctrl+c to stop\n`,
  );
});

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => {
    // server.close() alone hangs forever while keep-alive sockets (the
    // browser's open tabs) stay open. Drop them first, then fall through.
    server.closeAllConnections?.();
    server.close(() => process.exit(0));
    // Failsafe: if close still doesn't resolve (e.g. a stuck loader), bail.
    setTimeout(() => process.exit(0), 200).unref();
  });
}
