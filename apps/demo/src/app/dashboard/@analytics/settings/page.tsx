const PREFERENCES = [
  { label: "Theme", value: "system" },
  { label: "Email digest", value: "weekly" },
  { label: "Beta features", value: "off" },
];

export default function AnalyticsSettings() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        Settings analytics
      </h3>
      <dl className="space-y-2">
        {PREFERENCES.map((p) => (
          <div key={p.label} className="flex justify-between text-sm">
            <dt className="text-slate-600 dark:text-slate-400">{p.label}</dt>
            <dd className="font-mono text-slate-900 dark:text-slate-100">
              {p.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
