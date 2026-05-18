---
"@evolonix/react-router-next": patch
---

Fix parallel-route slots always falling back to `default.tsx`

When a `@slot` subtree contained only `page.tsx` (no nested layout or children),
the slot's routes were lowered to a pathless layout route with no descendants —
which `useRoutes`/`matchRoutes` cannot match against any URL. The slot therefore
always returned `null` and rendered `default.tsx`, even on the slot's own URL.

The route lowering now preserves the inner `index` leaf when the surrounding
route is pathless, so `useRoutes` can match the slot's `page.tsx` at the slot's
parent URL while still falling back to `default.tsx` for deeper paths.
