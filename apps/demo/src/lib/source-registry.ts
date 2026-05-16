// Eager raw imports of every route source under `src/app/`. Vite inlines the
// file contents at build time as strings. Keys are file paths relative to this
// module — call `getSource(relativePath)` with paths under `src/app/` to look up.
const RAW_MODULES = import.meta.glob("../app/**/*.{ts,tsx}", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

/** Strip the leading `../app/` so callers can pass paths like `posts/page.tsx`. */
const NORMALIZED: Record<string, string> = Object.fromEntries(
  Object.entries(RAW_MODULES).map(([key, value]) => [
    key.replace(/^\.\.\/app\//, ""),
    value,
  ]),
);

/**
 * Resolve a route source by its path under `src/app/`.
 * Glob keys preserve every character — `(.)`, `(..)`, `@modal`, `[id]` all
 * compare with strict equality, no normalization.
 */
export function getSource(relativeAppPath: string): string | null {
  return NORMALIZED[relativeAppPath] ?? null;
}

/** Lists every known route source path (for diagnostics/debugging). */
export function listSourcePaths(): string[] {
  return Object.keys(NORMALIZED).sort();
}
