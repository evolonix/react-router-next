/** Route file basenames that map to a runtime role (mirrors the core package). */
export const ROUTE_FILE_NAMES = [
  "page",
  "layout",
  "loading",
  "error",
  "default",
  "template",
  "not-found",
] as const;

const ROUTE_FILE_RE =
  /^(page|layout|loading|error|default|template|not-found)\.(tsx|jsx|ts|js)$/;

export type RouteFileInfo = {
  /** Directory segments beneath the app dir (excludes the filename). */
  segments: string[];
  /** The route-file basename, e.g. `page.tsx`. */
  basename: string;
  /** The role, e.g. `page`. */
  kind: string;
};

/**
 * Parse a route file's path into its app-relative segments. Returns `null` when
 * the file isn't a recognized route file under an `appDir` segment, so rules
 * can cheaply skip non-route files.
 */
export function parseRouteFile(
  filename: string,
  appDir = "app",
): RouteFileInfo | null {
  const parts = filename.split("\\").join("/").split("/");
  const basename = parts[parts.length - 1];
  const match = ROUTE_FILE_RE.exec(basename);
  if (!match) return null;

  const dirParts = parts.slice(0, -1);
  const appIdx = dirParts.lastIndexOf(appDir);
  if (appIdx === -1) return null;

  return { segments: dirParts.slice(appIdx + 1), basename, kind: match[1] };
}

export type SegmentParse =
  | { type: "static" | "group" | "slot" | "intercept" }
  | { type: "dynamic" | "catch-all" | "optional-catch-all"; name: string }
  | { type: "malformed" };

const DYNAMIC_RE = /^\[([^\].]+)\]$/;
const CATCH_ALL_RE = /^\[\.\.\.([^\].]+)\]$/;
const OPTIONAL_CATCH_ALL_RE = /^\[\[\.\.\.([^\].]+)\]\]$/;
const INTERCEPT_RE = /^(\(\.\)|\(\.\.\)|\(\.\.\)\(\.\.\)|\(\.\.\.\))/;
const GROUP_RE = /^\([^)]*\)$/;

/** Classify a single filesystem segment by routing convention. */
export function parseSegment(segment: string): SegmentParse {
  if (segment.startsWith("@")) return { type: "slot" };
  if (INTERCEPT_RE.test(segment)) return { type: "intercept" };
  if (GROUP_RE.test(segment)) return { type: "group" };

  const optional = OPTIONAL_CATCH_ALL_RE.exec(segment);
  if (optional) return { type: "optional-catch-all", name: optional[1] };
  const catchAll = CATCH_ALL_RE.exec(segment);
  if (catchAll) return { type: "catch-all", name: catchAll[1] };
  const dynamic = DYNAMIC_RE.exec(segment);
  if (dynamic) return { type: "dynamic", name: dynamic[1] };

  // A segment with brackets that matched no valid dynamic form is malformed
  // (e.g. `[]`, `[...]`, `[id`, `[[...x]`).
  if (segment.includes("[") || segment.includes("]"))
    return { type: "malformed" };
  return { type: "static" };
}

/** The param name a segment binds, if any (`[id]`, `[...slug]`, `[[...q]]`). */
export function paramName(segment: string): string | null {
  const parsed = parseSegment(segment);
  return "name" in parsed ? parsed.name : null;
}
