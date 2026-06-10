import { Link } from "react-router";

// `page.tsx` is the route's UI. This file at `src/app/page.tsx` is the index
// route ("/").
export default function HomePage() {
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">react-router-next</h1>
      <p>
        Next.js-style filesystem routing on React Router 7, styled with Tailwind
        CSS. Add a{" "}
        <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-sm dark:bg-white/10">
          page.tsx
        </code>{" "}
        inside a folder under{" "}
        <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-sm dark:bg-white/10">
          src/app/
        </code>{" "}
        and it becomes a route.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-sm dark:bg-white/10">
            src/app/page.tsx
          </code>{" "}
          →{" "}
          <Link
            className="text-indigo-600 underline underline-offset-2 hover:text-indigo-500 dark:text-indigo-400"
            to="/"
          >
            /
          </Link>
        </li>
        <li>
          <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-sm dark:bg-white/10">
            src/app/about/page.tsx
          </code>{" "}
          →{" "}
          <Link
            className="text-indigo-600 underline underline-offset-2 hover:text-indigo-500 dark:text-indigo-400"
            to="/about"
          >
            /about
          </Link>
        </li>
        <li>
          <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-sm dark:bg-white/10">
            src/app/blog/[slug]/page.tsx
          </code>{" "}
          →{" "}
          <Link
            className="text-indigo-600 underline underline-offset-2 hover:text-indigo-500 dark:text-indigo-400"
            to="/blog/hello-world"
          >
            /blog/:slug
          </Link>
        </li>
      </ul>
    </main>
  );
}
