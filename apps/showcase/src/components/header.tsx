import { GitHubLink } from "./github-link";
import { ThemeToggle } from "./theme-toggle";

const BASE = import.meta.env.BASE_URL;

const NAV_ITEMS = [
  { href: "#quickstart", label: "Quickstart" },
  { href: "#demos", label: "Demos" },
  { href: "#features", label: "Features" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/80 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <a
          href="/"
          aria-label="@evolonix/react-router-next — home"
          className="group flex items-center gap-2.5"
        >
          <img
            src={`${BASE}logo.svg`}
            alt=""
            aria-hidden="true"
            className="h-9 w-9 shrink-0"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-400">
              Evolonix
            </span>
            <span className="group-hover:text-brand-700 dark:group-hover:text-brand-300 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              react-router-next
            </span>
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="ml-auto hidden items-center gap-1 sm:flex"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-brand-700 dark:hover:text-brand-300 rounded-full px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors dark:text-zinc-400"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <GitHubLink />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
