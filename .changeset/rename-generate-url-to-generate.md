---
"@evolonix/react-router-next": minor
---

feat(app-router): export `generate` to match the per-route `generate()` helper; keep `generateUrl` as a deprecated alias

Use `generate(routeKey, params)` from the package directly to mirror the name of the per-route `generate(params)` helper emitted by the Vite plugin and codegen CLI. The previous `generateUrl` export is still available and forwards to `generate`, but is marked `@deprecated` — migrate at your own pace.
