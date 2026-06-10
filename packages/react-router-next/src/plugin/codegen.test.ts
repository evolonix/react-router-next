import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { generateRouteModules } from "./codegen";
import { renderRuntimeModule } from "./render";

function writePage(dir: string): void {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "page.tsx"), "export default function Page() {}");
}

describe("generateRouteModules", () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "rrn-codegen-"));
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("writes app-tree.js, aliases.json, and per-route shims", () => {
    writePage(join(root, "src/app"));
    writePage(join(root, "src/app/posts/[id]"));

    const result = generateRouteModules({
      root,
      appDir: "src/app",
      outDir: "out",
    });

    expect(result.routeKeys).toEqual(["", "posts/[id]"]);
    expect(existsSync(join(root, "out/app-tree.js"))).toBe(true);
    expect(existsSync(join(root, "out/aliases.json"))).toBe(true);
    expect(existsSync(join(root, "out/routes/_root.js"))).toBe(true);
    expect(existsSync(join(root, "out/routes/posts/[id].js"))).toBe(true);
  });

  it("per-route shims are byte-identical to renderRuntimeModule", () => {
    writePage(join(root, "src/app/posts/[id]"));

    generateRouteModules({ root, appDir: "src/app", outDir: "out" });

    const onDisk = readFileSync(join(root, "out/routes/posts/[id].js"), "utf8");
    expect(onDisk).toBe(renderRuntimeModule("posts/[id]"));
  });

  it("imports the schema with a path relative to the emitted route file", () => {
    mkdirSync(join(root, "src/app/posts"), { recursive: true });
    writeFileSync(
      join(root, "src/app/posts/page.tsx"),
      "export const searchSchema = schema;\nexport default function Page() {}",
    );

    generateRouteModules({ root, appDir: "src/app", outDir: "out" });

    const onDisk = readFileSync(join(root, "out/routes/posts.js"), "utf8");
    // routes/posts.js -> ../../src/app/posts/page.tsx (extension kept for bundlers)
    expect(onDisk).toContain(
      'import { searchSchema as schema } from "../../src/app/posts/page.tsx";',
    );
    expect(onDisk).toContain("useSearchParams as useSearchParamsBase");
    expect(onDisk).toContain("export { schema as searchSchema };");
  });

  it("app-tree.js module keys match the appDir prefix the Vite plugin emits", () => {
    writePage(join(root, "src/app"));
    writePage(join(root, "src/app/posts/[id]"));

    generateRouteModules({ root, appDir: "src/app", outDir: "out" });

    const source = readFileSync(join(root, "out/app-tree.js"), "utf8");
    expect(source).toContain('"/src/app/page.tsx"');
    expect(source).toContain('"/src/app/posts/[id]/page.tsx"');
    expect(source).toContain('export const appDir = "/src/app";');
  });

  it("aliases.json points exact-match app-tree and prefix routes at the resolved outDir", () => {
    writePage(join(root, "src/app"));
    const absoluteOut = join(root, "absolute-out");

    const result = generateRouteModules({
      root,
      appDir: "src/app",
      outDir: absoluteOut,
    });

    const aliases = JSON.parse(
      readFileSync(join(absoluteOut, "aliases.json"), "utf8"),
    ) as Record<string, string>;
    expect(aliases["virtual:react-router-next/app-tree$"]).toBe(
      join(absoluteOut, "app-tree.js"),
    );
    expect(aliases["virtual:react-router-next"]).toBe(
      join(absoluteOut, "routes"),
    );
    expect(result.outDir).toBe(absoluteOut);
  });

  it("is idempotent — a second call with no source change reports written: 0", () => {
    writePage(join(root, "src/app/posts/[id]"));

    const first = generateRouteModules({
      root,
      appDir: "src/app",
      outDir: "out",
    });
    expect(first.written).toBeGreaterThan(0);

    const second = generateRouteModules({
      root,
      appDir: "src/app",
      outDir: "out",
    });
    expect(second.written).toBe(0);
    expect(second.removed).toEqual([]);
  });

  it("prunes orphaned route shims when a route directory disappears", () => {
    writePage(join(root, "src/app/posts/[id]"));
    writePage(join(root, "src/app/about"));

    generateRouteModules({ root, appDir: "src/app", outDir: "out" });
    expect(existsSync(join(root, "out/routes/about.js"))).toBe(true);

    rmSync(join(root, "src/app/about"), { recursive: true, force: true });

    const result = generateRouteModules({
      root,
      appDir: "src/app",
      outDir: "out",
    });
    expect(existsSync(join(root, "out/routes/about.js"))).toBe(false);
    expect(result.removed).toContain(join(root, "out/routes/about.js"));
  });

  it("removes empty intermediate directories after pruning nested orphans", () => {
    writePage(join(root, "src/app/posts/[id]"));

    generateRouteModules({ root, appDir: "src/app", outDir: "out" });
    expect(existsSync(join(root, "out/routes/posts"))).toBe(true);

    rmSync(join(root, "src/app/posts"), { recursive: true, force: true });
    generateRouteModules({ root, appDir: "src/app", outDir: "out" });

    expect(existsSync(join(root, "out/routes/posts"))).toBe(false);
  });

  it("emits import specifiers as paths relative to app-tree.js", () => {
    writePage(join(root, "src/app"));

    generateRouteModules({
      root,
      appDir: "src/app",
      outDir: "node_modules/.react-router-next",
    });

    const source = readFileSync(
      join(root, "node_modules/.react-router-next/app-tree.js"),
      "utf8",
    );
    // outDir is two levels deep from root → app file is up two and then into src/app
    expect(source).toContain('from "../../src/app/page.tsx"');
  });
});
