export default function TransitionsHome() {
  return (
    <div className="space-y-2">
      <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
        transitions/page.tsx
      </p>
      <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
        Start here
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Click a sibling tab above. The dashed wrapper around this card fades in
        again because the template remounted — the layout above stayed put.
      </p>
    </div>
  );
}
