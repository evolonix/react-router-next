import { Link } from "react-router";

// `not-found.tsx` renders for unmatched URLs beneath this segment, and for
// `notFound()` thrown by a descendant.
export default function NotFound() {
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">404</h1>
      <p>That page doesn&apos;t exist.</p>
      <p>
        <Link
          className="text-indigo-600 underline underline-offset-2 hover:text-indigo-500 dark:text-indigo-400"
          to="/"
        >
          ← Home
        </Link>
      </p>
    </main>
  );
}
