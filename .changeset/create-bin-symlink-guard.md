---
"create-react-router-next": patch
---

Fix `npm create react-router-next` silently doing nothing. The bin entry decided whether it was "invoked directly" by comparing `process.argv[1]` against `import.meta.url`, but npm/npx expose the bin as a symlink in `node_modules/.bin`, so `argv[1]` (the symlink) never matched the resolved module path and the CLI exited 0 without scaffolding. The entry now compares realpaths, and a smoke test invokes the built bin through a symlink to guard against regressions.
