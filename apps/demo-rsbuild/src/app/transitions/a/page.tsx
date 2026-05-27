export default function TransitionsA() {
  return (
    <div className="space-y-2">
      <p className="font-mono text-[11px] tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
        transitions/a/page.tsx
      </p>
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        Tab A
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Same template wrapper around three different pages. The fade-in is the
        animation that proves the wrapper remounted on this navigation.
      </p>
    </div>
  );
}
