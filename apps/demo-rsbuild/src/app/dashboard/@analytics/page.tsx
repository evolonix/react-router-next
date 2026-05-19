import { useSearchParams } from "react-router";

import { useStats } from "./_lib/use-stats";

export default function AnalyticsHome() {
  const [searchParams] = useSearchParams();
  const stats = useStats("home", searchParams.get("fail") === "1");
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        Overview stats
      </h3>
      <dl className="space-y-2">
        {stats.map((stat) => (
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
