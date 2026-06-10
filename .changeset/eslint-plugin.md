---
"eslint-plugin-react-router-next": minor
---

New package: `eslint-plugin-react-router-next`, ESLint rules for the filesystem-routing conventions.

- `valid-dynamic-segments` — flags malformed dynamic segments (`[]`, `[...]`, `[id`).
- `no-duplicate-dynamic-params` — flags a route path binding the same param name twice.
- `no-search-params-export` — the schema export is `searchSchema`; `searchParams` is the page prop.

Ships a flat-config `recommended` preset and an `appDir` option (default `"app"`). Folder-level checks (orphaned `default.tsx`, slot-without-layout, unreachable intercepts) are planned as a follow-up.
