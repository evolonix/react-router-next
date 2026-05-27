import { isNotFoundError } from "@evolonix/react-router-next";
import { Link, useRouteError } from "react-router";

import { CodeBlock } from "../../_components/code-block";
import { Explain } from "../../_components/explain";

export default function PostError() {
  const error = useRouteError();
  if (isNotFoundError(error)) {
    return null;
  }
  const message =
    error instanceof Error ? error.message : "An unknown error occurred.";
  return (
    <Explain title="error.tsx caught it" accent="error" tag="error.tsx">
      <p>
        Something threw while rendering the post. The framework redirects to the
        nearest <code className="font-mono">error.tsx</code> boundary and hands
        you the error via React Router's{" "}
        <code className="font-mono">useRouteError()</code>.
      </p>
      <CodeBlock filename="src/app/posts/[postId]/error.tsx">{`import { isNotFoundError } from "@evolonix/react-router-next";
import { useRouteError } from "react-router";

export default function PostError() {
  const error = useRouteError();
  if (isNotFoundError(error)) return null; // not-found.tsx handles 404s
  return <p>{(error as Error).message}</p>;
}`}</CodeBlock>
      <pre className="overflow-x-auto rounded-md bg-zinc-100 px-3 py-2 font-mono text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
        {message}
      </pre>
      <p>
        <Link
          to="/posts"
          className="text-accent-error font-medium hover:underline"
        >
          ← back to all posts
        </Link>
      </p>
    </Explain>
  );
}
