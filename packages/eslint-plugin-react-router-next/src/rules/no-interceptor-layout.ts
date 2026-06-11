import { parseInterceptPrefix, parseRouteFile } from "../route-path";
import { appDirOption, appDirSchema, type RuleModule } from "../types";

const rule: RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Flag a layout inside an intercepting route, which the runtime drops.",
    },
    schema: appDirSchema,
    messages: {
      ignored:
        "A layout inside an intercepting route is ignored at runtime — interceptors resolve to their target and never render their own layout. Move this layout to the target route instead.",
    },
  },
  create(context) {
    const appDir = appDirOption(context.options);
    return {
      Program(node) {
        const info = parseRouteFile(context.filename, appDir);
        if (!info || info.kind !== "layout") return;
        if (info.segments.some((seg) => parseInterceptPrefix(seg) !== null))
          context.report({ node, messageId: "ignored" });
      },
    };
  },
};

export default rule;
