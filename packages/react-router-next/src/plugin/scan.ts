import { readdirSync, readFileSync } from "node:fs";
import { relative } from "node:path";
import { ROUTE_FILE_NAMES } from "../runtime/route-files";

// A folder is a route folder when it contains a page/layout/default/template
// (i.e. anything that can act as a "leaf" in the routing tree). Built from the
// shared names list so the plugin and runtime stay in sync.
const ROUTE_DIR_FILE_NAMES = ROUTE_FILE_NAMES.filter(
  (n): n is "page" | "layout" | "default" | "template" =>
    n === "page" || n === "layout" || n === "default" || n === "template",
);
const ROUTE_DIR_FILE_RE = new RegExp(
  `^(${ROUTE_DIR_FILE_NAMES.join("|")})\\.(tsx|jsx|ts|js)$`,
);

export function toPosix(p: string): string {
  return p.split("\\").join("/");
}

export type ScanResult = {
  /** Absolute paths of directories that contain a page/layout/default/template file. */
  routeDirs: string[];
};

// Matches files that map to a runtime role inside appDir — the broader list
// (page/layout/loading/error/default/template/not-found) the Vite plugin's
// `import.meta.glob` pattern picks up. `scanRouteFiles` uses this to mirror the
// glob exactly; routing semantics (private/slot filtering) are applied later
// by the runtime when it walks the resulting modules map.
const ROUTE_FILE_BASENAME_RE = new RegExp(
  `^(${ROUTE_FILE_NAMES.join("|")})\\.(tsx|jsx|ts|js)$`,
);

export function isPrivateSegment(seg: string): boolean {
  return seg.startsWith("_");
}

export function isSlotSegment(seg: string): boolean {
  return seg.startsWith("@") && seg.length > 1;
}

export type InterceptDepth = 1 | 2 | 3 | "root";

export type InterceptParse = { depth: InterceptDepth; rest: string };

export function parseInterceptPrefix(seg: string): InterceptParse | null {
  // Check from most specific to least so e.g. "(...)x" doesn't get caught by "(.)".
  if (seg.startsWith("(...)")) return { depth: "root", rest: seg.slice(5) };
  if (seg.startsWith("(..)(..)")) return { depth: 3, rest: seg.slice(8) };
  if (seg.startsWith("(..)")) return { depth: 2, rest: seg.slice(4) };
  if (seg.startsWith("(.)")) return { depth: 1, rest: seg.slice(3) };
  return null;
}

export function isRouteGroupSegment(seg: string): boolean {
  return (
    seg.startsWith("(") &&
    seg.endsWith(")") &&
    parseInterceptPrefix(seg) === null
  );
}

/**
 * Absolute paths of every file inside `appDir` whose basename matches one of
 * the routing-relevant filenames. Mirrors the Vite plugin's
 * `import.meta.glob("/src/app/**\/{page,layout,…}.{tsx,jsx,ts,js}")` so the
 * codegen `app-tree.js` and the Vite virtual module pick up the same set.
 */
export function scanRouteFiles(appDir: string): string[] {
  let entries;
  try {
    entries = readdirSync(appDir, { recursive: true, withFileTypes: true });
  } catch {
    return [];
  }
  const files: string[] = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!ROUTE_FILE_BASENAME_RE.test(entry.name)) continue;
    const dir =
      (entry as unknown as { parentPath?: string; path?: string }).parentPath ??
      (entry as unknown as { path?: string }).path ??
      appDir;
    files.push(`${dir}/${entry.name}`.split("\\").join("/"));
  }
  return files.sort((a, b) => a.localeCompare(b));
}

export function scanAppDir(appDir: string): ScanResult {
  let entries;
  try {
    entries = readdirSync(appDir, { recursive: true, withFileTypes: true });
  } catch {
    return { routeDirs: [] };
  }
  const routeDirs = new Set<string>();
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!ROUTE_DIR_FILE_RE.test(entry.name)) continue;
    const dir =
      (entry as unknown as { parentPath?: string; path?: string }).parentPath ??
      (entry as unknown as { path?: string }).path ??
      appDir;
    const rel = toPosix(relative(appDir, dir));
    if (rel !== "" && rel.split("/").some(isPrivateSegment)) continue;
    routeDirs.add(dir);
  }
  return { routeDirs: [...routeDirs] };
}

function routeKeySegmentsOf(parts: readonly string[]): string[] {
  // Keep route groups in the routeKey (they're literal directory components).
  // Strip @slots and `_private` because they don't appear in any URL.
  return parts.filter((s) => !isSlotSegment(s) && !isPrivateSegment(s));
}

/**
 * Compute the route key for a sequence of filesystem segments.
 *
 * - `_private` folders and `@slot` folders are stripped (they don't appear in URLs).
 * - Route groups `(group)` are preserved literally, matching the existing
 *   `(marketing)/about` shape.
 * - An intercept-prefixed segment (`(.)x`, `(..)x`, `(..)(..)x`, `(...)x`)
 *   collapses preceding filesystem segments by `depth - 1` levels (or all the
 *   way to the root for `(...)`), then appends the stripped name.
 *
 * For an interceptor folder, the returned key is the resolved target route key
 * — e.g. `photos/(.)[id]` → `photos/[id]`, the same key as the interceptor's
 * target page. That keeps `useRouteParams<...>()` aligned with the URL the
 * user sees regardless of which file rendered.
 */
export function computeRouteKey(parts: readonly string[]): string {
  let interceptIdx = -1;
  let intercept: InterceptParse | null = null;
  for (let i = 0; i < parts.length; i++) {
    const p = parseInterceptPrefix(parts[i]);
    if (p) {
      interceptIdx = i;
      intercept = p;
      break;
    }
  }

  if (intercept === null) return routeKeySegmentsOf(parts).join("/");

  const fsPrefix = parts.slice(0, interceptIdx);
  let resolved: string[];
  if (intercept.depth === "root") {
    resolved = [];
  } else {
    const popCount = intercept.depth - 1;
    resolved = fsPrefix.slice(0, Math.max(0, fsPrefix.length - popCount));
  }
  const prefixSegs = routeKeySegmentsOf(resolved);
  const tail = parts.slice(interceptIdx + 1);
  const restSegments: string[] = [];
  if (intercept.rest) restSegments.push(intercept.rest);
  restSegments.push(...tail);
  return [...prefixSegs, ...routeKeySegmentsOf(restSegments)].join("/");
}

export function routeKeyFor(appDir: string, routeDir: string): string {
  const rel = toPosix(relative(appDir, routeDir));
  if (rel === "") return "";
  return computeRouteKey(rel.split("/"));
}

export function routeHasParams(routeKey: string): boolean {
  return routeKey.includes("[");
}

/**
 * Detects a `searchSchema` export in a route's leaf file. Covers the three
 * forms an author might use:
 *   - `export const searchSchema = …` (also `let`/`var`/`function`)
 *   - `export { searchSchema }`
 *   - `export { foo as searchSchema }`
 * Intentionally a cheap textual check — the plugin never parses route files,
 * and a false positive degrades to a type error on the import, not a crash.
 */
const SEARCH_SCHEMA_EXPORT_RE =
  /\bexport\s+(?:const|let|var|(?:async\s+)?function)\s+searchSchema\b|\bexport\s*\{[^}]*\bas\s+searchSchema\b[^}]*\}|\bexport\s*\{[^}]*\bsearchSchema\b[^}]*\}/;

/** File names that can carry a route's `searchParams` schema, by priority. */
const LEAF_FILE_NAMES = ["page", "default", "template", "layout"] as const;
const LEAF_FILE_EXTS = ["tsx", "ts", "jsx", "js"] as const;

/**
 * Absolute path to the leaf file of a route directory (the file most likely to
 * carry a `searchParams` schema), or `null` if the directory has none. `page`
 * wins over `default`/`template`/`layout`, mirroring how the runtime treats the
 * page as the route's leaf.
 */
export function leafFileFor(routeDir: string): string | null {
  let names: Set<string>;
  try {
    names = new Set(
      readdirSync(routeDir, { withFileTypes: true })
        .filter((e) => e.isFile())
        .map((e) => e.name),
    );
  } catch {
    return null;
  }
  for (const base of LEAF_FILE_NAMES) {
    for (const ext of LEAF_FILE_EXTS) {
      const name = `${base}.${ext}`;
      if (names.has(name)) return toPosix(`${routeDir}/${name}`);
    }
  }
  return null;
}

/** Whether a leaf file exports a `searchSchema`. */
export function routeHasSearchSchema(leafFile: string | null): boolean {
  if (!leafFile) return false;
  try {
    return SEARCH_SCHEMA_EXPORT_RE.test(readFileSync(leafFile, "utf8"));
  } catch {
    return false;
  }
}

function isInterceptorDir(appDir: string, routeDir: string): boolean {
  return toPosix(relative(appDir, routeDir))
    .split("/")
    .some((seg) => parseInterceptPrefix(seg) !== null);
}

/**
 * Map of route key → absolute path of the leaf file that exports a
 * `searchSchema`. Only routes that declare a schema appear. When several
 * directories resolve to the same key (an interceptor and its target), the
 * non-interceptor (target) leaf is preferred so the schema tracks the canonical
 * URL.
 */
export function buildRouteSchemaMap(appDir: string): Map<string, string> {
  const { routeDirs } = scanAppDir(appDir);
  const byKey = new Map<string, { dir: string; isIntercept: boolean }[]>();
  for (const dir of routeDirs) {
    const key = routeKeyFor(appDir, dir);
    const list = byKey.get(key) ?? [];
    list.push({ dir, isIntercept: isInterceptorDir(appDir, dir) });
    byKey.set(key, list);
  }

  const result = new Map<string, string>();
  for (const [key, candidates] of byKey) {
    const ordered = [...candidates].sort(
      (a, b) => Number(a.isIntercept) - Number(b.isIntercept),
    );
    for (const candidate of ordered) {
      const leaf = leafFileFor(candidate.dir);
      if (routeHasSearchSchema(leaf)) {
        result.set(key, leaf as string);
        break;
      }
    }
  }
  return result;
}

/** Cross-platform variant of the runtime `ROUTE_FILE_RE` — handles backslash
 *  separators that Vite's file watcher emits on Windows. */
export const ROUTE_FILE_RE = new RegExp(
  `[\\\\/](${ROUTE_FILE_NAMES.join("|")})\\.(tsx|jsx|ts|js)$`,
);
