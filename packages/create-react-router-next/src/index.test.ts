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
import {
  buildPackageJson,
  type Features,
  isDirEmpty,
  layoutTsx,
  parseArgs,
  resolveFeatures,
  scaffold,
  toPackageName,
} from "./index";

const ALL_OFF: Features = {
  eslint: false,
  prettier: false,
  tailwind: false,
  devtools: false,
};
const ALL_ON: Features = {
  eslint: true,
  prettier: true,
  tailwind: true,
  devtools: true,
};

describe("parseArgs", () => {
  it("reads a positional directory", () => {
    expect(parseArgs(["my-app"]).dir).toBe("my-app");
  });

  it("reads --template and -t", () => {
    expect(parseArgs(["app", "--template", "webpack"]).template).toBe(
      "webpack",
    );
    expect(parseArgs(["-t", "rspack", "app"]).template).toBe("rspack");
    expect(parseArgs(["app", "--template=vite"]).template).toBe("vite");
  });

  it("reads feature flags and their negations", () => {
    expect(parseArgs(["app", "--tailwind"]).features.tailwind).toBe(true);
    expect(parseArgs(["app", "--no-eslint"]).features.eslint).toBe(false);
    expect(parseArgs(["app", "--devtools", "--no-prettier"]).features).toEqual({
      devtools: true,
      prettier: false,
    });
  });

  it("leaves unspecified features undefined (ask / default)", () => {
    expect(parseArgs(["app"]).features).toEqual({});
  });

  it("reads --yes and --help", () => {
    expect(parseArgs(["app", "--yes"]).yes).toBe(true);
    expect(parseArgs(["-y", "app"]).yes).toBe(true);
    expect(parseArgs(["--help"]).help).toBe(true);
    expect(parseArgs(["-h"]).help).toBe(true);
  });

  it("only takes the first positional as the directory", () => {
    expect(parseArgs(["a", "b"]).dir).toBe("a");
  });
});

describe("resolveFeatures", () => {
  it("applies defaults: eslint + prettier on, tailwind + devtools off", () => {
    expect(resolveFeatures(parseArgs(["app"]))).toEqual({
      eslint: true,
      prettier: true,
      tailwind: false,
      devtools: false,
    });
  });

  it("lets flags override the defaults", () => {
    expect(
      resolveFeatures(parseArgs(["app", "--no-eslint", "--tailwind"])),
    ).toEqual({
      eslint: false,
      prettier: true,
      tailwind: true,
      devtools: false,
    });
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

describe("buildPackageJson", () => {
  it("includes only core deps with all features off", () => {
    const pkg = buildPackageJson("vite", ALL_OFF, "x");
    const dev = pkg.devDependencies as Record<string, string>;
    expect(pkg.dependencies).toHaveProperty("@evolonix/react-router-next");
    expect(dev).not.toHaveProperty("eslint");
    expect(dev).not.toHaveProperty("prettier");
    expect(dev).not.toHaveProperty("tailwindcss");
    expect(dev).not.toHaveProperty("@evolonix/react-router-next-devtools");
    expect(pkg.scripts).not.toHaveProperty("lint");
    expect(pkg.scripts).not.toHaveProperty("format");
  });

  it("adds eslint deps + lint script when enabled", () => {
    const pkg = buildPackageJson("vite", { ...ALL_OFF, eslint: true }, "x");
    const dev = pkg.devDependencies as Record<string, string>;
    expect(dev).toHaveProperty("eslint");
    expect(dev).toHaveProperty("eslint-plugin-react-router-next");
    expect((pkg.scripts as Record<string, string>).lint).toBe("eslint src");
  });

  it("adds prettier deps + format scripts when enabled", () => {
    const pkg = buildPackageJson("vite", { ...ALL_OFF, prettier: true }, "x");
    const dev = pkg.devDependencies as Record<string, string>;
    expect(dev).toHaveProperty("prettier");
    expect(dev).not.toHaveProperty("prettier-plugin-tailwindcss");
    expect((pkg.scripts as Record<string, string>).format).toBe(
      "prettier --write .",
    );
  });

  it("adds the prettier tailwind plugin only when both are enabled", () => {
    const pkg = buildPackageJson(
      "vite",
      { ...ALL_OFF, prettier: true, tailwind: true },
      "x",
    );
    expect(pkg.devDependencies).toHaveProperty("prettier-plugin-tailwindcss");
  });

  it("wires Tailwind per bundler", () => {
    expect(
      buildPackageJson("vite", { ...ALL_OFF, tailwind: true }, "x")
        .devDependencies,
    ).toHaveProperty("@tailwindcss/vite");
    const wp = buildPackageJson("webpack", { ...ALL_OFF, tailwind: true }, "x")
      .devDependencies as Record<string, string>;
    expect(wp).toHaveProperty("@tailwindcss/postcss");
    expect(wp).toHaveProperty("postcss-loader");
    const rs = buildPackageJson("rspack", { ...ALL_OFF, tailwind: true }, "x")
      .devDependencies as Record<string, string>;
    expect(rs).toHaveProperty("@tailwindcss/postcss");
    expect(rs).not.toHaveProperty("postcss-loader");
  });

  it("adds the devtools package when enabled", () => {
    expect(
      buildPackageJson("vite", { ...ALL_OFF, devtools: true }, "x")
        .devDependencies,
    ).toHaveProperty("@evolonix/react-router-next-devtools");
  });

  it("omits type:module for webpack only", () => {
    expect(buildPackageJson("webpack", ALL_OFF, "x").type).toBeUndefined();
    expect(buildPackageJson("vite", ALL_OFF, "x").type).toBe("module");
    expect(buildPackageJson("rspack", ALL_OFF, "x").type).toBe("module");
  });
});

describe("layoutTsx", () => {
  it("renders a plain layout without devtools", () => {
    const out = layoutTsx(ALL_OFF, "vite");
    expect(out).toContain('import { NavLink, Outlet } from "react-router"');
    expect(out).not.toContain("RouteTreeDevtools");
    expect(out).not.toContain("className");
  });

  it("adds Tailwind classes when tailwind is on", () => {
    expect(layoutTsx({ ...ALL_OFF, tailwind: true }, "vite")).toContain(
      "className",
    );
  });

  it("imports devtools from the vite-client entry for Vite", () => {
    expect(layoutTsx({ ...ALL_OFF, devtools: true }, "vite")).toContain(
      "@evolonix/react-router-next-devtools/vite-client",
    );
  });

  it("imports devtools from the base entry for other bundlers", () => {
    const out = layoutTsx({ ...ALL_OFF, devtools: true }, "webpack");
    expect(out).toContain('from "@evolonix/react-router-next-devtools"');
    expect(out).not.toContain("vite-client");
    expect(out).toContain("<RouteTreeDevtools />");
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

  function read(target: string, file: string): string {
    return readFileSync(join(target, file), "utf8");
  }

  it("materializes the base + vite overlay and writes the package name", () => {
    const target = join(dir, "app");
    scaffold({
      targetDir: target,
      template: "vite",
      packageName: "demo-x",
      features: ALL_OFF,
    });

    // base
    expect(existsSync(join(target, "src/app/page.tsx"))).toBe(true);
    expect(existsSync(join(target, "src/app/layout.tsx"))).toBe(true);
    expect(existsSync(join(target, "src/app/blog/[slug]/page.tsx"))).toBe(true);
    expect(existsSync(join(target, "src/styles.css"))).toBe(true);
    // overlay
    expect(existsSync(join(target, "vite.config.ts"))).toBe(true);
    expect(existsSync(join(target, "src/main.tsx"))).toBe(true);

    // _gitignore restored to .gitignore
    expect(existsSync(join(target, ".gitignore"))).toBe(true);
    expect(existsSync(join(target, "_gitignore"))).toBe(false);

    // package.json name written
    const pkg = JSON.parse(read(target, "package.json")) as { name: string };
    expect(pkg.name).toBe("demo-x");
  });

  it("uses the webpack overlay config when chosen", () => {
    const target = join(dir, "wp");
    scaffold({
      targetDir: target,
      template: "webpack",
      packageName: "wp",
      features: ALL_OFF,
    });
    expect(existsSync(join(target, "webpack.config.cjs"))).toBe(true);
    expect(existsSync(join(target, "vite.config.ts"))).toBe(false);
  });

  it("uses the rspack overlay config when chosen", () => {
    const target = join(dir, "rs");
    scaffold({
      targetDir: target,
      template: "rspack",
      packageName: "rs",
      features: ALL_OFF,
    });
    expect(existsSync(join(target, "rsbuild.config.ts"))).toBe(true);
  });

  it("ships a css module declaration for webpack/rspack (tsc side-effect import)", () => {
    for (const template of ["webpack", "rspack"] as const) {
      const target = join(dir, `env-${template}`);
      scaffold({
        targetDir: target,
        template,
        packageName: template,
        features: ALL_OFF,
      });
      expect(read(target, "src/env.d.ts")).toContain('declare module "*.css"');
    }
  });

  it("appends README sections for the selected tooling only", () => {
    const none = join(dir, "readme-none");
    scaffold({
      targetDir: none,
      template: "vite",
      packageName: "a",
      features: ALL_OFF,
    });
    expect(read(none, "README.md")).not.toContain("## Lint");
    expect(read(none, "README.md")).not.toContain("## Format");

    const both = join(dir, "readme-both");
    scaffold({
      targetDir: both,
      template: "vite",
      packageName: "b",
      features: { ...ALL_OFF, eslint: true, prettier: true },
    });
    expect(read(both, "README.md")).toContain("## Lint");
    expect(read(both, "README.md")).toContain("## Format");
  });

  it("includes ESLint config only when enabled", () => {
    const off = join(dir, "no-eslint");
    scaffold({
      targetDir: off,
      template: "vite",
      packageName: "a",
      features: ALL_OFF,
    });
    expect(existsSync(join(off, "eslint.config.mjs"))).toBe(false);

    const on = join(dir, "eslint");
    scaffold({
      targetDir: on,
      template: "vite",
      packageName: "b",
      features: { ...ALL_OFF, eslint: true },
    });
    expect(existsSync(join(on, "eslint.config.mjs"))).toBe(true);
  });

  it("includes Prettier config only when enabled", () => {
    const target = join(dir, "prettier");
    scaffold({
      targetDir: target,
      template: "vite",
      packageName: "p",
      features: { ...ALL_OFF, prettier: true },
    });
    expect(existsSync(join(target, ".prettierrc.json"))).toBe(true);
    expect(existsSync(join(target, ".prettierignore"))).toBe(true);
    expect(read(target, ".prettierrc.json")).not.toContain("tailwind");
  });

  it("wires the prettier tailwind plugin when both are enabled", () => {
    const target = join(dir, "both");
    scaffold({
      targetDir: target,
      template: "vite",
      packageName: "pt",
      features: { ...ALL_OFF, prettier: true, tailwind: true },
    });
    expect(read(target, ".prettierrc.json")).toContain(
      "prettier-plugin-tailwindcss",
    );
  });

  it("applies the Tailwind overlay to styles, components, and config (vite)", () => {
    const target = join(dir, "tw");
    scaffold({
      targetDir: target,
      template: "vite",
      packageName: "tw",
      features: { ...ALL_OFF, tailwind: true },
    });
    expect(read(target, "src/styles.css")).toContain('@import "tailwindcss"');
    expect(read(target, "src/app/page.tsx")).toContain("className");
    expect(read(target, "vite.config.ts")).toContain("@tailwindcss/vite");
    expect(read(target, "src/app/layout.tsx")).toContain("className");
  });

  it("adds a PostCSS config for tailwind on webpack/rspack", () => {
    const wp = join(dir, "tw-wp");
    scaffold({
      targetDir: wp,
      template: "webpack",
      packageName: "tw-wp",
      features: { ...ALL_OFF, tailwind: true },
    });
    expect(existsSync(join(wp, "postcss.config.cjs"))).toBe(true);
    expect(read(wp, "webpack.config.cjs")).toContain("postcss-loader");

    const rs = join(dir, "tw-rs");
    scaffold({
      targetDir: rs,
      template: "rspack",
      packageName: "tw-rs",
      features: { ...ALL_OFF, tailwind: true },
    });
    expect(existsSync(join(rs, "postcss.config.cjs"))).toBe(true);
  });

  it("keeps plain CSS when tailwind is off", () => {
    const target = join(dir, "plain");
    scaffold({
      targetDir: target,
      template: "vite",
      packageName: "plain",
      features: ALL_OFF,
    });
    expect(read(target, "src/styles.css")).not.toContain("tailwindcss");
    expect(read(target, "vite.config.ts")).not.toContain("tailwindcss");
  });

  it("wires devtools into the layout when enabled", () => {
    const target = join(dir, "dt");
    scaffold({
      targetDir: target,
      template: "vite",
      packageName: "dt",
      features: { ...ALL_OFF, devtools: true },
    });
    const layout = read(target, "src/app/layout.tsx");
    expect(layout).toContain("RouteTreeDevtools");
    expect(layout).toContain("vite-client");
    const pkg = JSON.parse(read(target, "package.json")) as {
      devDependencies: Record<string, string>;
    };
    expect(pkg.devDependencies).toHaveProperty(
      "@evolonix/react-router-next-devtools",
    );
  });

  it("produces valid JSON package files for every bundler with all features", () => {
    for (const template of ["vite", "webpack", "rspack"] as const) {
      const target = join(dir, `all-${template}`);
      scaffold({
        targetDir: target,
        template,
        packageName: `all-${template}`,
        features: ALL_ON,
      });
      expect(() => JSON.parse(read(target, "package.json"))).not.toThrow();
    }
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
    execFileSync("node", ["../../node_modules/tsup/dist/cli-default.js"], {
      cwd: pkgRoot,
      stdio: "ignore",
    });
  });

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "rrn-bin-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("scaffolds non-interactively through a symlinked bin", () => {
    const link = join(dir, "create-react-router-next");
    symlinkSync(bin, link);

    const out = execFileSync(
      "node",
      [link, "app", "--template", "vite", "--tailwind", "--no-eslint"],
      { cwd: dir, encoding: "utf8" },
    );

    expect(out).toContain("Created app");
    expect(existsSync(join(dir, "app", "vite.config.ts"))).toBe(true);
    expect(existsSync(join(dir, "app", "src", "app", "page.tsx"))).toBe(true);
    // flags applied: tailwind on, eslint off
    expect(existsSync(join(dir, "app", "eslint.config.mjs"))).toBe(false);
    expect(
      readFileSync(join(dir, "app", "src", "styles.css"), "utf8"),
    ).toContain("tailwindcss");
  });
});
