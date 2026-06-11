// Filesystem helpers shared by the rules that need project-wide analysis
// (route conflicts, interceptor targets, slot layouts). Route structure is a
// property of the whole tree, not a single file, so these rules read the app
// directory from disk — keyed off the route file's own absolute path.

import { readdirSync } from "node:fs";
import { ROUTE_FILE_NAMES } from "./route-path";

const ROUTE_FILE_RE = new RegExp(
  `^(${ROUTE_FILE_NAMES.join("|")})\\.(tsx|jsx|ts|js)$`,
);

/** The app-dir root for a route file, e.g. `/proj/src/app`, or `null`. */
export function appRootOf(filename: string, appDir: string): string | null {
  const parts = filename.split("\\").join("/").split("/");
  const idx = parts.lastIndexOf(appDir);
  if (idx === -1) return null;
  return parts.slice(0, idx + 1).join("/");
}

/** Display a file relative to its app root so reports read as route paths. */
export function relativeToApp(file: string, appRoot: string): string {
  return file.startsWith(`${appRoot}/`) ? file.slice(appRoot.length + 1) : file;
}

/** Absolute (posix) paths of every route file beneath `appRoot`. */
export function scanRouteFiles(appRoot: string): string[] {
  let entries;
  try {
    entries = readdirSync(appRoot, { recursive: true, withFileTypes: true });
  } catch {
    return [];
  }
  const files: string[] = [];
  for (const entry of entries) {
    if (!entry.isFile() || !ROUTE_FILE_RE.test(entry.name)) continue;
    const dir =
      (entry as unknown as { parentPath?: string; path?: string }).parentPath ??
      (entry as unknown as { path?: string }).path ??
      appRoot;
    files.push(`${dir}/${entry.name}`.split("\\").join("/"));
  }
  return files;
}

/** Whether `dir` directly contains a `layout` route file. */
export function hasLayoutFile(dir: string): boolean {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return false;
  }
  return entries.some(
    (e) => e.isFile() && /^layout\.(tsx|jsx|ts|js)$/.test(e.name),
  );
}
