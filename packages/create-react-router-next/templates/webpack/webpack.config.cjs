const path = require("node:path");
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
        { test: /\.css$/, use: ["style-loader", "css-loader"] },
      ],
    },
    plugins: [new HtmlWebpackPlugin({ template: "./index.html" })],
    devServer: { historyApiFallback: true, port: 8080 },
    devtool: isDev ? "eval-cheap-module-source-map" : "source-map",
  };
};
