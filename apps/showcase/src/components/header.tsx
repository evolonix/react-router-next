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

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <a
          href="/"
          className="flex items-center gap-1 text-base font-semibold tracking-tight"
        >
          <img
            src={`${BASE}logo.svg`}
            alt=""
            aria-hidden="true"
            className="h-6 w-6 py-1"
          />
          <span>Evolonix</span>
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
                aria-current={isActive ? "true" : undefined}
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

        <div className="ml-auto sm:ml-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
