import { NavLink } from "react-router";

// `not-found.tsx` renders for unmatched URLs beneath this segment, and for
// `notFound()` thrown by a descendant. At the root it's the app-wide 404.
export default function NotFound() {
  return (
    <main>
      <p className="eyebrow">not-found.tsx</p>
      <h1>
        <span className="grad">404</span> — not found
      </h1>
      <p className="lede">
        No route matched that URL. This boundary also renders whenever a page
        calls <code>notFound()</code>.
      </p>
      <p>
        <NavLink to="/">← Back home</NavLink>
      </p>
    </main>
  );
}
