import { CodeBlock } from "../_components/code-block";
import { Explain } from "../_components/explain";

export default function InstallationPage() {
  return (
    <>
      <header className="space-y-3">
        <p className="font-mono text-xs tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
          @evolonix/react-router-next
        </p>
        <h1 className="text-2xl font-semibold text-zinc-900 md:text-3xl dark:text-zinc-100">
          Installation
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          A Vite plugin plus a tiny runtime. Install the package, register the
          plugin, mount{" "}
          <code className="whitespace-nowrap">{"<AppRouter />"}</code>, and drop
          pages into{" "}
          <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-[13px] dark:bg-zinc-700">
            src/app/
          </code>
          .
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
            if you use the Vite plugin)
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

      <Explain title="Add the Vite plugin" accent="neutral" tag="Step 2">
        <p>
          The plugin scans <code className="font-mono">src/app/</code>, exposes
          a virtual route tree, and writes typed shims so the editor knows every
          route's params:
        </p>
        <CodeBlock filename="vite.config.ts">{`import { routeTypegen } from "@evolonix/react-router-next/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [routeTypegen(), react()],
});`}</CodeBlock>
      </Explain>

      <Explain title="Mount the router" accent="neutral" tag="Step 3">
        <p>
          <code>AppRouter</code> reads the route tree from the plugin's virtual
          modules and mounts a React Router data router for you:
        </p>
        <CodeBlock filename="src/main.tsx">{`import { AppRouter } from "@evolonix/react-router-next/vite-client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);`}</CodeBlock>
      </Explain>

      <Explain
        title="Wire up types for the editor and tsc"
        accent="neutral"
        tag="Step 4"
      >
        <p>
          The plugin (and the bundled CLI) emit a single ambient{" "}
          <code className="font-mono">routes.d.ts</code> shim into{" "}
          <code className="font-mono">node_modules/.react-router-next/</code>.
          Include it in your tsconfig so <code>tsc</code> and editors resolve
          the virtual{" "}
          <code className="font-mono">virtual:react-router-next/*</code> imports
          — even when Vite isn't running:
        </p>
        <CodeBlock filename="tsconfig.app.json" lang="json">{`{
  "include": ["src", "node_modules/.react-router-next/routes.d.ts"]
}`}</CodeBlock>
        <p>
          In CI, run typegen before <code>tsc</code> so the shim exists before
          type-checking:
        </p>
        <CodeBlock filename="package.json" lang="json">{`{
  "scripts": {
    "typegen": "react-router-next typegen",
    "prebuild": "npm run typegen",
    "build": "tsc -b && vite build"
  }
}`}</CodeBlock>
      </Explain>

      <Explain title="Drop pages into src/app/" accent="neutral" tag="Step 5">
        <p>
          A folder becomes a route when it contains a{" "}
          <code className="font-mono">page.tsx</code>. Layouts, loading and
          error boundaries, parallel slots, and interceptors are all opt-in —
          add the file when you need it.
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
            className="font-medium text-zinc-900 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-900 dark:text-zinc-100 dark:decoration-zinc-500 dark:hover:decoration-zinc-100"
          >
            Basics
          </a>{" "}
          for layouts and nesting, or browse the sidebar for the rest of the
          conventions.
        </p>
      </Explain>

      <Explain title="Plugin options" accent="neutral" tag="Reference">
        <p>The plugin and CLI accept the same options:</p>
        <CodeBlock filename="vite.config.ts">{`routeTypegen({
  appDir: "src/app",                         // default
  outDir: "node_modules/.react-router-next", // default
});`}</CodeBlock>
        <CodeBlock filename="CLI" lang="sh">{`react-router-next typegen \\
  --app-dir=src/app \\
  --out-dir=node_modules/.react-router-next`}</CodeBlock>
      </Explain>
    </>
  );
}
