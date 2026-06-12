import { NavLink } from "react-router";

export default function AboutPage() {
  return (
    <main>
      <p className="eyebrow">about/page.tsx</p>
      <h1>A static route</h1>
      <p className="lede">
        The folder <code>src/app/about/</code> maps straight to{" "}
        <code>/about</code> — no route table, no config.
      </p>
      <p>
        Every folder with a <code>page.tsx</code> is a route. Nest folders to
        nest URLs, and the <code>layout.tsx</code> above wraps them all through{" "}
        <code>&lt;Outlet /&gt;</code>.
      </p>
      <p>
        <NavLink to="/">← Back home</NavLink>
      </p>
    </main>
  );
}
