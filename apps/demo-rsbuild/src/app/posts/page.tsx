import { generate, useSearchParams } from "@evolonix/react-router-next";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { Link } from "react-router";

import { CodeBlock } from "../_components/code-block";
import { Explain } from "../_components/explain";
import { usePosts } from "./_lib/use-posts";

export type PostsSearch = { q: string; sort: "newest" | "oldest" };

/**
 * A route declares its query string by exporting `searchSchema` — any Standard
 * Schema works (Zod, Valibot, ArkType…). This demo uses a tiny hand-rolled one
 * to show the runtime only depends on the spec, not a particular validator.
 */
export const searchSchema: StandardSchemaV1<unknown, PostsSearch> = {
  "~standard": {
    version: 1,
    vendor: "demo",
    validate(value) {
      const v = (value ?? {}) as Record<string, unknown>;
      return {
        value: {
          q: typeof v.q === "string" ? v.q : "",
          sort: v.sort === "oldest" ? "oldest" : "newest",
        },
      };
    },
  },
};

export default function PostsPage() {
  const posts = usePosts();
  // No codegen here, so no typed `searchParams` page prop — but the package-level
  // hook still gives typed, validated access: pass the route key + the schema.
  const [{ q, sort }, setSearch] = useSearchParams("posts", searchSchema);

  const visible = posts
    .filter((post) => post.title.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) =>
      sort === "newest" ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id),
    );

  return (
    <>
      <Explain title="loading.tsx fires for Suspense" accent="data">
        <p>
          This list comes from <code className="font-mono">usePosts()</code>,
          which calls React's <code>use()</code> on a cached promise. While that
          promise is pending the framework renders{" "}
          <code className="font-mono">posts/loading.tsx</code>. No data router
          loaders involved.
        </p>
        <CodeBlock filename="src/app/posts/_lib/use-posts.ts">{`import { use } from "react";

const promise = sleep(600).then(() => POSTS);
export function usePosts() {
  return use(promise);
}`}</CodeBlock>
      </Explain>

      <Explain title="Typed Link with generate()" accent="data">
        <p>
          Without the Vite plugin's <code>generate()</code> shim, the
          <code> Link</code>s below call{" "}
          <code className="font-mono">generate(routeKey, params)</code> from the
          package directly. TypeScript reads the params shape off the route-key
          literal — pass a bad <code>postId</code> and the editor complains:
        </p>
        <CodeBlock filename="src/app/posts/page.tsx">{`import { generate } from "@evolonix/react-router-next";

<Link to={generate("posts/[postId]", { postId: "1" })}>First post</Link>`}</CodeBlock>
      </Explain>

      <Explain
        title="Typed search params, same package-level API"
        accent="data"
      >
        <p>
          Export a <code className="font-mono">searchParams</code> schema (any{" "}
          <a
            href="https://standardschema.dev"
            className="font-medium hover:underline"
          >
            Standard Schema
          </a>
          ) and the query string gets the same treatment as params:{" "}
          <code className="font-mono">useSearchParams(routeKey, schema)</code>{" "}
          returns a typed value, and{" "}
          <code className="font-mono">
            generate(routeKey, params, &#123; search &#125;)
          </code>{" "}
          validates and serializes it.
        </p>
        <CodeBlock filename="src/app/posts/page.tsx">{`import { generate, useSearchParams } from "@evolonix/react-router-next";

export const searchSchema = z.object({
  q: z.string().default(""),
  sort: z.enum(["newest", "oldest"]).default("newest"),
});

const [{ q, sort }, setSearch] = useSearchParams("posts", searchSchema);
<Link to={generate("posts", {}, { search: { q, sort: "oldest" } })}>Oldest</Link>`}</CodeBlock>
      </Explain>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={q}
          placeholder="Filter posts…"
          onChange={(e) =>
            setSearch(
              { q: e.target.value, sort },
              { replace: true, preventScrollReset: true },
            )
          }
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <div className="flex gap-2 text-sm">
          {(["newest", "oldest"] as const).map((option) => (
            <Link
              key={option}
              to={generate("posts", {}, { search: { q, sort: option } })}
              preventScrollReset
              className={`rounded-lg border px-3 py-2 font-medium transition ${
                sort === option
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {option === "newest" ? "Newest" : "Oldest"}
            </Link>
          ))}
        </div>
      </div>

      <ul className="space-y-3">
        {visible.map((post) => (
          <li
            key={post.id}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <Link
              to={generate("posts/[postId]", { postId: post.id })}
              className="block"
            >
              <p className="font-mono text-[11px] tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                /posts/{post.id}
              </p>
              <h3 className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {post.title}
              </h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {post.excerpt}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <Explain title="Things to try" accent="error">
        <p>
          <Link
            to={generate(
              "posts",
              {},
              { search: { q: "typed", sort: "newest" } },
            )}
            className="font-medium hover:underline"
          >
            /posts?q=typed
          </Link>{" "}
          — a typed <code className="font-mono">generate()</code> URL; the
          filter input and sort toggle stay in sync with the query string.
        </p>
        <p>
          <Link
            to="/posts/999"
            className="text-accent-error font-medium hover:underline"
          >
            /posts/999
          </Link>{" "}
          — calls <code className="font-mono">notFound()</code> and renders{" "}
          <code className="font-mono">posts/not-found.tsx</code>.
        </p>
        <p>
          <Link
            to="/posts/1?fail=1"
            className="text-accent-error font-medium hover:underline"
          >
            /posts/1?fail=1
          </Link>{" "}
          — throws during render and lands on{" "}
          <code className="font-mono">posts/[postId]/error.tsx</code>.
        </p>
      </Explain>
    </>
  );
}
