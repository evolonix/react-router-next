// @vitest-environment jsdom
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import type { RouteObject } from "react-router";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { RouteTreeDevtools } from "./devtools";

// Params are sourced from React Router's `useParams()`, not from the optional
// `routes` prop. These tests pin that down: a dynamic `[slug]` segment must show
// even when no `routes` are passed (the base entry / non-Vite bundlers), which
// is the case that previously rendered "none".

let container: HTMLDivElement;
afterEach(() => {
  container?.remove();
});

function mount(pathname: string, routes?: RouteObject[]) {
  container = document.createElement("div");
  document.body.appendChild(container);
  // The devtools mounts inside the router (like a layout) so `useParams()`
  // resolves against the actually-matched route.
  const tree: RouteObject[] = [
    {
      path: "/",
      element: <RouteTreeDevtools routes={routes} enabled />,
      children: [{ path: "blog/:slug", element: <div /> }],
    },
  ];
  const router = createMemoryRouter(tree, { initialEntries: [pathname] });
  flushSync(() => {
    createRoot(container).render(<RouterProvider router={router} />);
  });
}

function openPanel() {
  const btn = container.querySelector<HTMLButtonElement>(
    'button[aria-label="Open react-router-next devtools"]',
  );
  flushSync(() => btn?.click());
}

describe("RouteTreeDevtools params", () => {
  it("shows the dynamic param without a routes prop (useParams source)", () => {
    mount("/blog/hello-world");
    openPanel();
    expect(container.textContent).toContain("slug");
    expect(container.textContent).toContain("hello-world");
    // No routes were passed, so the full tree section is omitted.
    expect(container.textContent?.toLowerCase()).not.toContain("route tree");
  });

  it("shows the dynamic param and the route tree with a routes prop", () => {
    mount("/blog/hello-world", [
      { path: "", children: [{ path: "blog", children: [{ path: ":slug" }] }] },
    ]);
    openPanel();
    expect(container.textContent).toContain("slug");
    expect(container.textContent).toContain("hello-world");
    expect(container.textContent?.toLowerCase()).toContain("route tree");
  });
});
