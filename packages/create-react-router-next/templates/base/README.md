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

Dynamic segments use brackets: `hello/[name]`, catch-all `files/[...path]`,
optional catch-all `[[...slug]]`. A route can also export a `searchSchema` to
get typed, validated search params (see `src/app/search/page.tsx`). The starter
under `src/app/` demonstrates each of these. See the
[full convention reference](https://github.com/evolonix/react-router-next#readme).

## Build

```bash
npm run build
```
