import type { RouteProps } from "@evolonix/react-router-next";
import { Link } from "react-router";

// `[slug]` is a dynamic segment. `RouteProps<"blog/[slug]">` types the `params`
// (and `searchParams`) prop straight from the route literal — no codegen
// required, so it works under every bundler.
//
// Tip: with the Vite plugin or the codegen CLI you can instead import a
// per-route typed helper:
//   import type { RouteProps } from "virtual:react-router-next/blog/[slug]";
export default function BlogPostPage({ params }: RouteProps<"blog/[slug]">) {
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">{params.slug}</h1>
      <p>
        Rendered from{" "}
        <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-sm dark:bg-white/10">
          src/app/blog/[slug]/page.tsx
        </code>{" "}
        with a typed{" "}
        <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-sm dark:bg-white/10">
          params.slug
        </code>
        .
      </p>
      <p>
        <Link
          className="text-indigo-600 underline underline-offset-2 hover:text-indigo-500 dark:text-indigo-400"
          to="/"
        >
          ← Home
        </Link>
      </p>
    </main>
  );
}
