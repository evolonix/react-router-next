import { isNotFoundError } from "@evolonix/react-router-next";
import { Link, useRouteError } from "react-router";

export default function AnalyticsError() {
  const error = useRouteError();
  if (isNotFoundError(error)) return null;
  const message =
    error instanceof Error ? error.message : "Unknown analytics failure.";
  return (
    <div className="space-y-2">
      <p className="font-mono text-[11px] uppercase tracking-wider text-accent-error">
        @analytics/error.tsx
      </p>
      <p className="text-sm text-zinc-700 dark:text-zinc-300">
        The analytics slot threw, but the main outlet kept rendering — each slot
        owns its own boundary.
      </p>
      <pre className="overflow-x-auto rounded-md bg-zinc-100 px-3 py-2 font-mono text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
        {message}
      </pre>
      <p>
        <Link
          to="/dashboard"
          className="text-xs font-medium text-accent-error hover:underline"
        >
          ← reset
        </Link>
      </p>
    </div>
  );
}
