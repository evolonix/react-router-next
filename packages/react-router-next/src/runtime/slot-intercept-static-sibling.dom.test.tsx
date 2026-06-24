// @vitest-environment jsdom

/**
 * Regression test for a slot-owned intercepting route capturing a *static*
 * sibling URL.
 *
 * Structure:
 *   projects/[projectId]/
 *     page.tsx              → index
 *     [taskId]/page.tsx     → full task page
 *     settings/page.tsx     → static sibling of [taskId]
 *     @modal/default.tsx    → makes @modal a real parallel slot
 *     @modal/(.)[taskId]/page.tsx → intercepting modal for [taskId]
 *
 * Bug: on soft (PUSH) navigation to `/projects/p1/settings`, the @modal slot's
 * isolated `useRoutes` matched `settings` against its injected `:taskId`
 * pattern and opened the modal (which then 404s on a non-existent task), even
 * though the main outlet correctly rendered the `settings` page. A hard refresh
 * (POP) worked because the interceptor only renders on PUSH.
 *
 * Fix: the slot interceptor is gated on the main router actually matching the
 * `[taskId]` target route, so a static sibling like `settings` falls through to
 * the slot default.
 */
import { type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { createMemoryRouter, Outlet, RouterProvider } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { buildRoutesFromModules, type RouteModuleMap } from "./app-routes";

const APP_DIR = "/src/app";

let activeRoot: Root | null = null;
let container: HTMLElement | null = null;

afterEach(() => {
  if (activeRoot) {
    activeRoot.unmount();
    activeRoot = null;
  }
  if (container) {
    container.remove();
    container = null;
  }
});

async function waitFor(
  fn: () => boolean,
  { timeout = 500, interval = 5 } = {},
): Promise<void> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (fn()) return;
    await new Promise((r) => setTimeout(r, interval));
  }
}

function ProjectLayout(props: { [slot: string]: unknown }): ReactNode {
  return (
    <div>
      <div data-testid="layout" />
      {props.modal as ReactNode}
      <Outlet />
    </div>
  );
}
const ProjectIndex = () => <div data-testid="index" />;
const TaskPage = () => <div data-testid="task" />;
const SettingsPage = () => <div data-testid="settings" />;
const ModalDefault = () => null;
const TaskModal = () => <div data-testid="modal" />;

const modules: RouteModuleMap = {
  [`${APP_DIR}/projects/[projectId]/layout.tsx`]: { default: ProjectLayout },
  [`${APP_DIR}/projects/[projectId]/page.tsx`]: { default: ProjectIndex },
  [`${APP_DIR}/projects/[projectId]/[taskId]/page.tsx`]: { default: TaskPage },
  [`${APP_DIR}/projects/[projectId]/settings/page.tsx`]: {
    default: SettingsPage,
  },
  [`${APP_DIR}/projects/[projectId]/@modal/default.tsx`]: {
    default: ModalDefault,
  },
  [`${APP_DIR}/projects/[projectId]/@modal/(.)[taskId]/page.tsx`]: {
    default: TaskModal,
  },
};

function renderAt(initialEntries: string[]): {
  el: HTMLElement;
  router: ReturnType<typeof createMemoryRouter>;
} {
  const routes = buildRoutesFromModules(modules, APP_DIR);
  const router = createMemoryRouter(routes, { initialEntries });
  const el = document.createElement("div");
  document.body.appendChild(el);
  container = el;
  activeRoot = createRoot(el);
  activeRoot.render(<RouterProvider router={router} />);
  return { el, router };
}

describe("slot-owned intercept vs static sibling", () => {
  it("soft-navigating to a static sibling renders the page, not the modal", async () => {
    // Start on the index so the navigation to /settings is a PUSH (soft nav).
    const { el, router } = renderAt(["/projects/p1"]);
    await waitFor(() => el.querySelector('[data-testid="index"]') !== null);

    await router.navigate("/projects/p1/settings");
    await waitFor(() => el.querySelector('[data-testid="settings"]') !== null);

    expect(el.querySelector('[data-testid="settings"]')).not.toBeNull();
    // The @modal slot must NOT hijack the static sibling into the modal.
    expect(el.querySelector('[data-testid="modal"]')).toBeNull();
  });

  it("soft-navigating to the dynamic [taskId] still opens the modal", async () => {
    const { el, router } = renderAt(["/projects/p1"]);
    await waitFor(() => el.querySelector('[data-testid="index"]') !== null);

    await router.navigate("/projects/p1/task-9");
    await waitFor(() => el.querySelector('[data-testid="modal"]') !== null);

    // Modal opens; the underlying page stays frozen on the parent index.
    expect(el.querySelector('[data-testid="modal"]')).not.toBeNull();
    expect(el.querySelector('[data-testid="index"]')).not.toBeNull();
    // The full task page is not rendered in the main outlet on soft nav.
    expect(el.querySelector('[data-testid="task"]')).toBeNull();
  });

  it("hard-loading the static sibling renders the page, not the modal", async () => {
    // Initial entry is a POP — mirrors a hard refresh / deep link.
    const { el } = renderAt(["/projects/p1/settings"]);
    await waitFor(() => el.querySelector('[data-testid="settings"]') !== null);

    expect(el.querySelector('[data-testid="settings"]')).not.toBeNull();
    expect(el.querySelector('[data-testid="modal"]')).toBeNull();
  });

  it("hard-loading the dynamic [taskId] renders the full page, not the modal", async () => {
    const { el } = renderAt(["/projects/p1/task-9"]);
    await waitFor(() => el.querySelector('[data-testid="task"]') !== null);

    expect(el.querySelector('[data-testid="task"]')).not.toBeNull();
    expect(el.querySelector('[data-testid="modal"]')).toBeNull();
  });
});

/**
 * Same bug, but via a deeper `(..)(..)` interceptor inside a route group — this
 * is the shape shipped by the demo apps' `projects/[orgId]/(catalog)` route,
 * which has a static `feed` sibling alongside the dynamic `[projectId]`. Proves
 * the gate is interceptor-depth/route-group agnostic, not specific to `(.)`.
 */
describe("deeper (..)(..) intercept in a route group vs static sibling", () => {
  const CatalogLayout = (props: { [slot: string]: unknown }): ReactNode => (
    <div>
      {props.modal as ReactNode}
      <Outlet />
    </div>
  );
  const ProjectPage = () => <div data-testid="project" />;
  const FeedPage = () => <div data-testid="feed" />;
  const ModalDefault = () => null;
  const ProjectModal = () => <div data-testid="modal" />;

  const catalogModules: RouteModuleMap = {
    [`${APP_DIR}/projects/[orgId]/(catalog)/layout.tsx`]: {
      default: CatalogLayout,
    },
    [`${APP_DIR}/projects/[orgId]/(catalog)/[projectId]/page.tsx`]: {
      default: ProjectPage,
    },
    [`${APP_DIR}/projects/[orgId]/(catalog)/feed/page.tsx`]: {
      default: FeedPage,
    },
    [`${APP_DIR}/projects/[orgId]/(catalog)/@modal/default.tsx`]: {
      default: ModalDefault,
    },
    [`${APP_DIR}/projects/[orgId]/(catalog)/@modal/(..)(..)[projectId]/page.tsx`]:
      { default: ProjectModal },
  };

  function render(initialEntries: string[]): {
    el: HTMLElement;
    router: ReturnType<typeof createMemoryRouter>;
  } {
    const routes = buildRoutesFromModules(catalogModules, APP_DIR);
    const router = createMemoryRouter(routes, { initialEntries });
    const el = document.createElement("div");
    document.body.appendChild(el);
    container = el;
    activeRoot = createRoot(el);
    activeRoot.render(<RouterProvider router={router} />);
    return { el, router };
  }

  it("soft-navigating to the static `feed` sibling does not open the modal", async () => {
    // Start on a project so the nav to /feed is a PUSH.
    const { el, router } = render(["/projects/org1/proj-1"]);
    await waitFor(() => el.querySelector('[data-testid="project"]') !== null);

    await router.navigate("/projects/org1/feed");
    await waitFor(() => el.querySelector('[data-testid="feed"]') !== null);

    expect(el.querySelector('[data-testid="feed"]')).not.toBeNull();
    expect(el.querySelector('[data-testid="modal"]')).toBeNull();
  });

  it("soft-navigating to a real [projectId] still opens the modal", async () => {
    const { el, router } = render(["/projects/org1/proj-1"]);
    await waitFor(() => el.querySelector('[data-testid="project"]') !== null);

    await router.navigate("/projects/org1/proj-2");
    await waitFor(() => el.querySelector('[data-testid="modal"]') !== null);

    expect(el.querySelector('[data-testid="modal"]')).not.toBeNull();
  });
});
