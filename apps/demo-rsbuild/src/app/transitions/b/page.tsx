export default function TransitionsB() {
  return (
    <div className="space-y-2">
      <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
        transitions/b/page.tsx
      </p>
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        Tab B
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        If this were a regular <code className="font-mono">layout.tsx</code>, no
        animation would replay between siblings — the wrapper would persist and
        only <code>{"<Outlet/>"}</code>'s contents would swap.
      </p>
    </div>
  );
}
