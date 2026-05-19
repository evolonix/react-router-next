---
"@evolonix/react-router-next": major
---

Split `<AppRouter />` into a bundler-agnostic core and a Vite-wired entry; add webpack/Rspack/Rsbuild support

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
