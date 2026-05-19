# @evolonix/react-router-next

## 3.0.0

### Major Changes

- [`b14c882`](https://github.com/evolonix/react-router-next/commit/b14c882d36e1621c62d5c4baf345f6e6b19a7026) Thanks [@jasonruesch](https://github.com/jasonruesch)! - Split `<AppRouter />` into a bundler-agnostic core and a Vite-wired entry; add webpack/Rspack/Rsbuild support

  The runtime `<AppRouter />` previously hard-coded the Vite-only virtual module
  `virtual:react-router-next/app-tree` and read `import.meta.env.BASE_URL`
  unconditionally, which left it unusable under bundlers that don't implement
  either. The component is now split:
  - **`@evolonix/react-router-next`** exports a bundler-agnostic `<AppRouter />`
    whose `modules` and `appDir` props are **required**. No virtual import, no
    `import.meta.env` access. Use this from webpack, Rspack, Rsbuild, or any other
    bundler.
  - **`@evolonix/react-router-next/vite-client`** (new subpath) re-exports a
    Vite-wired `<AppRouter />` that supplies `modules`/`appDir` from
    `virtual:react-router-next/app-tree` and defaults `basename` to
    `import.meta.env.BASE_URL`, so Vite users can still mount it with zero props.

  ### Migration

  **Vite users** — change the import path:

  ```diff
  - import { AppRouter } from "@evolonix/react-router-next";
  + import { AppRouter } from "@evolonix/react-router-next/vite-client";
  ```

  No other change is needed — `<AppRouter />` with zero props still works.

  **Webpack / Rspack / Rsbuild users** — keep the package-root import and pass
  `modules` + `appDir` explicitly. A new `buildModulesFromContext(ctx, appDir)`
  helper (plus exported `ROUTE_FILE_NAMES` and `ROUTE_FILE_RE`) builds the map
  from a `require.context`, rewriting its relative keys into the absolute
  `appDir`-prefixed form the runtime expects. Both bundlers require a regex
  _literal_ at the `require.context` call site, so an explanatory error is
  thrown when the resulting context is empty.

  ```tsx
  // webpack / Rspack / Rsbuild entry
  import {
    AppRouter,
    buildModulesFromContext,
  } from "@evolonix/react-router-next";

  const modules = buildModulesFromContext(
    // Inline the regex — see ROUTE_FILE_RE for the canonical pattern.
    require.context(
      "./app",
      true,
      /\/(page|layout|loading|error|default|template|not-found)\.(tsx|jsx|ts|js)$/,
    ),
    "/src/app",
  );

  <AppRouter modules={modules} appDir="/src/app" />;
  ```

  The shared `ROUTE_FILE_NAMES` constant also deduplicates the file list
  between `src/plugin/scan.ts` and the runtime so the two can't drift. The
  exported `AppRouterProps` and `RouteContext` types round out the public
  surface.

## 2.0.2

### Patch Changes

- [`4fb8e7e`](https://github.com/evolonix/react-router-next/commit/4fb8e7efaf058d434efb1fb0f6da264e1107e098) Thanks [@jasonruesch](https://github.com/jasonruesch)! - Fix parallel-route slots always falling back to `default.tsx`

  When a `@slot` subtree contained only `page.tsx` (no nested layout or children),
  the slot's routes were lowered to a pathless layout route with no descendants —
  which `useRoutes`/`matchRoutes` cannot match against any URL. The slot therefore
  always returned `null` and rendered `default.tsx`, even on the slot's own URL.

  The route lowering now preserves the inner `index` leaf when the surrounding
  route is pathless, so `useRoutes` can match the slot's `page.tsx` at the slot's
  parent URL while still falling back to `default.tsx` for deeper paths.

## 2.0.1

### Patch Changes

- [`4827dd9`](https://github.com/evolonix/react-router-next/commit/4827dd91060e6882f5a1811f087dcb082fde5088) Thanks [@jasonruesch](https://github.com/jasonruesch)! - Update READMEs to align with the new demo app. The root README replaces the dead `apps/demo/README.md` link and the stale `photos/`/`notes/` references with a tour of the demo's actual top-level routes (`basics`, `(marketing)`, `docs/[...slug]`, `search/[[...query]]`, `posts`, `transitions`, `dashboard`, `gallery`, `mail/[folderId]`, `projects/[orgId]/(catalog)`, `(overlay-host)`). The package README renames its illustrative examples from `notes/`→`posts/` and `photos/`→`gallery/` so the conventions match the names users will find in the live demo, and adds the `[postId]/error.tsx` and `not-found.tsx` files that the demo actually ships. No code or API changes.

## 2.0.0

### Major Changes

- [#31](https://github.com/evolonix/react-router-next/pull/31) [`0009903`](https://github.com/evolonix/react-router-next/commit/0009903e089eeab04ad0f487eff7cd86e8dd774b) Thanks [@jasonruesch](https://github.com/jasonruesch)! - Remove the `loader.ts` file convention.

  **Breaking**
  - The `loader.ts` filename is no longer recognized as a route convention. The Vite plugin's filesystem glob, the route-scan regex, and the runtime route-builder no longer pick up sibling `loader.ts` files, and the emitted `virtual:react-router-next/app-tree` `RouteModule` type no longer declares a `loader` member.
  - Pages that previously called `useLoaderData()` to read from a sibling `loader.ts` will have no data to read.
  - The "loader on intercepting route" and "loader inside @slot" build-time warnings are gone — those code paths have no loaders to detect anymore.

  **Migration**

  Move data fetching into a suspending hook. Wrap your data in a cached promise and call `use()` on it from the page. The injected `loading.tsx` still renders as the Suspense fallback, so the loading UX is unchanged:

  ```ts
  // _lib/use-thing.ts
  import { use } from "react";

  const cache = new Map<string, Promise<Thing>>();

  export function useThing(id: string): Thing {
    let p = cache.get(id);
    if (!p) {
      p = fetchThing(id);
      cache.set(id, p);
    }
    return use(p);
  }
  ```

  - Throw `notFound()` from inside the suspending promise chain to render the nearest `not-found.tsx`.
  - Throw a regular `Error` to render the nearest `error.tsx`.

  See `notes/_lib/use-notes.ts` and `inbox/_lib/use-message.ts` in the demo app for end-to-end templates.

  **Unchanged**
  - `notFound()`, `NotFoundError`, and `isNotFoundError` are still exported. They remain useful from suspending hooks and component render.
  - `parseRouteParams` continues to validate params from utility code where component hooks aren't available.

## 1.1.0

### Minor Changes

- [#27](https://github.com/evolonix/react-router-next/pull/27) [`ae2d37c`](https://github.com/evolonix/react-router-next/commit/ae2d37c5a66a8c5bcbd38be5395f3bf77633c54c) Thanks [@jasonruesch](https://github.com/jasonruesch)! - Slot- and intercept-scoped `loading.tsx` / `error.tsx` / `not-found.tsx`.

  **New**
  - Parallel-route slots (`@slot/`) now honor their own `error.tsx` and `not-found.tsx`. A render error inside a slot subtree is caught at the slot boundary, so the parent layout, the main `<Outlet />`, and sibling slots stay mounted instead of bubbling to the data router's root boundary.
  - Intercepting routes (`(.)x/`, `(..)x/`, `(...)x/`) now honor `loading.tsx`, `error.tsx`, and `not-found.tsx` inside the interceptor folder. The interceptor's `page.tsx` is wrapped in a framework Suspense + error boundary keyed by `location.key`, so the boundary remounts cleanly across navigations.
  - `notFound()` thrown from a route now renders the nearest ancestor `not-found.tsx` _without_ unmounting the surrounding layout chrome. The `errorElement` is attached to a pathless wrapper inside the layout's children instead of the layout route itself, matching Next.js's behavior.
  - Exported `useRouteError` from the package entry point. It's a drop-in replacement for react-router's hook that also works inside `error.tsx` files rendered by framework-managed boundaries (slots and intercepts), which don't sit on data-router routes with `id`s.

## 1.0.0

### Major Changes

- [#25](https://github.com/evolonix/react-router-next/pull/25) [`cf7076c`](https://github.com/evolonix/react-router-next/commit/cf7076cdcefe4ea2dfdf638d7706e2796e0c5442) Thanks [@jasonruesch](https://github.com/jasonruesch)! - v1 release.

  **Breaking**
  - Removed support for the optional single-dynamic segment pattern `[[name]]`. Use `[name]` for a required dynamic segment or `[[...name]]` for an optional catch-all. Folders named `[[name]]` are no longer recognized as a routing convention.

  **New**
  - `not-found.tsx` is now supported at any segment, not just the app root. The nearest ancestor's `not-found.tsx` renders for unmatched URLs under that segment.
  - Added a `notFound()` helper (plus `NotFoundError` / `isNotFoundError`) that can be thrown from loaders or components to short-circuit to the nearest ancestor `not-found.tsx`, bypassing any intermediate `error.tsx`.

## 0.6.0

### Minor Changes

- [#22](https://github.com/evolonix/react-router-next/pull/22) [`1b5848b`](https://github.com/evolonix/react-router-next/commit/1b5848b52a4902236bc97e2b0c381f703923488e) Thanks [@jasonruesch](https://github.com/jasonruesch)! - Fix intercepted routes to work with slots accurately

## 0.5.0

### Minor Changes

- [#20](https://github.com/evolonix/react-router-next/pull/20) [`855558f`](https://github.com/evolonix/react-router-next/commit/855558fc07b6ec464e50ff5661ba1c1724cad385) Thanks [@jasonruesch](https://github.com/jasonruesch)! - Add route pending features for navigation or loading boundary suspense

## 0.4.0

### Minor Changes

- [#18](https://github.com/evolonix/react-router-next/pull/18) [`bf72f76`](https://github.com/evolonix/react-router-next/commit/bf72f76c03f888b8eee0aa78b67e09b83bf05de2) Thanks [@jasonruesch](https://github.com/jasonruesch)! - `loading.tsx` rendered while a parent loader is pending or a descendant suspends — the injected boundary is both `useNavigation()`-aware and a `<Suspense>` fallback, so the same file covers `loader.ts` waits and suspending hooks (`use()`, React Query suspense, etc.)

## 0.3.1

### Patch Changes

- [#16](https://github.com/evolonix/react-router-next/pull/16) [`f335acb`](https://github.com/evolonix/react-router-next/commit/f335acb02068f2947a133ead55a6022673cd76a7) Thanks [@jasonruesch](https://github.com/jasonruesch)! - Host demo app on GitHub Pages

## 0.3.0

### Minor Changes

- [#7](https://github.com/evolonix/react-router-next/pull/7) [`e68af2a`](https://github.com/evolonix/react-router-next/commit/e68af2aeab19ff9d10f010843308c7bcc285bebe) Thanks [@jasonruesch](https://github.com/jasonruesch)! - Parallel route layouts now require an Outlet instead of children to be consistent with other layouts

## 0.2.1

### Patch Changes

- [`9e88da2`](https://github.com/evolonix/react-router-next/commit/9e88da29910318f17393886e6dfaab0958510e09) Thanks [@jasonruesch](https://github.com/jasonruesch)! - Update README documentation

## 0.2.0

### Minor Changes

- [#1](https://github.com/evolonix/react-router-next/pull/1) [`82477b3`](https://github.com/evolonix/react-router-next/commit/82477b3162db53978e60ca62b0306afbfe8a7f33) Thanks [@jasonruesch](https://github.com/jasonruesch)! - Initial public release as `@evolonix/react-router-next`.
