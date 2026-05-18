import type { ReactNode } from "react";

export type Accent =
  | "neutral"
  | "routing"
  | "data"
  | "error"
  | "parallel"
  | "intercept";

const ACCENT: Record<Accent, { chip: string; bar: string; label: string }> = {
  neutral: {
    chip: "bg-slate-200/60 text-slate-700 ring-slate-300 dark:bg-slate-700/60 dark:text-slate-200 dark:ring-slate-600",
    bar: "bg-slate-300 dark:bg-slate-600",
    label: "Overview",
  },
  routing: {
    chip: "bg-accent-routing/15 text-accent-routing ring-accent-routing/30",
    bar: "bg-accent-routing",
    label: "Routing",
  },
  data: {
    chip: "bg-accent-data/15 text-accent-data ring-accent-data/30",
    bar: "bg-accent-data",
    label: "Data",
  },
  error: {
    chip: "bg-accent-error/15 text-accent-error ring-accent-error/30",
    bar: "bg-accent-error",
    label: "Errors",
  },
  parallel: {
    chip: "bg-accent-parallel/15 text-accent-parallel ring-accent-parallel/30",
    bar: "bg-accent-parallel",
    label: "Parallel",
  },
  intercept: {
    chip: "bg-accent-intercept/15 text-accent-intercept ring-accent-intercept/30",
    bar: "bg-accent-intercept",
    label: "Intercept",
  },
};

export interface ExplainProps {
  title: string;
  accent: Accent;
  tag?: string;
  children: ReactNode;
}

export function Explain({ title, accent, tag, children }: ExplainProps) {
  const a = ACCENT[accent];
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className={`h-1 ${a.bar}`} />
      <div className="space-y-4 p-6">
        <header className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${a.chip}`}
          >
            {tag ?? a.label}
          </span>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
        </header>
        <div className="space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {children}
        </div>
      </div>
    </section>
  );
}
