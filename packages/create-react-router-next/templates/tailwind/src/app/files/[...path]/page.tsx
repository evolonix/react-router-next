import type { RouteProps } from "@evolonix/react-router-next";
import { NavLink } from "react-router";

// `[...path]` is a catch-all segment: it matches any number of path parts and
// hands them back as a typed `string[]`.
export default function FilesPage({ params }: RouteProps<"files/[...path]">) {
  return (
    <main>
      <p className="font-mono text-sm tracking-wide text-zinc-500 dark:text-zinc-400">
        files/[...path]/page.tsx
      </p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
        A catch-all route
      </h1>
      <p className="mt-3 max-w-xl text-zinc-500 dark:text-zinc-400">
        <code>[...path]</code> matched {params.path.length}{" "}
        {params.path.length === 1 ? "segment" : "segments"}, typed as a{" "}
        <code>string[]</code>:
      </p>
      <ol className="mt-5 flex list-none flex-wrap gap-2 p-0">
        {params.path.map((segment, i) => (
          <li
            key={i}
            className="rounded-md bg-cyan-400/20 px-2.5 py-1 font-mono text-sm"
          >
            {segment}
          </li>
        ))}
      </ol>
      <p className="mt-3">
        Add more to the URL, or jump to{" "}
        <NavLink
          to="/files/docs/routing/catch-all"
          className="text-purple-600 dark:text-purple-400"
        >
          /files/docs/routing/catch-all
        </NavLink>
        .
      </p>
      <p className="mt-6">
        <NavLink to="/" className="text-purple-600 dark:text-purple-400">
          ← Back home
        </NavLink>
      </p>
    </main>
  );
}
