# create-react-router-next

## 0.3.0

### Minor Changes

- [#69](https://github.com/evolonix/react-router-next/pull/69) [`2e96104`](https://github.com/evolonix/react-router-next/commit/2e9610489147b00134549f8adccc3b34c82b5056) Thanks [@jasonruesch](https://github.com/jasonruesch)! - Redesign the scaffolded starter into a simple, branded landing that demonstrates each core routing convention.

  - New `src/app/` example routes: home, `about` (static), `hello/[name]` (dynamic segment), `files/[...path]` (catch-all), `search` (typed + validated `searchSchema` via Zod), and a root `not-found`.
  - Cohesive Evolonix-branded design — `public/logo.svg` brand mark + `favicon.svg`, a Manrope wordmark, and the three-color palette — in both the plain-CSS base and the Tailwind variant.
  - Add `zod` as a dependency (backs the `/search` route) and `copy-webpack-plugin` to the webpack template so `public/` assets ship in the build (Vite and Rsbuild serve `public/` natively).

## 0.2.0

### Minor Changes

- [`520b67c`](https://github.com/evolonix/react-router-next/commit/520b67c540b129bdee063db655c4a1fe3855bb3f) Thanks [@jasonruesch](https://github.com/jasonruesch)! - Prompt for optional tooling during scaffolding. The CLI now asks (or takes
  `--eslint`/`--prettier`/`--tailwind`/`--devtools` flags, with `--no-` variants
  and `--yes`) whether to include:
  - **ESLint** (with the `eslint-plugin-react-router-next` route rules) — now
    opt-in instead of always installed
  - **Prettier** — adds `prettier-plugin-tailwindcss` when Tailwind is also chosen
  - **Tailwind CSS v4** — wired per bundler (`@tailwindcss/vite` for Vite,
    `@tailwindcss/postcss` for Webpack/Rspack), with the example components
    restyled
  - **react-router-next devtools** — rendered in `layout.tsx`

  Each option works across all three bundler templates, and only its
  dependencies/config are added when selected. The prompts use `@clack/prompts`
  with colored output. Also fixes the Webpack/Rspack templates to ship a
  `src/env.d.ts` so the `styles.css` side-effect import typechecks.

## 0.1.1

### Patch Changes

- [#64](https://github.com/evolonix/react-router-next/pull/64) [`f18e585`](https://github.com/evolonix/react-router-next/commit/f18e585214956cedaa89c7875bea43ee8fa570ab) Thanks [@jasonruesch](https://github.com/jasonruesch)! - Fix `npm create react-router-next` silently doing nothing. The bin entry decided whether it was "invoked directly" by comparing `process.argv[1]` against `import.meta.url`, but npm/npx expose the bin as a symlink in `node_modules/.bin`, so `argv[1]` (the symlink) never matched the resolved module path and the CLI exited 0 without scaffolding. The entry now compares realpaths, and a smoke test invokes the built bin through a symlink to guard against regressions.

## 0.1.0

### Minor Changes

- [#62](https://github.com/evolonix/react-router-next/pull/62) [`90f86b7`](https://github.com/evolonix/react-router-next/commit/90f86b71ba51eb52c49ceff8e68f06478c835057) Thanks [@jasonruesch](https://github.com/jasonruesch)! - New package: `create-react-router-next`, a scaffolder for new React Router 7 apps with Next.js-style filesystem routing.

  ```bash
  npm create react-router-next@latest my-app
  ```

  Ships Vite (zero-config plugin), Webpack, and Rspack/Rsbuild templates — all sharing the same `src/app/` route tree (home, a static route, a dynamic `[slug]` route, and `not-found.tsx`) and an `eslint.config.mjs` wired up with `eslint-plugin-react-router-next` (`npm run lint`). Pick a bundler with `--template <vite|webpack|rspack>` or interactively. Dependency-free CLI (Node built-ins only).
