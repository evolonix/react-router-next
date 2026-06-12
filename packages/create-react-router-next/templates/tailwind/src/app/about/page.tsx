import { NavLink } from "react-router";

export default function AboutPage() {
  return (
    <main>
      <p className="font-mono text-sm tracking-wide text-zinc-500 dark:text-zinc-400">
        about/page.tsx
      </p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
        A static route
      </h1>
      <p className="mt-3 max-w-xl text-zinc-500 dark:text-zinc-400">
        The folder <code>src/app/about/</code> maps straight to{" "}
        <code>/about</code> — no route table, no config.
      </p>
      <p className="mt-3 max-w-xl">
        Every folder with a <code>page.tsx</code> is a route. Nest folders to
        nest URLs, and the <code>layout.tsx</code> above wraps them all through{" "}
        <code>&lt;Outlet /&gt;</code>.
      </p>
      <p className="mt-6">
        <NavLink to="/" className="text-purple-600 dark:text-purple-400">
          ← Back home
        </NavLink>
      </p>
    </main>
  );
}
