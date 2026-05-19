import { useTheme, type Theme } from "./theme";

const OPTIONS: { value: Theme; label: string; icon: string }[] = [
  { value: "system", label: "System", icon: "◐" },
  { value: "light", label: "Light", icon: "☀" },
  { value: "dark", label: "Dark", icon: "☾" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const currentIndex = OPTIONS.findIndex((opt) => opt.value === theme);
  const current = OPTIONS[currentIndex] ?? OPTIONS[0];
  const next = OPTIONS[(currentIndex + 1) % OPTIONS.length];
  return (
    <button
      type="button"
      aria-label={`Theme: ${current.label}. Switch to ${next.label}.`}
      title={`Theme: ${current.label}`}
      onClick={() => setTheme(next.value)}
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <span aria-hidden>{current.icon}</span>
      <span>{current.label}</span>
    </button>
  );
}
