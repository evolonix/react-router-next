const path = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (_env, argv) => {
  const isDev = argv.mode !== "production";

  return {
    entry: "./src/main.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isDev ? "[name].js" : "[name].[contenthash].js",
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
    devServer: {
      historyApiFallback: true,
      port: 8080,
      static: { directory: path.resolve(__dirname, "public") },
    },
    devtool: isDev ? "eval-cheap-module-source-map" : "source-map",
  };
};
