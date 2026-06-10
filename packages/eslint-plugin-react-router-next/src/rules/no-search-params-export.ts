import { parseRouteFile } from "../route-path";
import { appDirOption, appDirSchema, type RuleModule } from "../types";

// `searchParams` is the name of the page *prop* a route receives. The opt-in
// validation schema is exported as `searchSchema` — exporting `searchParams`
// from a route file is almost always a mistake (or pre-rename code).
const rule: RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow exporting `searchParams` from a route file; the schema export is `searchSchema`.",
    },
    schema: appDirSchema,
    messages: {
      renamed:
        "Export the search-params schema as `searchSchema`, not `searchParams` (which is the page prop).",
    },
  },
  create(context) {
    const appDir = appDirOption(context.options);
    const inRouteFile = () => parseRouteFile(context.filename, appDir) !== null;

    const check = (name: unknown, node: unknown) => {
      if (name === "searchParams") {
        context.report({ node, messageId: "renamed" });
      }
    };

    return {
      ExportNamedDeclaration(node) {
        if (!inRouteFile()) return;
        const decl = node.declaration;
        if (decl?.type === "VariableDeclaration") {
          for (const d of decl.declarations) {
            if (d.id?.type === "Identifier") check(d.id.name, d.id);
          }
        } else if (
          (decl?.type === "FunctionDeclaration" ||
            decl?.type === "ClassDeclaration") &&
          decl.id
        ) {
          check(decl.id.name, decl.id);
        }
        for (const spec of node.specifiers ?? []) {
          const exported = spec.exported;
          const name =
            exported?.type === "Identifier" ? exported.name : exported?.value;
          check(name, spec);
        }
      },
    };
  },
};

export default rule;
