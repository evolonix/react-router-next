import {
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { basename, join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

export type TemplateName = "vite" | "webpack" | "rspack";

export const TEMPLATES: { name: TemplateName; label: string }[] = [
  { name: "vite", label: "Vite (recommended) — zero-config plugin" },
  { name: "webpack", label: "Webpack — codegen CLI + alias" },
  { name: "rspack", label: "Rspack / Rsbuild — require.context" },
];

const TEMPLATE_NAMES = new Set(TEMPLATES.map((t) => t.name));

export type CliOptions = {
  /** Target directory (relative or absolute), or undefined to prompt. */
  dir?: string;
  /** Chosen template, or undefined to prompt. */
  template?: TemplateName;
  help?: boolean;
};

/** Pure argv parser, exported for tests. */
export function parseArgs(argv: readonly string[]): CliOptions {
  const opts: CliOptions = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      opts.help = true;
    } else if (arg === "--template" || arg === "-t") {
      opts.template = argv[++i] as TemplateName;
    } else if (arg.startsWith("--template=")) {
      opts.template = arg.slice("--template=".length) as TemplateName;
    } else if (!arg.startsWith("-") && opts.dir === undefined) {
      opts.dir = arg;
    }
  }
  return opts;
}

const HELP = `
create-react-router-next — scaffold a React Router 7 app with Next.js-style routing

Usage:
  npm create react-router-next@latest [directory] -- [options]

Options:
  -t, --template <vite|webpack|rspack>   Bundler template (default: prompt / vite)
  -h, --help                             Show this help

Examples:
  npm create react-router-next@latest my-app
  npm create react-router-next@latest my-app -- --template webpack
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

/**
 * Materialize a project into `targetDir` from the `base` template plus the
 * bundler `template` overlay. Renames `_gitignore` → `.gitignore` and rewrites
 * the generated `package.json` name. Exported so tests can drive it without a
 * TTY.
 */
export function scaffold(opts: {
  targetDir: string;
  template: TemplateName;
  packageName: string;
}): void {
  const root = templatesRoot();
  const base = join(root, "base");
  const overlay = join(root, opts.template);

  cpSync(base, opts.targetDir, { recursive: true });
  cpSync(overlay, opts.targetDir, { recursive: true });

  // npm strips a literal `.gitignore` from published tarballs, so templates
  // ship it as `_gitignore` and we restore the real name on scaffold.
  const gi = join(opts.targetDir, "_gitignore");
  if (existsSync(gi)) renameSync(gi, join(opts.targetDir, ".gitignore"));

  const pkgPath = join(opts.targetDir, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as {
    name: string;
    [k: string]: unknown;
  };
  pkg.name = opts.packageName;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

async function promptDir(): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = (await rl.question("Project directory: (my-app) ")).trim();
    return answer || "my-app";
  } finally {
    rl.close();
  }
}

async function promptTemplate(): Promise<TemplateName> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    process.stdout.write("\nSelect a bundler:\n");
    TEMPLATES.forEach((t, i) => {
      process.stdout.write(`  ${i + 1}) ${t.label}\n`);
    });
    const answer = (await rl.question("Choice: (1) ")).trim();
    const idx = answer === "" ? 0 : Number.parseInt(answer, 10) - 1;
    return TEMPLATES[idx]?.name ?? "vite";
  } finally {
    rl.close();
  }
}

export async function run(argv: readonly string[]): Promise<number> {
  const opts = parseArgs(argv);
  if (opts.help) {
    process.stdout.write(HELP);
    return 0;
  }

  const interactive = process.stdin.isTTY === true;

  let dir = opts.dir;
  if (!dir) {
    if (!interactive) {
      process.stderr.write(
        "error: a target directory is required (non-interactive).\n" + HELP,
      );
      return 1;
    }
    dir = await promptDir();
  }

  const targetDir = resolve(process.cwd(), dir);
  if (!isDirEmpty(targetDir)) {
    process.stderr.write(`error: ${targetDir} exists and is not empty.\n`);
    return 1;
  }

  let template = opts.template;
  if (template && !TEMPLATE_NAMES.has(template)) {
    process.stderr.write(
      `error: unknown template "${template}". Expected one of: ${[...TEMPLATE_NAMES].join(", ")}.\n`,
    );
    return 1;
  }
  if (!template) {
    template = interactive ? await promptTemplate() : "vite";
  }

  const packageName = toPackageName(targetDir);
  scaffold({ targetDir, template, packageName });

  const rel = dir.startsWith(".") ? dir : `./${dir}`;
  process.stdout.write(
    `\n✓ Created ${packageName} (${template}) in ${targetDir}\n\n` +
      `Next steps:\n` +
      `  cd ${rel}\n` +
      `  npm install\n` +
      `  npm run dev\n\n`,
  );
  return 0;
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
