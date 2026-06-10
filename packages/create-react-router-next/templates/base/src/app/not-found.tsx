import { Link } from "react-router";

// `not-found.tsx` renders for unmatched URLs beneath this segment, and for
// `notFound()` thrown by a descendant.
export default function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <p>That page doesn&apos;t exist.</p>
      <p>
        <Link to="/">← Home</Link>
      </p>
    </main>
  );
}
