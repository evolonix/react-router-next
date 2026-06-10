import {
  useMemo,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";
import {
  matchRoutes,
  useLocation,
  useParams,
  type RouteObject,
} from "react-router";

export type FlatRoute = {
  route: RouteObject;
  depth: number;
  /** Display label: the URL segment, `index`, or a layout marker. */
  label: string;
};

/**
 * Flatten a React Router route config into a depth-annotated list for display.
 * Pure (no React) so it's unit-testable. Carries the original `route` reference
 * so callers can match it against `matchRoutes(...)` output by identity.
 */
export function flattenRoutes(
  routes: readonly RouteObject[],
  depth = 0,
): FlatRoute[] {
  const out: FlatRoute[] = [];
  for (const route of routes) {
    const label = route.index
      ? "index"
      : route.path !== undefined && route.path !== ""
        ? route.path
        : "▢ layout";
    out.push({ route, depth, label });
    if (route.children) out.push(...flattenRoutes(route.children, depth + 1));
  }
  return out;
}

function isProduction(): boolean {
  try {
    return process.env.NODE_ENV === "production";
  } catch {
    return false;
  }
}

export type RouteTreeDevtoolsProps = {
  /**
   * The app's route config (e.g. `buildRoutesFromModules(modules, appDir)`).
   * When provided, the panel renders the full route tree with the active branch
   * highlighted. Omit to show just the current location, params, and matches.
   */
  routes?: RouteObject[];
  /** Force-enable/disable. Defaults to off when `NODE_ENV === "production"`. */
  enabled?: boolean;
  /** Panel corner. Default `bottom-right`. */
  position?: "bottom-right" | "bottom-left";
};

const PANEL: CSSProperties = {
  position: "fixed",
  bottom: "1rem",
  zIndex: 2147483647,
  font: "12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace",
  color: "#e5e7eb",
  background: "rgba(17,17,20,0.95)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "10px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
  maxWidth: "min(90vw, 360px)",
  maxHeight: "60vh",
  overflow: "auto",
  padding: "10px 12px",
};

const BUTTON: CSSProperties = {
  position: "fixed",
  bottom: "1rem",
  zIndex: 2147483647,
  font: "12px/1 ui-monospace, monospace",
  color: "#e5e7eb",
  background: "rgba(17,17,20,0.95)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "999px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
  padding: "8px 12px",
  cursor: "pointer",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): ReactElement {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ opacity: 0.55, textTransform: "uppercase", fontSize: 10 }}>
        {title}
      </div>
      <div style={{ marginTop: 4 }}>{children}</div>
    </div>
  );
}

/**
 * Floating, dev-only overlay that visualizes the current route. Render it once
 * inside your router (e.g. in the root `layout.tsx`). Vite users can use the
 * zero-config `@evolonix/react-router-next-devtools/vite-client` entry instead.
 */
export function RouteTreeDevtools({
  routes,
  enabled,
  position = "bottom-right",
}: RouteTreeDevtoolsProps): ReactElement | null {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const search = useMemo(
    () => [...new URLSearchParams(location.search)],
    [location.search],
  );
  const matches = useMemo(
    () => (routes ? (matchRoutes(routes, location) ?? []) : []),
    [routes, location],
  );
  const activeRoutes = useMemo(
    () => new Set(matches.map((m) => m.route)),
    [matches],
  );
  // Read params from React Router directly rather than from `matchRoutes`, so
  // they show even when no `routes` prop was passed (e.g. the base entry without
  // the Vite virtual module). `useParams()` reflects the actually-matched route.
  const params = useParams();
  const flat = useMemo(() => (routes ? flattenRoutes(routes) : []), [routes]);

  if (enabled === false || (enabled === undefined && isProduction())) {
    return null;
  }

  const side =
    position === "bottom-left" ? { left: "1rem" } : { right: "1rem" };

  if (!open) {
    return (
      <button
        type="button"
        style={{ ...BUTTON, ...side }}
        onClick={() => setOpen(true)}
        aria-label="Open react-router-next devtools"
      >
        ◆ routes
      </button>
    );
  }

  return (
    <div style={{ ...PANEL, ...side }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <strong>react-router-next</strong>
        <button
          type="button"
          onClick={() => setOpen(false)}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
          }}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <Section title="Location">
        <code>{location.pathname || "/"}</code>
      </Section>

      <Section title="Params">
        {Object.keys(params).length === 0 ? (
          <span style={{ opacity: 0.5 }}>none</span>
        ) : (
          Object.entries(params).map(([k, v]) => (
            <div key={k}>
              <span style={{ color: "#7dd3fc" }}>{k}</span>: {String(v)}
            </div>
          ))
        )}
      </Section>

      <Section title="Search params">
        {search.length === 0 ? (
          <span style={{ opacity: 0.5 }}>none</span>
        ) : (
          search.map(([k, v], i) => (
            <div key={`${k}-${i}`}>
              <span style={{ color: "#a7f3d0" }}>{k}</span>: {v}
            </div>
          ))
        )}
      </Section>

      {flat.length > 0 && (
        <Section title="Route tree">
          {flat.map((node, i) => {
            const active = activeRoutes.has(node.route);
            return (
              <div
                key={i}
                style={{
                  paddingLeft: node.depth * 12,
                  color: active ? "#fde68a" : undefined,
                  fontWeight: active ? 600 : 400,
                }}
              >
                {active ? "› " : "  "}
                {node.label}
              </div>
            );
          })}
        </Section>
      )}
    </div>
  );
}
