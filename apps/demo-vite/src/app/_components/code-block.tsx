import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

export interface CodeBlockProps {
  filename?: string;
  lang?: string;
  children: string;
}

function inferLang(filename?: string): string {
  if (!filename) return "tsx";
  if (filename.endsWith("/")) return "text";
  if (filename.endsWith(".tsx")) return "tsx";
  if (filename.endsWith(".ts")) return "ts";
  if (filename.endsWith(".jsx")) return "jsx";
  if (filename.endsWith(".js")) return "js";
  if (filename.endsWith(".json")) return "json";
  if (filename.endsWith(".css")) return "css";
  if (filename.endsWith(".html")) return "html";
  if (filename.endsWith(".md")) return "md";
  return "tsx";
}

export function CodeBlock({ filename, lang, children }: CodeBlockProps) {
  const resolvedLang = lang ?? inferLang(filename);
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    codeToHtml(children, {
      lang: resolvedLang,
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    })
      .then((result) => {
        if (!cancelled) setHtml(result);
      })
      .catch(() => {
        // fall through to plain-text fallback
      });
    return () => {
      cancelled = true;
    };
  }, [children, resolvedLang]);

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 text-sm shadow-sm dark:border-zinc-800">
      {filename ? (
        <div className="border-b border-zinc-200 bg-zinc-50 px-3 py-1.5 font-mono text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          {filename}
        </div>
      ) : null}
      {html ? (
        <div
          className="shiki-block overflow-x-auto bg-white px-3 py-3 leading-relaxed dark:bg-zinc-950"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto bg-white px-3 py-3 leading-relaxed text-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
          <code className="font-mono">{children}</code>
        </pre>
      )}
    </div>
  );
}
