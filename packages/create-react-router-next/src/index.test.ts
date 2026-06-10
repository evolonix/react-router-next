import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { isDirEmpty, parseArgs, scaffold, toPackageName } from "./index";

describe("parseArgs", () => {
  it("reads a positional directory", () => {
    expect(parseArgs(["my-app"])).toEqual({ dir: "my-app" });
  });

  it("reads --template and -t", () => {
    expect(parseArgs(["app", "--template", "webpack"]).template).toBe(
      "webpack",
    );
    expect(parseArgs(["-t", "rspack", "app"]).template).toBe("rspack");
    expect(parseArgs(["app", "--template=vite"]).template).toBe("vite");
  });

  it("reads --help", () => {
    expect(parseArgs(["--help"]).help).toBe(true);
    expect(parseArgs(["-h"]).help).toBe(true);
  });

  it("only takes the first positional as the directory", () => {
    expect(parseArgs(["a", "b"]).dir).toBe("a");
  });
});

describe("toPackageName", () => {
  it("lowercases and slugifies the basename", () => {
    expect(toPackageName("/tmp/My App")).toBe("my-app");
    expect(toPackageName("/tmp/Cool_Thing")).toBe("cool_thing");
  });

  it("falls back when the basename is empty after stripping", () => {
    expect(toPackageName("/tmp/...")).toBe("react-router-next-app");
  });
});

describe("isDirEmpty", () => {
  it("is true for a missing path", () => {
    expect(isDirEmpty(join(tmpdir(), "rrn-does-not-exist-xyz"))).toBe(true);
  });
});

describe("scaffold", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "rrn-create-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("materializes the base + vite overlay and rewrites the package name", () => {
    const target = join(dir, "app");
    scaffold({ targetDir: target, template: "vite", packageName: "demo-x" });

    // base
    expect(existsSync(join(target, "src/app/page.tsx"))).toBe(true);
    expect(existsSync(join(target, "src/app/layout.tsx"))).toBe(true);
    expect(existsSync(join(target, "src/app/blog/[slug]/page.tsx"))).toBe(true);
    expect(existsSync(join(target, "src/styles.css"))).toBe(true);
    // overlay
    expect(existsSync(join(target, "vite.config.ts"))).toBe(true);
    expect(existsSync(join(target, "src/main.tsx"))).toBe(true);
    // shared eslint config (from base)
    expect(existsSync(join(target, "eslint.config.mjs"))).toBe(true);

    // _gitignore restored to .gitignore
    expect(existsSync(join(target, ".gitignore"))).toBe(true);
    expect(existsSync(join(target, "_gitignore"))).toBe(false);

    // package.json name rewritten
    const pkg = JSON.parse(
      readFileSync(join(target, "package.json"), "utf8"),
    ) as { name: string };
    expect(pkg.name).toBe("demo-x");
  });

  it("uses the webpack overlay config when chosen", () => {
    const target = join(dir, "wp");
    scaffold({ targetDir: target, template: "webpack", packageName: "wp" });
    expect(existsSync(join(target, "webpack.config.cjs"))).toBe(true);
    expect(existsSync(join(target, "vite.config.ts"))).toBe(false);
  });

  it("uses the rspack overlay config when chosen", () => {
    const target = join(dir, "rs");
    scaffold({ targetDir: target, template: "rspack", packageName: "rs" });
    expect(existsSync(join(target, "rsbuild.config.ts"))).toBe(true);
  });
});

// Regression guard: npm create / npx expose the bin as a symlink in
// node_modules/.bin, so the entry must detect "invoked directly" by realpath,
// not by comparing argv[1] (the symlink) to import.meta.url (the real file).
// A naive comparison passes when run as `node dist/index.js` but silently
// no-ops through the symlink — the bug that made 0.1.0 do nothing.
describe("bin entry (symlinked invocation)", () => {
  const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
  const bin = join(pkgRoot, "dist", "index.js");
  let dir: string;

  beforeAll(() => {
    // Build the bin from current source so the test reflects this commit.
    execFileSync("npm", ["run", "build"], { cwd: pkgRoot, stdio: "ignore" });
  });

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "rrn-bin-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("scaffolds when invoked through a symlinked bin", () => {
    const link = join(dir, "create-react-router-next");
    symlinkSync(bin, link);

    const out = execFileSync("node", [link, "app", "--template", "vite"], {
      cwd: dir,
      encoding: "utf8",
    });

    expect(out).toContain("Created app");
    expect(existsSync(join(dir, "app", "vite.config.ts"))).toBe(true);
    expect(existsSync(join(dir, "app", "src", "app", "page.tsx"))).toBe(true);
  });
});
