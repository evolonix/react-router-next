import type { ReactNode } from "react";

interface SectionProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  tone?: "default" | "brand";
  id?: string;
}

export function Section({
  eyebrow,
  title,
  description,
  children,
  tone = "default",
  id,
}: SectionProps) {
  const isBrand = tone === "brand";
  return (
    <section
      id={id}
      className={
        isBrand
          ? "from-brand-500 to-accent-500 relative isolate overflow-hidden bg-linear-to-br via-fuchsia-500 text-white"
          : "bg-transparent"
      }
    >
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        {eyebrow && (
          <p
            className={
              isBrand
                ? "mb-3 text-xs font-semibold tracking-[0.18em] text-white/80 uppercase"
                : "text-brand-600 dark:text-brand-300 mb-3 text-xs font-semibold tracking-[0.18em] uppercase"
            }
          >
            {eyebrow}
          </p>
        )}
        <h1
          className={
            isBrand
              ? "text-4xl font-bold tracking-tight sm:text-5xl"
              : "text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50"
          }
        >
          {title}
        </h1>
        {description && (
          <p
            className={
              isBrand
                ? "mt-4 max-w-2xl text-lg text-white/90"
                : "mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400"
            }
          >
            {description}
          </p>
        )}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
