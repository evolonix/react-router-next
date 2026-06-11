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

export type InterceptDepth = 1 | 2 | 3 | "root";
export type InterceptParse = { depth: InterceptDepth; rest: string };

/**
 * Parse an intercepting segment's prefix (mirrors the core scanner). `(.)x`
 * intercepts the same level, `(..)x` one level up, `(..)(..)x` two, `(...)x`
 * from the root. `rest` is the segment name being intercepted (e.g. `x`).
 */
export function parseInterceptPrefix(segment: string): InterceptParse | null {
  // Most specific first, so `(...)x` isn't caught by `(.)`.
  if (segment.startsWith("(...)"))
    return { depth: "root", rest: segment.slice(5) };
  if (segment.startsWith("(..)(..)"))
    return { depth: 3, rest: segment.slice(8) };
  if (segment.startsWith("(..)")) return { depth: 2, rest: segment.slice(4) };
  if (segment.startsWith("(.)")) return { depth: 1, rest: segment.slice(3) };
  return null;
}

/**
 * The filesystem segments of the route an interceptor targets, or `null` when
 * `segments` contains no intercepting segment. Mirrors `computeRouteKey` in the
 * core scanner: the intercept prefix pops `depth - 1` filesystem levels (all the
 * way to the root for `(...)`), then the intercepted name and any trailing
 * segments are appended. Route groups are kept (they're literal directories);
 * `routeMatchers` strips them when comparing against real pages.
 */
export function resolveInterceptTarget(
  segments: readonly string[],
): string[] | null {
  let idx = -1;
  let intercept: InterceptParse | null = null;
  for (let i = 0; i < segments.length; i++) {
    const parsed = parseInterceptPrefix(segments[i]);
    if (parsed) {
      idx = i;
      intercept = parsed;
      break;
    }
  }
  if (!intercept) return null;

  const fsPrefix = segments.slice(0, idx);
  const resolved =
    intercept.depth === "root"
      ? []
      : fsPrefix.slice(0, Math.max(0, fsPrefix.length - (intercept.depth - 1)));

  const rest = intercept.rest ? [intercept.rest] : [];
  return [...resolved, ...rest, ...segments.slice(idx + 1)];
}

export type RouteMatcher = {
  /** React-Router-style path for display, e.g. `/`, `/about`, `/:id`, `/*`. */
  path: string;
  /**
   * Collision key with param names erased, so matchers that React Router treats
   * as the same match set share a key: a route group doesn't change it, and
   * `/:id` and `/:slug` collapse to the same key (the name doesn't disambiguate).
   */
  signature: string;
};

type Token = { sig: string; rr: string };

/**
 * The React Router matchers a route file's segments compile to — the basis for
 * deciding whether two route files collide. Route files don't render in
 * isolation; they become React Router routes, so two files whose matchers share
 * a `signature` resolve the same URLs and conflict.
 *
 * - Route groups `(group)` contribute nothing to the path.
 * - `[id]` → `:id`; the name is dropped from the signature because React Router
 *   ranks `/:id` and `/:slug` identically (a differing name doesn't disambiguate).
 * - `[...slug]` → a splat `*`.
 * - `[[...slug]]` → TWO matchers, mirroring the runtime: an index match at the
 *   parent path and a splat — so an optional catch-all collides with a sibling
 *   index `page` as well as with a plain catch-all.
 *
 * Returns `null` for files excluded from URL-conflict detection: `_private`
 * folders, `@slot` folders (parallel routes render side-by-side, not at a
 * competing URL), intercepting segments (`(.)x` etc., which intentionally mirror
 * their target), and malformed segments (handled by `valid-dynamic-segments`).
 */
export function routeMatchers(
  segments: readonly string[],
): RouteMatcher[] | null {
  const tokens: Token[] = [];
  for (const seg of segments) {
    if (seg.startsWith("_")) return null;
    const parsed = parseSegment(seg);
    switch (parsed.type) {
      case "slot":
      case "intercept":
      case "malformed":
        return null;
      case "group":
        continue;
      case "static":
        tokens.push({ sig: `s:${seg}`, rr: seg });
        break;
      case "dynamic":
        tokens.push({ sig: ":d", rr: `:${parsed.name}` });
        break;
      case "catch-all":
        tokens.push({ sig: "*", rr: "*" });
        break;
      case "optional-catch-all":
        tokens.push({ sig: "*?", rr: "*" });
        break;
    }
  }

  const toMatcher = (toks: Token[]): RouteMatcher => ({
    path: "/" + toks.map((t) => t.rr).join("/"),
    signature: toks.map((t) => t.sig).join("/"),
  });

  const last = tokens[tokens.length - 1];
  if (last && last.sig === "*?") {
    const prefix = tokens.slice(0, -1);
    return [toMatcher(prefix), toMatcher([...prefix, { sig: "*", rr: "*" }])];
  }
  return [toMatcher(tokens)];
}
