export default function DashboardHome() {
  return (
    <div className="space-y-2">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        Overview
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Rendered by <code className="font-mono">dashboard/page.tsx</code>. The
        two cards next to this one are rendered by{" "}
        <code className="font-mono">dashboard/@analytics/page.tsx</code> and{" "}
        <code className="font-mono">dashboard/@notifications/page.tsx</code> at
        the same time — each matches the URL independently.
      </p>
    </div>
  );
}
