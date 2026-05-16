import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type HeroProps = {
  title: ReactNode;
  tagline: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function Hero({ title, tagline, actions, className }: HeroProps) {
  return (
    <section
      className={cn(
        "rounded border border-border bg-gradient-to-b from-accent/30 to-transparent p-6 sm:p-8",
        className,
      )}
    >
      <h1 className="m-0 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
      <p className="m-0 mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
        {tagline}
      </p>
      {actions ? (
        <div className="mt-4 flex flex-wrap gap-3">{actions}</div>
      ) : null}
    </section>
  );
}
