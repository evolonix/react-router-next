import type { ReactNode } from "react";
import { Link } from "react-router";

import type { Accent } from "./explain";

const ACCENT_BAR: Record<Accent, string> = {
  neutral: "bg-linear-to-r from-zinc-400 to-zinc-300",
  routing: "bg-linear-to-r from-blue-500 to-sky-400",
  data: "bg-linear-to-r from-emerald-500 to-green-400",
  error: "bg-linear-to-r from-emerald-500 to-green-400",
  parallel: "bg-linear-to-r from-fuchsia-500 to-pink-400",
  intercept: "bg-linear-to-r from-amber-500 to-orange-400",
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
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:focus-visible:ring-zinc-600"
    >
      <div className={`h-1 ${ACCENT_BAR[accent]}`} />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {pattern}
        </p>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {children}
        </p>
        <span className="mt-auto pt-3 text-sm font-medium text-zinc-700 transition group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-100">
          Open example →
        </span>
      </div>
    </Link>
  );
}
