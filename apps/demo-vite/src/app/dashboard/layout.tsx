import type { ReactNode } from "react";
import { Link, NavLink, Outlet } from "react-router";

import { CodeBlock } from "../_components/code-block";
import { Explain } from "../_components/explain";

interface DashboardLayoutProps {
  analytics: ReactNode;
  notifications: ReactNode;
}

export default function DashboardLayout({
  analytics,
  notifications,
}: DashboardLayoutProps) {
  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-wider text-accent-parallel">
          dashboard/ + @analytics/ + @notifications/
        </p>
        <h1 className="text-xl font-semibold text-slate-900 md:text-2xl dark:text-slate-100">
          Parallel routes
        </h1>
      </header>

      <Explain title="A slot is a layout prop" accent="parallel" tag="@slot">
        <p>
          Two sibling slots —{" "}
          <code className="font-mono">dashboard/@analytics/</code> and{" "}
          <code className="font-mono">dashboard/@notifications/</code> — each
          matches the URL independently and shows up as a named prop on this
          layout. The main flow still flows through <code>{"<Outlet/>"}</code>.
        </p>
        <p>
          Toggle between <code className="font-mono">/dashboard</code> and{" "}
          <code className="font-mono">/dashboard/settings</code>: the
          notifications column changes copy because{" "}
          <code className="font-mono">@notifications/</code> has no{" "}
          <code className="font-mono">settings/page.tsx</code>, so the slot
          falls back to its{" "}
          <code className="font-mono">@notifications/default.tsx</code>. Without
          that file the slot would either error or leak its previous match.
        </p>
        <CodeBlock filename="src/app/dashboard/@notifications/default.tsx">{`// Rendered whenever the URL doesn't match any of @notifications/'s pages.
// Can also \`return null\` — anything is better than a stale match.
export default function NotificationsDefault() {
  return <p>No notifications view matches this URL.</p>;
}`}</CodeBlock>
        <CodeBlock filename="src/app/dashboard/layout.tsx">{`export default function DashboardLayout({
  analytics,
  notifications,
}: { analytics: ReactNode; notifications: ReactNode }) {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr] gap-4">
      <main><Outlet /></main>     {/* dashboard/page.tsx, dashboard/settings/page.tsx */}
      <aside>{analytics}</aside>     {/* @analytics/page.tsx, @analytics/settings/page.tsx */}
      <aside>{notifications}</aside> {/* @notifications/page.tsx, @notifications/default.tsx */}
    </div>
  );
}`}</CodeBlock>
        <p>
          The analytics slot also owns its own{" "}
          <code className="font-mono">loading.tsx</code> and{" "}
          <code className="font-mono">error.tsx</code>. Trigger them with{" "}
          <Link
            to="/dashboard?fail=1"
            className="font-medium text-accent-parallel hover:underline"
          >
            /dashboard?fail=1
          </Link>{" "}
          — only the analytics column flips to the error state, while the outlet
          and notifications keep rendering.
        </p>
      </Explain>

      <nav className="flex gap-2 text-sm">
        <DashboardLink to="/dashboard" end>
          /dashboard
        </DashboardLink>
        <DashboardLink to="/dashboard/settings">
          /dashboard/settings
        </DashboardLink>
        <Link
          to="/dashboard?fail=1"
          preventScrollReset
          className="rounded-md border border-accent-error/40 bg-accent-error/5 px-3 py-1.5 text-accent-error hover:bg-accent-error/10"
        >
          ?fail=1
        </Link>
      </nav>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {"<Outlet />"}
          </p>
          <Outlet />
        </section>
        <aside className="rounded-xl border border-accent-parallel/30 bg-accent-parallel/5 p-5">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-accent-parallel">
            analytics slot
          </p>
          {analytics}
        </aside>
        <aside className="rounded-xl border border-accent-parallel/30 bg-accent-parallel/5 p-5">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-accent-parallel">
            notifications slot
          </p>
          {notifications}
        </aside>
      </div>
    </div>
  );
}

function DashboardLink({
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
            ? "border-accent-parallel/40 bg-accent-parallel/10 text-accent-parallel"
            : "border-slate-200 bg-white hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
