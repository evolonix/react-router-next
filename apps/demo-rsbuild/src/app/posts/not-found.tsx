import { Link, useLocation } from "react-router";

import { CodeBlock } from "../_components/code-block";
import { Explain } from "../_components/explain";

export default function PostsNotFound() {
  const { pathname } = useLocation();
  return (
    <Explain title="Scoped not-found.tsx" accent="error" tag="404">
      <p>
        No post matches{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 font-mono dark:bg-slate-800">
          {pathname}
        </code>
        . Because this file lives at{" "}
        <code className="font-mono">src/app/posts/not-found.tsx</code>, it wins
        over the root <code className="font-mono">not-found.tsx</code> for any
        unmatched URL under <code>/posts</code>.
      </p>
      <CodeBlock filename="src/app/posts/[postId]/page.tsx">{`import { notFound } from "@evolonix/react-router-next";

export default function PostPage({ params }: RouteProps) {
  const post = usePost(params.postId);
  if (!post) notFound(); // → nearest not-found.tsx
  return <article>{post.title}</article>;
}`}</CodeBlock>
      <p>
        <Link
          to="/posts"
          className="font-medium text-accent-error hover:underline"
        >
          ← back to all posts
        </Link>
      </p>
    </Explain>
  );
}
