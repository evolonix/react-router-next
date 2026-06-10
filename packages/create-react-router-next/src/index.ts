import {
  appendFileSync,
  cpSync,
  existsSync,
  readdirSync,
  realpathSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { basename, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as clack from "@clack/prompts";
import pc from "picocolors";

export type TemplateName = "vite" | "webpack" | "rspack";

export const TEMPLATES: { name: TemplateName; label: string }[] = [
  { name: "vite", label: "Vite (recommended) — zero-config plugin" },
  { name: "webpack", label: "Webpack — codegen CLI + alias" },
  { name: "rspack", label: "Rspack / Rsbuild — require.context" },
];

const TEMPLATE_NAMES = new Set(TEMPLATES.map((t) => t.name));

/** Optional, prompt-driven additions to the scaffold. */
export type Features = {
  eslint: boolean;
  prettier: boolean;
  tailwind: boolean;
  devtools: boolean;
};

export const FEATURE_KEYS = [
  "eslint",
  "prettier",
  "tailwind",
  "devtools",
] as const;

/** Values used for Enter-to-accept, `--yes`, and non-interactive runs. */
export const DEFAULT_FEATURES: Features = {
  eslint: true,
  prettier: true,
  tailwind: false,
  devtools: false,
};

const FEATURE_PROMPTS: Record<keyof Features, string> = {
  eslint: "Add ESLint (with the react-router-next route-convention rules)?",
  prettier: "Add Prettier?",
  tailwind: "Add Tailwind CSS v4?",
  devtools: "Add the react-router-next devtools overlay (dev only)?",
};

// Single source of truth for the versions written into the generated
// package.json. Bump these alongside the templates.
const V = {
  rrn: "^3.5.0",
  rrnDevtools: "^0.1.0",
  react: "^19.2.0",
  reactDom: "^19.2.0",
  reactRouter: "^7.17.0",
  typesReact: "^19.2.0",
  typesReactDom: "^19.2.0",
  typescript: "~6.0.2",
  // vite
  viteReact: "^6.0.0",
  vite: "^8.0.0",
  // webpack
  swcCore: "^1.15.0",
  typesWebpackEnv: "^1.18.5",
  cssLoader: "^7.1.2",
  htmlWebpackPlugin: "^5.6.0",
  styleLoader: "^4.0.0",
  swcLoader: "^0.2.6",
  webpack: "^5.103.0",
  webpackCli: "^7.0.0",
  webpackDevServer: "^5.2.0",
  // rspack
  rsbuildCore: "^2.0.0",
  rsbuildReact: "^2.0.0",
  // eslint
  tsParser: "^8.0.0",
  eslint: "^9.18.0",
  eslintPluginRrn: "^0.1.0",
  // prettier
  prettier: "^3.8.3",
  prettierPluginTailwind: "^0.8.0",
  // tailwind
  tailwindcss: "^4.3.0",
  tailwindVite: "^4.3.0",
  tailwindPostcss: "^4.3.0",
  postcss: "^8.5.6",
  postcssLoader: "^8.2.0",
} as const;

export type CliOptions = {
  /** Target directory (relative or absolute), or undefined to prompt. */
  dir?: string;
  /** Chosen template, or undefined to prompt. */
  template?: TemplateName;
  /** Explicit feature toggles from flags; undefined means "ask / default". */
  features: Partial<Features>;
  /** Accept all defaults without prompting. */
  yes?: boolean;
  help?: boolean;
};

/** Pure argv parser, exported for tests. */
export function parseArgs(argv: readonly string[]): CliOptions {
  const opts: CliOptions = { features: {} };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      opts.help = true;
    } else if (arg === "--yes" || arg === "-y") {
      opts.yes = true;
    } else if (arg === "--template" || arg === "-t") {
      opts.template = argv[++i] as TemplateName;
    } else if (arg.startsWith("--template=")) {
      opts.template = arg.slice("--template=".length) as TemplateName;
    } else if (
      arg.startsWith("--no-") &&
      isFeatureKey(arg.slice("--no-".length))
    ) {
      opts.features[arg.slice("--no-".length) as keyof Features] = false;
    } else if (arg.startsWith("--") && isFeatureKey(arg.slice(2))) {
      opts.features[arg.slice(2) as keyof Features] = true;
    } else if (!arg.startsWith("-") && opts.dir === undefined) {
      opts.dir = arg;
    }
  }
  return opts;
}

function isFeatureKey(s: string): s is keyof Features {
  return (FEATURE_KEYS as readonly string[]).includes(s);
}

const HELP = `
create-react-router-next — scaffold a React Router 7 app with Next.js-style routing

Usage:
  npm create react-router-next@latest [directory] -- [options]

Options:
  -t, --template <vite|webpack|rspack>   Bundler template (default: prompt / vite)
  --eslint / --no-eslint                 Toggle ESLint + route-convention rules (default: on)
  --prettier / --no-prettier             Toggle Prettier (default: on)
  --tailwind / --no-tailwind             Toggle Tailwind CSS v4 (default: off)
  --devtools / --no-devtools             Toggle the devtools overlay (default: off)
  -y, --yes                              Accept defaults without prompting
  -h, --help                             Show this help

Examples:
  npm create react-router-next@latest my-app
  npm create react-router-next@latest my-app -- --template webpack --tailwind
  npm create react-router-next@latest my-app -- --yes --no-eslint
`;

/** A directory is usable if it doesn't exist or is empty. */
export function isDirEmpty(dir: string): boolean {
  if (!existsSync(dir)) return true;
  return readdirSync(dir).length === 0;
}

/** Lowercase, npm-safe-ish package name derived from a directory path. */
export function toPackageName(dir: string): string {
  return (
    basename(resolve(dir))
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^[._]+/, "")
      .replace(/^-+|-+$/g, "") || "react-router-next-app"
  );
}

function templatesRoot(): string {
  // dist/index.js → ../templates
  return fileURLToPath(new URL("../templates", import.meta.url));
}

/** Resolve flags/defaults into a concrete feature set (no prompting). */
export function resolveFeatures(opts: CliOptions): Features {
  return {
    eslint: opts.features.eslint ?? DEFAULT_FEATURES.eslint,
    prettier: opts.features.prettier ?? DEFAULT_FEATURES.prettier,
    tailwind: opts.features.tailwind ?? DEFAULT_FEATURES.tailwind,
    devtools: opts.features.devtools ?? DEFAULT_FEATURES.devtools,
  };
}

function sortKeys(obj: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)),
  );
}

/** Build the generated package.json for a bundler + feature selection. */
export function buildPackageJson(
  template: TemplateName,
  features: Features,
  name: string,
): Record<string, unknown> {
  const deps: Record<string, string> = {
    "@evolonix/react-router-next": V.rrn,
    react: V.react,
    "react-dom": V.reactDom,
    "react-router": V.reactRouter,
  };
  const devDeps: Record<string, string> = {
    "@types/react": V.typesReact,
    "@types/react-dom": V.typesReactDom,
    typescript: V.typescript,
  };
  const scripts: Record<string, string> = {};

  if (template === "vite") {
    scripts.dev = "vite";
    scripts.build = "tsc --noEmit && vite build";
    scripts.preview = "vite preview";
    scripts.typecheck = "react-router-next typegen && tsc --noEmit";
    scripts.typegen = "react-router-next typegen";
    Object.assign(devDeps, {
      "@vitejs/plugin-react": V.viteReact,
      vite: V.vite,
    });
  } else if (template === "webpack") {
    scripts.dev = "webpack serve --mode development";
    scripts.build = "tsc --noEmit && webpack --mode production";
    scripts.typecheck = "tsc --noEmit";
    Object.assign(devDeps, {
      "@swc/core": V.swcCore,
      "@types/webpack-env": V.typesWebpackEnv,
      "css-loader": V.cssLoader,
      "html-webpack-plugin": V.htmlWebpackPlugin,
      "style-loader": V.styleLoader,
      "swc-loader": V.swcLoader,
      webpack: V.webpack,
      "webpack-cli": V.webpackCli,
      "webpack-dev-server": V.webpackDevServer,
    });
  } else {
    scripts.dev = "rsbuild dev";
    scripts.build = "tsc --noEmit && rsbuild build";
    scripts.preview = "rsbuild preview";
    scripts.typecheck = "tsc --noEmit";
    Object.assign(devDeps, {
      "@rsbuild/core": V.rsbuildCore,
      "@rsbuild/plugin-react": V.rsbuildReact,
      "@types/webpack-env": V.typesWebpackEnv,
    });
  }

  if (features.eslint) {
    scripts.lint = "eslint src";
    Object.assign(devDeps, {
      "@typescript-eslint/parser": V.tsParser,
      eslint: V.eslint,
      "eslint-plugin-react-router-next": V.eslintPluginRrn,
    });
  }

  if (features.prettier) {
    scripts.format = "prettier --write .";
    scripts["format:check"] = "prettier --check .";
    devDeps.prettier = V.prettier;
    if (features.tailwind) {
      devDeps["prettier-plugin-tailwindcss"] = V.prettierPluginTailwind;
    }
  }

  if (features.tailwind) {
    devDeps.tailwindcss = V.tailwindcss;
    if (template === "vite") {
      devDeps["@tailwindcss/vite"] = V.tailwindVite;
    } else {
      devDeps["@tailwindcss/postcss"] = V.tailwindPostcss;
      devDeps.postcss = V.postcss;
      if (template === "webpack") devDeps["postcss-loader"] = V.postcssLoader;
    }
  }

  if (features.devtools) {
    devDeps["@evolonix/react-router-next-devtools"] = V.rrnDevtools;
  }

  const pkg: Record<string, unknown> = {
    name,
    private: true,
    version: "0.0.0",
  };
  // Webpack's config is CommonJS (.cjs handles that); the rest are ESM.
  if (template !== "webpack") pkg.type = "module";
  pkg.scripts = scripts;
  pkg.dependencies = sortKeys(deps);
  pkg.devDependencies = sortKeys(devDeps);
  return pkg;
}

/** Generate `src/app/layout.tsx` for the chosen styling + devtools + bundler. */
export function layoutTsx(features: Features, template: TemplateName): string {
  const imports: string[] = [];
  if (features.devtools) {
    imports.push(
      template === "vite"
        ? `import { RouteTreeDevtools } from "@evolonix/react-router-next-devtools/vite-client";`
        : `import { RouteTreeDevtools } from "@evolonix/react-router-next-devtools";`,
    );
  }
  imports.push(`import { NavLink, Outlet } from "react-router";`);

  const devtools = features.devtools ? `\n      <RouteTreeDevtools />` : "";

  if (features.tailwind) {
    return `${imports.join("\n")}

// \`layout.tsx\` wraps every route beneath it and renders its matched child
// through \`<Outlet />\` — the same convention as Next.js's App Router.
const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "font-semibold" : "opacity-70 hover:opacity-100";

export default function RootLayout() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <nav className="mb-6 flex gap-4 border-b border-black/10 pb-4 dark:border-white/15">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/about" className={linkClass}>
          About
        </NavLink>
        <NavLink to="/blog/hello-world" className={linkClass}>
          Blog post
        </NavLink>
      </nav>
      <Outlet />${devtools}
    </div>
  );
}
`;
  }

  return `${imports.join("\n")}

// \`layout.tsx\` wraps every route beneath it and renders its matched child
// through \`<Outlet />\` — the same convention as Next.js's App Router.
export default function RootLayout() {
  return (
    <>
      <nav>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/blog/hello-world">Blog post</NavLink>
      </nav>
      <Outlet />${devtools}
    </>
  );
}
`;
}

const ESLINT_CONFIG = `import parser from "@typescript-eslint/parser";
import reactRouterNext from "eslint-plugin-react-router-next";

export default [
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser,
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: "module" },
    },
  },
  // Lints the filesystem-routing conventions under src/app.
  reactRouterNext.configs.recommended,
];
`;

const PRETTIER_IGNORE = `node_modules
dist

# Generated by @evolonix/react-router-next codegen
.react-router-next

package-lock.json
`;

/** Feature-specific README sections appended to the base template. */
function readmeExtras(features: Features): string {
  let out = "";
  if (features.eslint) {
    out +=
      "\n## Lint\n\n" +
      "Route conventions are linted by\n" +
      "[`eslint-plugin-react-router-next`](https://github.com/evolonix/react-router-next/tree/main/packages/eslint-plugin-react-router-next)\n" +
      "(see `eslint.config.mjs`):\n\n" +
      "```bash\nnpm run lint\n```\n";
  }
  if (features.prettier) {
    out += "\n## Format\n\n```bash\nnpm run format\n```\n";
  }
  return out;
}

function prettierRc(features: Features): string {
  // Written to match Prettier's own formatting so `npm run format:check` passes
  // on a fresh scaffold (Prettier keeps a short array inline).
  return features.tailwind
    ? `{\n  "plugins": ["prettier-plugin-tailwindcss"]\n}\n`
    : `{}\n`;
}

/**
 * Materialize a project into `targetDir` from the `base` template plus the
 * bundler overlay and the selected feature overlays. Renames `_gitignore` →
 * `.gitignore` and generates `package.json`, `layout.tsx`, and the config files
 * that depend on the feature selection. Exported so tests can drive it without
 * a TTY.
 */
export function scaffold(opts: {
  targetDir: string;
  template: TemplateName;
  packageName: string;
  features: Features;
}): void {
  const { targetDir, template, packageName, features } = opts;
  const root = templatesRoot();

  cpSync(join(root, "base"), targetDir, { recursive: true });
  cpSync(join(root, template), targetDir, { recursive: true });

  // Tailwind overlays the plain styles + example components, and swaps in the
  // bundler config (Vite plugin / PostCSS) that wires Tailwind v4.
  if (features.tailwind) {
    cpSync(join(root, "tailwind", "src"), join(targetDir, "src"), {
      recursive: true,
    });
    cpSync(join(root, "tailwind", template), targetDir, { recursive: true });
  }

  // `layout.tsx` is generated because it's the one file that crosses styling,
  // devtools, and bundler choice.
  writeFileSync(
    join(targetDir, "src/app/layout.tsx"),
    layoutTsx(features, template),
  );

  if (features.eslint) {
    writeFileSync(join(targetDir, "eslint.config.mjs"), ESLINT_CONFIG);
  }
  if (features.prettier) {
    writeFileSync(join(targetDir, ".prettierrc.json"), prettierRc(features));
    writeFileSync(join(targetDir, ".prettierignore"), PRETTIER_IGNORE);
  }

  const extras = readmeExtras(features);
  if (extras) appendFileSync(join(targetDir, "README.md"), extras);

  // npm strips a literal `.gitignore` from published tarballs, so templates
  // ship it as `_gitignore` and we restore the real name on scaffold.
  const gi = join(targetDir, "_gitignore");
  if (existsSync(gi)) renameSync(gi, join(targetDir, ".gitignore"));

  writeFileSync(
    join(targetDir, "package.json"),
    JSON.stringify(buildPackageJson(template, features, packageName), null, 2) +
      "\n",
  );
}

/** How to refer to the project dir in "Next steps" (`./my-app`, or absolute). */
function displayPath(dir: string): string {
  if (isAbsolute(dir) || dir.startsWith(".")) return dir;
  return `./${dir}`;
}

/** Summary line listing which optional features were enabled. */
function featureSummary(features: Features): string {
  const on = FEATURE_KEYS.filter((k) => features[k]);
  return on.length ? on.join(", ") : "none";
}

export async function run(argv: readonly string[]): Promise<number> {
  const opts = parseArgs(argv);
  if (opts.help) {
    process.stdout.write(HELP);
    return 0;
  }

  const interactive = process.stdin.isTTY === true && !opts.yes;

  // Validate template eagerly (applies to both paths).
  if (opts.template && !TEMPLATE_NAMES.has(opts.template)) {
    process.stderr.write(
      `error: unknown template "${opts.template}". Expected one of: ${[...TEMPLATE_NAMES].join(", ")}.\n`,
    );
    return 1;
  }

  if (!interactive) {
    let dir = opts.dir;
    if (!dir) {
      process.stderr.write(
        "error: a target directory is required (non-interactive).\n" + HELP,
      );
      return 1;
    }
    const targetDir = resolve(process.cwd(), dir);
    if (!isDirEmpty(targetDir)) {
      process.stderr.write(`error: ${targetDir} exists and is not empty.\n`);
      return 1;
    }
    const template = opts.template ?? "vite";
    const features = resolveFeatures(opts);
    const packageName = toPackageName(targetDir);
    scaffold({ targetDir, template, packageName, features });
    writeNextSteps(dir, packageName, template, features);
    return 0;
  }

  return runInteractive(opts);
}

async function runInteractive(opts: CliOptions): Promise<number> {
  clack.intro(pc.bgMagenta(pc.black(" create-react-router-next ")));

  const dir =
    opts.dir ??
    (await prompt(
      clack.text({
        message: "Where should we create your project?",
        placeholder: "my-app",
        defaultValue: "my-app",
      }),
    ));
  if (dir === SYM_CANCEL) return cancel();

  const targetDir = resolve(process.cwd(), dir);
  if (!isDirEmpty(targetDir)) {
    clack.cancel(`${targetDir} exists and is not empty.`);
    return 1;
  }

  const template =
    opts.template ??
    (await prompt(
      clack.select({
        message: "Which bundler?",
        options: TEMPLATES.map((t) => ({ value: t.name, label: t.label })),
        initialValue: "vite" as TemplateName,
      }),
    ));
  if (template === SYM_CANCEL) return cancel();

  const features = {} as Features;
  for (const key of FEATURE_KEYS) {
    const answer =
      opts.features[key] ??
      (await prompt(
        clack.confirm({
          message: FEATURE_PROMPTS[key],
          initialValue: DEFAULT_FEATURES[key],
        }),
      ));
    if (answer === SYM_CANCEL) return cancel();
    features[key] = answer as boolean;
  }

  const packageName = toPackageName(targetDir);
  const s = clack.spinner();
  s.start("Scaffolding project");
  scaffold({ targetDir, template, packageName, features });
  s.stop(`Created ${pc.cyan(packageName)} (${template})`);

  const rel = displayPath(dir);
  clack.note(
    `${pc.dim("cd")} ${rel}\n${pc.dim("npm install")}\n${pc.dim("npm run dev")}`,
    "Next steps",
  );
  clack.outro(
    `${pc.green("✔")} Features: ${pc.cyan(featureSummary(features))}`,
  );
  return 0;
}

// `clack.*` prompts resolve to a symbol when cancelled. We funnel everything
// through `prompt()` so a single `SYM_CANCEL` check covers cancellation.
const SYM_CANCEL = Symbol("cancel");
async function prompt<T>(
  p: Promise<T | symbol>,
): Promise<T | typeof SYM_CANCEL> {
  const value = await p;
  return clack.isCancel(value) ? SYM_CANCEL : (value as T);
}
function cancel(): number {
  clack.cancel("Cancelled.");
  return 1;
}

function writeNextSteps(
  dir: string,
  packageName: string,
  template: TemplateName,
  features: Features,
): void {
  const rel = displayPath(dir);
  process.stdout.write(
    `\n${pc.green("✔")} Created ${pc.cyan(packageName)} (${template}) — features: ${featureSummary(features)}\n\n` +
      `Next steps:\n` +
      `  ${pc.dim("cd")} ${rel}\n` +
      `  ${pc.dim("npm install")}\n` +
      `  ${pc.dim("npm run dev")}\n\n`,
  );
}

// Invoked as a bin. Compare realpaths so a symlinked bin — how npx/npm
// expose it (node_modules/.bin) — still matches the loaded module. argv[1]
// is the symlink; import.meta.url is already resolved to the real file.
const invokedDirectly = (() => {
  if (process.argv[1] == null) return false;
  try {
    return (
      realpathSync(process.argv[1]) ===
      realpathSync(fileURLToPath(import.meta.url))
    );
  } catch {
    return false;
  }
})();

if (invokedDirectly) {
  run(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (err: unknown) => {
      process.stderr.write(`${err instanceof Error ? err.message : err}\n`);
      process.exit(1);
    },
  );
}
