import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router";

import type { Accent } from "./explain";
import { GitHubLink } from "./github-link";
import { ThemeToggle } from "./theme-toggle";

/** Leading dot that ties each item to its feature card's accent color. */
const ACCENT_DOT: Record<Accent, string> = {
  neutral: "bg-zinc-400 dark:bg-zinc-500",
  routing: "bg-accent-routing",
  data: "bg-accent-data",
  error: "bg-accent-error",
  parallel: "bg-accent-parallel",
  intercept: "bg-accent-intercept",
};

/** Active pill tint, matching the card accent instead of the generic brand. */
const ACCENT_ACTIVE: Record<Accent, string> = {
  neutral:
    "bg-zinc-200/70 text-zinc-900 dark:bg-zinc-700/50 dark:text-zinc-100",
  routing: "bg-accent-routing/15 text-accent-routing",
  data: "bg-accent-data/15 text-accent-data",
  error: "bg-accent-error/15 text-accent-error",
  parallel: "bg-accent-parallel/15 text-accent-parallel",
  intercept: "bg-accent-intercept/15 text-accent-intercept",
};

interface Item {
  to: string;
  label: string;
  accent: Accent;
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
      { to: "/", label: "Home", accent: "neutral" },
      { to: "/installation", label: "Installation", accent: "neutral" },
      { to: "/basics", label: "Basics", accent: "neutral" },
    ],
  },
  {
    title: "Routing",
    items: [
      {
        to: "/about",
        label: "Route groups",
        accent: "routing",
        matchPaths: ["/pricing"],
      },
      {
        to: "/docs/getting-started",
        label: "Catch-all",
        accent: "routing",
        matchPrefix: "/docs",
      },
      { to: "/search", label: "Optional catch-all", accent: "routing" },
      {
        to: "/transitions",
        label: "Per-nav template",
        accent: "routing",
        matchPrefix: "/transitions",
      },
    ],
  },
  {
    title: "Data & errors",
    items: [{ to: "/posts", label: "Suspense + params", accent: "data" }],
  },
  {
    title: "Advanced",
    items: [
      { to: "/dashboard", label: "Parallel routes", accent: "parallel" },
      {
        to: "/gallery",
        label: "Intercept same level",
        accent: "intercept",
        matchPrefix: "/gallery",
      },
      {
        to: "/mail",
        label: "Intercept one up",
        accent: "intercept",
        matchPrefix: "/mail",
      },
      {
        to: "/projects",
        label: "Intercept two up",
        accent: "intercept",
        matchPrefix: "/projects",
      },
      {
        to: "/playground",
        label: "Intercept from root",
        accent: "intercept",
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

  const forcedActive = prefixActive || pathsActive;

  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      aria-current={forcedActive ? "page" : undefined}
      className={({ isActive }) => {
        const active = forcedActive || isActive;
        return [
          "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          active
            ? ACCENT_ACTIVE[item.accent]
            : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
        ].join(" ");
      }}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${ACCENT_DOT[item.accent]} opacity-70 transition-opacity group-hover:opacity-100 group-aria-[current=page]:opacity-100`}
      />
      {item.label}
    </NavLink>
  );
}

function SidebarGroups() {
  return (
    <>
      {GROUPS.map((group) => (
        <div key={group.title} className="space-y-1 px-3">
          <p className="px-3 text-xs font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
            {group.title}
          </p>
          <ul className="space-y-0.5" aria-label={group.title}>
            {group.items.map((item) => (
              <li key={item.to}>
                <SidebarItem item={item} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function SidebarFooterHint() {
  return (
    <div className="mx-6 mt-auto rounded-md bg-zinc-100 p-3 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
      Every example is a real route under <code>src/app/</code>. Click around
      and inspect the folder structure to see the conventions in action.
    </div>
  );
}

export function Sidebar() {
  return (
    <nav
      id="primary-nav"
      aria-label="Examples"
      className="pb-safe z-40 mr-6 ml-[max(1.5rem,env(safe-area-inset-left))] hidden w-72 shrink-0 flex-col gap-6 overflow-y-auto pt-[max(1.5rem,env(safe-area-inset-top))] md:sticky md:top-0 md:flex md:h-screen"
    >
      <div className="flex flex-col gap-1 px-6">
        <div className="flex items-center justify-between gap-3">
          <a
            href="/react-router-next/"
            className="inline-flex min-h-6 w-fit items-center gap-1 text-xs whitespace-nowrap text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <span aria-hidden>←</span>
            Back to overview
          </a>
          <div className="flex items-center gap-1.5">
            <GitHubLink />
            <ThemeToggle />
          </div>
        </div>
        <NavLink to="/" className="mt-2 block">
          <span className="text-brand-700 dark:text-brand-300 block text-xs font-semibold tracking-[0.18em] uppercase">
            Examples
          </span>
          <span className="mt-1 block text-base font-semibold text-zinc-900 dark:text-zinc-100">
            @evolonix/react-router-next
          </span>
          <span className="block text-xs text-zinc-600 dark:text-zinc-400">
            demo & playground ·{" "}
            <span className="font-mono text-zinc-800 dark:text-zinc-300">
              Vite
            </span>
          </span>
        </NavLink>
      </div>
      <SidebarGroups />
      <SidebarFooterHint />
    </nav>
  );
}

export interface MobileNavDialogProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNavDialog({ open, onClose }: MobileNavDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
    const onCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    const onClick = (event: MouseEvent) => {
      if (event.target === el) onClose();
    };
    el.addEventListener("cancel", onCancel);
    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("cancel", onCancel);
      el.removeEventListener("click", onClick);
    };
  }, [open, onClose]);

  return (
    <dialog
      ref={dialogRef}
      id="mobile-nav"
      aria-modal="true"
      aria-label="Examples"
      className="pb-safe fixed top-0 left-0 m-0 h-dvh max-h-dvh w-72 max-w-full flex-col gap-6 overflow-y-auto border-x border-zinc-200 bg-white pt-[max(1.5rem,env(safe-area-inset-top))] pr-0 pl-[env(safe-area-inset-left)] backdrop:bg-zinc-900/50 backdrop:backdrop-blur-sm open:flex md:hidden dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex flex-col gap-1 px-6">
        <div className="flex items-center justify-between gap-2">
          <a
            href="/react-router-next/"
            className="inline-flex min-h-6 w-fit items-center gap-1 text-xs whitespace-nowrap text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <span aria-hidden>←</span>
            Back to overview
          </a>
          <button
            type="button"
            autoFocus
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
        <p className="font-mono text-xs tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
          Examples ·{" "}
          <span className="text-zinc-800 dark:text-zinc-300">Vite</span>
        </p>
      </div>
      <SidebarGroups />
      <SidebarFooterHint />
    </dialog>
  );
}
