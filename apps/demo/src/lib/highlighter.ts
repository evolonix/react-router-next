import type { HighlighterCore } from "shiki/core";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

let pending: Promise<HighlighterCore> | null = null;

/**
 * Lazily build a fine-grained Shiki highlighter limited to TS/TSX with both
 * GitHub themes. Avoids the ~2 MB default bundle by importing only what we
 * need; the highlighter is built once per page load and reused for every file.
 *
 * The themes use `defaultColor: false` so the rendered output emits both
 * `--shiki-light` and `--shiki-dark` CSS variables on every span; the consuming
 * CSS picks one based on `color-scheme` so theme switches don't re-highlight.
 */
export function getHighlighter(): Promise<HighlighterCore> {
  if (!pending) {
    pending = createHighlighterCore({
      themes: [
        import("@shikijs/themes/github-light"),
        import("@shikijs/themes/github-dark"),
      ],
      langs: [
        import("@shikijs/langs/tsx"),
        import("@shikijs/langs/typescript"),
      ],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return pending;
}
