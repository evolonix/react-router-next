import { Link } from "react-router";

import { CodeBlock } from "../../_components/code-block";
import { Explain } from "../../_components/explain";

const STOPS = [
  {
    title: "Step 1 — Pick a feature",
    body: "Every example in this demo is a real folder under src/app/. The sidebar mirrors that tree.",
  },
  {
    title: "Step 2 — Open the folder",
    body: "Next to each running example, peek at the folder layout to see the convention that drives the URL.",
  },
  {
    title: "Step 3 — Read the Explain block",
    body: "Each page ships its own short doc + code snippet, so the demo doubles as the reference.",
  },
];

export default function TourPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-wider text-accent-intercept">
          (overlay-host)/tour/page.tsx
        </p>
        <h1 className="text-xl font-semibold text-slate-900 md:text-2xl dark:text-slate-100">
          The tour (full-page)
        </h1>
      </header>

      <Explain title="Full-page (no intercept)" accent="intercept">
        <p>
          You're seeing the bare <code className="font-mono">/tour</code> page —
          either you refreshed, navigated via back/forward, or visited directly.
          The <code className="font-mono">@overlay</code> slot fell back to{" "}
          <code className="font-mono">default.tsx</code> and the main outlet
          rendered this page.
        </p>
        <CodeBlock filename="src/app/(overlay-host)/@overlay/(...)tour/page.tsx">{`// (...) anchors at the app root, regardless of how deep the
// interceptor folder is. Same routeKey as /tour, so this file
// shares the virtual module:
import type { RouteProps } from "virtual:react-router-next/tour";`}</CodeBlock>
        <p>
          Visit{" "}
          <Link
            to="/playground"
            className="font-medium text-accent-intercept hover:underline"
          >
            /playground
          </Link>{" "}
          and click "Open the tour" to see this content render as a dialog
          overlay instead.
        </p>
      </Explain>

      <ol className="space-y-3">
        {STOPS.map((stop) => (
          <li
            key={stop.title}
            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {stop.title}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {stop.body}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
