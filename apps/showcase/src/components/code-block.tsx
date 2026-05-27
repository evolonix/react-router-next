import { Suspense, use } from "react";
import { highlight, type HighlightLang } from "../lib/highlight";

interface CodeBlockProps {
  code: string;
  lang?: HighlightLang;
  /** Optional file path shown in a header bar above the highlighted code. */
  filename?: string;
  className?: string;
}

export function CodeBlock({
  code,
  lang = "tsx",
  filename,
  className,
}: CodeBlockProps) {
  const wrapperClass = [
    "overflow-hidden rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-800",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  const blockClass =
    "shiki-block overflow-x-auto py-4 font-mono text-xs leading-relaxed";
  const label = filename
    ? `${filename}, ${lang.toUpperCase()}`
    : `Code example, ${lang.toUpperCase()}`;
  return (
    <div className={wrapperClass}>
      {filename ? (
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-1.5 font-mono text-[11px] tracking-wider text-zinc-600 uppercase dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          {filename}
        </div>
      ) : null}
      <Suspense
        fallback={
          <Placeholder className={blockClass} code={code} label={label} />
        }
      >
        <Highlighted
          code={code}
          lang={lang}
          className={blockClass}
          label={label}
        />
      </Suspense>
    </div>
  );
}

function Highlighted({
  code,
  lang,
  className,
  label,
}: {
  code: string;
  lang: HighlightLang;
  className: string;
  label: string;
}) {
  const html = use(highlight(code, lang));
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function Placeholder({
  code,
  className,
  label,
}: {
  code: string;
  className: string;
  label: string;
}) {
  return (
    <pre role="region" aria-label={label} tabIndex={0} className={className}>
      <code>{code}</code>
    </pre>
  );
}
