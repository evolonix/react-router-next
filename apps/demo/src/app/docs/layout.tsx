import { NavLink, Outlet } from "react-router";

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
          <NavLink
            key={path}
            to={path}
            end
            preventScrollReset
            className={({ isActive }) =>
              `rounded-md border px-3 py-1.5 font-mono text-xs transition ${
                isActive
                  ? "border-accent-routing/40 bg-accent-routing/10 text-accent-routing"
                  : "border-slate-200 bg-white hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
              }`
            }
          >
            {path}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
