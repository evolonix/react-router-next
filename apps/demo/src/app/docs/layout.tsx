import { Link, Outlet } from "react-router";

const SAMPLE_PATHS = [
  "/docs/getting-started",
  "/docs/getting-started/install",
  "/docs/guides/parallel-routes/with-modal",
];

export default function DocsLayout() {
  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-wider text-accent-routing">
          docs/[...slug]
        </p>
        <h1 className="text-xl font-semibold text-slate-900 md:text-2xl dark:text-slate-100">
          Catch-all segments
        </h1>
      </header>
      <div className="flex flex-wrap gap-2">
        {SAMPLE_PATHS.map((path) => (
          <Link
            key={path}
            to={path}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            {path}
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
