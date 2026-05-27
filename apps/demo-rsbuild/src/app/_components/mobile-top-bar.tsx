import { NavLink } from "react-router";

import { GitHubLink } from "./github-link";
import { ThemeToggle } from "./theme-toggle";

export interface MobileTopBarProps {
  menuOpen: boolean;
  onMenuClick: () => void;
}

export function MobileTopBar({ menuOpen, onMenuClick }: MobileTopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-zinc-200 bg-white/70 px-4 py-3 backdrop-blur md:hidden dark:border-zinc-800 dark:bg-zinc-900/70">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Toggle navigation"
        aria-controls="primary-nav"
        aria-expanded={menuOpen}
        className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        >
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      </button>
      <NavLink to="/" className="flex-1 leading-tight">
        <span className="block font-mono text-[10px] tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
          evolonix
        </span>
        <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          react-router-next
        </span>
      </NavLink>
      <GitHubLink />
      <ThemeToggle />
    </header>
  );
}
