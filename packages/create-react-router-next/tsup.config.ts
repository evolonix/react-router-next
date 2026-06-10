import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm"],
  target: "node20",
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  shims: false,
  // Emit the CLI shebang at the top of the bundle.
  banner: { js: "#!/usr/bin/env node" },
});
