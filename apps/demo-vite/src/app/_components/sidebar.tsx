import { NavLink, useLocation } from "react-router";

import type { Accent } from "./explain";
import { GitHubLink } from "./github-link";
import { ThemeSwitcher } from "./theme-switcher";

const ACCENT_BAR: Record<Accent, string> = {
  neutral: "bg-linear-to-b from-zinc-400 to-zinc-300",
  routing: "bg-linear-to-b from-blue-500 to-sky-400",
  data: "bg-linear-to-b from-emerald-500 to-green-400",
  error: "bg-linear-to-b from-emerald-500 to-green-400",
  parallel: "bg-linear-to-b from-fuchsia-500 to-pink-400",
  intercept: "bg-linear-to-b from-amber-500 to-orange-400",
};

interface Item {
  to: string;
  label: string;
  accent: Accent;
  hint?: string;
  /** If set, the item is considered active when pathname starts with this prefix */
  matchPrefix?: string;
  /** Additional paths that should make this item active */
  matchPaths?: string[];
}

interface Group {
  title: string;
  items: Item[];
}

const GROUPS: Group[] = [
  {
    title: "Start here",
    items: [
      { to: "/", label: "Home", accent: "neutral", hint: "AppRouter mount" },
      {
        to: "/installation",
        label: "Installation",
        accent: "neutral",
        hint: "install + setup",
      },
      {
        to: "/basics",
        label: "Basics",
        accent: "neutral",
        hint: "page.tsx + layout.tsx",
      },
    ],
  },
  {
    title: "Routing",
    items: [
      {
        to: "/about",
        label: "Route groups",
        accent: "routing",
        hint: "(marketing)/layout.tsx",
        matchPaths: ["/pricing"],
      },
      {
        to: "/docs/getting-started",
        label: "Catch-all",
        accent: "routing",
        hint: "[...slug]",
        matchPrefix: "/docs",
      },
      {
        to: "/search",
        label: "Optional catch-all",
        accent: "routing",
        hint: "[[...query]]",
      },
      {
        to: "/transitions",
        label: "Per-nav template",
        accent: "routing",
        hint: "template.tsx",
        matchPrefix: "/transitions",
      },
    ],
  },
  {
    title: "Data & errors",
    items: [
      {
        to: "/posts",
        label: "Suspense + params",
        accent: "data",
        hint: "loading.tsx, error.tsx, notFound()",
      },
    ],
  },
  {
    title: "Advanced",
    items: [
      {
        to: "/dashboard",
        label: "Parallel routes",
        accent: "parallel",
        hint: "@slot + boundaries",
      },
      {
        to: "/gallery",
        label: "Intercept same level",
        accent: "intercept",
        hint: "(.)[id]",
        matchPrefix: "/gallery",
      },
      {
        to: "/mail",
        label: "Intercept one up",
        accent: "intercept",
        hint: "(..)[id]",
        matchPrefix: "/mail",
      },
      {
        to: "/projects",
        label: "Intercept two up",
        accent: "intercept",
        hint: "(..)(..)[id]",
        matchPrefix: "/projects",
      },
      {
        to: "/playground",
        label: "Intercept from root",
        accent: "intercept",
        hint: "(...)x",
        matchPaths: ["/tour"],
      },
    ],
  },
];

function SidebarItem({ item }: { item: Item }) {
  const { pathname } = useLocation();
  const prefixActive = item.matchPrefix
    ? pathname.startsWith(item.matchPrefix)
    : false;
  const pathsActive = item.matchPaths?.includes(pathname) ?? false;

  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      className={({ isActive }) => {
        const active = prefixActive || pathsActive || isActive;
        return `group relative block py-1.5 pl-6 pr-6 transition ${
          active
            ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
            : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
        }`;
      }}
    >
      <span
        aria-hidden
        className={`absolute bottom-1.5 left-4 top-1.5 w-0.5 rounded-full transition-opacity ${ACCENT_BAR[item.accent]} opacity-60 group-hover:opacity-100 group-aria-[current=page]:opacity-100`}
      />
      <span className="block text-sm font-medium">{item.label}</span>
      {item.hint ? (
        <span className="block font-mono text-[11px] text-zinc-400 group-aria-[current=page]:text-zinc-500 dark:text-zinc-500 dark:group-aria-[current=page]:text-zinc-400">
          {item.hint}
        </span>
      ) : null}
    </NavLink>
  );
}

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <nav
      id="primary-nav"
      aria-label="Examples"
      className={`fixed inset-y-0 left-0 md:mx-6 z-40 flex w-72 shrink-0 transform flex-col gap-6 overflow-y-auto border-x border-zinc-200 bg-white py-6 transition-transform duration-200 ease-out md:sticky md:top-0 md:h-screen md:translate-x-0 md:transform-none md:bg-white/70 md:backdrop-blur md:transition-none dark:border-zinc-800 dark:bg-zinc-900 dark:md:bg-zinc-900/70 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="hidden flex-col gap-1 px-6 md:flex">
        <a
          href="/react-router-next/"
          className="-mb-1 inline-flex w-fit items-center gap-1 whitespace-nowrap text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <span aria-hidden>←</span>
          Back to overview
        </a>
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            evolonix
          </span>
          <div className="flex items-center gap-1.5">
            <GitHubLink />
            <ThemeSwitcher />
          </div>
        </div>
        <NavLink to="/" className="block">
          <span className="block text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            react-router-next
          </span>
          <span className="block text-xs text-zinc-500 dark:text-zinc-400">
            demo & playground
          </span>
        </NavLink>
      </div>
      <div className="flex flex-col gap-1 px-6 md:hidden">
        <a
          href="/react-router-next/"
          className="-mb-1 inline-flex w-fit items-center gap-1 whitespace-nowrap text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <span aria-hidden>←</span>
          Back to overview
        </a>
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Examples
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="-mr-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <svg
              aria-hidden
              viewBox="0 0 20 20"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              <path d="M5 5l10 10M15 5l-10 10" />
            </svg>
          </button>
        </div>
      </div>
      {GROUPS.map((group) => (
        <div key={group.title} className="space-y-1">
          <p className="px-6 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {group.title}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => (
              <li key={item.to}>
                <SidebarItem item={item} />
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="mx-6 mt-auto rounded-md bg-zinc-100 p-3 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
        Every example is a real route under <code>src/app/</code>. Click around
        and inspect the folder structure to see the conventions in action.
      </div>
    </nav>
  );
}
