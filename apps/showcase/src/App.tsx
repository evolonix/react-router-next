import type { JSX, ReactNode } from "react";
import { Card } from "./components/card";
import { CodeBlock } from "./components/code-block";
import { Eyebrow } from "./components/eyebrow";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { GitHubIcon } from "./components/icons";

const BASE = import.meta.env.BASE_URL;
const GITHUB_URL = "https://github.com/evolonix/react-router-next";

export function App(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="focus:bg-brand-700 focus:outline-brand-500 sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-2 focus:outline-offset-2"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <Hero />
        <div className="px-safe-lg mx-auto max-w-6xl space-y-20 pb-20">
          <Quickstart />
          <Demos />
          <Features />
          <WhyVite />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="from-brand-600 to-brand-800 relative isolate overflow-hidden bg-linear-to-br via-fuchsia-700 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-white/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-black/10 blur-3xl"
      />
      <div className="px-safe-lg relative mx-auto max-w-6xl py-24 sm:py-32">
        <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-white uppercase">
          @evolonix/react-router-next
        </p>
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
          Next.js-style filesystem routing for React Router 7
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white sm:text-xl">
          Drop a <code className="font-mono">page.tsx</code> into a folder, get
          a typed route — including nested layouts, parallel routes (
          <code className="font-mono">@slot</code>), intercepting routes (
          <code className="font-mono">(.)</code> /{" "}
          <code className="font-mono">(..)</code> /{" "}
          <code className="font-mono">(...)</code>),{" "}
          <code className="font-mono">template.tsx</code> remount-on-navigation,
          and <code className="font-mono">_private</code> colocation folders.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={`${BASE}vite/`}
            className="group text-brand-700 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-zinc-100"
          >
            Open the Vite demo
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 ring-inset hover:bg-white/20"
          >
            <GitHubIcon className="h-4 w-4" />
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

function Quickstart() {
  return (
    <section id="quickstart" className="space-y-6 pt-16">
      <SectionHeader
        eyebrow="The recommended path"
        title="Vite quickstart"
        description={
          <>
            Three files, no configuration beyond the plugin. The plugin scans{" "}
            <code className="font-mono">src/app/</code>, exposes a virtual route
            tree, and writes typed shims for every route's params.
          </>
        }
      />
      <ol className="space-y-6">
        <Step n={1} title="Install">
          <CodeBlock
            lang="text"
            code={`npm i @evolonix/react-router-next react-router`}
          />
        </Step>
        <Step n={2} title="Add the Vite plugin">
          <CodeBlock
            lang="tsx"
            filename="vite.config.ts"
            code={`import { routeTypegen } from "@evolonix/react-router-next/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [routeTypegen(), react()],
});`}
          />
        </Step>
        <Step n={3} title="Mount the router and drop pages into src/app/">
          <CodeBlock
            lang="tsx"
            filename="src/main.tsx"
            code={`import { AppRouter } from "@evolonix/react-router-next/vite-client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);`}
          />
          <CodeBlock
            lang="text"
            filename="src/app/"
            code={`src/app/
├── layout.tsx              # wraps everything below
├── page.tsx                # /
└── about/
    └── page.tsx            # /about`}
          />
        </Step>
      </ol>
    </section>
  );
}

function Demos() {
  return (
    <section id="demos" className="space-y-6">
      <SectionHeader
        eyebrow="Try the demos"
        title="Same routes, three bundlers"
        description={
          <>
            Vite is the first-class path, but the runtime is bundler-agnostic.
            Each demo is the same route tree compiled by a different toolchain —
            proof that the package's Vite plugin is <em>optional</em>, not
            required.
          </>
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DemoCard
          href={`${BASE}vite/`}
          name="Vite"
          tagline="Recommended"
          tone="from-brand-500 to-fuchsia-500"
          recommended
        >
          The reference experience: the package's Vite plugin handles route
          discovery, virtual modules, and types automatically — no glue code.
        </DemoCard>
        <DemoCard
          href={`${BASE}rsbuild/`}
          name="Rsbuild"
          tagline="Rspack-based"
          tone="from-fuchsia-500 to-accent-500"
        >
          Webpack-compatible Rust bundler from ByteDance. The same routes load
          via <code className="font-mono">require.context</code>, fed to{" "}
          <code className="font-mono">{"<AppRouter />"}</code> as a prop.
        </DemoCard>
        <DemoCard
          href={`${BASE}webpack/`}
          name="Webpack 5"
          tagline="Codegen path"
          tone="from-accent-500 to-brand-500"
        >
          The classic bundler, with the package's{" "}
          <code className="font-mono">react-router-next gen</code> CLI doing
          what the Vite plugin does in memory: it writes physical{" "}
          <code className="font-mono">.js</code> shims for every{" "}
          <code className="font-mono">virtual:react-router-next/…</code> module,
          so source-level parity with the Vite demo —{" "}
          <code className="font-mono">
            import {"{ generate }"} from "virtual:…"
          </code>{" "}
          and all — works under webpack too.
        </DemoCard>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="space-y-6">
      <SectionHeader
        eyebrow="What you get"
        title="Every convention is opt-in"
        description={
          <>
            Add a file when you need it. Each pattern below is wired up and
            clickable in any of the demos above.
          </>
        }
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Feature
          pattern="page.tsx"
          label="Leaf route"
          tone="from-zinc-400 to-zinc-300"
        >
          A folder becomes a route as soon as it contains a{" "}
          <code className="font-mono">page.tsx</code>.
        </Feature>
        <Feature
          pattern="layout.tsx"
          label="Nested layouts"
          tone="from-zinc-400 to-zinc-300"
        >
          Wraps children via <code>{"<Outlet/>"}</code>. Layouts compose down
          the folder tree.
        </Feature>
        <Feature
          pattern="[id] / [...slug]"
          label="Typed params"
          tone="from-blue-500 to-sky-400"
        >
          The folder name is the param shape — TypeScript reads it off the
          route-key literal.
        </Feature>
        <Feature
          pattern="(group)/"
          label="Route groups"
          tone="from-blue-500 to-sky-400"
        >
          Parens organize files without contributing a URL segment.
        </Feature>
        <Feature
          pattern="loading.tsx + use()"
          label="Suspense data"
          tone="from-emerald-500 to-green-400"
        >
          Pair a <code className="font-mono">loading.tsx</code> with{" "}
          <code>use()</code> on a cached promise — works with any data layer.
        </Feature>
        <Feature
          pattern="@slot/ + default.tsx"
          label="Parallel routes"
          tone="from-fuchsia-500 to-pink-400"
        >
          Two route trees rendered as layout props alongside{" "}
          <code>{"<Outlet/>"}</code>, each with its own boundaries.
        </Feature>
        <Feature
          pattern="(.) / (..) / (...)"
          label="Intercepting routes"
          tone="from-amber-500 to-orange-400"
        >
          The "soft-nav opens a modal, refresh shows the full page" pattern — at
          any depth in the tree.
        </Feature>
        <Feature
          pattern="template.tsx"
          label="Per-nav templates"
          tone="from-blue-500 to-sky-400"
        >
          Like <code>layout.tsx</code> but remounts on every navigation —
          replays entry animations and per-visit effects.
        </Feature>
        <Feature
          pattern="error.tsx + notFound()"
          label="Boundaries"
          tone="from-rose-500 to-rose-400"
        >
          Scoped error boundaries and a <code>notFound()</code> helper that
          skips to the nearest <code className="font-mono">not-found.tsx</code>.
        </Feature>
        <Feature
          pattern="_private/"
          label="Colocation"
          tone="from-blue-500 to-sky-400"
        >
          Folders that start with <code className="font-mono">_</code> are
          skipped by routing but importable from siblings.
        </Feature>
      </div>
    </section>
  );
}

function WhyVite() {
  return (
    <section className="space-y-4">
      <SectionHeader
        eyebrow="Why Vite is the recommended path"
        title="The plugin earns its keep"
      />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Bullet title="Automatic route discovery">
          The plugin watches <code className="font-mono">src/app/</code> and
          regenerates virtual modules + types on every change. No{" "}
          <code className="font-mono">require.context</code> or props to wire.
        </Bullet>
        <Bullet title="Typed per-route helpers">
          Every route folder gets a{" "}
          <code className="font-mono">
            virtual:react-router-next/&lt;key&gt;
          </code>{" "}
          module exposing typed{" "}
          <code className="font-mono">generate(params)</code> and{" "}
          <code className="font-mono">useRouteParams()</code>.
        </Bullet>
        <Bullet title="HMR for free">
          Edit a layout, see it update without losing route state — Vite's HMR
          flows through the package's virtual modules.
        </Bullet>
        <Bullet title="Same runtime everywhere">
          The Rsbuild and Webpack demos share the exact same runtime — the
          plugin is just developer ergonomics. Switching bundlers later is a
          config change, not a rewrite.
        </Bullet>
      </ul>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}) {
  return (
    <header className="space-y-2">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      ) : null}
    </header>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <li>
      <Card className="space-y-3">
        <header className="flex items-center gap-2">
          <span className="bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-200 inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-semibold whitespace-nowrap">
            {n}
          </span>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
        </header>
        <div className="space-y-3">{children}</div>
      </Card>
    </li>
  );
}

function DemoCard({
  href,
  name,
  tagline,
  tone,
  children,
  recommended,
}: {
  href: string;
  name: string;
  tagline: string;
  tone: string;
  children: ReactNode;
  recommended?: boolean;
}) {
  return (
    <Card href={href} interactive accent={tone}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {name}
        </h3>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider whitespace-nowrap uppercase ring-1 ring-inset ${
            recommended
              ? "bg-brand-800 ring-brand-700 dark:bg-brand-700 dark:ring-brand-400 text-white"
              : "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
          }`}
        >
          {tagline}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {children}
      </p>
      <span className="text-brand-700 dark:text-brand-300 mt-4 inline-flex items-center gap-1 text-sm font-medium transition-all group-hover:gap-2">
        Open
        <span aria-hidden>→</span>
      </span>
    </Card>
  );
}

function Feature({
  pattern,
  label,
  tone,
  children,
}: {
  pattern: string;
  label: string;
  /** Tailwind gradient classes for the accent strip, e.g. "from-emerald-500 to-green-400". */
  tone: string;
  children: ReactNode;
}) {
  return (
    <Card accent={tone} className="space-y-1">
      <p className="font-mono text-[11px] tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
        {pattern}
      </p>
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {label}
      </h3>
      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {children}
      </p>
    </Card>
  );
}

function Bullet({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className="grid">
      <Card className="h-full">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {children}
        </p>
      </Card>
    </li>
  );
}
