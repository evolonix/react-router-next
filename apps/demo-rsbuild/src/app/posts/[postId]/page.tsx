import { notFound, type RouteProps } from "@evolonix/react-router-next";
import { Link, useSearchParams } from "react-router";

import { CodeBlock } from "../../_components/code-block";
import { Explain } from "../../_components/explain";
import { usePost } from "../_lib/use-posts";

export default function PostPage({ params }: RouteProps<"posts/[postId]">) {
  const [searchParams] = useSearchParams();
  if (searchParams.get("fail") === "1") {
    throw new Error(`Boom — failed to render post ${params.postId}.`);
  }

  const post = usePost(params.postId);
  if (!post) notFound();

  return (
    <>
      <Explain
        title="Typed RouteProps from a route-key literal"
        accent="data"
        tag="RouteProps"
      >
        <p>
          This component receives <code>params</code> as a typed prop.
          <code className="font-mono">
            {" "}
            RouteProps&lt;"posts/[postId]"&gt;
          </code>{" "}
          comes from the package itself — TypeScript parses the folder name in
          the route-key literal and infers <code>{"{ postId: string }"}</code>,
          no virtual module needed.
        </p>
        <CodeBlock filename="src/app/posts/[postId]/page.tsx">{`import { type RouteProps } from "@evolonix/react-router-next";

export default function PostPage({ params }: RouteProps<"posts/[postId]">) {
  return <h1>Post {params.postId}</h1>;
}`}</CodeBlock>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Prefer a hook? The package also re-exports{" "}
          <code className="font-mono">useRouteParams("posts/[postId]")</code>{" "}
          which returns the same typed shape.
        </p>
      </Explain>

      <article className="space-y-2 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="font-mono text-[11px] tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
          /posts/{params.postId}
        </p>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {post.title}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{post.body}</p>
      </article>

      <Explain title="notFound() and error.tsx" accent="error">
        <p>
          When this component calls{" "}
          <code className="font-mono">notFound()</code>, the thrown{" "}
          <code className="font-mono">NotFoundError</code> skips{" "}
          <code className="font-mono">error.tsx</code> and renders the nearest{" "}
          <code className="font-mono">not-found.tsx</code>. Any other thrown
          error goes to the error boundary instead.
        </p>
        <p>
          Try{" "}
          <Link
            to={`/posts/${params.postId}?fail=1`}
            className="text-accent-error font-medium hover:underline"
          >
            ?fail=1
          </Link>{" "}
          to see <code className="font-mono">error.tsx</code> take over, or{" "}
          <Link
            to="/posts/999"
            className="text-accent-error font-medium hover:underline"
          >
            /posts/999
          </Link>{" "}
          for the not-found boundary.
        </p>
      </Explain>

      <Link
        to="/posts"
        className="inline-flex rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      >
        ← back to all posts
      </Link>
    </>
  );
}
