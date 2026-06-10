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

## Options

```
create-react-router-next [directory] [--template vite|webpack|rspack]
  -t, --template   Bundler template
  -h, --help       Show help
```
