export default function AnalyticsDefault() {
  return (
    <p className="text-xs text-slate-500 dark:text-slate-400">
      No analytics view matches this URL.{" "}
      <code className="font-mono">default.tsx</code> renders this fallback so
      the slot doesn't leak its previous match.
    </p>
  );
}
