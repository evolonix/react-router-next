# eslint-plugin-react-router-next

ESLint rules that catch mistakes in
[`@evolonix/react-router-next`](https://github.com/evolonix/react-router-next)
route conventions.

## Install

```bash
npm i -D eslint-plugin-react-router-next
```

## Usage (flat config)

```js
// eslint.config.js
import reactRouterNext from "eslint-plugin-react-router-next";

export default [reactRouterNext.configs.recommended];
```

Or wire rules manually:

```js
import reactRouterNext from "eslint-plugin-react-router-next";

export default [
  {
    plugins: { "react-router-next": reactRouterNext },
    rules: {
      "react-router-next/valid-dynamic-segments": "error",
      "react-router-next/no-duplicate-dynamic-params": "error",
      "react-router-next/no-search-params-export": "warn",
    },
  },
];
```

## Rules

| Rule                          | Description                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------ |
| `valid-dynamic-segments`      | Flags malformed dynamic segments (`[]`, `[...]`, `[id`). Use `[name]`/`[...name]`/`[[...name]]`. |
| `no-duplicate-dynamic-params` | Flags a route path that binds the same param name twice.                                         |
| `no-search-params-export`     | The search schema export is `searchSchema`; `searchParams` is the page prop.                     |

All rules accept an `appDir` option (default `"app"`) to locate the route tree:

```js
"react-router-next/valid-dynamic-segments": ["error", { appDir: "routes" }]
```

## Roadmap

Folder-level checks (orphaned `default.tsx`, a slot without a parallel layout,
unreachable intercepts, `@slot` outside a layout) need project-wide analysis and
are planned as a follow-up.
