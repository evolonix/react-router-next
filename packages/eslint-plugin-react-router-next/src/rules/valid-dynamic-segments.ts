import { parseRouteFile, parseSegment } from "../route-path";
import { appDirOption, appDirSchema, type RuleModule } from "../types";

const rule: RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Flag malformed dynamic route segments (e.g. `[]`, `[...]`, `[id`).",
    },
    schema: appDirSchema,
    messages: {
      malformed:
        'Malformed route segment "{{segment}}". Use [name], [...name], or [[...name]].',
    },
  },
  create(context) {
    const appDir = appDirOption(context.options);
    return {
      Program(node) {
        const info = parseRouteFile(context.filename, appDir);
        if (!info) return;
        for (const segment of info.segments) {
          if (parseSegment(segment).type === "malformed") {
            context.report({ node, messageId: "malformed", data: { segment } });
          }
        }
      },
    };
  },
};

export default rule;
