import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";

interface CommonProps {
  interactive?: boolean;
  /** Tailwind gradient classes for the optional top accent strip, e.g. "from-brand-500 to-fuchsia-500". */
  accent?: string;
  className?: string;
  children: ReactNode;
}

type CardAsDiv = CommonProps &
  Omit<HTMLAttributes<HTMLDivElement>, "className" | "children"> & {
    href?: undefined;
  };

type CardAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

export type CardProps = CardAsDiv | CardAsLink;

const BASE =
  "relative block overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800";
const INTERACTIVE = "group transition hover:-translate-y-0.5 hover:shadow-lg";

export function Card(props: CardProps) {
  const { interactive = false, accent, children, className, ...rest } = props;
  const merged = [BASE, interactive && INTERACTIVE, className]
    .filter(Boolean)
    .join(" ");
  const strip = accent ? (
    <div
      aria-hidden
      className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${accent}`}
    />
  ) : null;

  if ("href" in rest && rest.href !== undefined) {
    return (
      <a
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        className={merged}
      >
        {strip}
        {children}
      </a>
    );
  }
  return (
    <div {...(rest as HTMLAttributes<HTMLDivElement>)} className={merged}>
      {strip}
      {children}
    </div>
  );
}
