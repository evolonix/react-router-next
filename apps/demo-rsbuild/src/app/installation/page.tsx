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
          Installation — Rsbuild (no Vite)
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
          The package's Vite plugin is <em>optional</em> — the runtime only
          needs a <code>RouteModuleMap</code> and an <code>appDir</code> string.
          Any bundler that can eagerly enumerate a route folder works. This
          guide wires it up with{" "}
          <a
            href="https://rsbuild.rs"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-slate-900 underline decoration-slate-400 underline-offset-2 hover:decoration-slate-900 dark:text-slate-100 dark:decoration-slate-500 dark:hover:decoration-slate-100"
          >
            Rsbuild
          </a>
          's <code>require.context</code>.
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

      <Explain title="Configure Rsbuild" accent="neutral" tag="Step 2">
        <p>
          A minimal Rsbuild config with the React plugin. Tailwind v4 is wired
          through PostCSS, which Rsbuild auto-discovers from{" "}
          <code className="font-mono">postcss.config.cjs</code>:
        </p>
        <CodeBlock filename="rsbuild.config.ts">{`import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  source: { entry: { index: "./src/main.tsx" } },
  html: { template: "./index.html" },
});`}</CodeBlock>
        <CodeBlock filename="postcss.config.cjs">{`module.exports = {
  plugins: { "@tailwindcss/postcss": {} },
};`}</CodeBlock>
      </Explain>

      <Explain
        title="Build the route map and mount AppRouter"
        accent="neutral"
        tag="Step 3"
      >
        <p>
          Under Vite, you import{" "}
          <code className="font-mono">{"<AppRouter />"}</code> from{" "}
          <code className="font-mono">
            @evolonix/react-router-next/vite-client
          </code>{" "}
          and it reads its modules from the plugin's{" "}
          <code className="font-mono">virtual:react-router-next/app-tree</code>{" "}
          virtual module. Without that plugin we import the bundler-agnostic{" "}
          <code className="font-mono">{"<AppRouter />"}</code> from the package
          root and hand the modules in ourselves — Rspack ships webpack's{" "}
          <code>require.context</code>, which eagerly imports every file
          matching the same regex the Vite plugin uses:
        </p>
        <CodeBlock filename="src/main.tsx">{`/// <reference types="webpack-env" />
import {
  AppRouter,
  buildModulesFromContext,
} from "@evolonix/react-router-next";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// Rspack's require.context analyzer needs a regex *literal* at the call site
// (an imported identifier produces an empty context, which buildModulesFromContext
// will then throw on). The package's ROUTE_FILE_RE is the source of truth.
const APP_DIR = "/src/app";
const modules = buildModulesFromContext(
  require.context(
    "./app",
    true,
    /\\/(page|layout|loading|error|default|template|not-found)\\.(tsx|jsx|ts|js)$/,
  ),
  APP_DIR,
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter modules={modules} appDir={APP_DIR} />
  </StrictMode>,
);`}</CodeBlock>
        <p>
          The package exports <code className="font-mono">ROUTE_FILE_RE</code>{" "}
          and <code className="font-mono">buildModulesFromContext</code> so the
          file-name list and the key-rewrite stay in one place. The regex has to
          be inlined at the <code className="font-mono">require.context</code>{" "}
          call site though — Rspack/Webpack's analyzer is strict about that.
          Anything else that hands <code>{"<AppRouter />"}</code> the same map
          will work too; you could even build it by hand.
        </p>
      </Explain>

      <Explain
        title="(Optional) Typed virtual imports via the CLI"
        accent="neutral"
        tag="Step 4"
      >
        <p>
          Skip this step if you stick to the direct API — this demo does, and
          its routes type-check with no extra setup. The CLI matters only when
          you want the Vite-style{" "}
          <code className="font-mono">
            virtual:react-router-next/&lt;key&gt;
          </code>{" "}
          ergonomic (typed <code className="font-mono">generate(params)</code>{" "}
          per route): the bundled <code>react-router-next typegen</code> writes
          an ambient <code className="font-mono">routes.d.ts</code> shim into{" "}
          <code className="font-mono">node_modules/.react-router-next/</code>,
          identical to what the Vite plugin emits. Include it in your tsconfig
          and run the CLI before each build:
        </p>
        <CodeBlock filename="tsconfig.app.json" lang="json">{`{
  "include": ["src", "node_modules/.react-router-next/routes.d.ts"]
}`}</CodeBlock>
        <CodeBlock filename="package.json" lang="json">{`{
  "scripts": {
    "typegen": "react-router-next typegen",
    "typecheck": "react-router-next typegen && tsc -b",
    "build": "react-router-next typegen && tsc -b && rsbuild build"
  }
}`}</CodeBlock>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Types only — the runtime side of those virtual modules still needs a
          bundler resolver (the Vite plugin provides it for Vite users; for
          Rsbuild you'd add a small{" "}
          <code className="font-mono">NormalModuleReplacementPlugin</code>{" "}
          mirroring the plugin's <code>load()</code>). This demo skips both.
        </p>
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
          The CLI mirrors the Vite plugin's options. Defaults match what the
          plugin would use:
        </p>
        <CodeBlock filename="CLI" lang="sh">{`react-router-next typegen \\
  --app-dir=src/app \\
  --out-dir=node_modules/.react-router-next`}</CodeBlock>
      </Explain>
    </>
  );
}
