# @evolonix/react-router-next-devtools

## 0.1.0

### Minor Changes

- [#62](https://github.com/evolonix/react-router-next/pull/62) [`90f86b7`](https://github.com/evolonix/react-router-next/commit/90f86b71ba51eb52c49ceff8e68f06478c835057) Thanks [@jasonruesch](https://github.com/jasonruesch)! - New package: `@evolonix/react-router-next-devtools`, a dev-only floating overlay that visualizes the route tree, the active route branch, and the current params + search params as you navigate.
  - `RouteTreeDevtools` — render once inside your router; pass `routes` (e.g. from `buildRoutesFromModules`).
  - `@evolonix/react-router-next-devtools/vite-client` — zero-config for Vite apps; reads the route tree from the `reactRouterNext()` plugin's virtual module.

  Renders `null` when `NODE_ENV === "production"` by default, so it's safe to leave mounted.
