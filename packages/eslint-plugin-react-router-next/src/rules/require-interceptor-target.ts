import {
  parseRouteFile,
  resolveInterceptTarget,
  routeMatchers,
} from "../route-path";
import { appRootOf, scanRouteFiles } from "../scan";
import { appDirOption, appDirSchema, type RuleModule } from "../types";

const rule: RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require an intercepting route to have an existing target page to intercept.",
    },
    schema: appDirSchema,
    messages: {
      missing:
        'Intercepting route resolves to "{{path}}", but no page renders that URL. Add a page for it, or remove the interceptor — at runtime this throws while building the route tree.',
    },
  },
  create(context) {
    const appDir = appDirOption(context.options);
    return {
      Program(node) {
        const info = parseRouteFile(context.filename, appDir);
        if (!info || info.kind !== "page") return;

        const target = resolveInterceptTarget(info.segments);
        if (!target) return; // not an intercepting route
        const targetMatchers = routeMatchers(target);
        if (!targetMatchers) return;
        const targetSignatures = new Set(
          targetMatchers.map((m) => m.signature),
        );

        const appRoot = appRootOf(context.filename, appDir);
        if (!appRoot) return;

        const self = context.filename.split("\\").join("/");
        for (const file of scanRouteFiles(appRoot)) {
          if (file === self) continue;
          const other = parseRouteFile(file, appDir);
          if (!other || other.kind !== "page") continue;
          // The target must be a real page, not another interceptor.
          if (resolveInterceptTarget(other.segments)) continue;
          const matchers = routeMatchers(other.segments);
          if (!matchers) continue;
          if (matchers.some((m) => targetSignatures.has(m.signature))) return;
        }

        context.report({
          node,
          messageId: "missing",
          data: { path: targetMatchers[targetMatchers.length - 1].path },
        });
      },
    };
  },
};

export default rule;
