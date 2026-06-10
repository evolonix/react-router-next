# @evolonix/react-router-next-devtools

A dev-only floating overlay for
[`@evolonix/react-router-next`](https://github.com/evolonix/react-router-next).
Visualizes the **route tree**, the **active route branch**, and the current
**params** and **search params** — live, as you navigate.

## Install

```bash
npm i -D @evolonix/react-router-next-devtools
```

## Vite (zero-config)

Render it once inside your router — the root `layout.tsx` is the natural spot.
The `vite-client` entry reads the route tree from the `reactRouterNext()`
plugin's virtual module, so there's nothing to pass:

```tsx
// src/app/layout.tsx
import { RouteTreeDevtools } from "@evolonix/react-router-next-devtools/vite-client";
import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <>
      <Outlet />
      <RouteTreeDevtools />
    </>
  );
}
```

## Other bundlers

Pass your route config explicitly:

```tsx
import { RouteTreeDevtools } from "@evolonix/react-router-next-devtools";
import { buildRoutesFromModules } from "@evolonix/react-router-next";

const routes = buildRoutesFromModules(modules, appDir);

<RouteTreeDevtools routes={routes} />;
```

Without `routes`, the panel still shows the current location, params, and search
params — it just omits the full tree.

## Props

| Prop       | Type                              | Default                        |
| ---------- | --------------------------------- | ------------------------------ |
| `routes`   | `RouteObject[]`                   | —                              |
| `enabled`  | `boolean`                         | off when `NODE_ENV=production` |
| `position` | `"bottom-right" \| "bottom-left"` | `"bottom-right"`               |

It renders `null` in production by default, so it's safe to leave mounted.
