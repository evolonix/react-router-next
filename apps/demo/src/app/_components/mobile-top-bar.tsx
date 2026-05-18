import { NavLink } from "react-router";

import { ThemeSwitcher } from "./theme-switcher";

export interface MobileTopBarProps {
  menuOpen: boolean;
  onMenuClick: () => void;
}

export function MobileTopBar({ menuOpen, onMenuClick }: MobileTopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/70 px-4 py-3 backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-900/70">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Toggle navigation"
        aria-controls="primary-nav"
        aria-expanded={menuOpen}
        className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
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
        <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
          evolonix
        </span>
        <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
          react-router-next
        </span>
      </NavLink>
      <ThemeSwitcher />
    </header>
  );
}
