import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "inline" | "external";

interface AppLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "className"
> {
  variant?: Variant;
  /** Optional leading brand icon, rendered aria-hidden before the label. */
  icon?: ReactNode;
  href: string;
  className?: string;
  children: ReactNode;
}

const BASE = "text-brand-700 dark:text-brand-300";
const VARIANT: Record<Variant, string> = {
  inline: "hover:underline underline-offset-2",
  external: "underline underline-offset-2 decoration-1 hover:no-underline",
};

export function AppLink({
  variant = "inline",
  icon,
  className,
  children,
  ...rest
}: AppLinkProps) {
  const decoration = VARIANT[variant];
  const merged = icon
    ? [BASE, "inline-flex items-center gap-1.5", className]
        .filter(Boolean)
        .join(" ")
    : [BASE, decoration, className].filter(Boolean).join(" ");
  const externalAttrs =
    variant === "external"
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
  return (
    <a {...externalAttrs} {...rest} className={merged}>
      {icon ? (
        <>
          <span aria-hidden className="shrink-0">
            {icon}
          </span>
          <span className={decoration}>{children}</span>
        </>
      ) : (
        children
      )}
    </a>
  );
}
