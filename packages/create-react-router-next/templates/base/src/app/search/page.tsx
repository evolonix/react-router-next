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

  return (
    <main>
      <p className="eyebrow">search/page.tsx</p>
      <h1>Typed search params</h1>
      <p className="lede">
        This field writes <code>?q=</code> and <code>?sort=</code> straight to
        the URL. Reload the page and your search survives.
      </p>
      <div className="search">
        <input
          type="search"
          value={q}
          placeholder="Filter conventions…"
          aria-label="Filter conventions"
          onChange={(e) =>
            setSearch({ q: e.target.value, sort }, { replace: true })
          }
        />
        <select
          value={sort}
          aria-label="Sort order"
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
      <ul className="results">
        {results.map((name) => (
          <li key={name}>
            <code>{name}</code>
          </li>
        ))}
        {results.length === 0 && (
          <li className="empty">No matches for “{q}”.</li>
        )}
      </ul>
      <p>
        <NavLink to="/">← Back home</NavLink>
      </p>
    </main>
  );
}
