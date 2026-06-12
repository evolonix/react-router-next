---
"create-react-router-next": minor
---

Redesign the scaffolded starter into a simple, branded landing that demonstrates each core routing convention.

- New `src/app/` example routes: home, `about` (static), `hello/[name]` (dynamic segment), `files/[...path]` (catch-all), `search` (typed + validated `searchSchema` via Zod), and a root `not-found`.
- Cohesive Evolonix-branded design — `public/logo.svg` brand mark + `favicon.svg`, a Manrope wordmark, and the three-color palette — in both the plain-CSS base and the Tailwind variant.
- Add `zod` as a dependency (backs the `/search` route) and `copy-webpack-plugin` to the webpack template so `public/` assets ship in the build (Vite and Rsbuild serve `public/` natively).
