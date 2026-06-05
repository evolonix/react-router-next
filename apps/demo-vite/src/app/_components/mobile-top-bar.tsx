import { GitHubLink } from "./github-link";
import { ThemeToggle } from "./theme-toggle";

export interface MobileTopBarProps {
  menuOpen: boolean;
  onMenuClick: () => void;
}

export function MobileTopBar({ menuOpen, onMenuClick }: MobileTopBarProps) {
  return (
    <header className="pt-safe sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur md:hidden dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="px-safe-lg flex items-center gap-3 py-3">
        <button
          type="button"
          id="mobile-nav-toggle"
          onClick={onMenuClick}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-controls="mobile-nav"
          aria-expanded={menuOpen}
          className="hover:text-brand-700 dark:hover:text-brand-300 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-700 ring-1 ring-zinc-200 transition-colors hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-800"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <a
          href="/"
          className="flex items-center gap-2 text-base font-semibold tracking-tight"
        >
          <Logo className="h-[1em] w-[1em]" />
          <span className="font-display font-bold">Evolonix</span>
        </a>

        <div className="ml-auto flex items-center gap-1.5">
          <GitHubLink />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect y="0" width="64" height="12.4" rx="6.2" fill="#a855f7" />
      <rect y="25.8" width="44" height="12.4" rx="6.2" fill="#d946ef" />
      <rect y="51.6" width="64" height="12.4" rx="6.2" fill="#22d3ee" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
