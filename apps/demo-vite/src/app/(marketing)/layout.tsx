import { Link, NavLink, Outlet } from "react-router";

export default function MarketingLayout() {
  return (
    <div className="space-y-6">
      <header className="rounded-xl border border-dashed border-accent-routing/40 bg-accent-routing/5 px-4 py-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-accent-routing">
          (marketing)/layout.tsx
        </p>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          Shared chrome for every page in the{" "}
          <code className="font-mono">(marketing)</code> group. The folder is
          stripped from the URL, but its{" "}
          <code className="font-mono">layout.tsx</code> still wraps the
          children.
        </p>
      </header>
      <div className="flex gap-2 text-sm">
        <MarketingLink to="/about">About</MarketingLink>
        <MarketingLink to="/pricing">Pricing</MarketingLink>
      </div>
      <Outlet />
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        This footer is also part of the marketing layout — visit{" "}
        <Link
          to="/"
          className="font-medium text-accent-routing hover:underline"
        >
          home
        </Link>{" "}
        to see it disappear.
      </p>
    </div>
  );
}

function MarketingLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      preventScrollReset
      className={({ isActive }) =>
        `rounded-md border px-3 py-1.5 transition ${
          isActive
            ? "border-accent-routing/40 bg-accent-routing/10 text-accent-routing"
            : "border-zinc-200 bg-white hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
