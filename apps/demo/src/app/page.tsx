import { CategoryCard } from "../components/ui/category-card";
import { Heading } from "../components/ui/heading";
import { Hero } from "../components/ui/hero";
import { NavLink } from "../components/ui/nav";
import { Stack } from "../components/ui/stack";
import {
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  FEATURE_ENTRIES,
  featureLinkHref,
  type FeatureCategory,
} from "../lib/feature-catalog";

const CATEGORY_BLURB: Record<FeatureCategory, string> = {
  "get-started":
    "Get oriented with the file and folder conventions powering the router.",
  routing: "Pattern-match URLs with groups, dynamic segments, and catch-alls.",
  "data-loading":
    "Loaders, suspense, and the imperative pending hook in one place.",
  boundaries:
    "Per-segment loading, error, and not-found boundaries — including slot-scoped ones.",
  "advanced-layouts":
    "Parallel slots, intercepting routes at three depths, and per-nav templates.",
  "type-safe-urls":
    "Auto-generated RouteProps, useRouteParams, and a typed URL builder per route.",
};

export default function Home() {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    entries: FEATURE_ENTRIES.filter((e) => e.category === cat),
  }));

  return (
    <Stack gap="lg">
      <Hero
        title="React Router Next"
        tagline="Next.js-style filesystem routing on top of React Router 7. Every demo below maps to a real feature implemented in @evolonix/react-router-next."
        actions={
          <>
            <NavLink
              to="/conventions"
              className="rounded border border-border bg-background px-4 py-2 no-underline hover:bg-muted/40"
            >
              File conventions
            </NavLink>
            <NavLink
              to="/folders"
              className="rounded border border-border bg-background px-4 py-2 no-underline hover:bg-muted/40"
            >
              Folder conventions
            </NavLink>
            <NavLink
              to="/posts"
              tone="primary"
              className="rounded border border-accent-foreground/40 bg-accent px-4 py-2 no-underline"
            >
              Jump into a demo →
            </NavLink>
          </>
        }
      />

      <Stack gap="sm">
        <Heading level={3}>Browse by category</Heading>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {grouped.map(({ cat, entries }) => (
            <CategoryCard
              key={cat}
              label={CATEGORY_LABEL[cat]}
              description={CATEGORY_BLURB[cat]}
              primaryHref={entries[0] ? featureLinkHref(entries[0]) : "/"}
              entries={entries.map((e) => ({
                id: e.id,
                name: e.name,
                href: featureLinkHref(e),
              }))}
            />
          ))}
        </div>
      </Stack>
    </Stack>
  );
}
