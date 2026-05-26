import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

type Density = "comfortable" | "compact";

interface BaseFieldProps {
  label: string;
  hint?: ReactNode;
  error?: string;
  density?: Density;
  required?: boolean;
}

const DENSITY: Record<Density, string> = {
  comfortable: "px-3 py-2 text-base sm:text-sm",
  compact: "px-3 py-1.5 text-sm",
};

const CONTROL_BASE =
  "mt-1 block w-full rounded-lg border-0 bg-zinc-50 text-zinc-900 ring-1 ring-zinc-200 ring-inset placeholder:text-zinc-400 focus:ring-2 focus-visible:outline-none dark:bg-zinc-950 dark:text-zinc-100 dark:ring-zinc-700";

function controlClass(density: Density, hasError: boolean, extra?: string) {
  const ring = hasError
    ? "focus:ring-rose-500 ring-rose-300 dark:ring-rose-700"
    : "focus:ring-brand-500";
  return [CONTROL_BASE, DENSITY[density], ring, extra]
    .filter(Boolean)
    .join(" ");
}

function RequiredMark() {
  return (
    <>
      <span
        aria-hidden="true"
        className="ml-0.5 text-rose-600 dark:text-rose-300"
      >
        *
      </span>
      <span className="sr-only"> (required)</span>
    </>
  );
}

function FieldLabel({
  htmlFor,
  label,
  required,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
    >
      {label}
      {required && <RequiredMark />}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-1 text-sm text-rose-600 dark:text-rose-300">
      {message}
    </p>
  );
}

export type FieldProps = BaseFieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "name"> & {
    name: string;
  };

export function Field({
  label,
  hint,
  error,
  density = "comfortable",
  required,
  name,
  ...rest
}: FieldProps) {
  const errorId = `${name}-error`;
  return (
    <div>
      <FieldLabel htmlFor={name} label={label} required={required} />
      <input
        id={name}
        name={name}
        required={required}
        aria-required={required ? "true" : undefined}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        className={controlClass(density, Boolean(error))}
        {...rest}
      />
      {hint && !error && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
      )}
      {error && <FieldError id={errorId} message={error} />}
    </div>
  );
}

export type FieldTextareaProps = BaseFieldProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className" | "name"> & {
    name: string;
  };

export function FieldTextarea({
  label,
  hint,
  error,
  density = "comfortable",
  required,
  name,
  rows = 5,
  ...rest
}: FieldTextareaProps) {
  const errorId = `${name}-error`;
  return (
    <div>
      <FieldLabel htmlFor={name} label={label} required={required} />
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        aria-required={required ? "true" : undefined}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        className={controlClass(density, Boolean(error))}
        {...rest}
      />
      {hint && !error && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
      )}
      {error && <FieldError id={errorId} message={error} />}
    </div>
  );
}
