# create-react-router-next

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
