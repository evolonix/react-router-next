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
        <p className="text-accent-routing font-mono text-[11px] tracking-wider uppercase">
          docs/[...slug]
        </p>
        <h1 className="text-xl font-semibold text-zinc-900 md:text-2xl dark:text-zinc-100">
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
                  : "border-zinc-200 bg-white hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
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
