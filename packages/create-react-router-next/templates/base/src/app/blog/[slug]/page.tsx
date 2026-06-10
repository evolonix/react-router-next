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
    <main>
      <h1>{params.slug}</h1>
      <p>
        Rendered from <code>src/app/blog/[slug]/page.tsx</code> with a typed{" "}
        <code>params.slug</code>.
      </p>
      <p>
        <Link to="/">← Home</Link>
      </p>
    </main>
  );
}
