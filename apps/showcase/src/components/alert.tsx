import type { HTMLAttributes, ReactNode } from "react";

type Intent = "info" | "success" | "warning" | "error";
type Density = "inline" | "section";

interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  intent?: Intent;
  density?: Density;
  title?: ReactNode;
  children: ReactNode;
}

const INTENT: Record<Intent, string> = {
  info: "bg-brand-50 ring-brand-200 text-brand-900 dark:bg-brand-900/40 dark:ring-brand-800 dark:text-brand-100",
  success:
    "bg-emerald-50 ring-emerald-200 text-emerald-900 dark:bg-emerald-900/40 dark:ring-emerald-800 dark:text-emerald-100",
  warning:
    "bg-amber-50 ring-amber-200 text-amber-900 dark:bg-amber-900/40 dark:ring-amber-800 dark:text-amber-100",
  error:
    "bg-rose-50 ring-rose-200 text-rose-700 dark:bg-rose-950/40 dark:ring-rose-800 dark:text-rose-200",
};

const DENSITY: Record<Density, string> = {
  inline: "rounded-lg p-3 text-sm",
  section: "rounded-2xl p-8 text-base",
};

export function Alert({
  intent = "info",
  density = "inline",
  title,
  children,
  className,
  ...rest
}: AlertProps) {
  const merged = [DENSITY[density], "ring-1", INTENT[intent], className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={merged} {...rest}>
      {title && <p className="font-semibold">{title}</p>}
      <div className={title ? "mt-1" : undefined}>{children}</div>
    </div>
  );
}
