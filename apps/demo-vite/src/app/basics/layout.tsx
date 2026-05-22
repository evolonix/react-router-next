import { NavLink, Outlet } from "react-router";

export default function BasicsLayout() {
  return (
    <div className="space-y-6">
      <header className="rounded-xl border border-dashed border-zinc-300 bg-zinc-100/60 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/40">
        <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
          basics/layout.tsx
        </p>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          This banner is rendered by the nested layout. It persists while you
          move between <code className="font-mono">basics/</code> children.
        </p>
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
            ? "border-zinc-400 bg-zinc-200/60 text-zinc-900 dark:border-zinc-500 dark:bg-zinc-700/60 dark:text-zinc-100"
            : "border-zinc-200 bg-white hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
