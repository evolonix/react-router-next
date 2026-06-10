import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "vite-client": "src/vite-client.tsx",
  },
  format: ["esm"],
  target: "es2023",
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  shims: false,
  external: [
    "react",
    "react-dom",
    "react-router",
    "@evolonix/react-router-next",
  ],
  esbuildOptions(options) {
    options.external = [
      ...(options.external ?? []),
      "virtual:react-router-next/app-tree",
    ];
  },
});
