import { Link, useLocation } from "react-router";

export default function RootNotFound() {
  const { pathname } = useLocation();
  return (
    <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        not-found.tsx
      </p>
      <h1 className="text-xl font-semibold text-zinc-900 md:text-2xl dark:text-zinc-100">
        404
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Nothing is mounted at{" "}
        <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">
          {pathname}
        </code>
        . This page is rendered by{" "}
        <code className="font-mono">src/app/not-found.tsx</code> — the root
        boundary.
      </p>
      <Link
        to="/"
        className="inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Back to the demo home
      </Link>
    </section>
  );
}
