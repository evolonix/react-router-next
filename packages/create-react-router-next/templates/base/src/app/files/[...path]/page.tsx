import type { RouteProps } from "@evolonix/react-router-next";
import { NavLink } from "react-router";

// `[...path]` is a catch-all segment: it matches any number of path parts and
// hands them back as a typed `string[]`.
export default function FilesPage({ params }: RouteProps<"files/[...path]">) {
  return (
    <main>
      <p className="eyebrow">files/[...path]/page.tsx</p>
      <h1>A catch-all route</h1>
      <p className="lede">
        <code>[...path]</code> matched {params.path.length}{" "}
        {params.path.length === 1 ? "segment" : "segments"}, typed as a{" "}
        <code>string[]</code>:
      </p>
      <ol className="crumbs">
        {params.path.map((segment, i) => (
          <li key={i}>
            <code>{segment}</code>
          </li>
        ))}
      </ol>
      <p>
        Add more to the URL, or jump to{" "}
        <NavLink to="/files/docs/routing/catch-all">
          /files/docs/routing/catch-all
        </NavLink>
        .
      </p>
      <p>
        <NavLink to="/">← Back home</NavLink>
      </p>
    </main>
  );
}
