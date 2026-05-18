import { NavLink, useLocation } from "react-router";

import { GitHubLink } from "./github-link";
import { ThemeSwitcher } from "./theme-switcher";

interface Item {
  to: string;
  label: string;
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
      { to: "/", label: "Home", hint: "AppRouter mount" },
      { to: "/basics", label: "Basics", hint: "page.tsx + layout.tsx" },
    ],
  },
  {
    title: "Routing",
    items: [
      {
        to: "/about",
        label: "Route groups",
        hint: "(marketing)/layout.tsx",
        matchPaths: ["/pricing"],
      },
      {
        to: "/docs/getting-started",
        label: "Catch-all",
        hint: "[...slug]",
        matchPrefix: "/docs",
      },
      { to: "/search", label: "Optional catch-all", hint: "[[...query]]" },
      {
        to: "/transitions",
        label: "Per-nav template",
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
        hint: "@slot + boundaries",
      },
      {
        to: "/gallery",
        label: "Intercept same level",
        hint: "(.)[id]",
        matchPrefix: "/gallery",
      },
      {
        to: "/mail",
        label: "Intercept one up",
        hint: "(..)[id]",
        matchPrefix: "/mail",
      },
      {
        to: "/projects",
        label: "Intercept two up",
        hint: "(..)(..)[id]",
        matchPrefix: "/projects",
      },
      {
        to: "/playground",
        label: "Intercept from root",
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
        return `group block rounded-md px-2 py-1.5 transition ${
          active
            ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
            : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        }`;
      }}
    >
      <span className="block text-sm font-medium">{item.label}</span>
      {item.hint ? (
        <span className="block font-mono text-[11px] text-slate-400 group-aria-[current=page]:text-slate-300 dark:text-slate-500 dark:group-aria-[current=page]:text-slate-600">
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
      className={`fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 transform flex-col gap-6 overflow-y-auto border-r border-slate-200 bg-white p-6 transition-transform duration-200 ease-out md:sticky md:top-0 md:h-screen md:translate-x-0 md:transform-none md:bg-white/70 md:backdrop-blur md:transition-none dark:border-slate-800 dark:bg-slate-900 dark:md:bg-slate-900/70 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="hidden flex-col gap-1 md:flex">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
            evolonix
          </span>
          <div className="flex items-center gap-1.5">
            <GitHubLink />
            <ThemeSwitcher />
          </div>
        </div>
        <NavLink to="/" className="block">
          <span className="block text-lg font-semibold text-slate-900 dark:text-slate-100">
            react-router-next
          </span>
          <span className="block text-xs text-slate-500 dark:text-slate-400">
            demo & playground
          </span>
        </NavLink>
      </div>
      <div className="flex items-center justify-between md:hidden">
        <p className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Examples
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="-mr-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
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
      {GROUPS.map((group) => (
        <div key={group.title} className="space-y-1">
          <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
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
      <div className="mt-auto rounded-md bg-slate-100 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        Every example is a real route under <code>src/app/</code>. Click around
        and inspect the folder structure to see the conventions in action.
      </div>
    </nav>
  );
}
