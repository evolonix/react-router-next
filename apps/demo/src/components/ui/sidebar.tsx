import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { matchPath, useLocation } from "react-router";
import {
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  FEATURE_ENTRIES,
  type FeatureCategory,
  type FeatureEntry,
} from "../../lib/feature-catalog";
import { cn } from "../../lib/cn";
import { NavLink } from "./nav";

const BANNERS_HIDDEN_KEY = "demo-banners-hidden";

function findActiveEntry(pathname: string): FeatureEntry | null {
  for (const entry of FEATURE_ENTRIES) {
    if (entry.routes.some((r) => matchPath(r.pattern, pathname) !== null)) {
      return entry;
    }
  }
  return null;
}

function entriesByCategory(): Record<FeatureCategory, FeatureEntry[]> {
  const out = Object.fromEntries(
    CATEGORY_ORDER.map((c) => [c, [] as FeatureEntry[]]),
  ) as Record<FeatureCategory, FeatureEntry[]>;
  for (const e of FEATURE_ENTRIES) out[e.category].push(e);
  return out;
}

function SidebarContent({
  pathname,
  activeId,
  onResetExplanations,
  footer,
}: {
  pathname: string;
  activeId: string | null;
  onResetExplanations: () => void;
  footer?: ReactNode;
}) {
  const grouped = useMemo(entriesByCategory, []);
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-4 pb-2">
        <NavLink to="/" tone="default" weight="semibold" className="block">
          React Router Next
        </NavLink>
        <p className="m-0 mt-1 text-xs text-muted-foreground">
          Filesystem routing for React Router 7.
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {CATEGORY_ORDER.map((cat) => (
          <CategoryGroup
            key={cat}
            label={CATEGORY_LABEL[cat]}
            entries={grouped[cat]}
            activeId={activeId}
            pathname={pathname}
          />
        ))}
      </nav>
      <div className="border-t border-border px-3 py-3">
        <button
          type="button"
          onClick={onResetExplanations}
          className="w-full rounded border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/40 hover:text-foreground"
        >
          Show all explanations
        </button>
        {footer ? <div className="mt-3">{footer}</div> : null}
      </div>
    </div>
  );
}

function CategoryGroup({
  label,
  entries,
  activeId,
  pathname,
}: {
  label: string;
  entries: FeatureEntry[];
  activeId: string | null;
  pathname: string;
}) {
  const hasActive = entries.some((e) => e.id === activeId);
  const [open, setOpen] = useState(true);
  // Always expand the group containing the active route.
  useEffect(() => {
    if (hasActive) setOpen(true);
  }, [hasActive]);

  if (entries.length === 0) return null;

  return (
    <div className="px-1 py-2">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-2 py-1 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
      >
        <span>{label}</span>
        <span
          aria-hidden
          className={cn(
            "transition-transform",
            open ? "rotate-90" : "rotate-0",
          )}
        >
          ›
        </span>
      </button>
      {open ? (
        <ul className="m-0 mt-1 list-none p-0">
          {entries.map((entry) => {
            const primary = entry.routes[0]!;
            const isActive = entry.id === activeId;
            const isExactMatch = entry.routes.some(
              (r) => r.href === pathname,
            );
            return (
              <li key={entry.id} className="my-0.5">
                <NavLink
                  to={primary.href}
                  tone={isActive ? "primary" : "muted"}
                  size="sm"
                  className={cn(
                    "block rounded px-2 py-1 no-underline",
                    isActive && "bg-accent text-accent-foreground",
                    !isActive && "hover:bg-muted/40 hover:text-foreground",
                    isExactMatch && "font-medium",
                  )}
                >
                  {entry.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function Sidebar({ footer }: { footer?: ReactNode }) {
  const { pathname } = useLocation();
  const activeEntry = useMemo(() => findActiveEntry(pathname), [pathname]);
  const activeId = activeEntry?.id ?? null;

  const resetExplanations = useCallback(() => {
    try {
      window.localStorage.removeItem(BANNERS_HIDDEN_KEY);
      // Clear every per-route session dismissal.
      for (let i = window.sessionStorage.length - 1; i >= 0; i--) {
        const key = window.sessionStorage.key(i);
        if (key?.startsWith("demo-banner-dismissed:")) {
          window.sessionStorage.removeItem(key);
        }
      }
    } catch {
      // sessionStorage / localStorage can be unavailable in some browsers; ignore.
    }
    window.dispatchEvent(new Event("demo:banner-reset"));
  }, []);

  return (
    <aside
      style={{ viewTransitionName: "sidebar" }}
      className="hidden w-64 shrink-0 border-r border-border bg-background lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col"
    >
      <SidebarContent
        pathname={pathname}
        activeId={activeId}
        onResetExplanations={resetExplanations}
        footer={footer}
      />
    </aside>
  );
}

export function SidebarDrawer({
  open,
  onClose,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  footer?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const { pathname } = useLocation();
  const activeEntry = useMemo(() => findActiveEntry(pathname), [pathname]);
  const activeId = activeEntry?.id ?? null;
  const [prevPathname, setPrevPathname] = useState(pathname);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // Auto-close on navigation.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (open) onClose();
  }

  const resetExplanations = useCallback(() => {
    try {
      window.localStorage.removeItem(BANNERS_HIDDEN_KEY);
      for (let i = window.sessionStorage.length - 1; i >= 0; i--) {
        const key = window.sessionStorage.key(i);
        if (key?.startsWith("demo-banner-dismissed:")) {
          window.sessionStorage.removeItem(key);
        }
      }
    } catch {
      /* noop */
    }
    window.dispatchEvent(new Event("demo:banner-reset"));
  }, []);

  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself, not its child) closes.
        if (e.target === ref.current) onClose();
      }}
      className="m-0 h-screen w-72 max-w-[90vw] border-r border-border bg-background p-0 text-foreground backdrop:bg-background/50 lg:hidden"
      style={{ marginRight: "auto" }}
    >
      <SidebarContent
        pathname={pathname}
        activeId={activeId}
        onResetExplanations={resetExplanations}
        footer={footer}
      />
    </dialog>
  );
}
