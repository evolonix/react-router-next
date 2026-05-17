import { Link, useLocation } from "react-router";

export default function RootNotFound() {
  const { pathname } = useLocation();
  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
        not-found.tsx
      </p>
      <h1 className="text-xl font-semibold text-slate-900 md:text-2xl dark:text-slate-100">
        404
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Nothing is mounted at{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 font-mono dark:bg-slate-800">
          {pathname}
        </code>
        . This page is rendered by{" "}
        <code className="font-mono">src/app/not-found.tsx</code> — the root
        boundary.
      </p>
      <Link
        to="/"
        className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Back to the demo home
      </Link>
    </section>
  );
}
