import { useState } from "react";
import { Outlet, ScrollRestoration } from "react-router";
import { ThemeToggle } from "../components/theme-provider";
import { FeatureCallout } from "../components/ui/feature-callout";
import { Sidebar, SidebarDrawer } from "../components/ui/sidebar";
import { RouteProgress } from "../components/ui/route-progress";

export default function RootLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollRestoration />
      <RouteProgress />
      <div className="flex flex-1">
        <Sidebar footer={<ThemeToggle />} />
        <SidebarDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          footer={<ThemeToggle />}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-foreground">
              React Router Next
            </span>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </header>
          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <FeatureCallout />
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
