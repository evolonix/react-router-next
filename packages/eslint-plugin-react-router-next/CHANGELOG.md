# eslint-plugin-react-router-next

## 0.1.0

### Minor Changes

- [#62](https://github.com/evolonix/react-router-next/pull/62) [`90f86b7`](https://github.com/evolonix/react-router-next/commit/90f86b71ba51eb52c49ceff8e68f06478c835057) Thanks [@jasonruesch](https://github.com/jasonruesch)! - New package: `eslint-plugin-react-router-next`, ESLint rules for the filesystem-routing conventions.
  - `valid-dynamic-segments` — flags malformed dynamic segments (`[]`, `[...]`, `[id`).
  - `no-duplicate-dynamic-params` — flags a route path binding the same param name twice.
  - `no-search-params-export` — the schema export is `searchSchema`; `searchParams` is the page prop.

  Ships a flat-config `recommended` preset and an `appDir` option (default `"app"`). Folder-level checks (orphaned `default.tsx`, slot-without-layout, unreachable intercepts) are planned as a follow-up.
