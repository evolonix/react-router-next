import { paramName, parseRouteFile } from "../route-path";
import { appDirOption, appDirSchema, type RuleModule } from "../types";

const rule: RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Flag a route path that binds the same dynamic param name twice.",
    },
    schema: appDirSchema,
    messages: {
      duplicate:
        'Duplicate route param "{{name}}". Each dynamic segment in a route path needs a distinct name.',
    },
  },
  create(context) {
    const appDir = appDirOption(context.options);
    return {
      Program(node) {
        const info = parseRouteFile(context.filename, appDir);
        if (!info) return;
        const seen = new Set<string>();
        for (const segment of info.segments) {
          const name = paramName(segment);
          if (!name) continue;
          if (seen.has(name)) {
            context.report({ node, messageId: "duplicate", data: { name } });
          } else {
            seen.add(name);
          }
        }
      },
    };
  },
};

export default rule;
