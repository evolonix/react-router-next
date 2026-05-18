---
"@evolonix/react-router-next": patch
---

Update READMEs to align with the new demo app. The root README replaces the dead `apps/demo/README.md` link and the stale `photos/`/`notes/` references with a tour of the demo's actual top-level routes (`basics`, `(marketing)`, `docs/[...slug]`, `search/[[...query]]`, `posts`, `transitions`, `dashboard`, `gallery`, `mail/[folderId]`, `projects/[orgId]/(catalog)`, `(overlay-host)`). The package README renames its illustrative examples from `notes/`→`posts/` and `photos/`→`gallery/` so the conventions match the names users will find in the live demo, and adds the `[postId]/error.tsx` and `not-found.tsx` files that the demo actually ships. No code or API changes.
