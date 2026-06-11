# eslint-plugin-react-router-next

ESLint rules that catch mistakes in
[`@evolonix/react-router-next`](https://github.com/evolonix/react-router-next)
route conventions.

## Install

```bash
npm i -D eslint-plugin-react-router-next
```

## Usage (flat config)

```js
// eslint.config.js
import reactRouterNext from "eslint-plugin-react-router-next";

export default [reactRouterNext.configs.recommended];
```

Or wire rules manually:

```js
import reactRouterNext from "eslint-plugin-react-router-next";

export default [
  {
    plugins: { "react-router-next": reactRouterNext },
    rules: {
      "react-router-next/valid-dynamic-segments": "error",
      "react-router-next/no-duplicate-dynamic-params": "error",
      "react-router-next/catch-all-must-be-last": "error",
      "react-router-next/no-conflicting-routes": "error",
      "react-router-next/require-interceptor-target": "error",
      "react-router-next/no-interceptor-layout": "warn",
      "react-router-next/slot-needs-layout": "warn",
      "react-router-next/no-search-params-export": "warn",
    },
  },
];
```

## Rules

| Rule                          | Description                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------ |
| `valid-dynamic-segments`      | Flags malformed dynamic segments (`[]`, `[...]`, `[id`). Use `[name]`/`[...name]`/`[[...name]]`. |
| `no-duplicate-dynamic-params` | Flags a route path that binds the same param name twice.                                         |
| `catch-all-must-be-last`      | A catch-all (`[...slug]`) compiles to a React Router splat, so nothing may follow it.            |
| `no-conflicting-routes`       | Flags `page` files that compile to the same React Router path (see below).                       |
| `require-interceptor-target`  | An intercepting route (`(.)x`) must have an existing page to intercept.                          |
| `no-interceptor-layout`       | A `layout` inside an interceptor is dropped at runtime; move it to the target.                   |
| `slot-needs-layout`           | A `@slot` needs a `layout` in its owning segment to render into.                                 |
| `no-search-params-export`     | The search schema export is `searchSchema`; `searchParams` is the page prop.                     |

Because route files ultimately render as React Router routes, two pages
"conflict" when they compile to the same matcher — React Router would rank them
equally and render whichever it sees first. `no-conflicting-routes` catches
every shape of this:

- route groups that wash out: `(marketing)/about` and `about` → `/about`;
- dynamic params that differ only by name: `[id]` and `[slug]` both → `/:param`
  (the name doesn't disambiguate a match);
- an optional catch-all colliding with an index page: `[[...slug]]` also matches
  its parent path, so it clashes with a sibling `page` (and with a plain
  `[...slug]`).

Intercepting routes (`(.)x`), `@slot` folders, and `_private` folders are
excluded — they intentionally don't compete for the same URL.

`no-conflicting-routes`, `require-interceptor-target`, and `slot-needs-layout`
analyze the whole route tree, so they read the app directory from disk (keyed off
each route file's own path). The other rules work from the filename alone.

All rules accept an `appDir` option (default `"app"`) to locate the route tree:

```js
"react-router-next/valid-dynamic-segments": ["error", { appDir: "routes" }]
```

## Roadmap

Remaining folder-level check: orphaned `default.tsx` (a parallel-route fallback
with no matching slot). Its semantics are the fuzziest of the set, so it's
deferred until the convention settles.
