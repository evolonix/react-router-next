---
"create-react-router-next": minor
---

New package: `create-react-router-next`, a scaffolder for new React Router 7 apps with Next.js-style filesystem routing.

```bash
npm create react-router-next@latest my-app
```

Ships Vite (zero-config plugin), Webpack, and Rspack/Rsbuild templates — all sharing the same `src/app/` route tree (home, a static route, a dynamic `[slug]` route, and `not-found.tsx`) and an `eslint.config.mjs` wired up with `eslint-plugin-react-router-next` (`npm run lint`). Pick a bundler with `--template <vite|webpack|rspack>` or interactively. Dependency-free CLI (Node built-ins only).
