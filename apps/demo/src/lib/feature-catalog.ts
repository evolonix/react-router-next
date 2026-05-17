export type FeatureCategory =
  | "get-started"
  | "routing"
  | "data-loading"
  | "boundaries"
  | "advanced-layouts"
  | "type-safe-urls";

export type RoutePointer = {
  /** React Router URL pattern, e.g. "/inbox/:id". */
  pattern: string;
  /** Concrete URL the navigation link should hit. */
  href: string;
  /** Optional override for the link label. Defaults to `href`. */
  label?: string;
};

export type FeatureEntry = {
  id: string;
  category: FeatureCategory;
  name: string;
  /** Convention shorthand, e.g. "@slot/, default.tsx". */
  convention: string;
  description: string;
  whatToLookFor: string[];
  /** Source files (relative to `src/app/`) that implement the feature. */
  files: string[];
  /** One or more routes that demonstrate the feature. The first is canonical. */
  routes: RoutePointer[];
};

export const CATEGORY_ORDER: FeatureCategory[] = [
  "get-started",
  "routing",
  "data-loading",
  "boundaries",
  "advanced-layouts",
  "type-safe-urls",
];

export const CATEGORY_LABEL: Record<FeatureCategory, string> = {
  "get-started": "Get started",
  routing: "Routing",
  "data-loading": "Data & loading",
  boundaries: "Boundaries",
  "advanced-layouts": "Advanced layouts",
  "type-safe-urls": "Type-safe URLs",
};

export const FEATURE_ENTRIES: FeatureEntry[] = [
  // ── Get started ───────────────────────────────────────────────────────
  {
    id: "overview",
    category: "get-started",
    name: "Overview",
    convention: "AppRouter",
    description:
      "Landing page with a hero and category cards. Reading order across the sidebar mirrors how the feature set builds up.",
    whatToLookFor: [
      "Sidebar groups every feature into one of six categories.",
      "Every demo page includes a dismissible callout describing the feature.",
      "Source files are viewable inline with syntax highlighting.",
    ],
    files: ["page.tsx", "layout.tsx"],
    routes: [{ pattern: "/", href: "/", label: "/" }],
  },
  {
    id: "file-conventions",
    category: "get-started",
    name: "File conventions",
    convention:
      "page · layout · template · loading · error · not-found · default",
    description:
      "Reference for every special filename the router recognizes inside a route folder.",
    whatToLookFor: [
      "Each filename has one responsibility — no opaque magic.",
      "Anything not on the list is left as a regular module import.",
    ],
    files: ["(docs)/conventions/page.tsx"],
    routes: [{ pattern: "/conventions", href: "/conventions" }],
  },
  {
    id: "folder-conventions",
    category: "get-started",
    name: "Folder conventions",
    convention: "(group) · [id] · @slot · _private · (.)x · (..)x · (...)x",
    description:
      "Reference for every special folder name. The router classifies each at build time, so folder naming IS the routing API.",
    whatToLookFor: [
      "Route groups stay invisible in the URL.",
      "Inside @slot, (.) and (..) collapse to the same target — use (..)(..) to escape a real folder.",
    ],
    files: ["(docs)/folders/page.tsx"],
    routes: [{ pattern: "/folders", href: "/folders" }],
  },

  // ── Routing ───────────────────────────────────────────────────────────
  {
    id: "route-groups",
    category: "routing",
    name: "Route groups",
    convention: "(group)/",
    description:
      "Parenthesized folder names organize the file tree without affecting URLs. Useful for sharing a layout across unrelated pages.",
    whatToLookFor: [
      "/about and /pricing both have no marketing/ in their URL.",
      "Both pages share the (marketing)/layout.tsx wrapper.",
    ],
    files: [
      "(marketing)/layout.tsx",
      "(marketing)/about/page.tsx",
      "(marketing)/pricing/page.tsx",
    ],
    routes: [
      { pattern: "/about", href: "/about" },
      { pattern: "/pricing", href: "/pricing" },
    ],
  },
  {
    id: "dynamic-segments",
    category: "routing",
    name: "Dynamic segments",
    convention: "[id]/",
    description:
      "Bracket-named folders capture URL segments. Params are inferred per route and surface in both useParams() and the typed RouteProps.",
    whatToLookFor: [
      "params.id is typed as string with no manual annotation.",
      "The same id is fed into the suspending hook to fetch one message.",
    ],
    files: ["inbox/[id]/page.tsx", "inbox/_lib/use-message.ts"],
    routes: [
      { pattern: "/inbox", href: "/inbox" },
      { pattern: "/inbox/:id", href: "/inbox/1", label: "/inbox/1" },
    ],
  },
  {
    id: "catch-all",
    category: "routing",
    name: "Catch-all segments",
    convention: "[...slug]/",
    description:
      "Captures every remaining path segment as an array. A bare visit to the parent (with no segments) does not match — the catch-all is required.",
    whatToLookFor: [
      "/docs/intro has slug = ['intro'].",
      "/docs/api/v2/reference has slug = ['api', 'v2', 'reference'].",
      "Bare /docs falls through to the segment's not-found.",
    ],
    files: ["docs/[...slug]/page.tsx"],
    routes: [
      { pattern: "/docs/*", href: "/docs/intro" },
      { pattern: "/docs/*", href: "/docs/api/v2/reference" },
    ],
  },
  {
    id: "optional-catch-all",
    category: "routing",
    name: "Optional catch-all",
    convention: "[[...slug]]/",
    description:
      "Like [...slug] but also matches the bare path with no extra segments. The router emits both an index leaf and a splat under the same folder.",
    whatToLookFor: [
      "/files matches with slug = undefined.",
      "/files/readme matches with slug = ['readme'].",
    ],
    files: ["files/[[...slug]]/page.tsx"],
    routes: [
      { pattern: "/files", href: "/files" },
      { pattern: "/files/*", href: "/files/readme" },
    ],
  },

  // ── Data & loading ────────────────────────────────────────────────────
  {
    id: "suspense-loading",
    category: "data-loading",
    name: "Suspense data fetching",
    convention: "loading.tsx + use()",
    description:
      "A page suspends by calling use() on a cached promise. The injected loading.tsx renders as the Suspense fallback — the same file covers navigation transitions and in-render suspending.",
    whatToLookFor: [
      "/notes suspends inside the page; loading.tsx catches it as a Suspense fallback.",
      "Pre-cached promises (use-notes.ts, use-message.ts) deduplicate across renders.",
    ],
    files: [
      "notes/page.tsx",
      "notes/loading.tsx",
      "notes/_lib/use-notes.ts",
      "inbox/[id]/page.tsx",
      "inbox/_lib/use-message.ts",
    ],
    routes: [
      { pattern: "/notes", href: "/notes" },
      { pattern: "/notes/:noteId", href: "/notes/a", label: "/notes/a" },
      { pattern: "/inbox", href: "/inbox" },
    ],
  },
  {
    id: "is-route-pending",
    category: "data-loading",
    name: "useIsRoutePending",
    convention: "useIsRoutePending()",
    description:
      "Imperative hook that returns true whenever React Router is transitioning or any descendant Suspense boundary is pending. The global progress strip uses this.",
    whatToLookFor: [
      "The dot in the live-value chip lights up while you wait.",
      "The progress strip at the top of the page reads the same value.",
    ],
    files: ["components/ui/route-progress.tsx", "inbox/_lib/use-message.ts"],
    routes: [
      { pattern: "/inbox", href: "/inbox" },
      { pattern: "/notes", href: "/notes" },
    ],
  },

  // ── Boundaries ────────────────────────────────────────────────────────
  {
    id: "error-boundary",
    category: "boundaries",
    name: "error.tsx boundary",
    convention: "error.tsx",
    description:
      "Catches render errors and thrown values from suspending hooks. useRouteError() surfaces the thrown value.",
    whatToLookFor: [
      "/inbox/999 throws from the suspending hook and lands in the error boundary.",
      "The layout above remains mounted — only the inner subtree is replaced.",
    ],
    files: ["inbox/[id]/error.tsx", "inbox/_lib/use-message.ts"],
    routes: [
      { pattern: "/inbox", href: "/inbox" },
      {
        pattern: "/inbox/:id",
        href: "/inbox/999",
        label: "/inbox/999",
      },
    ],
  },
  {
    id: "not-found",
    category: "boundaries",
    name: "not-found + notFound()",
    convention: "not-found.tsx, notFound()",
    description:
      "Per-segment 404 element. Triggered by an unmatched splat OR an explicit notFound() throw, which bypasses error.tsx and renders the nearest ancestor not-found.tsx.",
    whatToLookFor: [
      "/inbox/missing calls notFound() from the suspending hook and lands on inbox/not-found.tsx.",
      "Deep unmatched paths under /inbox hit the segment's splat fallback.",
    ],
    files: ["inbox/not-found.tsx", "inbox/_lib/use-message.ts"],
    routes: [
      { pattern: "/inbox", href: "/inbox" },
      {
        pattern: "/inbox/:id",
        href: "/inbox/missing",
        label: "/inbox/missing",
      },
    ],
  },
  {
    id: "slot-boundaries",
    category: "boundaries",
    name: "Slot-scoped boundaries",
    convention: "@slot/loading.tsx, @slot/error.tsx",
    description:
      "loading.tsx and error.tsx inside a parallel slot only affect that slot's render. The main outlet and sibling slots keep working.",
    whatToLookFor: [
      "Visiting /dashboard shows the notifications slot's own skeleton.",
      "/dashboard/broken triggers the notifications slot's error.tsx; the main panel is unaffected.",
    ],
    files: [
      "dashboard/@notifications/loading.tsx",
      "dashboard/@notifications/error.tsx",
      "dashboard/@notifications/broken/page.tsx",
      "dashboard/broken/page.tsx",
    ],
    routes: [
      { pattern: "/dashboard", href: "/dashboard" },
      { pattern: "/dashboard/broken", href: "/dashboard/broken" },
    ],
  },
  {
    id: "intercept-boundaries",
    category: "boundaries",
    name: "Intercept-scoped boundaries",
    convention: "@slot/(.)x/loading.tsx, @slot/(.)x/error.tsx",
    description:
      "loading.tsx and error.tsx inside an intercepting folder scope to the modal overlay. A full-page refresh routes around the modal and hits the leaf's own boundaries.",
    whatToLookFor: [
      "Click into /inbox/999 from the inbox list — the modal error.tsx fires.",
      "Refresh on /inbox/999 — the leaf [id]/error.tsx fires instead.",
    ],
    files: [
      "inbox/@modal/(.)[id]/loading.tsx",
      "inbox/@modal/(.)[id]/error.tsx",
      "inbox/[id]/error.tsx",
    ],
    routes: [
      { pattern: "/inbox", href: "/inbox" },
      {
        pattern: "/inbox/:id",
        href: "/inbox/999",
        label: "/inbox/999 (try it from the list)",
      },
    ],
  },

  // ── Advanced layouts ──────────────────────────────────────────────────
  {
    id: "parallel-routes",
    category: "advanced-layouts",
    name: "Parallel routes",
    convention: "@slot/, default.tsx",
    description:
      "Folders prefixed with `@` are slots — they don't appear in the URL but pass a named ReactNode prop to the parent layout. default.tsx serves as the fallback when the URL has no match for the slot.",
    whatToLookFor: [
      "DashboardLayout receives { analytics, notifications } props.",
      "/dashboard/other has no matching slot pages — both slots render their default.tsx.",
    ],
    files: [
      "dashboard/layout.tsx",
      "dashboard/@analytics/page.tsx",
      "dashboard/@analytics/settings/page.tsx",
      "dashboard/@analytics/default.tsx",
      "dashboard/@notifications/page.tsx",
    ],
    routes: [
      { pattern: "/dashboard", href: "/dashboard" },
      { pattern: "/dashboard/settings", href: "/dashboard/settings" },
      { pattern: "/dashboard/other", href: "/dashboard/other" },
    ],
  },
  {
    id: "intercepting-routes",
    category: "advanced-layouts",
    name: "Intercepting routes",
    convention: "(.)x/",
    description:
      "Inside a parallel slot, (.)x overlays the URL `x` as a modal during soft navigation. A direct visit or refresh routes around the modal and renders the full page.",
    whatToLookFor: [
      "Click a photo from /photos — the modal opens without unmounting the grid.",
      "Refresh on /photos/1 — the full-page version renders.",
    ],
    files: [
      "photos/layout.tsx",
      "photos/[id]/page.tsx",
      "photos/@modal/(.)[id]/page.tsx",
      "photos/@modal/default.tsx",
    ],
    routes: [
      { pattern: "/photos", href: "/photos" },
      {
        pattern: "/photos/:id",
        href: "/photos/1",
        label: "/photos/1 (refresh = full page)",
      },
    ],
  },
  {
    id: "multi-level-intercepts",
    category: "advanced-layouts",
    name: "Multi-level interceptors",
    convention: "(..)x, (..)(..)x, (...)x",
    description:
      "Three depths of interceptor pop different filesystem-level segments before binding to the target. (..) pops one segment, (..)(..) pops two, (...) anchors to the app root.",
    whatToLookFor: [
      "Inside an album, (.) intercepts photo navigation as a modal.",
      "From the feed view, (..)(..) pops the slot AND feed/ to hit the same photo route as the album's modal.",
      "(...) targets /search from any depth — the root-anchored intercept.",
    ],
    files: [
      "gallery/page.tsx",
      "gallery/[albumId]/layout.tsx",
      "gallery/[albumId]/page.tsx",
      "gallery/[albumId]/[photoId]/page.tsx",
      "gallery/[albumId]/@modal/(.)[photoId]/page.tsx",
      "gallery/[albumId]/feed/page.tsx",
      "gallery/[albumId]/feed/@modal/(..)(..)[photoId]/page.tsx",
      "gallery/[albumId]/feed/@modal/(...)search/page.tsx",
      "search/page.tsx",
    ],
    routes: [
      { pattern: "/gallery", href: "/gallery" },
      {
        pattern: "/gallery/:albumId",
        href: "/gallery/alpine",
        label: "/gallery/alpine",
      },
      {
        pattern: "/gallery/:albumId/feed",
        href: "/gallery/alpine/feed",
        label: "/gallery/alpine/feed",
      },
    ],
  },
  {
    id: "template",
    category: "advanced-layouts",
    name: "template.tsx",
    convention: "template.tsx",
    description:
      "Same shape as layout.tsx, but the router keys it by pathname so it remounts on every navigation. Useful for entry transitions or per-nav resetting state.",
    whatToLookFor: [
      "Each photo detail fades in — local state to the template resets every time.",
      "The surrounding layout.tsx stays mounted across the same navigations.",
    ],
    files: ["photos/[id]/template.tsx", "photos/[id]/page.tsx"],
    routes: [
      { pattern: "/photos", href: "/photos" },
      {
        pattern: "/photos/:id",
        href: "/photos/2",
        label: "/photos/2",
      },
    ],
  },

  // ── Type-safe URLs ────────────────────────────────────────────────────
  {
    id: "use-route-params",
    category: "type-safe-urls",
    name: "useRouteParams + RouteProps",
    convention: "useRouteParams<S>(), parseRouteParams(), RouteProps",
    description:
      "Each route module exports a typed RouteProps and a generate() URL builder via Vite's virtual-module system. useRouteParams is a hook variant for code outside the page component.",
    whatToLookFor: [
      "params.example is typed without writing a generic — the auto-generated RouteProps does it.",
      "generate() requires every dynamic segment at the call site (compile-time check).",
    ],
    files: ["typed-routes/page.tsx", "typed-routes/[example]/page.tsx"],
    routes: [
      { pattern: "/typed-routes", href: "/typed-routes" },
      {
        pattern: "/typed-routes/:example",
        href: "/typed-routes/hello",
        label: "/typed-routes/hello",
      },
    ],
  },
];

/** Sidebar nav search-param key that disambiguates entries sharing a URL. */
export const FEATURE_PARAM = "feature";

/** Build the sidebar link URL for an entry: landing href + `?feature=<id>`. */
export function featureLinkHref(entry: FeatureEntry): string {
  const base = entry.routes[0]!.href;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}${FEATURE_PARAM}=${entry.id}`;
}

/**
 * Resolve which feature entry corresponds to the current location.
 *
 * 1. If `?feature=<id>` is present, return that entry (the source of truth
 *    when the user clicked a sidebar link). Multiple entries can share a
 *    landing URL — the param disambiguates.
 * 2. Otherwise prefer an exact `href === pathname` match.
 * 3. Otherwise fall back to the longest matching `pattern`, which beats
 *    parent patterns when child patterns overlap.
 *
 * Returns null when nothing matches.
 */
export function findEntryForPath(
  pathname: string,
  matchPath: (pattern: string, pathname: string) => unknown,
  featureId?: string | null,
): FeatureEntry | null {
  if (featureId) {
    const byId = FEATURE_ENTRIES.find((e) => e.id === featureId);
    if (byId) return byId;
  }
  for (const entry of FEATURE_ENTRIES) {
    if (entry.routes.some((r) => r.href === pathname)) return entry;
  }
  let best: { entry: FeatureEntry; len: number } | null = null;
  for (const entry of FEATURE_ENTRIES) {
    for (const r of entry.routes) {
      if (matchPath(r.pattern, pathname) === null) continue;
      if (!best || r.pattern.length > best.len) {
        best = { entry, len: r.pattern.length };
      }
    }
  }
  return best?.entry ?? null;
}
