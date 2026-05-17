import type { ReactNode } from "react";
import { Link } from "react-router";

import type { Accent } from "./explain";

const ACCENT_BAR: Record<Accent, string> = {
  routing: "bg-accent-routing",
  data: "bg-accent-data",
  error: "bg-accent-error",
  parallel: "bg-accent-parallel",
  intercept: "bg-accent-intercept",
};

export interface FeatureCardProps {
  to: string;
  title: string;
  accent: Accent;
  pattern: string;
  children: ReactNode;
}

export function FeatureCard({
  to,
  title,
  accent,
  pattern,
  children,
}: FeatureCardProps) {
  return (
    <Link
      to={to}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:focus-visible:ring-slate-600"
    >
      <div className={`h-1 ${ACCENT_BAR[accent]}`} />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {pattern}
        </p>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {children}
        </p>
        <span className="mt-auto pt-3 text-sm font-medium text-slate-700 transition group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-slate-100">
          Open example →
        </span>
      </div>
    </Link>
  );
}
