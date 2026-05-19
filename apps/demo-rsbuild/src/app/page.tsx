import { CodeBlock } from "./_components/code-block";
import { Explain } from "./_components/explain";
import { FeatureCard } from "./_components/feature-card";

export default function HomePage() {
  return (
    <>
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
          @evolonix/react-router-next
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl dark:text-slate-100">
          Next.js-style filesystem routing for React Router 7
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
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
            className="font-medium text-slate-900 underline decoration-slate-400 underline-offset-2 hover:decoration-slate-900 dark:text-slate-100 dark:decoration-slate-500 dark:hover:decoration-slate-100"
          >
            example
          </a>{" "}
          below is a real folder under{" "}
          <code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-[13px] dark:bg-slate-700">
            src/app/
          </code>
          . Open the folder next to each page to see how the convention maps to
          a URL.
        </p>
      </header>

      <Explain
        title="How the app is wired — without Vite"
        accent="neutral"
        tag="Rsbuild"
      >
        <p>
          Vite is an <em>optional</em> peer dependency. The runtime contract is
          just <code>buildRoutesFromModules(modules, appDir)</code> returning a{" "}
          <code>RouteObject[]</code>, so any bundler that can eagerly enumerate
          your route folder will do. This demo runs on Rsbuild — Rspack supports
          webpack's <code>require.context</code>, which produces the same map
          Vite builds via <code>import.meta.glob</code>:
        </p>
        <CodeBlock filename="src/main.tsx">{`/// <reference types="webpack-env" />
import {
  AppRouter,
  buildModulesFromContext,
} from "@evolonix/react-router-next";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// Inlined regex literal: webpack/Rspack's require.context analyzer needs the
// regex statically at the call site. The package's ROUTE_FILE_RE is the
// source of truth — keep this in sync.
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
          The Rsbuild config is otherwise unremarkable — React plugin, PostCSS
          for Tailwind v4. No Vite plugin in sight:
        </p>
        <CodeBlock filename="rsbuild.config.ts">{`import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  source: { entry: { index: "./src/main.tsx" } },
  html: { template: "./index.html" },
});`}</CodeBlock>
        <p>
          Types are free — <code className="font-mono">RouteProps</code>,{" "}
          <code className="font-mono">useRouteParams</code>, and{" "}
          <code className="font-mono">generateUrl</code> are all parameterized
          on the route-key literal, so the editor infers{" "}
          <code className="font-mono">params</code> off
          <code className="font-mono"> "posts/[postId]"</code> with no codegen.
          The CLI shim is still there if you want the
          <code className="font-mono">
            {" "}
            virtual:react-router-next/&lt;key&gt;
          </code>{" "}
          ergonomic (see{" "}
          <a
            href="/installation"
            className="font-medium text-slate-900 underline decoration-slate-400 underline-offset-2 hover:decoration-slate-900 dark:text-slate-100 dark:decoration-slate-500 dark:hover:decoration-slate-100"
          >
            Installation
          </a>
          ) — this demo doesn't need it.
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
          className="scroll-mt-6 text-lg font-semibold text-slate-900 dark:text-slate-100"
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
