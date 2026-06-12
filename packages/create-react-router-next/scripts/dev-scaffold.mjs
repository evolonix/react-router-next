#!/usr/bin/env node
// Dev helper for iterating on the scaffolder + its templates.
//
// `create-react-router-next` is built for end users: it emits a package.json
// pinning the *published* versions of @evolonix/react-router-next & friends.
// That's wrong for local development — you want a scaffolded app that exercises
// the templates AND the local package source you're editing.
//
// This script wraps the CLI to close that gap:
//   1. (re)builds the CLI so dist/index.js reflects your src changes,
//   2. scaffolds into a scratch dir (CLI wizard by default; -y/--yes bypasses),
//   3. rewrites the @evolonix/* + eslint-plugin deps to `file:` links pointing
//      at the workspace packages (installed as copies — see install step),
//   4. optionally `npm install`s and starts the dev server.
//
// Wrapper flags (--out/--no-build/--no-link/--no-install/--dev/--help) are
// consumed here; every other option — including a positional [directory] and
// all create-react-router-next feature flags — is forwarded to the CLI. Run
// `npm run scaffold -- --help` for the full usage.

import { execFileSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PKG_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PACKAGES_DIR = resolve(PKG_DIR, "..");

// Workspace package name → directory under packages/. These are the deps a
// generated app references that live in this monorepo.
const LOCAL_PACKAGES = {
  "@evolonix/react-router-next": "react-router-next",
  "eslint-plugin-react-router-next": "eslint-plugin-react-router-next",
  "@evolonix/react-router-next-devtools": "react-router-next-devtools",
};

const HELP = `dev-scaffold — scaffold a throwaway app from the LOCAL create-react-router-next

Builds the local CLI, scaffolds into a scratch dir, links the in-repo packages
so the app exercises your local source, then installs.

Usage:
  npm run scaffold [-- <options>]

Wrapper options:
  --out <dir>     scratch target (default: <tmpdir>/create-react-router-next/<template>)
  --no-build      skip rebuilding the CLI before scaffolding
  --no-link       keep published deps instead of file: links to the workspace
  --no-install    scaffold only; skip npm install
  --dev           run \`npm run dev\` in the scaffold after install
  -h, --help      show this help

By default create-react-router-next runs its interactive wizard (bundler +
feature prompts). Pass -y/--yes to accept defaults non-interactively, or run in
a non-TTY shell; forwarded flags answer individual prompts either way.

Everything else is forwarded to create-react-router-next. A positional
[directory] (or --out) sets the scaffold target — that prompt is always
skipped so the scratch location stays managed. The feature flags are:
  -t, --template <vite|webpack|rspack>   bundler template (default: vite)
  --eslint / --no-eslint                 ESLint + route-convention rules
  --prettier / --no-prettier             Prettier
  --tailwind / --no-tailwind             Tailwind CSS v4
  --devtools / --no-devtools             devtools overlay
  -y, --yes                              accept all defaults (skip the wizard)
(run create-react-router-next --help for the authoritative list.)

Examples:
  npm run scaffold -- -t webpack --tailwind
  npm run scaffold -- my-app --devtools --dev
  npm run scaffold -- --out /tmp/try --no-install
`;

function parseDevArgs(argv) {
  const dev = {
    build: true,
    link: true,
    install: true,
    runDev: false,
    help: false,
    yes: false,
  };
  let out;
  let template = "vite";
  let templateGiven = false;
  const forward = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") dev.help = true;
    else if (arg === "--no-build") dev.build = false;
    else if (arg === "--no-link") dev.link = false;
    else if (arg === "--no-install") dev.install = false;
    else if (arg === "--dev") dev.runDev = true;
    else if (arg === "--out") out = argv[++i];
    else if (arg.startsWith("--out=")) out = arg.slice("--out=".length);
    else if (arg === "-t" || arg === "--template") {
      // -t/--template takes a space-separated value; consume it here so it
      // isn't mistaken for the positional [directory] below. Forward both, and
      // remember the template to name the default scratch dir.
      const value = argv[++i];
      template = value ?? template;
      templateGiven = true;
      forward.push(arg);
      if (value !== undefined) forward.push(value);
    } else if (arg.startsWith("--template=")) {
      template = arg.slice("--template=".length);
      templateGiven = true;
      forward.push(arg);
    } else if (arg === "-y" || arg === "--yes") {
      // Forwarded so the CLI bypasses its wizard; tracked so we know the
      // template is settled (defaults) when naming the scratch dir.
      dev.yes = true;
      forward.push(arg);
    } else if (!arg.startsWith("-") && out === undefined) {
      // create-react-router-next's positional [directory] → the scaffold target
      // (passed to the CLI as its directory below).
      out = arg;
    } else {
      // Any other create-react-router-next option (feature toggles, …).
      forward.push(arg);
    }
  }
  return { ...dev, template, templateGiven, out, forward };
}

function npm(args, cwd) {
  execFileSync("npm", args, { cwd, stdio: "inherit" });
}

/** Rewrite local @evolonix/* deps to `file:` links against the workspace. */
function linkLocalPackages(targetDir) {
  const pkgPath = join(targetDir, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const linked = [];
  for (const field of ["dependencies", "devDependencies"]) {
    const deps = pkg[field];
    if (!deps) continue;
    for (const [name, dir] of Object.entries(LOCAL_PACKAGES)) {
      if (!(name in deps)) continue;
      // Absolute `file:` path to the workspace package (installed as a copy via
      // --install-links, not a symlink — see the install step for why).
      // Absolute, not relative, because the scratch dir lives outside the repo
      // where a relative climb is brittle.
      deps[name] = "file:" + join(PACKAGES_DIR, dir);
      linked.push(name);
    }
  }
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  return linked;
}

function main() {
  const opts = parseDevArgs(process.argv.slice(2));
  if (opts.help) {
    process.stdout.write(HELP);
    return;
  }

  // The CLI runs its wizard when attached to a TTY without --yes; otherwise it
  // falls back to flags + defaults. When the wizard will choose the bundler
  // (interactive + no -t), we don't know it yet, so name the scratch dir
  // neutrally rather than guessing "vite".
  const bypass = opts.yes || process.stdin.isTTY !== true;
  const wizardPicksTemplate = !bypass && !opts.templateGiven;
  const dirName = wizardPicksTemplate ? "app" : opts.template;

  // Default outside the repo: a scratch dir nested under a workspace would make
  // npm dedupe deps against the monorepo's node_modules, masking the exact
  // versions a template pins. tmpdir guarantees a clean, self-contained install.
  const targetDir = resolve(
    process.cwd(),
    opts.out ?? join(tmpdir(), "create-react-router-next", dirName),
  );

  if (opts.build) {
    console.log("▸ Building CLI…");
    npm(["run", "build"], PKG_DIR);
  }

  console.log(
    wizardPicksTemplate
      ? `▸ Scaffolding into ${targetDir}…`
      : `▸ Scaffolding ${opts.template} into ${targetDir}…`,
  );
  rmSync(targetDir, { recursive: true, force: true });
  // Pass the scratch dir as the positional so the CLI skips its directory
  // prompt (we manage the scratch location). With no --yes on a TTY the wizard
  // still prompts for bundler + features; forwarded flags answer them up front.
  execFileSync(
    process.execPath,
    [join(PKG_DIR, "dist", "index.js"), targetDir, ...opts.forward],
    { stdio: "inherit" },
  );

  if (opts.link) {
    const linked = linkLocalPackages(targetDir);
    console.log(
      linked.length
        ? `▸ Linked local packages: ${linked.join(", ")}`
        : "▸ No local packages to link for this feature set",
    );
  }

  if (opts.install) {
    console.log("▸ Installing…");
    // --install-links: copy the file: deps into node_modules as real dirs
    // instead of symlinking them. A symlink resolves the linked package's
    // `react` from the monorepo (where it's a dev/peer dep), giving the app two
    // Reacts → "Invalid hook call". Copies resolve react from the app's single
    // copy. Trade-off: edits to a linked package need a re-run to take effect.
    npm(["install", "--install-links"], targetDir);
  }

  if (opts.runDev) {
    console.log("▸ Starting dev server…");
    npm(["run", "dev"], targetDir);
    return;
  }

  console.log(
    `\n✔ Ready: ${targetDir}\n` +
      (opts.install ? "" : `  npm install --prefix ${targetDir}\n`) +
      `  npm run dev --prefix ${targetDir}\n`,
  );
}

main();
