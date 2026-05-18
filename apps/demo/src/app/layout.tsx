import { useEffect, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router";

import { MobileTopBar } from "./_components/mobile-top-bar";
import { ProgressBar } from "./_components/progress-bar";
import { Sidebar } from "./_components/sidebar";
import { ThemeProvider } from "./_components/theme";

export default function RootLayout() {
  const { pathname } = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!navOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setNavOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [navOpen]);

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
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <ProgressBar />
        <MobileTopBar
          menuOpen={navOpen}
          onMenuClick={() => setNavOpen((v) => !v)}
        />
        <div className="mx-auto flex max-w-7xl">
          <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
          {navOpen ? (
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setNavOpen(false)}
              className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden"
            />
          ) : null}
          <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-10">
            <div className="mx-auto max-w-3xl space-y-6">
              <Outlet />
            </div>
          </main>
        </div>
        <ScrollRestoration />
      </div>
    </ThemeProvider>
  );
}
