import { buildRoutesFromModules } from "@evolonix/react-router-next";
import type { ReactElement } from "react";
import type { RouteObject } from "react-router";
import { appDir, modules } from "virtual:react-router-next/app-tree";
import {
  RouteTreeDevtools as BaseRouteTreeDevtools,
  type RouteTreeDevtoolsProps,
} from "./devtools";

// Built lazily on first render, NOT at module top level. A route module that
// the virtual app-tree eagerly imports (e.g. the root `layout.tsx`) may import
// this module too, making the two circular — reading `modules` at init time
// would hit its temporal dead zone. By first render the app-tree module is
// fully initialized.
let cachedRoutes: RouteObject[] | null = null;
function getRoutes(): RouteObject[] {
  cachedRoutes ??= buildRoutesFromModules(modules, appDir);
  return cachedRoutes;
}

/**
 * Zero-config devtools for Vite apps. Reads the route tree from the
 * `reactRouterNext()` plugin's virtual module, so you don't pass `routes`.
 * Render once inside your router (e.g. in the root `layout.tsx`).
 */
export function RouteTreeDevtools(
  props: Omit<RouteTreeDevtoolsProps, "routes">,
): ReactElement | null {
  return <BaseRouteTreeDevtools routes={getRoutes()} {...props} />;
}

export type { RouteTreeDevtoolsProps } from "./devtools";
