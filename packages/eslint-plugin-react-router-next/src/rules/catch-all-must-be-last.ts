import { parseRouteFile, parseSegment } from "../route-path";
import { appDirOption, appDirSchema, type RuleModule } from "../types";

// Segment kinds that contribute a matchable part to the React Router path.
const PATH_KINDS = new Set([
  "static",
  "dynamic",
  "catch-all",
  "optional-catch-all",
]);

const rule: RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require a catch-all segment to be last — it compiles to a React Router splat, which must end the path.",
    },
    schema: appDirSchema,
    messages: {
      notLast:
        'Catch-all segment "{{catchAll}}" must be the last segment. It compiles to a React Router splat ("*"), which matches the rest of the URL, so "{{next}}" can never be reached.',
    },
  },
  create(context) {
    const appDir = appDirOption(context.options);
    return {
      Program(node) {
        const info = parseRouteFile(context.filename, appDir);
        if (!info) return;

        let catchAll: string | null = null;
        for (const segment of info.segments) {
          // `_private` folders are stripped from the URL, so they don't count
          // as "after" a catch-all.
          if (segment.startsWith("_")) continue;
          const parsed = parseSegment(segment);
          if (!PATH_KINDS.has(parsed.type)) continue;
          if (catchAll !== null) {
            context.report({
              node,
              messageId: "notLast",
              data: { catchAll, next: segment },
            });
            return;
          }
          if (
            parsed.type === "catch-all" ||
            parsed.type === "optional-catch-all"
          )
            catchAll = segment;
        }
      },
    };
  },
};

export default rule;
