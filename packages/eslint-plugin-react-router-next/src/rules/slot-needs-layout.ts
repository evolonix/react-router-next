import { parseRouteFile, parseSegment } from "../route-path";
import { appRootOf, hasLayoutFile } from "../scan";
import { appDirOption, appDirSchema, type RuleModule } from "../types";

const rule: RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Require a parallel-route slot (@slot) to have a layout in its owning segment to render into.",
    },
    schema: appDirSchema,
    messages: {
      missing:
        'Parallel-route slot "{{slot}}" needs a layout.tsx in "{{owner}}" to render into. Without one the runtime ignores the slot and it renders nothing.',
    },
  },
  create(context) {
    const appDir = appDirOption(context.options);
    return {
      Program(node) {
        const info = parseRouteFile(context.filename, appDir);
        if (!info) return;

        const slotIdx = info.segments.findIndex(
          (seg) => parseSegment(seg).type === "slot",
        );
        if (slotIdx === -1) return;

        const appRoot = appRootOf(context.filename, appDir);
        if (!appRoot) return;

        // The slot renders into the layout of the segment that owns it.
        const ownerSegments = info.segments.slice(0, slotIdx);
        const ownerDir = [appRoot, ...ownerSegments].join("/");
        if (!hasLayoutFile(ownerDir)) {
          context.report({
            node,
            messageId: "missing",
            data: {
              slot: info.segments[slotIdx],
              owner: ownerSegments.length ? ownerSegments.join("/") : appDir,
            },
          });
        }
      },
    };
  },
};

export default rule;
