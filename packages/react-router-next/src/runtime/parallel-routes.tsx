import type { ComponentType, ReactElement, ReactNode } from "react";
import {
  useLocation,
  useMatches,
  useNavigationType,
  useParams,
  useRoutes,
  type RouteObject,
} from "react-router";

import { SegmentBoundary } from "./route-components";
import { parseRouteParams } from "./use-route-params";

export type SlotConfig = {
  routes: RouteObject[];
  defaultElement: ReactNode | null;
  ErrorComponent?: ComponentType;
  NotFoundComponent?: ComponentType;
};

type LayoutWithSlots = ComponentType<{
  params?: Record<string, string | string[] | undefined>;
  [slot: string]: unknown;
}>;

function SlotElement({ slot }: { slot: SlotConfig }): ReactElement {
  // This `useRoutes(...)` is a descendant `<Routes>` rendered inside the layout
  // that owns the slot. In dev, react-router warns that the parent route path
  // (e.g. "react-router-next") has no trailing "*", claiming child routes won't
  // render once you navigate deeper. That doesn't apply here: the layout route
  // is generated with real path children (its `index` and `:param` routes), so
  // it keeps matching at deeper URLs and this slot keeps rendering and matching.
  // The suggested "/*" fix is also incompatible — a splat can't coexist with
  // those path children. The warning is a dev-only false positive for parallel
  // slots; behavior is correct. See app-routes.tsx `nodeToRoute` (layout branch).
  const matched = useRoutes(slot.routes);
  const content: ReactNode = matched ?? slot.defaultElement;
  // `useRoutes(...)` doesn't honor `errorElement` (only the top-level data
  // router does), so wrap the slot output in our framework boundary so the
  // slot's own `error.tsx` / `not-found.tsx` actually catch render errors
  // inside the slot subtree instead of letting them bubble out to the data
  // router's root boundary.
  return (
    <SegmentBoundary
      ErrorComponent={slot.ErrorComponent}
      NotFoundComponent={slot.NotFoundComponent}
    >
      {content}
    </SegmentBoundary>
  );
}

/**
 * Wraps a layout that owns one or more `@slot` parallel routes. Each slot is
 * rendered into a `SlotElement` whose content is driven by `useRoutes(slot.routes)`
 * — i.e. the slot's own subtree is matched against the current URL independently
 * of the main outlet. The matched element (or the slot's `default.tsx`) is
 * passed to the user's layout as a named prop. The main flow is reached via
 * `<Outlet />` inside the layout, matching the convention for non-parallel
 * layouts in this package.
 */
export function ParallelLayout({
  Component,
  slots,
  route,
}: {
  Component: LayoutWithSlots;
  slots: Record<string, SlotConfig>;
  route: string;
}): ReactElement {
  const rrParams = useParams();
  const slotProps: Record<string, ReactNode> = {};
  for (const [name, slot] of Object.entries(slots)) {
    slotProps[name] = <SlotElement key={name} slot={slot} />;
  }
  const params = route.includes("[")
    ? parseRouteParams(route, rrParams)
    : undefined;
  return <Component {...slotProps} params={params} />;
}

/**
 * Re-mounts its template on every URL change by keying it on `location.pathname`.
 * Mirrors Next.js `template.tsx` semantics: like a layout, but state is not
 * preserved across navigations. The template itself renders `<Outlet />` for
 * the matched child, matching the convention for layouts in this package.
 */
export function TemplateRemount({
  Template,
}: {
  Template: ComponentType;
}): ReactElement {
  const { pathname } = useLocation();
  return <Template key={pathname} />;
}

/**
 * Renders the interceptor element on PUSH/REPLACE (soft) navigation, and the
 * original target element on POP (back/forward) and initial loads. Mirrors
 * Next.js intercepting-route semantics: a deep link or refresh shows the full
 * page; an in-app click shows the interceptor (e.g. modal).
 */
export function InterceptedRoute({
  Interceptor,
  Target,
}: {
  Interceptor: ReactNode;
  Target: ReactNode;
}): ReactElement {
  const navType = useNavigationType();
  return <>{navType === "POP" ? Target : Interceptor}</>;
}

/**
 * Slot-side counterpart to `InterceptedRoute`. A `@slot` is matched by its own
 * `useRoutes(slot.routes)`, which is isolated from the main outlet's matcher.
 * That isolated matcher contains only the intercept's dynamic pattern (e.g.
 * `:id`), so it would greedily match a *static* sibling URL too — e.g. a
 * `/projects/p1/settings` route would match a sibling `:taskId` intercept as
 * `taskId="settings"` and wrongly open the modal (which then 404s on the
 * non-existent task).
 *
 * The main data router does NOT have this problem: it ranks the static
 * `settings` route above the dynamic `[taskId]` one, so it lands on `settings`.
 * We delegate to that decision: render the interceptor only on soft navigation
 * AND only when the main router actually matched the intercept's target route
 * (identified by `targetRouteId`). Otherwise fall through to the slot's default,
 * exactly as if the slot pattern had not matched.
 */
export function SlotInterceptedRoute({
  Interceptor,
  Default,
  targetRouteId,
}: {
  Interceptor: ReactNode;
  Default: ReactNode;
  targetRouteId: string;
}): ReactElement {
  const navType = useNavigationType();
  const matches = useMatches();
  const mainMatchedTarget = matches.some((m) => m.id === targetRouteId);
  const showInterceptor = navType !== "POP" && mainMatchedTarget;
  return <>{showInterceptor ? Interceptor : Default}</>;
}
