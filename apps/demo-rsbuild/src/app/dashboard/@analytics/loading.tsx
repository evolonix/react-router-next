export default function AnalyticsLoading() {
  return (
    <div className="space-y-3">
      <p className="text-accent-parallel font-mono text-[11px] tracking-wider uppercase">
        @analytics/loading.tsx
      </p>
      <div className="space-y-2">
        <div className="bg-accent-parallel/20 h-4 w-2/3 animate-pulse rounded" />
        <div className="bg-accent-parallel/20 h-4 w-1/2 animate-pulse rounded" />
        <div className="bg-accent-parallel/20 h-4 w-3/4 animate-pulse rounded" />
      </div>
    </div>
  );
}
