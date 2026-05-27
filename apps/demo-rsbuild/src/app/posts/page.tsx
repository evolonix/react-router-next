import { generate } from "@evolonix/react-router-next";
import { Link } from "react-router";

import { CodeBlock } from "../_components/code-block";
import { Explain } from "../_components/explain";
import { usePosts } from "./_lib/use-posts";

export default function PostsPage() {
  const posts = usePosts();
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

      <ul className="space-y-3">
        {posts.map((post) => (
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
