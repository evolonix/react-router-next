---
"@evolonix/react-router-next": major
---

Remove the `loader.ts` file convention.

**Breaking**

- The `loader.ts` filename is no longer recognized as a route convention. The Vite plugin's filesystem glob, the route-scan regex, and the runtime route-builder no longer pick up sibling `loader.ts` files, and the emitted `virtual:react-router-next/app-tree` `RouteModule` type no longer declares a `loader` member.
- Pages that previously called `useLoaderData()` to read from a sibling `loader.ts` will have no data to read.
- The "loader on intercepting route" and "loader inside @slot" build-time warnings are gone — those code paths have no loaders to detect anymore.

**Migration**

Move data fetching into a suspending hook. Wrap your data in a cached promise and call `use()` on it from the page. The injected `loading.tsx` still renders as the Suspense fallback, so the loading UX is unchanged:

```ts
// _lib/use-thing.ts
import { use } from "react";

const cache = new Map<string, Promise<Thing>>();

export function useThing(id: string): Thing {
  let p = cache.get(id);
  if (!p) {
    p = fetchThing(id);
    cache.set(id, p);
  }
  return use(p);
}
```

- Throw `notFound()` from inside the suspending promise chain to render the nearest `not-found.tsx`.
- Throw a regular `Error` to render the nearest `error.tsx`.

See `notes/_lib/use-notes.ts` and `inbox/_lib/use-message.ts` in the demo app for end-to-end templates.

**Unchanged**

- `notFound()`, `NotFoundError`, and `isNotFoundError` are still exported. They remain useful from suspending hooks and component render.
- `parseRouteParams` continues to validate params from utility code where component hooks aren't available.
