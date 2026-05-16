import { use, useMemo } from "react";
import { getHighlighter } from "../../lib/highlighter";
import { cn } from "../../lib/cn";
import { getSource } from "../../lib/source-registry";

type SourceViewerProps = {
  path: string;
  className?: string;
};

const highlightCache = new Map<string, Promise<string>>();

function highlight(path: string, code: string): Promise<string> {
  let p = highlightCache.get(path);
  if (!p) {
    const lang = path.endsWith(".tsx") ? "tsx" : "typescript";
    p = getHighlighter().then((h) =>
      h.codeToHtml(code, {
        lang,
        themes: { light: "github-light", dark: "github-dark" },
        defaultColor: false,
      }),
    );
    highlightCache.set(path, p);
  }
  return p;
}

/**
 * Renders a route source file with syntax highlighting. Suspends while Shiki
 * boots; the parent must wrap in `<Suspense fallback={...}>`.
 */
export function SourceViewer({ path, className }: SourceViewerProps) {
  const code = useMemo(() => getSource(path), [path]);
  if (!code) {
    return (
      <div
        className={cn(
          "rounded border border-border bg-muted/30 p-3 text-xs text-muted-foreground",
          className,
        )}
      >
        Source not found:{" "}
        <code className="font-mono text-foreground">{path}</code>
      </div>
    );
  }
  const html = use(highlight(path, code));
  return (
    <div
      className={cn(
        "overflow-x-auto rounded border border-border text-xs leading-relaxed [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:p-3 [&_pre]:font-mono",
        className,
      )}
      // Shiki escapes everything; safe to inject.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
