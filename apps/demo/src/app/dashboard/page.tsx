export default function DashboardHome() {
  return (
    <div className="space-y-2">
      <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
        Overview
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Rendered by <code className="font-mono">dashboard/page.tsx</code>. The
        analytics card on the right is rendered by{" "}
        <code className="font-mono">dashboard/@analytics/page.tsx</code> at the
        same time.
      </p>
    </div>
  );
}
