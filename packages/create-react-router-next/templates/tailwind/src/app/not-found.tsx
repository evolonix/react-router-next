import { NavLink } from "react-router";

// `not-found.tsx` renders for unmatched URLs beneath this segment, and for
// `notFound()` thrown by a descendant. At the root it's the app-wide 404.
export default function NotFound() {
  return (
    <main>
      <p className="font-mono text-sm tracking-wide text-zinc-500 dark:text-zinc-400">
        not-found.tsx
      </p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
        <span className="bg-linear-to-r from-purple-500 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
          404
        </span>{" "}
        — not found
      </h1>
      <p className="mt-3 max-w-xl text-zinc-500 dark:text-zinc-400">
        No route matched that URL. This boundary also renders whenever a page
        calls <code>notFound()</code>.
      </p>
      <p className="mt-6">
        <NavLink to="/" className="text-purple-600 dark:text-purple-400">
          ← Back home
        </NavLink>
      </p>
    </main>
  );
}
