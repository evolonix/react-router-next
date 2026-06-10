import { RouteTreeDevtools } from "@evolonix/react-router-next-devtools/vite-client";
import { useEffect, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router";

import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
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
      <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <a
          href="#main-content"
          className="focus:bg-brand-700 focus:outline-brand-500 sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-2 focus:outline-offset-2"
        >
          Skip to content
        </a>
        <ProgressBar />
        <Header menuOpen={navOpen} onMenuClick={() => setNavOpen((v) => !v)} />
        <div className="mx-auto flex w-full max-w-6xl flex-1">
          <Sidebar />
          <main
            id="main-content"
            tabIndex={-1}
            className="px-safe-lg pb-safe min-w-0 flex-1 pt-6 md:py-10"
          >
            <div className="space-y-6">
              <Outlet />
            </div>
          </main>
        </div>
        <Footer />
        <MobileNavDialog open={navOpen} onClose={() => setNavOpen(false)} />
        <ScrollRestoration />
        <RouteTreeDevtools />
      </div>
    </ThemeProvider>
  );
}
