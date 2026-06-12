import type { RouteProps } from "@evolonix/react-router-next";
import { NavLink } from "react-router";

// `[name]` is a dynamic segment. `RouteProps<"hello/[name]">` types `params`
// straight from the route literal — no codegen required, so it works under
// every bundler. (With the Vite plugin you can instead import the per-route
// type from "virtual:react-router-next/hello/[name]".)
export default function HelloPage({ params }: RouteProps<"hello/[name]">) {
  return (
    <main>
      <p className="font-mono text-sm tracking-wide text-zinc-500 dark:text-zinc-400">
        hello/[name]/page.tsx
      </p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
        Hello,{" "}
        <span className="bg-linear-to-r from-purple-500 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
          {params.name}
        </span>
        !
      </h1>
      <p className="mt-3 max-w-xl text-zinc-500 dark:text-zinc-400">
        <code>[name]</code> is a dynamic segment, and <code>params.name</code>{" "}
        is typed for you from the folder name.
      </p>
      <p className="mt-3">
        Try another:{" "}
        <NavLink
          to="/hello/router"
          className="text-purple-600 dark:text-purple-400"
        >
          router
        </NavLink>
        ,{" "}
        <NavLink
          to="/hello/world"
          className="text-purple-600 dark:text-purple-400"
        >
          world
        </NavLink>
        ,{" "}
        <NavLink
          to="/hello/you"
          className="text-purple-600 dark:text-purple-400"
        >
          you
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
