import { buildRoutesFromModules } from "@evolonix/react-router-next";
import type { ReactElement } from "react";
import { appDir, modules } from "virtual:react-router-next/app-tree";
import {
  RouteTreeDevtools as BaseRouteTreeDevtools,
  type RouteTreeDevtoolsProps,
} from "./devtools";

// Built once from the Vite plugin's virtual route tree — no props required.
const routes = buildRoutesFromModules(modules, appDir);

/**
 * Zero-config devtools for Vite apps. Reads the route tree from the
 * `reactRouterNext()` plugin's virtual module, so you don't pass `routes`.
 * Render once inside your router (e.g. in the root `layout.tsx`).
 */
export function RouteTreeDevtools(
  props: Omit<RouteTreeDevtoolsProps, "routes">,
): ReactElement | null {
  return <BaseRouteTreeDevtools routes={routes} {...props} />;
}

export type { RouteTreeDevtoolsProps } from "./devtools";
