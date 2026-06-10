# react-router-next app

Next.js-style filesystem routing on [React Router 7](https://reactrouter.com),
powered by [`@evolonix/react-router-next`](https://github.com/evolonix/react-router-next).

## Develop

```bash
npm install
npm run dev
```

## Routing

Routes live under `src/app/`. A folder becomes a URL segment; the files inside
it map to roles:

| File            | Role                                            |
| --------------- | ----------------------------------------------- |
| `page.tsx`      | The route's UI                                  |
| `layout.tsx`    | Wraps child routes (renders `<Outlet />`)       |
| `loading.tsx`   | Suspense fallback                               |
| `error.tsx`     | Error boundary                                  |
| `not-found.tsx` | 404 boundary (also catches `notFound()` throws) |

Dynamic segments use brackets: `blog/[slug]`, catch-all `docs/[...slug]`,
optional catch-all `search/[[...query]]`. See the
[full convention reference](https://github.com/evolonix/react-router-next#readme).

## Build

```bash
npm run build
```

## Lint

Route conventions are linted by
[`eslint-plugin-react-router-next`](https://github.com/evolonix/react-router-next/tree/main/packages/eslint-plugin-react-router-next)
(see `eslint.config.mjs`):

```bash
npm run lint
```
