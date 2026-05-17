const STATS = [
  { label: "Visits today", value: "1,284" },
  { label: "Sign-ups", value: "37" },
  { label: "Error rate", value: "0.4%" },
];

export default function AnalyticsHome() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        Overview stats
      </h3>
      <dl className="space-y-2">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex justify-between text-sm">
            <dt className="text-slate-600 dark:text-slate-400">{stat.label}</dt>
            <dd className="font-mono text-slate-900 dark:text-slate-100">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
