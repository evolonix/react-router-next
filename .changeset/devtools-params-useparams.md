---
"@evolonix/react-router-next-devtools": patch
---

Show route params even without a `routes` prop. The PARAMS panel now reads from
React Router's `useParams()` instead of deriving them from `matchRoutes(routes)`,
so dynamic segments like `[slug]` display correctly under the base entry and
non-Vite bundlers (previously they showed "none").
