# react-router-next

Workspace monorepo containing **`@evolonix/react-router-next`** — a publishable npm package that brings Next.js-style filesystem routing to React Router 7 — alongside a **landing-page demo** and three **bundler demos** (Vite, Rsbuild, Webpack) that exercise every feature of the package.

**Live demo:** <https://evolonix.github.io/react-router-next/>

## Layout

```
.
├── packages/
│   └── react-router-next/   # published library + Vite plugin + CLI
└── apps/
    ├── demo/                # landing page (deployed at /)
    ├── demo-vite/           # Vite + plugin demo (deployed at /vite/)
    ├── demo-rsbuild/        # Rsbuild (Rspack) demo (deployed at /rsbuild/)
    └── demo-webpack/        # Webpack 5 demo (deployed at /webpack/)
```

### `packages/react-router-next/`

The library that ships to npm. See [`packages/react-router-next/README.md`](packages/react-router-next/README.md) for installation and usage. Three entry points:

- **`@evolonix/react-router-next`** — bundler-agnostic runtime: `AppRouter` (requires `modules` + `appDir` props), `buildRoutesFromModules`, `buildModulesFromContext`, `ROUTE_FILE_RE`, `useRouteParams`, `parseRouteParams`, `generateUrl`, and the `AppRouterProps` / `RouteParams` / `RouteProps` / `RouteModule` / `RouteModuleMap` / `RouteContext` types.
- **`@evolonix/react-router-next/vite-client`** — Vite-wired `AppRouter` that reads `modules`/`appDir` from the plugin's `virtual:react-router-next/app-tree` so you can mount it with zero props.
- **`@evolonix/react-router-next/vite`** — the `routeTypegen` Vite plugin and a programmatic `generateRouteTypes` API.
- **`@evolonix/react-router-next` bin** — `react-router-next typegen` for prebuild and CI use without Vite.

How types reach consumers is hybrid: under Vite, the plugin serves per-route virtual modules (`virtual:react-router-next/<route-key>`); for type-checking, the plugin and CLI emit a single ambient `routes.d.ts` shim into `node_modules/.react-router-next/`, so `tsc` and editors infer per-route param shapes without Vite running. Non-Vite consumers can skip the virtual modules entirely and import `RouteProps<"posts/[postId]">` / `useRouteParams("posts/[postId]")` / `generateUrl("posts/[postId]", …)` directly.

### `apps/demo/`

A small Vite + React 19 + Tailwind v4 landing page that introduces the package, walks through the Vite quickstart, and links to each bundler demo. Deployed at the repo's GitHub Pages root.

### `apps/demo-vite/`, `apps/demo-rsbuild/`, `apps/demo-webpack/`

Three apps that share the same `src/app/` route tree but compile with three different bundlers. They demonstrate every routing convention the package supports — open the folder next to each page to see how the convention maps to a URL:

- **`basics/`** — nested layouts and `<Outlet/>`.
- **`(marketing)/`** — route group (`about`, `pricing`) that organizes files without changing the URL.
- **`docs/[...slug]/`** — catch-all segments.
- **`search/[[...query]]/`** — optional catch-all.
- **`posts/`** — Suspense data fetching with `use()`, `loading.tsx`, `error.tsx`, `not-found.tsx`, and the `notFound()` helper for `[postId]` misses.
- **`transitions/`** — `template.tsx` remount-on-navigation.
- **`dashboard/`** — parallel-route slots: `@analytics` with scoped `loading.tsx` / `error.tsx`, and `@notifications` whose `default.tsx` renders when `/dashboard/settings` has no matching page in the slot.
- **`gallery/`** — the canonical intercept pattern: `@modal/(.)[id]` overlays the grid on soft-nav, `[id]/page.tsx` renders full-page on refresh, with a `_components/` private folder for the shared dialog.
- **`mail/[folderId]/`** — `(..)[messageId]` intercepts one filesystem level up out of a `@preview` slot.
- **`projects/[orgId]/(catalog)/`** — `(..)(..)[projectId]` pops both the slot and the catalog group so a nested feed can intercept its parent's detail route.
- **`(overlay-host)/`** — `(...)tour` interceptor anchored at the app root, overlaying a root-level page from anywhere in the tree.

`demo-vite` is the reference implementation — it uses the Vite plugin, the Vite-wired `<AppRouter />` from `@evolonix/react-router-next/vite-client` with zero props, and the per-route virtual modules. `demo-rsbuild` and `demo-webpack` import the bundler-agnostic `<AppRouter />` from `@evolonix/react-router-next`, reach the same route tree via `require.context` + `buildModulesFromContext`, and pass the modules to `<AppRouter modules={…} appDir={…} basename={…} />` — proof that the Vite plugin is optional, not required.

All four apps are deployed from `main` via [`.github/workflows/main.yml`](.github/workflows/main.yml). The root `build` script assembles them into a single `dist-pages/` artifact.

## Working in the repo

From the repo root:

```sh
npm install                       # install all workspaces
npm run dev                       # tsup --watch + demo-vite dev server, concurrently
npm run build                     # build the package + four apps + assemble dist-pages/
npm run preview:pages             # serve dist-pages/ at /react-router-next/ (matches GH Pages)
```

`preview:pages` is the easiest way to test the assembled site end-to-end: it mounts `dist-pages/` under `http://localhost:4444/react-router-next/` (matching the deployed path), with per-demo SPA fallback so deep links like `/react-router-next/vite/posts/1` resolve correctly.

Per-workspace commands use npm workspaces:

```sh
npm run build   -w @evolonix/react-router-next   # build the library (tsup → dist/)
npm run dev     -w @evolonix/react-router-next   # tsup --watch
npm run build   -w demo                          # build the landing page
npm run dev     -w demo-vite                     # vite dev server (port 5173)
npm run dev     -w demo-rsbuild                  # rsbuild dev server (port 3000)
npm run dev     -w demo-webpack                  # webpack-dev-server (port 8080)
npm run typegen -w demo-vite                     # regenerate the routes.d.ts shim
```

## Requirements

- Node ≥ 22
- npm ≥ 9 (uses npm workspaces)

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, the changesets release workflow, and PR expectations. For usage questions see [SUPPORT.md](SUPPORT.md); to report a vulnerability see [SECURITY.md](.github/SECURITY.md).

## License

[MIT](LICENSE) © Jason Ruesch
