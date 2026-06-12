import type { RouteProps } from "@evolonix/react-router-next";
import { NavLink } from "react-router";

// `[name]` is a dynamic segment. `RouteProps<"hello/[name]">` types `params`
// straight from the route literal — no codegen required, so it works under
// every bundler. (With the Vite plugin you can instead import the per-route
// type from "virtual:react-router-next/hello/[name]".)
export default function HelloPage({ params }: RouteProps<"hello/[name]">) {
  return (
    <main>
      <p className="eyebrow">hello/[name]/page.tsx</p>
      <h1>
        Hello, <span className="grad">{params.name}</span>!
      </h1>
      <p className="lede">
        <code>[name]</code> is a dynamic segment, and <code>params.name</code>{" "}
        is typed for you from the folder name.
      </p>
      <p>
        Try another: <NavLink to="/hello/router">router</NavLink>,{" "}
        <NavLink to="/hello/world">world</NavLink>,{" "}
        <NavLink to="/hello/you">you</NavLink>.
      </p>
      <p>
        <NavLink to="/">← Back home</NavLink>
      </p>
    </main>
  );
}
