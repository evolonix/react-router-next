import type { RouteProps } from "virtual:react-router-next/search/[[...query]]";

import { CodeBlock } from "../../_components/code-block";
import { Explain } from "../../_components/explain";

export default function SearchPage({ params }: RouteProps) {
  const terms = params.query ?? [];
  return (
    <>
      <Explain title="[[...query]] — optional catch-all" accent="routing">
        <p>
          A double-bracket folder matches the bare segment <em>and</em> any
          depth below it. <code>params.query</code> is{" "}
          <code>{"string[] | undefined"}</code> — <code>undefined</code> at{" "}
          <code>/search</code>, an array at <code>/search/...</code>.
        </p>
        <CodeBlock filename="src/app/search/[[...query]]/page.tsx">{`import type { RouteProps } from "virtual:react-router-next/search/[[...query]]";

export default function SearchPage({ params }: RouteProps) {
  const terms = params.query ?? [];
  return terms.length === 0 ? <Empty /> : <Results terms={terms} />;
}`}</CodeBlock>
      </Explain>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {terms.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <code className="font-mono">params.query</code> is{" "}
            <code className="font-mono">undefined</code>. Click a sample above
            to see the array populate.
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Searched for {terms.length} term{terms.length === 1 ? "" : "s"}:
            </p>
            <div className="flex flex-wrap gap-2">
              {terms.map((term, i) => (
                <span
                  key={`${term}-${i}`}
                  className="bg-accent-routing/10 text-accent-routing rounded-full px-3 py-1 font-mono text-xs whitespace-nowrap"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
