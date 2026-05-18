# react-router-next

Workspace monorepo containing **`@evolonix/react-router-next`** — a publishable npm package that brings Next.js-style filesystem routing to React Router 7 — and **`demo`**, the example app that exercises every feature of the package.

**Live demo:** <https://evolonix.github.io/react-router-next/>

## Layout

```
.
├── packages/
│   └── react-router-next/   # published library + Vite plugin + CLI
└── apps/
    └── demo/                # example app, depends on react-router-next via workspace
```

### `packages/react-router-next/`

The library that ships to npm. See [`packages/react-router-next/README.md`](packages/react-router-next/README.md) for installation and usage. Three entry points:

- **`@evolonix/react-router-next`** — runtime: `AppRouter`, `buildRoutesFromModules`, `useRouteParams`, `parseRouteParams`, `generateUrl`, and the `RouteParams` / `RouteProps` / `RouteModule` / `RouteModuleMap` types.
- **`@evolonix/react-router-next/vite`** — the `routeTypegen` Vite plugin and a programmatic `generateRouteTypes` API.
- **`@evolonix/react-router-next` bin** — `react-router-next typegen` for prebuild and CI use without Vite.

How types reach consumers is hybrid: at runtime, the Vite plugin serves per-route virtual modules (`virtual:react-router-next/<route-key>`); for type-checking, the plugin and CLI emit a single ambient `routes.d.ts` shim into `node_modules/.react-router-next/`, so `tsc` and editors infer per-route param shapes without Vite running.

### `apps/demo/`

A Vite + React 19 app that consumes the workspace package and demonstrates every routing feature. Each page is a real folder under [`apps/demo/src/app/`](apps/demo/src/app/) — open the folder next to a page to see how the convention maps to a URL:

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

Hosted at <https://evolonix.github.io/react-router-next/> — deployed from `main` by [`.github/workflows/deploy-demo.yml`](.github/workflows/deploy-demo.yml).

## Working in the repo

From the repo root:

```sh
npm install                       # install all workspaces
npm run dev                       # run the package build (tsup --watch) and the demo's Vite dev server concurrently
```

Per-workspace commands use npm workspaces:

```sh
npm run build -w @evolonix/react-router-next   # build the library (tsup → dist/)
npm run dev   -w @evolonix/react-router-next   # tsup --watch
npm run build -w demo                # tsc -b && vite build
npm run dev   -w demo                # vite dev server
npm run typegen -w demo              # regenerate the routes.d.ts shim
```

## Requirements

- Node ≥ 22
- npm ≥ 9 (uses npm workspaces)

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, the changesets release workflow, and PR expectations. For usage questions see [SUPPORT.md](SUPPORT.md); to report a vulnerability see [SECURITY.md](.github/SECURITY.md).

## License

[MIT](LICENSE) © Jason Ruesch
