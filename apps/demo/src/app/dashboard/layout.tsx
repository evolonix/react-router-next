import type { ReactNode } from "react";
import { Link, Outlet } from "react-router";

import { CodeBlock } from "../_components/code-block";
import { Explain } from "../_components/explain";

interface DashboardLayoutProps {
  analytics: ReactNode;
}

export default function DashboardLayout({ analytics }: DashboardLayoutProps) {
  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-wider text-accent-parallel">
          dashboard/ + @analytics/
        </p>
        <h1 className="text-xl font-semibold text-slate-900 md:text-2xl dark:text-slate-100">
          Parallel routes
        </h1>
      </header>

      <Explain title="A slot is a layout prop" accent="parallel" tag="@slot">
        <p>
          The folder <code className="font-mono">dashboard/@analytics/</code>{" "}
          doesn't add anything to the URL. Instead, it matches the URL
          independently and shows up as a named prop on this layout. The main
          flow still flows through <code>{"<Outlet/>"}</code>.
        </p>
        <CodeBlock filename="src/app/dashboard/layout.tsx">{`export default function DashboardLayout({
  analytics,
}: { analytics: ReactNode }) {
  return (
    <div className="grid grid-cols-[2fr_1fr] gap-4">
      <main><Outlet /></main>      {/* dashboard/page.tsx, dashboard/settings/page.tsx */}
      <aside>{analytics}</aside>   {/* @analytics/page.tsx, @analytics/settings/page.tsx */}
    </div>
  );
}`}</CodeBlock>
      </Explain>

      <nav className="flex gap-2 text-sm">
        <Link
          to="/dashboard"
          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          /dashboard
        </Link>
        <Link
          to="/dashboard/settings"
          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          /dashboard/settings
        </Link>
      </nav>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
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
      </div>
    </div>
  );
}
