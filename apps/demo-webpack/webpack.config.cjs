const path = require("node:path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// react-router-next gen / codegen writes this file alongside the runtime shims
// for the virtual:react-router-next/* specifiers. predev/prebuild scripts must
// run codegen first so this require resolves.
const reactRouterNextAliases = require("./node_modules/.react-router-next/aliases.json");

// Webpack treats any request matching `/^[a-z]+:/` as a URI scheme and short-
// circuits past resolve.alias, so `virtual:react-router-next/...` requests
// never see the alias map. Rewrite them into the codegen output paths via
// NormalModuleReplacementPlugin instead — same data, applied earlier.
const VIRTUAL_PREFIX = "virtual:react-router-next";
const reactRouterNextVirtual = new webpack.NormalModuleReplacementPlugin(
  /^virtual:react-router-next(\/.*)?$/,
  (resource) => {
    const request = resource.request;
    const exactKey = `${request}$`;
    if (reactRouterNextAliases[exactKey]) {
      resource.request = reactRouterNextAliases[exactKey];
      return;
    }
    if (request.startsWith(`${VIRTUAL_PREFIX}/`)) {
      const slug = request.slice(VIRTUAL_PREFIX.length + 1);
      resource.request = path.join(
        reactRouterNextAliases[VIRTUAL_PREFIX],
        slug,
      );
    }
  },
);

module.exports = (_env, argv) => {
  const isDev = argv.mode !== "production";

  return {
    entry: "./src/main.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isDev ? "[name].js" : "[name].[contenthash].js",
      // Give lazily-imported chunks (shiki core/engine, grammars, themes)
      // stable, content-hashed names instead of bare numeric ids.
      chunkFilename: isDev ? "[name].js" : "[name].[contenthash].js",
      publicPath: isDev ? "/" : "/react-router-next/webpack/",
      clean: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
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
        {
          test: /\.css$/,
          use: [
            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
          ],
        },
      ],
    },
    plugins: [
      reactRouterNextVirtual,
      new HtmlWebpackPlugin({ template: "./index.html" }),
      new CopyWebpackPlugin({
        patterns: [{ from: "public", to: ".", noErrorOnMissing: true }],
      }),
      ...(isDev
        ? []
        : [
            new MiniCssExtractPlugin({
              filename: "[name].[contenthash].css",
            }),
          ]),
    ],
    optimization: {
      // Split node_modules (react, react-dom, react-router, the router package)
      // out of the entry into cacheable vendor chunks — webpack doesn't do this
      // by default the way Rsbuild/Vite do, which is what left `main` huge.
      splitChunks: { chunks: "all" },
    },
    performance: {
      // Webpack's default budget (244 KiB) predates modern React — react-dom
      // alone exceeds it, so the figure is unrealistic and Rsbuild/Vite don't
      // flag these sizes. Align the per-asset limit with Vite's 500 kB chunk
      // warning and allow the (unavoidable) React-DOM entrypoint, so the hint
      // still catches real regressions.
      maxAssetSize: 512000,
      maxEntrypointSize: 600000,
    },
    devServer: {
      historyApiFallback: true,
      port: 8080,
      static: { directory: path.resolve(__dirname, "public") },
    },
    devtool: isDev ? "eval-cheap-module-source-map" : "source-map",
  };
};
