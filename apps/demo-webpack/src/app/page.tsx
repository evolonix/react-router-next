import { CodeBlock } from "./_components/code-block";
import { Explain } from "./_components/explain";
import { FeatureCard } from "./_components/feature-card";

export default function HomePage() {
  return (
    <>
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
          @evolonix/react-router-next
        </p>
        <h1 className="text-2xl font-semibold text-zinc-900 md:text-3xl dark:text-zinc-100">
          Next.js-style filesystem routing for React Router 7
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Every{" "}
          <a
            href="#pick-a-feature"
            onClick={(event) => {
              const target = document.getElementById("pick-a-feature");
              if (!target) return;
              event.preventDefault();
              target.scrollIntoView({ behavior: "smooth", block: "start" });
              history.replaceState(null, "", "#pick-a-feature");
            }}
            className="font-medium text-zinc-900 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-900 dark:text-zinc-100 dark:decoration-zinc-500 dark:hover:decoration-zinc-100"
          >
            example
          </a>{" "}
          below is a real folder under{" "}
          <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-[13px] dark:bg-zinc-700">
            src/app/
          </code>
          . Open the folder next to each page to see how the convention maps to
          a URL.
        </p>
      </header>

      <Explain
        title="How the app is wired — without Vite"
        accent="neutral"
        tag="Webpack 5"
      >
        <p>
          Vite is an <em>optional</em> peer dependency. The runtime contract is
          just <code>buildRoutesFromModules(modules, appDir)</code> returning a{" "}
          <code>RouteObject[]</code> — any bundler that can resolve a static
          import tree will do. This demo runs on Webpack 5 and uses the
          package's <code className="font-mono">react-router-next gen</code>{" "}
          CLI: it walks <code>src/app/</code>, writes physical{" "}
          <code className="font-mono">.js</code> shims for every{" "}
          <code className="font-mono">virtual:react-router-next/…</code> module,
          and emits an <code className="font-mono">aliases.json</code> the
          bundler spreads into <code>resolve.alias</code>. The source then reads
          exactly like the Vite demo — same{" "}
          <code className="font-mono">import {"{ generate }"} from</code>{" "}
          <code className="font-mono">
            "virtual:react-router-next/posts/[postId]"
          </code>{" "}
          lines, no <code>require.context</code>:
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
          The webpack config rewrites{" "}
          <code className="font-mono">virtual:</code> requests into the codegen
          file paths via{" "}
          <code className="font-mono">NormalModuleReplacementPlugin</code> —
          webpack treats any <code>scheme:</code> prefix as a URI and would
          otherwise refuse it before <code>resolve.alias</code> can fire. The
          rest is unremarkable — swc-loader for TSX, PostCSS for Tailwind v4,{" "}
          <code>historyApiFallback</code> so deep links work in the dev server.
          No Vite plugin in sight:
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
    if (aliases[exactKey]) { resource.request = aliases[exactKey]; return; }
    if (req.startsWith(VIRTUAL_PREFIX + "/")) {
      resource.request = path.join(aliases[VIRTUAL_PREFIX], req.slice(VIRTUAL_PREFIX.length + 1));
    }
  },
);

module.exports = (_env, argv) => {
  const isDev = argv.mode !== "production";
  return {
    entry: "./src/main.tsx",
    output: { path: path.resolve(__dirname, "dist"), publicPath: "/" },
    resolve: { extensions: [".tsx", ".ts", ".jsx", ".js"] },
    module: {
      rules: [
        { test: /\\.[jt]sx?$/, use: "swc-loader", exclude: /node_modules/ },
        { test: /\\.css$/, use: ["style-loader", "css-loader", "postcss-loader"] },
      ],
    },
    plugins: [reactRouterNextVirtual, new HtmlWebpackPlugin({ template: "./index.html" })],
    devServer: { historyApiFallback: true, port: 8080 },
  };
};`}</CodeBlock>
        <p>
          Codegen runs before each build via <code>prebuild</code>; during dev,
          the CLI's <code className="font-mono">--watch</code> mode reruns it
          whenever a route file is added or removed (
          <code className="font-mono">chokidar</code> is an optional peer
          dependency the CLI loads on demand):
        </p>
        <CodeBlock filename="package.json">{`{
  "scripts": {
    "dev": "react-router-next gen --watch & webpack serve --mode development",
    "prebuild": "react-router-next gen",
    "build": "tsc -b && webpack --mode production",
    "gen": "react-router-next gen"
  }
}`}</CodeBlock>
        <p>
          Types come along for the ride —{" "}
          <code className="font-mono">react-router-next gen</code> also writes{" "}
          <code className="font-mono">routes.d.ts</code> next to the runtime
          shims, and <code className="font-mono">tsconfig.app.json</code>'s{" "}
          <code>include</code> picks it up. So{" "}
          <code className="font-mono">RouteProps</code> and{" "}
          <code className="font-mono">generate(params)</code> are fully typed
          per route, no <code>{`<"posts/[postId]">`}</code> generics anywhere.
          See{" "}
          <a
            href="/installation"
            className="font-medium text-zinc-900 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-900 dark:text-zinc-100 dark:decoration-zinc-500 dark:hover:decoration-zinc-100"
          >
            Installation
          </a>{" "}
          for the full walkthrough.
        </p>
      </Explain>

      <Explain
        title="Private folders for colocation"
        accent="neutral"
        tag="_private"
      >
        <p>
          A folder whose name starts with <code className="font-mono">_</code>{" "}
          is skipped by the router entirely — no URL, no route entry — but its
          files are still importable from sibling routes. Use it to colocate
          components, hooks, fixtures, or helpers right next to the routes that
          consume them, without leaking them into your URL space.
        </p>
        <p>
          This demo uses a few of them. Everything the chrome renders (sidebar,
          theme switcher, code blocks, the{" "}
          <code className="font-mono">Explain</code> card you're reading) lives
          under <code className="font-mono">src/app/_components/</code>; the{" "}
          <code>/posts</code> route keeps its suspense hook in{" "}
          <code className="font-mono">src/app/posts/_lib/</code>; and the
          dashboard's <code className="font-mono">@analytics</code> parallel
          slot has its own <code className="font-mono">_lib/</code> for the{" "}
          <code className="font-mono">use-stats</code> hook — private folders
          nest inside slots just fine:
        </p>
        <CodeBlock filename="src/app/">{`src/app/
├── _components/                  # shared UI for the demo (no route)
│   ├── explain.tsx
│   ├── sidebar.tsx
│   └── ...
├── page.tsx                      # imports from ./_components
├── layout.tsx
├── posts/
│   ├── _lib/                     # route-local helpers (no route)
│   │   └── use-posts.ts
│   └── [postId]/page.tsx         # imports from ../_lib
└── dashboard/
    └── @analytics/               # parallel slot
        ├── _lib/                 # slot-local helpers (no route)
        │   └── use-stats.ts
        └── page.tsx              # imports from ./_lib`}</CodeBlock>
        <p>
          The check is a simple prefix match, so{" "}
          <code className="font-mono">__tests__/</code> or any folder you rename
          to start with <code className="font-mono">_</code> drops out of the
          route tree too.
        </p>
      </Explain>

      <section className="space-y-3">
        <h2
          id="pick-a-feature"
          className="scroll-mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100"
        >
          Pick a feature to explore
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FeatureCard
            to="/basics"
            accent="neutral"
            pattern="layout.tsx + page.tsx"
            title="Layouts & nesting"
          >
            How parent layouts wrap children through <code>{"<Outlet/>"}</code>.
          </FeatureCard>
          <FeatureCard
            to="/about"
            accent="routing"
            pattern="(group)/"
            title="Route groups"
          >
            Folders in parens organize files without changing the URL.
          </FeatureCard>
          <FeatureCard
            to="/docs/getting-started"
            accent="routing"
            pattern="[...slug]"
            title="Catch-all segments"
          >
            Match any path under a segment and read it as a string array.
          </FeatureCard>
          <FeatureCard
            to="/search"
            accent="routing"
            pattern="[[...query]]"
            title="Optional catch-all"
          >
            One folder serves the bare segment <em>and</em> any depth below.
          </FeatureCard>
          <FeatureCard
            to="/transitions"
            accent="routing"
            pattern="template.tsx"
            title="Per-nav template"
          >
            Wraps children like <code>layout.tsx</code>, but remounts on every
            navigation — replays entry animations and per-visit effects.
          </FeatureCard>
          <FeatureCard
            to="/posts"
            accent="data"
            pattern="loading.tsx + use()"
            title="Suspense data + typed params"
          >
            Suspense-based loading, <code>error.tsx</code>, and{" "}
            <code>notFound()</code> all in one route tree.
          </FeatureCard>
          <FeatureCard
            to="/dashboard"
            accent="parallel"
            pattern="@slot/ + loading.tsx + error.tsx"
            title="Parallel routes"
          >
            Two route trees rendered as layout props alongside{" "}
            <code>{"<Outlet/>"}</code>, each with its own scoped boundaries.
          </FeatureCard>
          <FeatureCard
            to="/gallery"
            accent="intercept"
            pattern="(.)[id]"
            title="Intercept same level"
          >
            The canonical "soft nav opens a modal, refresh shows the full page"
            pattern with <code>(.)</code>.
          </FeatureCard>
          <FeatureCard
            to="/mail"
            accent="intercept"
            pattern="(..)[id]"
            title="Intercept one up"
          >
            Same idea, but the interceptor pops a filesystem level out of its{" "}
            <code>@slot/</code> before descending.
          </FeatureCard>
          <FeatureCard
            to="/projects"
            accent="intercept"
            pattern="(..)(..)[id]"
            title="Intercept two up"
          >
            Pops the slot <em>and</em> one real folder so a nested feed can
            intercept its parent's detail route.
          </FeatureCard>
          <FeatureCard
            to="/playground"
            accent="intercept"
            pattern="(...)x"
            title="Intercept from root"
          >
            Anchors at the app root regardless of nesting — overlays a
            root-level page from anywhere in the tree.
          </FeatureCard>
        </div>
      </section>
    </>
  );
}
