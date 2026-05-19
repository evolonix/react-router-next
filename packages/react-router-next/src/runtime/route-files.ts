import type { RouteModule, RouteModuleMap } from "./app-routes";

/**
 * File names within a route folder that get a runtime role. Mirrors the
 * "File-name conventions" table in the README — kept in one place so the Vite
 * plugin (in `src/plugin/scan.ts`) and runtime helpers below stay in sync.
 */
export const ROUTE_FILE_NAMES = [
  "page",
  "layout",
  "loading",
  "error",
  "default",
  "template",
  "not-found",
] as const;

/**
 * Matches route files inside the app dir, with POSIX-style slashes. Suitable
 * for `require.context` / `import.meta.glob` keys, which both bundlers
 * normalize to forward slashes regardless of host OS.
 */
export const ROUTE_FILE_RE = new RegExp(
  `\\/(${ROUTE_FILE_NAMES.join("|")})\\.(tsx|jsx|ts|js)$`,
);

/**
 * Minimal shape of webpack/Rspack's `require.context` return value. Defined
 * locally so consumers don't need `@types/webpack-env` to import this type.
 */
export interface RouteContext {
  keys(): string[];
  (key: string): unknown;
}

/**
 * Build the `modules` map `<AppRouter />` / `buildRoutesFromModules` expects
 * from a webpack/Rspack `require.context` result. The context's relative keys
 * (`./posts/[postId]/page.tsx`) are rewritten to the absolute `appDir`-prefixed
 * form the Vite plugin produces (`/src/app/posts/[postId]/page.tsx`) so both
 * paths share the same `appDir` argument downstream.
 *
 * @example
 * ```ts
 * const modules = buildModulesFromContext(
 *   require.context("./app", true, ROUTE_FILE_RE),
 *   "/src/app",
 * );
 * <AppRouter modules={modules} appDir="/src/app" />
 * ```
 */
export function buildModulesFromContext(
  ctx: RouteContext,
  appDir: string,
): RouteModuleMap {
  const prefix = appDir.endsWith("/") ? appDir : `${appDir}/`;
  const modules: RouteModuleMap = {};
  for (const key of ctx.keys()) {
    modules[key.replace(/^\.\//, prefix)] = ctx(key) as RouteModule;
  }
  if (Object.keys(modules).length === 0) {
    // Most common cause: `require.context(…, …, ROUTE_FILE_RE)` was used in a
    // webpack/Rspack consumer. Both bundlers require a regex *literal* at the
    // call site for static analysis — an imported identifier silently produces
    // an empty context. Inline the regex (e.g. /\/(page|layout|loading|error|
    // default|template|not-found)\.(tsx|jsx|ts|js)$/) and retry.
    throw new Error(
      `[react-router-next] buildModulesFromContext: ` +
        `the require.context for appDir "${appDir}" returned no modules. ` +
        `Inline a literal regex at the require.context call site — see ROUTE_FILE_RE.`,
    );
  }
  return modules;
}
