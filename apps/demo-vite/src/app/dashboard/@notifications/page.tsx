const ALERTS = [
  { id: "a1", text: "Deploy succeeded", when: "2m" },
  { id: "a2", text: "New sign-up: hannah@", when: "14m" },
  { id: "a3", text: "Daily digest sent", when: "1h" },
];

export default function NotificationsHome() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        Recent activity
      </h3>
      <ul className="space-y-2">
        {ALERTS.map((alert) => (
          <li
            key={alert.id}
            className="flex justify-between text-sm text-slate-700 dark:text-slate-300"
          >
            <span>{alert.text}</span>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
              {alert.when}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
