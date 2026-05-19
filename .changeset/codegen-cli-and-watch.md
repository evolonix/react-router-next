---
"@evolonix/react-router-next": minor
---

Add `codegen` and `gen` CLI commands plus `--watch` mode for non-Vite bundlers.

`react-router-next codegen` emits physical `.js` shims for every `virtual:react-router-next/...` module the Vite plugin serves in-memory, plus an `aliases.json` mapping specifiers to file paths. `react-router-next gen` runs typegen and codegen together. All three commands now accept `--watch` to keep running and regenerate on route file add/unlink.

`chokidar` is declared as an **optional peer dependency** and is lazy-loaded only when `--watch` is set, so consumers who never use the watcher don't need it installed.
