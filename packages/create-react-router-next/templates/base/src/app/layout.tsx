import { NavLink, Outlet } from "react-router";

// `layout.tsx` wraps every route beneath it and renders its matched child
// through `<Outlet />` — the same convention as Next.js's App Router.
export default function RootLayout() {
  return (
    <>
      <nav>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/blog/hello-world">Blog post</NavLink>
      </nav>
      <Outlet />
    </>
  );
}
