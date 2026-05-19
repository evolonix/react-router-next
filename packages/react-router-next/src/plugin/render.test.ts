import { describe, expect, it } from "vitest";
import {
  renderAliasMap,
  renderAppTreeModule,
  renderDtsShim,
  renderRuntimeModule,
  virtualIdFor,
} from "./render";

describe("virtualIdFor", () => {
  it("maps the empty route key to _root", () => {
    expect(virtualIdFor("")).toBe("virtual:react-router-next/_root");
  });

  it("preserves the route key for non-empty keys", () => {
    expect(virtualIdFor("posts/[id]")).toBe(
      "virtual:react-router-next/posts/[id]",
    );
  });
});

describe("renderRuntimeModule", () => {
  it("emits only generate() for a static route", () => {
    const source = renderRuntimeModule("about");
    expect(source).toContain('const PATH = "about";');
    expect(source).toContain("export function generate()");
    expect(source).toContain("generateUrl(PATH, {})");
    expect(source).not.toContain("useRouteParams");
  });

  it("emits generate(params) and useRouteParams for a dynamic route", () => {
    const source = renderRuntimeModule("posts/[id]");
    expect(source).toContain('const PATH = "posts/[id]";');
    expect(source).toContain("export function useRouteParams()");
    expect(source).toContain("useRouteParamsBase(PATH)");
    expect(source).toContain("export function generate(params)");
    expect(source).toContain("generateUrl(PATH, params)");
  });

  it("JSON-encodes the route key so special characters stay quoted", () => {
    const key = 'foo"bar';
    const source = renderRuntimeModule(key);
    expect(source).toContain(`const PATH = ${JSON.stringify(key)};`);
  });
});

describe("renderDtsShim", () => {
  it("always emits the app-tree ambient declaration", () => {
    const shim = renderDtsShim([]);
    expect(shim).toContain(
      'declare module "virtual:react-router-next/app-tree"',
    );
    expect(shim).toContain("export const modules: Record<string, RouteModule>");
  });

  it("emits one declare module block per route key", () => {
    const shim = renderDtsShim(["", "posts/[id]"]);
    expect(shim).toContain('declare module "virtual:react-router-next/_root"');
    expect(shim).toContain(
      'declare module "virtual:react-router-next/posts/[id]"',
    );
  });

  it("omits useRouteParams and RouteProps for routes without params", () => {
    const shim = renderDtsShim([""]);
    const rootBlockMatch = shim.match(
      /declare module "virtual:react-router-next\/_root"[\s\S]*?\n}\n/,
    );
    expect(rootBlockMatch).not.toBeNull();
    const block = rootBlockMatch![0];
    expect(block).toContain("export function generate(): string;");
    expect(block).not.toContain("useRouteParams");
    expect(block).not.toContain("RouteProps");
  });

  it("emits useRouteParams and RouteProps for dynamic routes", () => {
    const shim = renderDtsShim(["posts/[id]"]);
    expect(shim).toContain("export function useRouteParams(): RouteParams;");
    expect(shim).toContain("export type RouteProps = { params: RouteParams };");
    expect(shim).toContain(
      "export function generate(params: RouteParams): string;",
    );
  });

  it("produces deterministic output for a given input order", () => {
    const a = renderDtsShim(["a", "b", "c"]);
    const b = renderDtsShim(["a", "b", "c"]);
    expect(a).toBe(b);
  });
});

describe("renderAppTreeModule", () => {
  it("emits an empty modules map when no entries are provided", () => {
    const source = renderAppTreeModule({
      appDirRootRelative: "/src/app",
      entries: [],
    });
    expect(source).toContain("export const modules = {");
    expect(source).toContain('export const appDir = "/src/app";');
    expect(source).not.toContain("import * as");
  });

  it("emits one static import per entry, keyed by the module key", () => {
    const source = renderAppTreeModule({
      appDirRootRelative: "/src/app",
      entries: [
        {
          importSpecifier: "../../src/app/page.tsx",
          moduleKey: "/src/app/page.tsx",
        },
        {
          importSpecifier: "../../src/app/posts/[id]/page.tsx",
          moduleKey: "/src/app/posts/[id]/page.tsx",
        },
      ],
    });
    expect(source).toContain('import * as m0 from "../../src/app/page.tsx";');
    expect(source).toContain(
      'import * as m1 from "../../src/app/posts/[id]/page.tsx";',
    );
    expect(source).toContain('["/src/app/page.tsx"]: m0,');
    expect(source).toContain('["/src/app/posts/[id]/page.tsx"]: m1,');
  });
});

describe("renderAliasMap", () => {
  it("emits an exact-match alias for app-tree and a prefix alias for routes", () => {
    const raw = renderAliasMap({ outDir: "/abs/out" });
    const parsed = JSON.parse(raw) as Record<string, string>;
    expect(parsed["virtual:react-router-next/app-tree$"]).toBe(
      "/abs/out/app-tree.js",
    );
    expect(parsed["virtual:react-router-next"]).toBe("/abs/out/routes");
  });

  it("terminates the JSON document with a trailing newline", () => {
    const raw = renderAliasMap({ outDir: "/abs/out" });
    expect(raw.endsWith("\n")).toBe(true);
  });
});
