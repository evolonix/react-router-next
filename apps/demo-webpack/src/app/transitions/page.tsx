export default function TransitionsHome() {
  return (
    <div className="space-y-2">
      <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        transitions/page.tsx
      </p>
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        Start here
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Click a sibling tab above. The dashed wrapper around this card fades in
        again because the template remounted — the layout above stayed put.
      </p>
    </div>
  );
}
