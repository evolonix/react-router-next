# react-router-next

Next.js-style filesystem routing for React Router 7, delivered as a Vite plugin plus a tiny runtime. Drop a `page.tsx` into a folder, get a typed route — including typed params, typed `generate(...)` URL builders, nested layouts/loading/error boundaries, parallel routes (`@slot`), intercepting routes (`(.)`/`(..)`/`(...)`), `template.tsx` remount-on-navigation, and `_private` colocation folders.

**Live demo:** <https://evolonix.github.io/react-router-next/> — every convention below is wired up and clickable.

> Peer dependencies: `react ≥ 19`, `react-dom ≥ 19`, `react-router ≥ 7`, `vite ≥ 5`.

## Install

```sh
npm i @evolonix/react-router-next react-router
```

## Quick start

### 1. Add the Vite plugin

```ts
// vite.config.ts
import react from "@vitejs/plugin-react";
import { routeTypegen } from "@evolonix/react-router-next/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [routeTypegen(), react()],
});
```

### 2. Mount the router

Vite users import `<AppRouter />` from the `/vite-client` subpath — the wrapper reads `modules` and `appDir` from the plugin's virtual module, so you can mount it with zero props:

```tsx
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "@evolonix/react-router-next/vite-client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
```

> **Other bundlers (Webpack, Rspack, Rsbuild)** — import the bundler-agnostic `<AppRouter />` from `@evolonix/react-router-next` and pass `modules` + `appDir` explicitly. See [Use without Vite](#use-without-vite).

### 3. Drop pages into `src/app/`

```
src/app/
├── layout.tsx                 # wraps everything below
├── page.tsx                   # /
├── not-found.tsx              # not-found boundary (root only)
├── (marketing)/               # route group — folder name in (parens) is stripped
│   ├── about/page.tsx         # /about
│   └── pricing/page.tsx       # /pricing
├── posts/                        # data fetching via Suspense + use()
│   ├── _lib/use-posts.ts         # usePosts()/usePost() — promise cache + use()
│   ├── layout.tsx
│   ├── loading.tsx               # Suspense fallback for any descendant that suspends
│   ├── not-found.tsx             # rendered when notFound() is thrown for a missing post
│   ├── page.tsx                  # /posts — usePosts() suspends on first render
│   └── [postId]/
│       ├── error.tsx             # scoped error boundary for the detail route
│       └── page.tsx              # /posts/:postId — usePost(id) suspends per id
├── dashboard/                 # parallel-route slots
│   ├── layout.tsx             # function ({ analytics, notifications }) — main flow via <Outlet/>
│   ├── page.tsx               # /dashboard main panel
│   ├── settings/page.tsx      # /dashboard/settings main panel
│   └── @analytics/            # parallel slot — invisible in URL
│       ├── page.tsx           # rendered for /dashboard
│       ├── settings/page.tsx  # rendered for /dashboard/settings
│       └── default.tsx        # fallback when slot has no match
└── gallery/                   # intercepting route inside a parallel slot
    ├── layout.tsx             # function ({ modal }) — main flow via <Outlet/>, modal via slot prop
    ├── page.tsx               # /gallery
    ├── [id]/
    │   ├── page.tsx           # full-page detail (POP / refresh)
    │   └── template.tsx       # remounts on every navigation
    ├── @modal/                # parallel slot — invisible in URL
    │   ├── default.tsx        # null fallback when no item is selected
    │   └── (.)[id]/page.tsx   # modal interceptor — rendered on PUSH/REPLACE
    └── _components/           # private folder — never routed, importable
        └── dialog.tsx
```

Folder-name conventions:

| Pattern       | URL effect                                                           | TypeScript shape        |
| ------------- | -------------------------------------------------------------------- | ----------------------- |
| `foo`         | `/foo`                                                               | —                       |
| `(group)`     | (segment removed)                                                    | —                       |
| `[id]`        | `:id`                                                                | `{ id: string }`        |
| `[...slug]`   | catch-all                                                            | `{ slug: string[] }`    |
| `[[...slug]]` | optional catch-all                                                   | `{ slug?: string[] }`   |
| `@slot`       | (segment removed) — contents become a slot prop on the parent layout | —                       |
| `_private`    | folder is skipped by routing (still importable from siblings)        | —                       |
| `(.)x`        | intercepts URL `<parent>/x` — same level as containing folder        | inherits `x`'s shape    |
| `(..)x`       | intercepts one filesystem level up                                   | inherits target's shape |
| `(..)(..)x`   | intercepts two filesystem levels up                                  | inherits target's shape |
| `(...)x`      | intercepts `/x` from the app root                                    | inherits target's shape |

File-name conventions inside a route folder:

| File            | Role                                                                                                                                                                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `page.tsx`      | Leaf component for the route                                                                                                                                                                                                                                 |
| `layout.tsx`    | Wraps children via `<Outlet/>`. With sibling `@slot/` folders, the layout also receives each slot as a named prop alongside the outlet.                                                                                                                      |
| `template.tsx`  | Like `layout.tsx` but remounts on every navigation (keyed on `pathname`).                                                                                                                                                                                    |
| `default.tsx`   | Fallback inside a `@slot/` directory when the URL doesn't match any of the slot's pages.                                                                                                                                                                     |
| `loading.tsx`   | Rendered while React Router transitions **or** a descendant suspends — the injected boundary is both `useNavigation()`-aware and a `<Suspense>` fallback, so the same file covers nav transitions and suspending hooks (`use()`, React Query suspense, etc.) |
| `error.tsx`     | `errorElement` for the route                                                                                                                                                                                                                                 |
| `not-found.tsx` | Renders when no descendant route matches a URL under this segment, or when the segment (or one below) calls `notFound()`. Supported at any depth — the nearest ancestor wins.                                                                                |

### 4. Use the typed helpers

For each route folder the plugin exposes a virtual module — `virtual:react-router-next/<route-key>` — that mirrors the folder layout, with the root represented as `_root`:

The runtime renders each `page.tsx` with its `RouteProps` already wired up — `params` is parsed from the URL (typed from the folder name) and passed in as a prop, so the component can destructure it directly without calling `useParams`/`useRouteParams`. The virtual module only exports `RouteProps` (and `useRouteParams`) for routes that actually have params; paramless routes can omit the prop entirely.

```tsx
// src/app/posts/[postId]/page.tsx
import type { RouteProps } from "virtual:react-router-next/posts/[postId]";
import { usePost } from "../_lib/use-posts";

export default function PostPage({ params }: RouteProps) {
  const post = usePost(params.postId); // suspends; loading.tsx renders
  return (
    <article>
      {post.title} (id: {params.postId})
    </article>
  );
}
```

```tsx
// any other component
import { generate as generatePost } from "virtual:react-router-next/posts/[postId]";

<NavLink to={generatePost({ postId: "a" })}>First post</NavLink>;
```

```tsx
// src/app/posts/[postId]/page.tsx
import { useRouteParams } from "virtual:react-router-next/posts/[postId]";

export default function PostPage() {
  const { postId } = useRouteParams();
  return <article>Post id: {postId}</article>;
}
```

The runtime hook `useRouteParams` is also re-exported from the package itself if you'd rather not pin the route literal:

```tsx
import { useRouteParams } from "@evolonix/react-router-next";
const { postId } = useRouteParams("posts/[postId]");
```

The same goes for `generateUrl` — pass the route literal as the first argument and the params object as the second to build a URL without the per-route `generate(params)` helper:

```tsx
import { generateUrl } from "@evolonix/react-router-next";
<NavLink to={generateUrl("posts/[postId]", { postId: "a" })}>
  First post
</NavLink>;
```

## Use without Vite

The runtime is bundler-agnostic. There are two ways to wire it up under webpack / Rspack / Rsbuild (or anything else with a `resolve.alias`).

### Option A — prop-based, no codegen

Build the `modules` map however your bundler enumerates a directory and pass it in as a prop. For webpack/Rspack/Rsbuild, the package ships `buildModulesFromContext` to convert a `require.context` into the shape the runtime expects:

```tsx
// src/main.tsx (webpack / Rspack / Rsbuild)
/// <reference types="webpack-env" />
import {
  AppRouter,
  buildModulesFromContext,
} from "@evolonix/react-router-next";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// webpack/Rspack's require.context analyzer needs a regex *literal* at the
// call site — an imported identifier produces an empty context. The package's
// `ROUTE_FILE_RE` is the source of truth; keep this regex in sync.
const APP_DIR = "/src/app";
const modules = buildModulesFromContext(
  require.context(
    "./app",
    true,
    /\/(page|layout|loading|error|default|template|not-found)\.(tsx|jsx|ts|js)$/,
  ),
  APP_DIR,
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter modules={modules} appDir={APP_DIR} />
  </StrictMode>,
);
```

The trade-off: source code diverges from the Vite path. Per-route `generate(params)` helpers aren't available, so use the package's `useRouteParams("posts/[postId]")` / `generateUrl("posts/[postId]", …)` instead.

### Option B — `virtual:` imports via the codegen CLI

For source-level parity with the Vite path (same `import … from "virtual:react-router-next/..."` lines), run the codegen CLI before each build/dev step. It writes physical `.js` shims that mirror the Vite plugin's virtual modules, plus an `aliases.json` map of specifier → file path.

```sh
react-router-next gen   # runs typegen + codegen in one step
```

Output under `node_modules/.react-router-next/`:

```
├── routes.d.ts        # ambient types (typegen)
├── aliases.json       # specifier → file path map (data)
├── app-tree.js        # exports { modules, appDir }
└── routes/
    ├── _root.js       # virtual:react-router-next/_root
    └── …              # one .js per discovered route key
```

Wiring depends on how the bundler dispatches requests with a `scheme:` prefix:

- **webpack / Rspack** — both short-circuit any `/^[a-z]+:/` request as a URI scheme _before_ `resolve.alias` runs, so `aliases.json` can't be spread directly. Instead, register a `NormalModuleReplacementPlugin` (apps/demo-webpack has a working example) that reads `aliases.json` and rewrites `virtual:react-router-next/...` to the codegen file paths.
- **Rollup / esbuild / Parcel** — `aliases.json` is plain specifier → path data; feed it into the corresponding alias plugin's input shape and the `virtual:` requests resolve directly.

Once wired, write the same imports as a Vite consumer:

```tsx
import {
  generate,
  useRouteParams,
} from "virtual:react-router-next/posts/[postId]";
```

Add the CLI to a `prebuild` script so the output stays fresh for production builds. During dev, pass `--watch`:

```sh
react-router-next gen --watch
```

`--watch` keeps the CLI running, reruns codegen on route file add/unlink, and lazy-loads `chokidar` — an **optional peer dependency** the CLI installs only on demand. Consumers who never use `--watch` don't need it; consumers who do should `npm i -D chokidar`.

## Build your own router

`<AppRouter />` is a thin wrapper around `createBrowserRouter` plus the package's filesystem-to-`RouteObject[]` builder. If you need a different router (memory router for tests, hash router, SSR via `createStaticRouter`, custom `RouterProvider` props, route post-processing, etc.) import the builder directly and feed it the same virtual module the Vite-wired entry uses:

```tsx
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import {
  buildRoutesFromModules,
  type RouteModuleMap,
} from "@evolonix/react-router-next";
// @ts-expect-error virtual module is provided by the routeTypegen Vite plugin
import { modules, appDir } from "virtual:react-router-next/app-tree";

const routes = buildRoutesFromModules(modules as RouteModuleMap, appDir);
const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
```

The returned `RouteObject[]` is plain React Router 7 — pass it to any router factory, splice in extra routes, or wrap the elements before mounting.

## Parallel routes (`@slot`)

A folder prefixed with `@` doesn't contribute a URL segment — instead, its contents are matched independently against the current URL and rendered in the parent layout as a named prop. The main flow still comes through `<Outlet />`; the layout's signature gains one extra prop per slot:

```tsx
// src/app/dashboard/layout.tsx
import { Outlet } from "react-router";

export default function DashboardLayout({
  analytics,
}: {
  analytics: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[2fr_1fr]">
      <main>
        <Outlet />
      </main>
      <aside>{analytics}</aside>
    </div>
  );
}
```

Each slot subtree can have its own `page.tsx` files (matching the parent's URL space) and a `default.tsx` fallback rendered when the URL doesn't match any of the slot's explicit pages.

> **Caveat:** slot subtrees are matched via `useRoutes()` outside React Router's data router. They render alongside the main outlet but aren't part of the data-router tree. Fetch slot data with the same Suspense + `use()` pattern the rest of the app uses.

## Intercepting routes (`(.)`/`(..)`/`(...)`)

A folder whose name starts with `(.)`, `(..)`, `(..)(..)`, or `(...)` is an **interceptor**: its `page.tsx` is rendered when the user soft-navigates (PUSH/REPLACE) to a target URL elsewhere in the tree. On reload, back/forward, or direct visit, the original target page renders instead. The interceptor and the target share the same routeKey and `useRouteParams`/`generate` virtual module.

Prefix semantics (counted in **filesystem** levels — slots count, group folders count, but the prefix itself does not):

- `(.)x` — same level as the interceptor's containing folder; appends `x`.
- `(..)x` — pops one filesystem level above, then appends `x`.
- `(..)(..)x` — pops two levels.
- `(...)x` — anchors at the app root.

### The canonical pattern: interceptor inside a parallel slot

The Next.js-canonical "click a thumbnail → item overlays the grid" pattern combines an interceptor with a `@slot` so the underlying page stays mounted behind the modal:

```
gallery/
├── layout.tsx                # function ({ modal }) { return <><Outlet />{modal}</> }
├── page.tsx                  # /gallery — grid (stays mounted on soft-nav)
├── [id]/page.tsx             # /gallery/:id — full-page detail (POP / refresh)
└── @modal/                   # parallel slot — invisible in URL
    ├── default.tsx           # `return null` — fallback when no item is selected
    └── (.)[id]/page.tsx      # /gallery/:id — modal (PUSH / REPLACE from in-app Link)
```

On soft-nav to `/gallery/:id`, the `@modal` slot matches the interceptor and the main outlet "freezes" to `gallery/page.tsx`, so the grid stays mounted under the modal. On hard load / refresh / POP, the slot falls back to `default.tsx` and the main outlet renders the full-page `[id]/page.tsx`. The slot's `default.tsx` is required — without it the slot would render its previous match and leave a stale modal mounted after the URL changes back to `/gallery`.

A bare interceptor without the slot (`gallery/(.)[id]/page.tsx`) still works — but it swaps the page element outright instead of overlaying it, so the grid unmounts on soft-nav. Use the slot variant when you want true overlay layering.

> **Caveats:** a `layout.tsx` inside an interceptor folder is dropped with a build-time warning. The intercept target route must exist — otherwise the build fails (a refresh on the URL has to render _something_). The "freeze" behavior is a static approximation of Next.js's freeze-to-pre-nav-URL: the main outlet always anchors to the parent layout's `page.tsx`, not to whichever sibling URL the user navigated _from_.

## `template.tsx` and `_private` folders

- `template.tsx` works like `layout.tsx`, but the wrapper is keyed on `useLocation().pathname` so it remounts on every navigation. Useful for entry transitions or `useEffect`-based instrumentation that should fire per-navigation.
- A folder whose name starts with `_` is skipped by the router entirely. Use it to colocate components, helpers, or fixtures alongside your routes without producing a URL.

## `not-found.tsx` and the `notFound()` helper

Drop a `not-found.tsx` at any segment to render a scoped 404 for unmatched URLs under that segment. When several `not-found.tsx` files exist along an ancestor chain, the nearest one to the unmatched URL wins.

Throw `notFound()` from a suspending hook or a component during render to short-circuit to the same boundary — for example, when a resource lookup misses:

```ts
// src/app/posts/_lib/use-posts.ts
import { notFound } from "@evolonix/react-router-next";
import { use } from "react";

const cache = new Map<string, Promise<Post>>();

export function usePost(id: string): Post {
  let p = cache.get(id);
  if (!p) {
    p = fetchPost(id).then((post) => {
      if (!post) notFound();
      return post;
    });
    cache.set(id, p);
  }
  return use(p);
}
```

The thrown `NotFoundError` bypasses any `error.tsx` in between and renders the nearest `not-found.tsx`.

## How types work without running Vite

The plugin (and the bundled `react-router-next` CLI) emit a single ambient `routes.d.ts` shim into `node_modules/.react-router-next/`. The shim contains one `declare module 'virtual:react-router-next/<route-key>' { … }` block per discovered route, so `tsc` and editors resolve the imports and infer per-route param shapes — even when Vite isn't running.

Add the shim to your tsconfig:

```jsonc
// tsconfig.app.json
{
  "include": ["src", "node_modules/.react-router-next/routes.d.ts"],
}
```

In CI, run typegen before `tsc`:

```jsonc
// package.json
{
  "scripts": {
    "typegen": "react-router-next typegen",
    "prebuild": "npm run typegen",
    "build": "tsc -b && vite build",
  },
}
```

## Plugin options

```ts
routeTypegen({
  appDir: "src/app", // default
  outDir: "node_modules/.react-router-next", // default
});
```

The CLI mirrors these:

```sh
react-router-next typegen \
  --app-dir=src/app \
  --out-dir=node_modules/.react-router-next
```

## License

MIT
