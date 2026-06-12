# Contributing to react-router-next

Thanks for your interest in contributing! This document covers everything you need to know to get a change merged into `@evolonix/react-router-next`.

## Code of Conduct

Please read the [Code of Conduct](CODE_OF_CONDUCT.md) — it describes the kind of community we want to be and the behaviors we encourage.

## Reporting bugs and requesting features

- **Bugs:** open a [bug report](https://github.com/evolonix/react-router-next/issues/new?template=bug_report.yml). Please include a minimal reproduction — a CodeSandbox or stripped-down repo is the fastest path to a fix.
- **Features:** open a [feature request](https://github.com/evolonix/react-router-next/issues/new?template=feature_request.yml). Describe the use case before the implementation.
- **Security vulnerabilities:** **do not** open a public issue. See [SECURITY.md](.github/SECURITY.md) for the private reporting process.
- **Usage questions:** see [SUPPORT.md](SUPPORT.md).

## Repository layout

This is an npm workspaces monorepo:

```
.
├── packages/
│   ├── react-router-next/                  # the core library (runtime + Vite plugin + codegen CLI)
│   ├── create-react-router-next/           # scaffolder (npm create react-router-next)
│   ├── eslint-plugin-react-router-next/    # route-convention lint rules
│   └── react-router-next-devtools/         # dev-only route-tree overlay
└── apps/
    ├── showcase/                           # landing page (deployed at /)
    ├── demo-vite/                          # Vite + plugin demo
    ├── demo-rsbuild/                       # Rsbuild demo
    └── demo-webpack/                       # Webpack 5 demo
```

All four `packages/*` are published to npm (public, with provenance). The `showcase` and `demo-*` apps are private workspaces used for development — they never publish (`"private": true`), and `showcase` is also excluded from the changesets release flow (see [.changeset/config.json](.changeset/config.json)).

## Prerequisites

- **Node** ≥ 24 (the repo's `.nvmrc` pins the exact version used in CI — `nvm use` will pick it up)
- **npm** ≥ 9 (uses npm workspaces)

## Local setup

```sh
git clone https://github.com/evolonix/react-router-next.git
cd react-router-next
npm install                       # install all workspaces
npm run dev                       # run the package build (tsup --watch) and the demo's Vite dev server concurrently
```

> **Reinstalling:** after a `git pull` or branch switch that changes `package-lock.json`, run `npm ci` instead of `npm install`. `npm ci` wipes `node_modules` and installs exactly from the lockfile, so the platform-specific native binaries (esbuild, rollup, lightningcss, …) always match your OS/arch. Plain `npm install` reconciles incrementally and can occasionally leave one of those binaries missing — surfacing as a `Cannot find module @esbuild/<platform>` error at build or test time. There's no need to delete `package-lock.json`; `npm ci` is also what CI runs.

Per-workspace commands:

```sh
npm run build -w @evolonix/react-router-next   # build the library (tsup → dist/)
npm run dev   -w @evolonix/react-router-next   # tsup --watch
npm run build -w showcase                      # tsc -b && vite build (landing page)
npm run dev   -w demo-vite                     # vite dev server (bundler demo)
npm run typegen -w demo-vite                   # regenerate routes.d.ts shim
```

## Developing the create-react-router-next templates

`create-react-router-next` emits a project that pins the **published** versions of `@evolonix/react-router-next` and friends, so a plain scaffold won't exercise template edits or local package source. The `scaffold` script closes that gap:

```sh
cd packages/create-react-router-next

npm run scaffold                              # runs the interactive CLI wizard
npm run scaffold -- -y                        # skip the wizard; vite + defaults
npm run scaffold -- -t webpack --tailwind     # prompts only for unanswered options
npm run scaffold -- -y -t vite --devtools --dev  # no prompts, then start dev
npm run scaffold -- --no-link                 # use published versions instead
npm run scaffold -- --out /tmp/try            # custom target dir
```

By default the script runs the create-react-router-next **wizard** (bundler + feature prompts); pass `-y`/`--yes` to take defaults non-interactively, or run in a non-TTY shell. Forwarded flags answer individual prompts up front. The directory prompt is always skipped — the script manages the scratch location (`--out` or a positional `[directory]`).

It rebuilds the CLI, scaffolds into a scratch dir, rewrites the in-repo deps (`@evolonix/react-router-next`, `eslint-plugin-react-router-next`, the devtools) to `file:` links against the workspace packages, then installs. Dev-only flags handled by the wrapper — `--out <dir>`, `--no-build`, `--no-link`, `--no-install`, `--dev`, `-h`/`--help` — everything else (a positional `[directory]` plus all the CLI's feature flags) is forwarded to create-react-router-next. Run `npm run scaffold -- --help` for the full list.

Two deliberate choices worth knowing:

- **The scratch dir defaults to the OS temp dir, outside the repo.** A dir nested under a workspace makes npm dedupe deps against the monorepo's `node_modules`, masking the exact versions a template pins. tmpdir guarantees a clean, self-contained install.
- **It installs with `--install-links`.** This copies the linked packages into `node_modules` as real dirs instead of symlinking them — a symlink would resolve the linked package's `react` from the monorepo (where it's a dev/peer dep), giving the app two copies of React and an "Invalid hook call" at runtime.

Because the linked packages are installed as copies, **edits to a linked package's source don't apply live** — rebuild it (`npm run build -w @evolonix/react-router-next`) and re-run `npm run scaffold` to pick the change up.

## Known dev-only warnings

Running a demo that uses **parallel routes (`@slot`)** — including the canonical intercepting-route-in-a-slot pattern — prints this in the **browser** console in development:

```
You rendered descendant <Routes> (or called `useRoutes()`) at "…" (under <Route path="…">) but the parent route path has no trailing "*".
```

This is an expected false positive, not a regression. Slots render through `useRoutes()` (a descendant `<Routes>`) inside the layout whose generated route has a plain segment path; React Router flags any such call structurally. It's safe here because the layout route carries real path children, so it keeps matching at deeper URLs and the slot keeps rendering. The warning is dev-only and absent from production builds. See the comment at [`SlotElement` in `parallel-routes.tsx`](packages/react-router-next/src/runtime/parallel-routes.tsx) and the "Parallel routes" caveat in the [package README](packages/react-router-next/README.md) for the full rationale. Don't "fix" it by adding `/*` — a splat can't coexist with the route's path children.

## Quality gates

CI runs the same scripts you can run locally before pushing:

```sh
npm run format:check   # prettier --check .
npm run lint           # eslint across workspaces
npm run typecheck      # tsc --noEmit on the library
npm run build          # full build of package + apps
```

All four must pass for a PR to be mergeable. To auto-fix formatting:

```sh
npm run format
```

## Changesets — required for user-facing changes

Releases are automated via [changesets](https://github.com/changesets/changesets). **Any PR that changes a published `packages/*` workspace in a way users will notice must include a changeset** — this covers `@evolonix/react-router-next`, `create-react-router-next`, `eslint-plugin-react-router-next`, and `@evolonix/react-router-next-devtools`. Examples that need one: bug fixes, new features, type changes, breaking changes, public-API tweaks, scaffolder template changes. Examples that do **not** need one: README/docs-only changes, repo tooling, demo-only updates, tests, internal refactors with no behavioral change.

To add a changeset:

```sh
npx changeset
```

Pick a bump level (`patch` / `minor` / `major`) and write a one-line summary in the imperative mood — it becomes a line in the published changelog/release notes. Commit the generated `.changeset/*.md` file alongside your code changes.

When your PR merges to `main`, the release workflow opens (or updates) a `chore(release): version packages` PR. Merging that PR publishes to npm with provenance.

## Pull request expectations

- **Keep PRs focused.** One logical change per PR; don't bundle unrelated refactors.
- **Link the issue** the PR closes (`Closes #123`) when applicable.
- **Fill out the [PR template](.github/PULL_REQUEST_TEMPLATE.md).**
- **Update or add tests** when you change behavior. If a feature is hard to test in isolation, demonstrate it in `apps/demo-vite/`.
- **Update docs** — both [packages/react-router-next/README.md](packages/react-router-next/README.md) and any relevant section of the root [README.md](README.md) — when you change a public API or convention.
- **Pass CI before requesting review.** A red CI is a non-starter.

## Commit messages

The project follows the spirit of [Conventional Commits](https://www.conventionalcommits.org/). Common prefixes seen in the history: `feat:`, `fix:`, `docs:`, `chore:`, `ci:`, `refactor:`, `test:`. The release-bot uses `chore(release):` — please don't reuse that prefix in normal contributions.

## Questions?

Open a [GitHub Discussion](https://github.com/evolonix/react-router-next/discussions) or ping the maintainer on the relevant issue. Thanks for helping make this project better!
