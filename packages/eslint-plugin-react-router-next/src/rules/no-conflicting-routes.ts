import { parseRouteFile, routeMatchers } from "../route-path";
import { appRootOf, relativeToApp, scanRouteFiles } from "../scan";
import { appDirOption, appDirSchema, type RuleModule } from "../types";

const rule: RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Flag page files that compile to the same React Router path and so match the same URLs.",
    },
    schema: appDirSchema,
    messages: {
      conflict:
        'Route conflict: this page matches the same URL(s) as {{others}} — all compile to the React Router path "{{path}}". Route groups, and dynamic params that differ only by name (`[id]` vs `[slug]`), don\'t make routes distinct.',
    },
  },
  create(context) {
    const appDir = appDirOption(context.options);
    return {
      Program(node) {
        const info = parseRouteFile(context.filename, appDir);
        if (!info || info.kind !== "page") return;
        const selfMatchers = routeMatchers(info.segments);
        if (!selfMatchers) return;

        const appRoot = appRootOf(context.filename, appDir);
        if (!appRoot) return;

        const self = context.filename.split("\\").join("/");
        const selfSignatures = new Set(selfMatchers.map((m) => m.signature));
        const conflicts = new Set<string>();
        let conflictPath = "";
        for (const file of scanRouteFiles(appRoot)) {
          if (file === self) continue;
          const other = parseRouteFile(file, appDir);
          if (!other || other.kind !== "page") continue;
          const otherMatchers = routeMatchers(other.segments);
          if (!otherMatchers) continue;
          for (const m of otherMatchers) {
            if (!selfSignatures.has(m.signature)) continue;
            conflicts.add(relativeToApp(file, appRoot));
            conflictPath =
              selfMatchers.find((s) => s.signature === m.signature)?.path ??
              conflictPath;
          }
        }

        if (conflicts.size) {
          context.report({
            node,
            messageId: "conflict",
            data: {
              path: conflictPath,
              others: [...conflicts].sort().join(", "),
            },
          });
        }
      },
    };
  },
};

export default rule;
