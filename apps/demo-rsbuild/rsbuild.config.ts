import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: { index: "./src/main.tsx" },
  },
  html: {
    template: "./index.html",
  },
  output: {
    assetPrefix: isProd ? "/react-router-next/rsbuild/" : "/",
  },
});
