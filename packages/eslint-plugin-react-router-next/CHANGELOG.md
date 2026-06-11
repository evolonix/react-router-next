# eslint-plugin-react-router-next

## 0.2.0

### Minor Changes

- [`9c47ad9`](https://github.com/evolonix/react-router-next/commit/9c47ad9e3f26fbb228c47901713c5c0ba9020ec1) Thanks [@jasonruesch](https://github.com/jasonruesch)! - Add five route-structure rules, all reasoning about how route files compile to
  React Router routes. They're part of the `recommended` config.
  - **`no-conflicting-routes`** (error) — flags `page` files that compile to the
    same React Router matcher and so match the same URLs. Covers route groups that
    wash out of the URL (`(marketing)/about` vs `about`), dynamic params that
    differ only by name (`[id]` vs `[slug]`, since the name doesn't disambiguate a
    match), and an optional catch-all (`[[...slug]]`) colliding with a sibling
    index page or a plain catch-all. Intercepting, `@slot`, and `_private`
    segments are excluded.
  - **`catch-all-must-be-last`** (error) — a catch-all (`[...slug]`/`[[...slug]]`)
    compiles to a React Router splat (`*`), which must end the path, so any segment
    after it (e.g. `docs/[...slug]/more/page.tsx`) is unreachable.
  - **`require-interceptor-target`** (error) — an intercepting route (`(.)x`,
    `(..)x`, etc.) must resolve to a page that actually renders that URL; otherwise
    the runtime throws while building the route tree.
  - **`no-interceptor-layout`** (warn) — a `layout` inside an interceptor is dropped
    at runtime (interceptors resolve to their target); move it to the target route.
  - **`slot-needs-layout`** (warn) — a parallel-route slot (`@slot`) needs a
    `layout` in its owning segment to render into, or the runtime ignores it.

## 0.1.0

### Minor Changes

- [#62](https://github.com/evolonix/react-router-next/pull/62) [`90f86b7`](https://github.com/evolonix/react-router-next/commit/90f86b71ba51eb52c49ceff8e68f06478c835057) Thanks [@jasonruesch](https://github.com/jasonruesch)! - New package: `eslint-plugin-react-router-next`, ESLint rules for the filesystem-routing conventions.
  - `valid-dynamic-segments` — flags malformed dynamic segments (`[]`, `[...]`, `[id`).
  - `no-duplicate-dynamic-params` — flags a route path binding the same param name twice.
  - `no-search-params-export` — the schema export is `searchSchema`; `searchParams` is the page prop.

  Ships a flat-config `recommended` preset and an `appDir` option (default `"app"`). Folder-level checks (orphaned `default.tsx`, slot-without-layout, unreachable intercepts) are planned as a follow-up.
