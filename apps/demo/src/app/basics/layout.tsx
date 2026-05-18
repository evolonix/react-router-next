import { NavLink, Outlet, useLocation } from "react-router";

export default function BasicsLayout() {
  const { pathname } = useLocation();
  const crumbs = pathname.split("/").filter(Boolean);
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 rounded-xl border border-dashed border-accent-routing/40 bg-accent-routing/5 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-accent-routing">
            basics/layout.tsx
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            This banner is rendered by the nested layout. It persists while you
            move between <code className="font-mono">basics/</code> children.
          </p>
        </div>
        <nav className="font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
          /{crumbs.join("/")}
        </nav>
      </header>
      <div className="flex gap-2 text-sm">
        <BasicsLink to="/basics" end>
          /basics
        </BasicsLink>
        <BasicsLink to="/basics/nested">/basics/nested</BasicsLink>
      </div>
      <Outlet />
    </div>
  );
}

function BasicsLink({
  to,
  end,
  children,
}: {
  to: string;
  end?: boolean;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      preventScrollReset
      className={({ isActive }) =>
        `rounded-md border px-3 py-1.5 transition ${
          isActive
            ? "border-accent-routing/40 bg-accent-routing/10 text-accent-routing"
            : "border-slate-200 bg-white hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
