import { Dialog } from "../../../gallery/_components/dialog";

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

export default function PlaygroundTourOverlay() {
  return (
    <Dialog title="The tour">
      <ol className="space-y-3">
        {STOPS.map((stop) => (
          <li
            key={stop.title}
            className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-700"
          >
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {stop.title}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {stop.body}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Rendered by{" "}
        <code className="font-mono">
          (overlay-host)/@overlay/(...)tour/page.tsx
        </code>
        . Refresh this URL to see the full-page version.
      </p>
    </Dialog>
  );
}
