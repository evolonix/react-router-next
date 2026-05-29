import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

export type HighlightLang = "tsx" | "text";

let highlighterPromise: Promise<HighlighterCore> | null = null;

function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [
        import("@shikijs/themes/github-light-high-contrast"),
        import("@shikijs/themes/github-dark-high-contrast"),
      ],
      langs: [import("@shikijs/langs/tsx")],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return highlighterPromise;
}

const cache = new Map<string, Promise<string>>();

export function highlight(code: string, lang: HighlightLang): Promise<string> {
  const key = `${lang}::${code}`;
  let p = cache.get(key);
  if (!p) {
    p = getHighlighter().then((h) =>
      h.codeToHtml(code, {
        lang,
        themes: {
          light: "github-light-high-contrast",
          dark: "github-dark-high-contrast",
        },
        defaultColor: false,
      }),
    );
    cache.set(key, p);
  }
  return p;
}
