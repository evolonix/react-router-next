import { Outlet } from "react-router";

export default function PostsLayout() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-accent-data font-mono text-[11px] tracking-wider uppercase">
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
