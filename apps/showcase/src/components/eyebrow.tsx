import {
  createElement,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type Tone = "brand" | "neutral" | "danger";

interface EyebrowProps extends HTMLAttributes<HTMLElement> {
  tone?: Tone;
  /** Underlying element. Default "p". Use "h2"/"h3"/etc. when the eyebrow doubles as a heading. */
  as?: ElementType;
  children: ReactNode;
}

const TONE: Record<Tone, string> = {
  brand: "text-brand-700 dark:text-brand-300",
  neutral: "text-zinc-600 dark:text-zinc-400",
  danger: "text-rose-700 dark:text-rose-300",
};

export function Eyebrow({
  tone = "brand",
  as = "p",
  children,
  className,
  ...rest
}: EyebrowProps) {
  const merged = [
    "text-xs font-semibold tracking-[0.18em] uppercase",
    TONE[tone],
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return createElement(as, { className: merged, ...rest }, children);
}
