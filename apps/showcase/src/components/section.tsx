import type { ReactNode } from "react";
import { Eyebrow } from "./eyebrow";

type Tone = "default" | "brand" | "alt";
type Width = "default" | "prose";

interface SectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  tone?: Tone;
  width?: Width;
  id?: string;
}

const OUTER: Record<Tone, string> = {
  default: "bg-transparent",
  brand:
    "from-brand-600 to-brand-800 relative isolate overflow-hidden bg-linear-to-br via-fuchsia-700 text-white",
  alt: "border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40",
};

const INNER_WIDTH: Record<Width, string> = {
  default: "max-w-6xl",
  prose: "max-w-3xl",
};

export function Section({
  eyebrow,
  title,
  description,
  children,
  tone = "default",
  width = "default",
  id,
}: SectionProps) {
  const isBrand = tone === "brand";
  return (
    <section id={id} className={OUTER[tone]}>
      <div className={`mx-auto ${INNER_WIDTH[width]} px-6 py-16 sm:py-20`}>
        {eyebrow &&
          (isBrand ? (
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-white uppercase">
              {eyebrow}
            </p>
          ) : (
            <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
          ))}
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
                ? "mt-4 max-w-2xl text-lg text-white"
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
