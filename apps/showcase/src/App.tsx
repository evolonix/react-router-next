import type { JSX, ReactNode } from "react";
import { Footer } from "./components/footer";
import { Header } from "./components/header";

const BASE = import.meta.env.BASE_URL;
const GITHUB_URL = "https://github.com/evolonix/react-router-next";

export function App(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-700 focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-brand-500"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <Hero />
        <div className="mx-auto max-w-6xl space-y-20 px-4 pb-20 sm:px-6">
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
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-24 sm:px-6 sm:py-32">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white">
          @evolonix/react-router-next
        </p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Next.js-style filesystem routing for React Router 7
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-white sm:text-lg">
          Drop a <code className="font-mono">page.tsx</code> into a folder, get
          a typed route — including nested layouts, parallel routes (
          <code className="font-mono">@slot</code>), intercepting routes (
          <code className="font-mono">(.)</code> /{" "}
          <code className="font-mono">(..)</code> /{" "}
          <code className="font-mono">(...)</code>),{" "}
          <code className="font-mono">template.tsx</code> remount-on-navigation,
          and <code className="font-mono">_private</code> colocation folders.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={`${BASE}vite/`}
            className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-800 shadow-lg ring-1 ring-white/20 transition hover:bg-zinc-50"
          >
            Open the Vite demo →
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full bg-white/20 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/60 transition hover:bg-white/30"
          >
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
          <Code>{`npm i @evolonix/react-router-next react-router`}</Code>
        </Step>
        <Step n={2} title="Add the Vite plugin">
          <Code
            lang="ts"
            filename="vite.config.ts"
          >{`import { routeTypegen } from "@evolonix/react-router-next/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [routeTypegen(), react()],
});`}</Code>
        </Step>
        <Step n={3} title="Mount the router and drop pages into src/app/">
          <Code
            lang="tsx"
            filename="src/main.tsx"
          >{`import { AppRouter } from "@evolonix/react-router-next/vite-client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);`}</Code>
          <Code filename="src/app/">{`src/app/
├── layout.tsx              # wraps everything below
├── page.tsx                # /
└── about/
    └── page.tsx            # /about`}</Code>
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
          recommended
        >
          The reference experience: the package's Vite plugin handles route
          discovery, virtual modules, and types automatically — no glue code.
        </DemoCard>
        <DemoCard
          href={`${BASE}rsbuild/`}
          name="Rsbuild"
          tagline="Rspack-based"
        >
          Webpack-compatible Rust bundler from ByteDance. The same routes load
          via <code className="font-mono">require.context</code>, fed to{" "}
          <code className="font-mono">{"<AppRouter />"}</code> as a prop.
        </DemoCard>
        <DemoCard
          href={`${BASE}webpack/`}
          name="Webpack 5"
          tagline="Codegen path"
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
        <Feature pattern="page.tsx" label="Leaf route" accent="routing">
          A folder becomes a route as soon as it contains a{" "}
          <code className="font-mono">page.tsx</code>.
        </Feature>
        <Feature pattern="layout.tsx" label="Nested layouts" accent="routing">
          Wraps children via <code>{"<Outlet/>"}</code>. Layouts compose down
          the folder tree.
        </Feature>
        <Feature
          pattern="[id] / [...slug]"
          label="Typed params"
          accent="routing"
        >
          The folder name is the param shape — TypeScript reads it off the
          route-key literal.
        </Feature>
        <Feature pattern="(group)/" label="Route groups" accent="routing">
          Parens organize files without contributing a URL segment.
        </Feature>
        <Feature
          pattern="loading.tsx + use()"
          label="Suspense data"
          accent="data"
        >
          Pair a <code className="font-mono">loading.tsx</code> with{" "}
          <code>use()</code> on a cached promise — works with any data layer.
        </Feature>
        <Feature
          pattern="@slot/ + default.tsx"
          label="Parallel routes"
          accent="parallel"
        >
          Two route trees rendered as layout props alongside{" "}
          <code>{"<Outlet/>"}</code>, each with its own boundaries.
        </Feature>
        <Feature
          pattern="(.) / (..) / (...)"
          label="Intercepting routes"
          accent="intercept"
        >
          The "soft-nav opens a modal, refresh shows the full page" pattern — at
          any depth in the tree.
        </Feature>
        <Feature
          pattern="template.tsx"
          label="Per-nav templates"
          accent="routing"
        >
          Like <code>layout.tsx</code> but remounts on every navigation —
          replays entry animations and per-visit effects.
        </Feature>
        <Feature
          pattern="error.tsx + notFound()"
          label="Boundaries"
          accent="error"
        >
          Scoped error boundaries and a <code>notFound()</code> helper that
          skips to the nearest <code className="font-mono">not-found.tsx</code>.
        </Feature>
        <Feature pattern="_private/" label="Colocation" accent="routing">
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
      <p className="text-brand-800 dark:text-brand-300 text-xs font-semibold uppercase tracking-[0.18em]">
        {eyebrow}
      </p>
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
    <li className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="space-y-3 p-6">
        <header className="flex items-center gap-2">
          <span className="bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-200 inline-flex h-6 min-w-6 items-center justify-center whitespace-nowrap rounded-full px-2 text-xs font-semibold">
            {n}
          </span>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
        </header>
        <div className="space-y-3">{children}</div>
      </div>
    </li>
  );
}

function Code({
  children,
  filename,
  lang = "sh",
}: {
  children: string;
  filename?: string;
  lang?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      {filename ? (
        <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-700 dark:border-zinc-800 dark:text-zinc-400">
          <span>{filename}</span>
          <span className="opacity-70">{lang}</span>
        </div>
      ) : null}
      <pre className="overflow-x-auto px-3 py-2 text-[13px] leading-relaxed text-zinc-800 dark:text-zinc-200">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function DemoCard({
  href,
  name,
  tagline,
  children,
  recommended,
}: {
  href: string;
  name: string;
  tagline: string;
  children: ReactNode;
  recommended?: boolean;
}) {
  return (
    <a
      href={href}
      className={`group flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-zinc-900 ${
        recommended
          ? "border-brand-300 ring-2 ring-brand-200 dark:border-brand-700 dark:ring-brand-900/60"
          : "border-zinc-200 dark:border-zinc-800"
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {name}
        </h3>
        <span
          className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ${
            recommended
              ? "bg-brand-800 text-white ring-brand-700 dark:bg-brand-700 dark:ring-brand-400"
              : "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
          }`}
        >
          {tagline}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {children}
      </p>
      <span className="group-hover:text-brand-700 dark:group-hover:text-brand-300 mt-4 text-sm font-medium text-zinc-900 transition-colors dark:text-zinc-100">
        Open →
      </span>
    </a>
  );
}

const ACCENT_BAR: Record<string, string> = {
  routing: "bg-accent-routing",
  data: "bg-accent-data",
  error: "bg-accent-error",
  parallel: "bg-accent-parallel",
  intercept: "bg-accent-intercept",
};

function Feature({
  pattern,
  label,
  accent,
  children,
}: {
  pattern: string;
  label: string;
  accent: "routing" | "data" | "error" | "parallel" | "intercept";
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className={`h-1 ${ACCENT_BAR[accent]}`} />
      <div className="space-y-1 p-4">
        <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
          {pattern}
        </p>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {label}
        </h3>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {children}
        </p>
      </div>
    </div>
  );
}

function Bullet({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {children}
      </p>
    </li>
  );
}
