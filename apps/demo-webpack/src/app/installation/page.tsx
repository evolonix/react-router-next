import { CodeBlock } from "../_components/code-block";
import { Explain } from "../_components/explain";

export default function InstallationPage() {
  return (
    <>
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
          @evolonix/react-router-next
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl dark:text-slate-100">
          Installation — Webpack 5 (codegen path)
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
          The package's Vite plugin is <em>optional</em>. The runtime contract
          is just{" "}
          <code className="font-mono">
            buildRoutesFromModules(modules, appDir)
          </code>{" "}
          returning a <code>RouteObject[]</code> — any bundler that can resolve
          a static import tree will do. This guide wires it up with{" "}
          <a
            href="https://webpack.js.org"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-slate-900 underline decoration-slate-400 underline-offset-2 hover:decoration-slate-900 dark:text-slate-100 dark:decoration-slate-500 dark:hover:decoration-slate-100"
          >
            Webpack 5
          </a>{" "}
          and the package's{" "}
          <code className="font-mono">react-router-next gen</code> CLI: the CLI
          materializes the same{" "}
          <code className="font-mono">virtual:react-router-next/…</code> modules
          the Vite plugin serves in-memory as physical{" "}
          <code className="font-mono">.js</code> shims plus an{" "}
          <code className="font-mono">aliases.json</code> file the bundler
          spreads into <code>resolve.alias</code>. Source code ends up identical
          to a Vite consumer.
        </p>
      </header>

      <Explain title="Peer dependencies" accent="neutral" tag="Prerequisites">
        <p>
          Make sure your project meets these minimums before installing — they
          are declared as peer dependencies on the package:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <code className="font-mono">react</code> ≥ 19
          </li>
          <li>
            <code className="font-mono">react-dom</code> ≥ 19
          </li>
          <li>
            <code className="font-mono">react-router</code> ≥ 7
          </li>
          <li>
            <code className="font-mono">vite</code> ≥ 5 (optional — only needed
            if you use the Vite plugin; this demo does <strong>not</strong>)
          </li>
        </ul>
      </Explain>

      <Explain title="Install the package" accent="neutral" tag="Step 1">
        <p>
          Add the package alongside{" "}
          <code className="font-mono">react-router</code>. Use whichever package
          manager your project already uses:
        </p>
        <CodeBlock
          filename="npm"
          lang="sh"
        >{`npm i @evolonix/react-router-next react-router`}</CodeBlock>
        <CodeBlock
          filename="pnpm"
          lang="sh"
        >{`pnpm add @evolonix/react-router-next react-router`}</CodeBlock>
        <CodeBlock
          filename="yarn"
          lang="sh"
        >{`yarn add @evolonix/react-router-next react-router`}</CodeBlock>
      </Explain>

      <Explain title="Configure Webpack 5" accent="neutral" tag="Step 2">
        <p>
          A minimal Webpack 5 config: <code>swc-loader</code> for TSX, PostCSS
          for Tailwind v4, <code>HtmlWebpackPlugin</code> to inject the bundle,
          and <code>historyApiFallback</code> so deep links work in the dev
          server. The Option B–specific piece is a small{" "}
          <code className="font-mono">NormalModuleReplacementPlugin</code> that
          rewrites{" "}
          <code className="font-mono">virtual:react-router-next/...</code>{" "}
          requests into the codegen file paths — webpack treats anything
          matching <code className="font-mono">{`/^[a-z]+:/`}</code> as a URI
          scheme and short-circuits past <code>resolve.alias</code>, so we have
          to intervene earlier in the pipeline. The{" "}
          <code className="font-mono">aliases.json</code> file the codegen emits
          is still the source of truth for the actual destinations:
        </p>
        <CodeBlock filename="webpack.config.cjs">{`const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("node:path");
const webpack = require("webpack");
const aliases = require("./node_modules/.react-router-next/aliases.json");

const VIRTUAL_PREFIX = "virtual:react-router-next";
const reactRouterNextVirtual = new webpack.NormalModuleReplacementPlugin(
  /^virtual:react-router-next(\\/.*)?$/,
  (resource) => {
    const req = resource.request;
    const exactKey = req + "$";
    if (aliases[exactKey]) {
      resource.request = aliases[exactKey];
      return;
    }
    if (req.startsWith(VIRTUAL_PREFIX + "/")) {
      resource.request = path.join(
        aliases[VIRTUAL_PREFIX],
        req.slice(VIRTUAL_PREFIX.length + 1),
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
      publicPath: "/",
      clean: true,
    },
    resolve: { extensions: [".tsx", ".ts", ".jsx", ".js"] },
    module: {
      rules: [
        {
          test: /\\.[jt]sx?$/,
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
          test: /\\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    plugins: [
      reactRouterNextVirtual,
      new HtmlWebpackPlugin({ template: "./index.html" }),
    ],
    devServer: { historyApiFallback: true, port: 8080 },
  };
};`}</CodeBlock>
        <CodeBlock filename="postcss.config.cjs">{`module.exports = {
  plugins: { "@tailwindcss/postcss": {} },
};`}</CodeBlock>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The <code className="font-mono">require</code> at the top of the
          config will throw if the codegen hasn't run yet — that's the desired
          failure mode. The <code className="font-mono">prebuild</code> hook and
          the <code className="font-mono">--watch</code> dev runner in Step 3
          ensure it always has.
        </p>
      </Explain>

      <Explain title="Run codegen on every build" accent="neutral" tag="Step 3">
        <p>
          <code className="font-mono">react-router-next gen</code> walks{" "}
          <code className="font-mono">src/app/</code> and writes, under{" "}
          <code className="font-mono">node_modules/.react-router-next/</code>:
          an ambient <code className="font-mono">routes.d.ts</code> (types for
          every virtual specifier), an{" "}
          <code className="font-mono">app-tree.js</code> (statically imports
          every route file), one{" "}
          <code className="font-mono">routes/&lt;key&gt;.js</code> per route
          (the typed <code className="font-mono">generate(params)</code>{" "}
          helper), and an <code className="font-mono">aliases.json</code> wiring
          those files back to the <code className="font-mono">virtual:</code>{" "}
          specifiers. Plug it into your scripts:
        </p>
        <CodeBlock filename="package.json" lang="json">{`{
  "scripts": {
    "dev": "react-router-next gen --watch & webpack serve --mode development",
    "prebuild": "react-router-next gen",
    "build": "tsc -b && webpack --mode production",
    "typecheck": "tsc -b",
    "gen": "react-router-next gen"
  },
  "devDependencies": {
    "chokidar": "^4.0.0"
  }
}`}</CodeBlock>
        <p>
          The <code className="font-mono">--watch</code> flag keeps the CLI
          running after the initial pass and reruns it whenever a route file is
          added or removed (editor saves don't change the route map, so it
          ignores content edits). <code className="font-mono">chokidar</code> is
          an <em>optional</em> peer dependency of the package — the CLI
          lazy-loads it only when <code>--watch</code> is set, so consumers who
          only build (no dev watcher) don't need it installed.
        </p>
        <p>
          Finally, tell TypeScript about the ambient declarations — add the
          generated <code className="font-mono">routes.d.ts</code> to{" "}
          <code>include</code> so editor autocomplete works for{" "}
          <code className="font-mono">
            import {"{ generate }"} from "virtual:react-router-next/…"
          </code>
          :
        </p>
        <CodeBlock filename="tsconfig.app.json" lang="json">{`{
  "include": ["src", "node_modules/.react-router-next/routes.d.ts"]
}`}</CodeBlock>
      </Explain>

      <Explain title="Mount AppRouter" accent="neutral" tag="Step 4">
        <p>
          Pull <code className="font-mono">modules</code> and{" "}
          <code className="font-mono">appDir</code> from the codegen's app-tree
          shim and hand them to the bundler-agnostic{" "}
          <code className="font-mono">{"<AppRouter />"}</code>. That's it —
          source matches a Vite consumer line-for-line; the only difference
          versus <code className="font-mono">/vite-client</code> is that we
          destructure the virtual module ourselves instead of letting the
          wrapper read it:
        </p>
        <CodeBlock filename="src/main.tsx">{`import { AppRouter } from "@evolonix/react-router-next";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { appDir, modules } from "virtual:react-router-next/app-tree";

import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter modules={modules} appDir={appDir} />
  </StrictMode>,
);`}</CodeBlock>
        <p>
          Anywhere you'd write a typed link or read params, use the per-route
          virtual module the way the Vite demo does — same imports work under
          either bundler now:
        </p>
        <CodeBlock filename="src/app/posts/page.tsx">{`import { Link } from "react-router";
import { generate as generatePost } from "virtual:react-router-next/posts/[postId]";

<Link to={generatePost({ postId: "1" })}>First post</Link>`}</CodeBlock>
      </Explain>

      <Explain title="Drop pages into src/app/" accent="neutral" tag="Step 5">
        <p>
          A folder becomes a route when it contains a{" "}
          <code className="font-mono">page.tsx</code>. Layouts, loading and
          error boundaries, parallel slots, and interceptors are all opt-in —
          add the file when you need it. Every convention you see in this demo
          works identically whether you run it on Vite, Rsbuild, or Webpack —
          only the bundler glue changes.
        </p>
        <CodeBlock filename="src/app/">{`src/app/
├── layout.tsx              # wraps everything below
├── page.tsx                # /
└── about/
    └── page.tsx            # /about`}</CodeBlock>
        <p>
          That's the whole setup. Head to{" "}
          <a
            href="/basics"
            className="font-medium text-slate-900 underline decoration-slate-400 underline-offset-2 hover:decoration-slate-900 dark:text-slate-100 dark:decoration-slate-500 dark:hover:decoration-slate-100"
          >
            Basics
          </a>{" "}
          for layouts and nesting, or browse the sidebar for the rest of the
          conventions.
        </p>
      </Explain>

      <Explain title="CLI options" accent="neutral" tag="Reference">
        <p>
          Three subcommands; all accept the same options. Defaults match what
          the Vite plugin would use:
        </p>
        <CodeBlock
          filename="CLI"
          lang="sh"
        >{`react-router-next gen      # typegen + codegen in one step (recommended)
react-router-next typegen  # just the routes.d.ts shim
react-router-next codegen  # just the .js shims + aliases.json

# Options (any subcommand):
#   --app-dir=src/app
#   --out-dir=node_modules/.react-router-next`}</CodeBlock>
      </Explain>
    </>
  );
}
