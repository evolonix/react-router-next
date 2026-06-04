import type { HighlighterCore } from "shiki/core";

let highlighterPromise: Promise<HighlighterCore> | null = null;

function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    // Load the shiki core, regex engine, and only the grammars/themes the demo
    // actually uses — all dynamically, so none of it lands in the main entry
    // chunk. Importing the bundled `shiki` entry instead would pull ~300
    // language grammars into the build.
    highlighterPromise = (async () => {
      const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] =
        await Promise.all([
          import("shiki/core"),
          import("shiki/engine/javascript"),
        ]);
      return createHighlighterCore({
        themes: [
          import("@shikijs/themes/github-light"),
          import("@shikijs/themes/github-dark"),
        ],
        langs: [
          import("@shikijs/langs/tsx"),
          import("@shikijs/langs/json"),
          import("@shikijs/langs/shellscript"),
        ],
        engine: createJavaScriptRegexEngine(),
      });
    })();
  }
  return highlighterPromise;
}

/**
 * Map the languages the demo infers/passes onto the small set of grammars we
 * load. The TS/JS family is highlighted by the `tsx` grammar; anything we don't
 * load falls back to plain `text` (the code-block then degrades gracefully).
 */
function toGrammar(lang: string): string {
  if (lang === "json") return "json";
  if (lang === "sh" || lang === "bash" || lang === "shellscript") {
    return "shellscript";
  }
  if (["tsx", "ts", "jsx", "js", "typescript", "javascript"].includes(lang)) {
    return "tsx";
  }
  return "text";
}

const cache = new Map<string, Promise<string>>();

export function highlight(code: string, lang: string): Promise<string> {
  const grammar = toGrammar(lang);
  const key = `${grammar}::${code}`;
  let p = cache.get(key);
  if (!p) {
    p = getHighlighter().then((h) =>
      h.codeToHtml(code, {
        lang: grammar,
        themes: { light: "github-light", dark: "github-dark" },
        defaultColor: false,
      }),
    );
    cache.set(key, p);
  }
  return p;
}
