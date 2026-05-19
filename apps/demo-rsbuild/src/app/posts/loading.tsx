export default function PostsLoading() {
  return (
    <div className="space-y-3">
      <p className="font-mono text-[11px] uppercase tracking-wider text-accent-data">
        loading.tsx
      </p>
      <div className="space-y-2">
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}
