import { Link } from "react-router";

export default function AboutPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">About</h1>
      <p>
        A static route — the folder name{" "}
        <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-sm dark:bg-white/10">
          about
        </code>{" "}
        is the URL segment.
      </p>
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
