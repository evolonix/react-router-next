import { Outlet } from "react-router";

export default function PostsLayout() {
  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-wider text-accent-data">
          posts/
        </p>
        <h1 className="text-xl font-semibold text-zinc-900 md:text-2xl dark:text-zinc-100">
          Suspense, params, errors
        </h1>
      </header>
      <Outlet />
    </div>
  );
}
