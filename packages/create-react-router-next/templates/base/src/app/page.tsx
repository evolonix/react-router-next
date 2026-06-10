import { Link } from "react-router";

// `page.tsx` is the route's UI. This file at `src/app/page.tsx` is the index
// route ("/").
export default function HomePage() {
  return (
    <main>
      <h1>react-router-next</h1>
      <p>
        Next.js-style filesystem routing on React Router 7. Add a{" "}
        <code>page.tsx</code> inside a folder under <code>src/app/</code> and it
        becomes a route.
      </p>
      <ul>
        <li>
          <code>src/app/page.tsx</code> → <Link to="/">/</Link>
        </li>
        <li>
          <code>src/app/about/page.tsx</code> → <Link to="/about">/about</Link>
        </li>
        <li>
          <code>src/app/blog/[slug]/page.tsx</code> →{" "}
          <Link to="/blog/hello-world">/blog/:slug</Link>
        </li>
      </ul>
    </main>
  );
}
