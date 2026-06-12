# create-react-router-next

Scaffold a new [React Router 7](https://reactrouter.com) app with Next.js-style
filesystem routing, powered by
[`@evolonix/react-router-next`](https://github.com/evolonix/react-router-next).

## Usage

```bash
npm create react-router-next@latest my-app
# or pick a bundler up front:
npm create react-router-next@latest my-app -- --template webpack
```

Then:

```bash
cd my-app
npm install
npm run dev
```

## Templates

| Template  | Bundler          | Wiring                                          |
| --------- | ---------------- | ----------------------------------------------- |
| `vite`    | Vite             | zero-config `reactRouterNext()` plugin          |
| `webpack` | Webpack 5        | `buildModulesFromContext(require.context(...))` |
| `rspack`  | Rsbuild / Rspack | `buildModulesFromContext(require.context(...))` |

Pass one with `--template <name>` (`-t`), or pick interactively. Defaults to
`vite`.

Every template ships the same `src/app/` route tree (home, a static route, a
dynamic `[slug]` route, and a `not-found.tsx`) so the conventions are the same
across bundlers.

## Optional features

The CLI asks whether to include each of these (or pass the matching flag to skip
the prompt). They work with every bundler template.

| Feature      | Flag                         | Default | What it adds                                                                 |
| ------------ | ---------------------------- | ------- | ---------------------------------------------------------------------------- |
| **ESLint**   | `--eslint` / `--no-eslint`   | on      | `eslint.config.mjs` with the `eslint-plugin-react-router-next` rules         |
| **Prettier** | `--prettier`/`--no-prettier` | on      | `.prettierrc.json` + `format` scripts (adds the Tailwind plugin if both on)  |
| **Tailwind** | `--tailwind`/`--no-tailwind` | off     | Tailwind CSS v4 wired for the bundler, with the example components restyled  |
| **Devtools** | `--devtools`/`--no-devtools` | off     | The `@evolonix/react-router-next-devtools` overlay, rendered in `layout.tsx` |

## Options

```
create-react-router-next [directory] [options]
  -t, --template <vite|webpack|rspack>   Bundler template (default: vite)
  --eslint / --no-eslint                 ESLint + route-convention rules (default: on)
  --prettier / --no-prettier             Prettier (default: on)
  --tailwind / --no-tailwind             Tailwind CSS v4 (default: off)
  --devtools / --no-devtools             Devtools overlay (default: off)
  -y, --yes                              Accept defaults without prompting
  -h, --help                             Show help
```

## Development

Iterating on the CLI or the templates? `npm run scaffold` builds the CLI,
scaffolds into a scratch dir, and links the in-repo packages so a generated app
exercises your local source instead of the published versions:

```bash
npm run scaffold                              # vite, default features, installs
npm run scaffold -- -t webpack --tailwind     # any template + feature flags
npm run scaffold -- -t vite --devtools --dev  # …and start the dev server
```

See [Developing the create-react-router-next templates](../../CONTRIBUTING.md#developing-the-create-react-router-next-templates)
for the full flag list and the rationale behind the defaults.
