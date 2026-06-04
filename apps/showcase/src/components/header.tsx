import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const BASE = import.meta.env.BASE_URL;

const NAV_ITEMS = [
  { href: "#quickstart", label: "Quickstart" },
  { href: "#demos", label: "Demos" },
  { href: "#features", label: "Features" },
];

const NAV_IDS = NAV_ITEMS.map((item) => item.href.slice(1));

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }
        if (visible.size === 0) {
          setActive(null);
          return;
        }
        // Pick the first section (in document order) that is currently visible.
        const next = ids.find((id) => visible.has(id)) ?? null;
        setActive(next);
      },
      { rootMargin: "-80px 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export function Header() {
  const activeId = useActiveSection(NAV_IDS);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="pt-safe sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="px-safe sm:px-safe-lg mx-auto flex max-w-6xl items-center gap-3 py-3">
        <a
          href="/"
          className="flex items-center gap-2 text-base font-semibold tracking-tight"
        >
          <img
            src={`${BASE}logo.svg`}
            alt=""
            aria-hidden="true"
            className="h-[1em] w-[1em]"
          />
          <span className="font-display font-bold">Evolonix</span>
        </a>

        <nav
          aria-label="Primary"
          className="ml-auto hidden items-center gap-1 sm:flex"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "location" : undefined}
                className={[
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-200"
                    : "hover:text-brand-700 dark:hover:text-brand-300 text-zinc-600 dark:text-zinc-400",
                ].join(" ")}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:ml-0">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Navigation menu"
            aria-controls="mobile-nav"
            aria-expanded={menuOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-700 hover:bg-zinc-100 sm:hidden dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <path d="M5 5l10 10M15 5l-10 10" />
              ) : (
                <path d="M3 5h14M3 10h14M3 15h14" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Primary"
        hidden={!menuOpen}
        className="px-safe border-t border-zinc-200 sm:hidden dark:border-zinc-800"
      >
        <ul className="mx-auto flex max-w-6xl flex-col py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.href.slice(1);
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive ? "location" : undefined}
                  className={[
                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-200"
                      : "hover:text-brand-700 dark:hover:text-brand-300 text-zinc-600 dark:text-zinc-400",
                  ].join(" ")}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
