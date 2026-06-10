import { Link } from "react-router";

export default function AboutPage() {
  return (
    <main>
      <h1>About</h1>
      <p>
        A static route — the folder name <code>about</code> is the URL segment.
      </p>
      <p>
        <Link to="/">← Home</Link>
      </p>
    </main>
  );
}
