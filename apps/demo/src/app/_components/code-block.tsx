import type { ReactNode } from "react";

export interface CodeBlockProps {
  filename?: string;
  children: ReactNode;
}

export function CodeBlock({ filename, children }: CodeBlockProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 text-sm shadow-sm dark:border-slate-800">
      {filename ? (
        <div className="border-b border-slate-800 bg-slate-900 px-3 py-1.5 font-mono text-xs text-slate-400">
          {filename}
        </div>
      ) : null}
      <pre className="overflow-x-auto px-3 py-3 leading-relaxed text-slate-100">
        <code className="font-mono">{children}</code>
      </pre>
    </div>
  );
}
