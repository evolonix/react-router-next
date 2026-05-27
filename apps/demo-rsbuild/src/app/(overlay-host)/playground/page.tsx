import { Link } from "react-router";

import { CodeBlock } from "../../_components/code-block";
import { Explain } from "../../_components/explain";

export default function PlaygroundPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-accent-intercept font-mono text-[11px] tracking-wider uppercase">
          (overlay-host)/ + @overlay/(...)tour
        </p>
        <h1 className="text-xl font-semibold text-zinc-900 md:text-2xl dark:text-zinc-100">
          Intercept from the app root
        </h1>
      </header>

      <Explain
        title="(...)x anchors at the app root"
        accent="intercept"
        tag="(...)x"
      >
        <p>
          The folder{" "}
          <code className="font-mono">(overlay-host)/@overlay/(...)tour</code>{" "}
          doesn't care how deep it sits. The{" "}
          <code className="font-mono">(...)</code> prefix discards the
          interceptor's filesystem path entirely and anchors the target route
          key at the app root.
        </p>
        <CodeBlock filename="src/app/">{`(overlay-host)/                       # URL-transparent group
├── layout.tsx                       # ({ overlay }) => <><Outlet />{overlay}</>
├── tour/page.tsx                    # /tour — full-page target
├── playground/page.tsx              # /playground (this page)
└── @overlay/
    ├── default.tsx                  # null fallback
    └── (...)tour/page.tsx           # intercepts /tour while overlay-host is mounted`}</CodeBlock>
        <p>
          The slot lives on a URL-transparent group layout that wraps both{" "}
          <code className="font-mono">/playground</code> and{" "}
          <code className="font-mono">/tour</code>, so the slot stays mounted
          across the soft nav. Refresh on{" "}
          <code className="font-mono">/tour</code> or visit it from any page
          outside this group and the bare page renders instead.
        </p>
      </Explain>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          to="/tour"
          className="bg-accent-intercept rounded-md px-3 py-1.5 font-medium text-white shadow-sm transition hover:brightness-110"
        >
          Open the tour →
        </Link>
        <Link
          to="/"
          className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          Back to home
        </Link>
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        Try refreshing while the overlay is open — the slot's{" "}
        <code className="font-mono">default.tsx</code> takes over and the URL
        renders as a regular page.
      </p>
    </div>
  );
}
