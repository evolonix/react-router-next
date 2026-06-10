---
"@evolonix/react-router-next-devtools": minor
---

New package: `@evolonix/react-router-next-devtools`, a dev-only floating overlay that visualizes the route tree, the active route branch, and the current params + search params as you navigate.

- `RouteTreeDevtools` — render once inside your router; pass `routes` (e.g. from `buildRoutesFromModules`).
- `@evolonix/react-router-next-devtools/vite-client` — zero-config for Vite apps; reads the route tree from the `reactRouterNext()` plugin's virtual module.

Renders `null` when `NODE_ENV === "production"` by default, so it's safe to leave mounted.
