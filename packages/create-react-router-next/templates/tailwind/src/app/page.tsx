import { NavLink } from "react-router";

// `src/app/page.tsx` is the index route ("/"). Drop a `page.tsx` into any
// folder under `src/app/` and it becomes a route — that's the whole idea.
const examples = [
  {
    to: "/about",
    label: "About",
    file: "about/page.tsx",
    blurb: "A static route — the folder name is the URL segment.",
    accent: "border-t-purple-500",
  },
  {
    to: "/hello/world",
    label: "Hello",
    file: "hello/[name]/page.tsx",
    blurb: "A dynamic [name] segment, typed for you.",
    accent: "border-t-fuchsia-500",
  },
  {
    to: "/files/docs/getting-started",
    label: "Files",
    file: "files/[...path]/page.tsx",
    blurb: "A catch-all [...path] — every segment as an array.",
    accent: "border-t-cyan-400",
  },
  {
    to: "/search",
    label: "Search",
    file: "search/page.tsx",
    blurb: "Typed, validated searchParams via searchSchema.",
    accent: "border-t-purple-500",
  },
];

export default function HomePage() {
  return (
    <main>
      <p className="font-mono text-sm tracking-wide text-zinc-500 dark:text-zinc-400">
        @evolonix/react-router-next
      </p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
        Next.js-style routing,
        <br />
        on React Router 7.
      </h1>
      <p className="mt-3 max-w-xl text-zinc-500 dark:text-zinc-400">
        Drop a <code>page.tsx</code> into a folder under <code>src/app/</code>{" "}
        and it becomes a route — typed params and all. Pick a card to see a
        convention in action.
      </p>
      <ul className="mt-8 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
        {examples.map((example) => (
          <li key={example.to}>
            <NavLink
              to={example.to}
              className={`flex h-full flex-col gap-1 rounded-xl border border-t-4 border-black/10 ${example.accent} bg-white p-5 no-underline transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-zinc-900`}
            >
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                {example.label}
              </span>
              <span className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
                {example.file}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {example.blurb}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </main>
  );
}
