---
"@evolonix/react-router-next": minor
---

Add Next.js-style `searchParams` page props and typed search params.

- **Next parity:** every page now receives a `searchParams` prop alongside `params` (layouts don't, matching Next). `RouteProps` is exported for all routes and carries both.
- **Typed + validated (opt-in):** a route that exports a `searchSchema` (any [Standard Schema](https://standardschema.dev) — Zod, Valibot, ArkType) gets a typed, validated `searchParams` prop, a typed `useSearchParams()` (with setter), and a `generate(params, { search })` that serializes the query string. Invalid query strings throw `SearchParamsError` into the nearest `error.tsx`. The `searchSchema` export name is distinct from the Next-style `searchParams` page prop.
- **Setter accepts navigation options:** `setSearch(next, { replace, preventScrollReset, … })` forwards React Router's `NavigateOptions` — useful for search-as-you-type fields.
- Without codegen, the `searchParams` prop is the untyped record; `useSearchParams(routeKey, schema)` gives typed access.

Also: `loading.tsx` Suspense boundaries now key on `location.pathname` instead of `location.key`, so a search- or hash-only navigation no longer remounts the route subtree — preserving input focus and component state as the query string updates. The fallback still fires on path navigation, matching Next.

New exports: `useSearchParams`, `parseSearchParams`, `safeParseSearchParams`, `SearchParamsError`, `serializeSearch`, `deserializeSearch`, and the `GenerateOptions`, `SearchInput`, `SearchPrimitive`, `SearchParamsRecord`, `InferSearch`, `SetSearch`, and `SetSearchOptions` types. Additive — existing `generate`/`useRouteParams` usage is unchanged.
