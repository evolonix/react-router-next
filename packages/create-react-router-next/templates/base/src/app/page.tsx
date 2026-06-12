import { NavLink } from "react-router";

// `src/app/page.tsx` is the index route ("/"). Drop a `page.tsx` into any
// folder under `src/app/` and it becomes a route — that's the whole idea.
const examples = [
  {
    to: "/about",
    label: "About",
    file: "about/page.tsx",
    blurb: "A static route — the folder name is the URL segment.",
  },
  {
    to: "/hello/world",
    label: "Hello",
    file: "hello/[name]/page.tsx",
    blurb: "A dynamic [name] segment, typed for you.",
  },
  {
    to: "/files/docs/getting-started",
    label: "Files",
    file: "files/[...path]/page.tsx",
    blurb: "A catch-all [...path] — every segment as an array.",
  },
  {
    to: "/search",
    label: "Search",
    file: "search/page.tsx",
    blurb: "Typed, validated searchParams via searchSchema.",
  },
];

export default function HomePage() {
  return (
    <main>
      <p className="eyebrow">@evolonix/react-router-next</p>
      <h1>
        Next.js-style routing,
        <br />
        on React Router 7.
      </h1>
      <p className="lede">
        Drop a <code>page.tsx</code> into a folder under <code>src/app/</code>{" "}
        and it becomes a route — typed params and all. Pick a card to see a
        convention in action.
      </p>
      <ul className="cards">
        {examples.map((example) => (
          <li key={example.to} className="card">
            <NavLink to={example.to}>
              <span className="card-label">{example.label}</span>
              <code className="card-file">{example.file}</code>
              <span className="card-blurb">{example.blurb}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </main>
  );
}
