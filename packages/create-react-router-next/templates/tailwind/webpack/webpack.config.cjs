const path = require("node:path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (_env, argv) => {
  const isDev = argv.mode !== "production";
  return {
    entry: "./src/main.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isDev ? "[name].js" : "[name].[contenthash].js",
      publicPath: "/",
      clean: true,
    },
    resolve: { extensions: [".tsx", ".ts", ".jsx", ".js"] },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: "swc-loader",
            options: {
              jsc: {
                parser: { syntax: "typescript", tsx: true },
                transform: { react: { runtime: "automatic" } },
                target: "es2022",
              },
            },
          },
        },
        // `postcss-loader` runs Tailwind v4 via `@tailwindcss/postcss`
        // (configured in postcss.config.cjs) before css-loader.
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: "./index.html" }),
      // Serve/emit static assets from public/ (the logo) — Vite and Rsbuild
      // do this by convention; webpack needs it spelled out.
      new CopyPlugin({
        patterns: [{ from: "public", noErrorOnMissing: true }],
      }),
    ],
    devServer: { historyApiFallback: true, port: 8080 },
    devtool: isDev ? "eval-cheap-module-source-map" : "source-map",
  };
};
