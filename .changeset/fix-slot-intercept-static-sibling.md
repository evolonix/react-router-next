---
"@evolonix/react-router-next": patch
---

Fix slot-owned intercepting routes wrongly capturing static sibling URLs on soft navigation.

When a `@modal` parallel slot had a `default.tsx` and an intercepting route (e.g. `@modal/(.)[taskId]`), its isolated slot matcher contained only the intercept's dynamic pattern. A soft (PUSH) navigation to a static sibling like `/projects/[projectId]/settings` matched that dynamic pattern (`taskId="settings"`) and opened the modal — which then 404s on the non-existent target — even though the main outlet correctly rendered the static page. A hard refresh worked because the interceptor only renders on PUSH.

The slot interceptor is now gated on the main data router actually matching the intercept's target route (via a stable target route id + `useMatches()`), so static siblings correctly fall through to the slot default. The fix is interceptor-depth and route-group agnostic — it covers `(.)`, `(..)`, `(..)(..)`, and `(...)` slot intercepts.
