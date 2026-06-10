---
"create-react-router-next": minor
---

Prompt for optional tooling during scaffolding. The CLI now asks (or takes
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
