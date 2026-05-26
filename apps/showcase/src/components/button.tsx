import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Variant = "solid" | "ghost" | "link";
type Intent = "brand" | "neutral";
type Size = "sm" | "md";

interface CommonProps {
  variant?: Variant;
  intent?: Intent;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

const BASE =
  "inline-flex items-center gap-2 rounded-full text-sm transition disabled:cursor-not-allowed disabled:opacity-50";

const SIZE: Record<Size, string> = {
  sm: "px-4 py-2",
  md: "px-5 py-2.5",
};

const VARIANT_INTENT: Record<Variant, Record<Intent, string>> = {
  solid: {
    brand:
      "bg-brand-600 text-white font-semibold shadow-sm hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400",
    neutral:
      "bg-zinc-900 text-white font-semibold shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white",
  },
  ghost: {
    brand:
      "text-brand-700 font-semibold hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-900/40",
    neutral:
      "text-zinc-700 font-semibold hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
  },
  link: {
    brand:
      "rounded-none px-0 py-0 text-brand-700 dark:text-brand-300 hover:underline underline-offset-2 font-medium",
    neutral:
      "rounded-none px-0 py-0 text-zinc-700 dark:text-zinc-300 hover:underline underline-offset-2 font-medium",
  },
};

function recipe(variant: Variant, intent: Intent, size: Size) {
  const sizeClasses = variant === "link" ? "" : SIZE[size];
  return [BASE, sizeClasses, VARIANT_INTENT[variant][intent]]
    .filter(Boolean)
    .join(" ");
}

export function Button(props: ButtonProps) {
  const {
    variant = "solid",
    intent = "brand",
    size = "md",
    className,
    children,
    ...rest
  } = props;
  const merged = [recipe(variant, intent, size), className]
    .filter(Boolean)
    .join(" ");

  if ("href" in rest && rest.href !== undefined) {
    return (
      <a
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        className={merged}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      className={merged}
    >
      {children}
    </button>
  );
}
