import { useSearchParams } from "@evolonix/react-router-next";
import { NavLink } from "react-router";
import { z } from "zod";

// Export a `searchSchema` and react-router-next validates this route's query
// string (`?q=&sort=`). Any Standard Schema works — here we use Zod. This is the
// one step past Next.js: the search params are typed *and* validated.
export const searchSchema = z.object({
  q: z.string().default(""),
  sort: z.enum(["a-z", "z-a"]).default("a-z"),
});

// The conventions this starter shows off — filtered live by the URL.
const CONVENTIONS = [
  "page.tsx",
  "layout.tsx",
  "not-found.tsx",
  "[name] — dynamic segment",
  "[...path] — catch-all",
  "searchSchema — typed query",
];

export default function SearchPage() {
  // `useSearchParams(route, schema)` returns the validated value plus a typed
  // setter that writes back to the URL. (With the Vite plugin, call the bare
  // `useSearchParams()` from "virtual:react-router-next/search" — no schema arg.)
  const [{ q, sort }, setSearch] = useSearchParams("search", searchSchema);

  const results = CONVENTIONS.filter((name) =>
    name.toLowerCase().includes(q.toLowerCase()),
  ).sort((a, b) => (sort === "a-z" ? a.localeCompare(b) : b.localeCompare(a)));

  const field =
    "rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-zinc-900";

  return (
    <main>
      <p className="font-mono text-sm tracking-wide text-zinc-500 dark:text-zinc-400">
        search/page.tsx
      </p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
        Typed search params
      </h1>
      <p className="mt-3 max-w-xl text-zinc-500 dark:text-zinc-400">
        This field writes <code>?q=</code> and <code>?sort=</code> straight to
        the URL. Reload the page and your search survives.
      </p>
      <div className="mt-6 mb-4 flex gap-2.5">
        <input
          type="search"
          value={q}
          placeholder="Filter conventions…"
          aria-label="Filter conventions"
          className={`${field} flex-1`}
          onChange={(e) =>
            setSearch({ q: e.target.value, sort }, { replace: true })
          }
        />
        <select
          value={sort}
          aria-label="Sort order"
          className={field}
          onChange={(e) =>
            setSearch(
              { q, sort: e.target.value as typeof sort },
              { replace: true },
            )
          }
        >
          <option value="a-z">A → Z</option>
          <option value="z-a">Z → A</option>
        </select>
      </div>
      <ul className="flex list-none flex-col gap-2 p-0">
        {results.map((name) => (
          <li
            key={name}
            className="rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-zinc-900"
          >
            <code>{name}</code>
          </li>
        ))}
        {results.length === 0 && (
          <li className="rounded-lg border border-dashed border-black/15 px-3 py-2 text-zinc-500 dark:border-white/15 dark:text-zinc-400">
            No matches for “{q}”.
          </li>
        )}
      </ul>
      <p className="mt-6">
        <NavLink to="/" className="text-purple-600 dark:text-purple-400">
          ← Back home
        </NavLink>
      </p>
    </main>
  );
}
