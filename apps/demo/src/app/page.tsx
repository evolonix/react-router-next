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
          Every example below is a real folder under{" "}
          <code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-[13px] dark:bg-slate-700">
            src/app/
          </code>
          . Open the folder next to each page to see how the convention maps to
          a URL.
        </p>
      </header>

      <Explain title="How the app is wired" accent="routing" tag="AppRouter">
        <p>
          <code>AppRouter</code> reads the route tree from the Vite plugin's
          virtual modules and mounts a React Router data router for you. The
          whole demo boots from this one file:
        </p>
        <CodeBlock filename="src/main.tsx">{`import { AppRouter } from "@evolonix/react-router-next";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);`}</CodeBlock>
        <p>
          The Vite plugin is the other half — it scans{" "}
          <code className="font-mono">src/app/</code>, exposes a virtual route
          tree, and writes typed shims so the editor knows every route's params:
        </p>
        <CodeBlock filename="vite.config.ts">{`import { routeTypegen } from "@evolonix/react-router-next/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [routeTypegen(), react(), tailwindcss()],
});`}</CodeBlock>
      </Explain>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Pick a feature to explore
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FeatureCard
            to="/basics"
            accent="routing"
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
            pattern="@slot/"
            title="Parallel routes"
          >
            A second route tree rendered as a layout prop alongside{" "}
            <code>{"<Outlet/>"}</code>.
          </FeatureCard>
          <FeatureCard
            to="/gallery"
            accent="intercept"
            pattern="(.)[id] + template.tsx"
            title="Intercepting routes"
          >
            The canonical "soft nav opens a modal, refresh shows the full page"
            pattern.
          </FeatureCard>
        </div>
      </section>
    </>
  );
}
