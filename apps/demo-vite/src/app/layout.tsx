import { useEffect, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router";

import { MobileTopBar } from "./_components/mobile-top-bar";
import { ProgressBar } from "./_components/progress-bar";
import { MobileNavDialog, Sidebar } from "./_components/sidebar";
import { ThemeProvider } from "./_components/theme";

export default function RootLayout() {
  const { pathname } = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setNavOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-700 focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-brand-500"
        >
          Skip to content
        </a>
        <ProgressBar />
        <MobileTopBar
          menuOpen={navOpen}
          onMenuClick={() => setNavOpen((v) => !v)}
        />
        <div className="mx-auto flex max-w-6xl">
          <Sidebar />
          <main
            id="main-content"
            tabIndex={-1}
            className="min-w-0 flex-1 px-4 py-6 md:px-6 md:py-10"
          >
            <div className="space-y-6">
              <Outlet />
            </div>
          </main>
        </div>
        <MobileNavDialog open={navOpen} onClose={() => setNavOpen(false)} />
        <ScrollRestoration />
      </div>
    </ThemeProvider>
  );
}
