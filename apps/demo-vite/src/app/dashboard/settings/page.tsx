export default function DashboardSettings() {
  return (
    <div className="space-y-2">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        Settings
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Rendered by{" "}
        <code className="font-mono">dashboard/settings/page.tsx</code>. Both
        slots swapped to their <code className="font-mono">settings/</code>{" "}
        match — analytics shows preferences and notifications shows channels.
      </p>
    </div>
  );
}
