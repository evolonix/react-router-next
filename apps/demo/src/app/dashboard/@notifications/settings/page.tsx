const CHANNELS = [
  { label: "Email", value: "on" },
  { label: "Push", value: "off" },
  { label: "Slack", value: "on" },
];

export default function NotificationsSettings() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        Notification channels
      </h3>
      <dl className="space-y-2">
        {CHANNELS.map((channel) => (
          <div key={channel.label} className="flex justify-between text-sm">
            <dt className="text-slate-600 dark:text-slate-400">
              {channel.label}
            </dt>
            <dd className="font-mono text-slate-900 dark:text-slate-100">
              {channel.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
