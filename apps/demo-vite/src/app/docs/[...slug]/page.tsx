import type { RouteProps } from "virtual:react-router-next/docs/[...slug]";

import { CodeBlock } from "../../_components/code-block";
import { Explain } from "../../_components/explain";

export default function DocsCatchAllPage({ params }: RouteProps) {
  return (
    <>
      <Explain title="[...slug] folder name" accent="routing">
        <p>
          The folder <code className="font-mono">[...slug]</code> matches{" "}
          <em>any</em> path under <code>/docs/…</code> and gives you the
          segments as a string array. Every link above hits this same file —
          only <code>params.slug</code> changes.
        </p>
        <CodeBlock filename="src/app/docs/[...slug]/page.tsx">{`import type { RouteProps } from "virtual:react-router-next/docs/[...slug]";

export default function DocsCatchAllPage({ params }: RouteProps) {
  // params.slug is string[]
  return <Breadcrumbs path={params.slug} />;
}`}</CodeBlock>
      </Explain>
      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
          params.slug
        </p>
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {params.slug.map((segment, i) => (
            <li key={`${segment}-${i}`} className="flex items-center gap-2">
              <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {segment}
              </span>
              {i < params.slug.length - 1 ? (
                <span className="text-slate-400 dark:text-slate-500">/</span>
              ) : null}
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
