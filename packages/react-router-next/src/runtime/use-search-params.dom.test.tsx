// @vitest-environment jsdom

/**
 * Render test for the `useSearchParams` hook: it reads + validates the current
 * query string and its setter serializes a typed object back into the URL,
 * driving a re-render with the new parsed value.
 */
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { createRoot, type Root } from "react-dom/client";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { useSearchParams } from "./use-search-params";

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

type Parsed = { q?: string; page: number };

function schema(): StandardSchemaV1<unknown, Parsed> {
  return {
    "~standard": {
      version: 1,
      vendor: "test",
      validate(value) {
        const v = (value ?? {}) as Record<string, unknown>;
        return {
          value: {
            q: v.q === undefined ? undefined : String(v.q),
            page: v.page === undefined ? 1 : Number(v.page),
          },
        };
      },
    },
  };
}

function Probe(): React.JSX.Element {
  const [search, setSearch] = useSearchParams("posts", schema());
  return (
    <div>
      <span data-testid="page">{String(search.page)}</span>
      <span data-testid="q">{search.q ?? ""}</span>
      <button type="button" onClick={() => setSearch({ page: 5, q: "next" })}>
        set
      </button>
    </div>
  );
}

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

function render(): HTMLElement {
  const router = createMemoryRouter([{ path: "*", element: <Probe /> }], {
    initialEntries: ["/posts?page=2&q=hi"],
  });
  const el = document.createElement("div");
  document.body.appendChild(el);
  container = el;
  activeRoot = createRoot(el);
  activeRoot.render(<RouterProvider router={router} />);
  return el;
}

describe("useSearchParams", () => {
  it("parses the current query string into the typed value", async () => {
    const el = render();
    await waitFor(() => el.querySelector('[data-testid="page"]') !== null);
    expect(el.querySelector('[data-testid="page"]')?.textContent).toBe("2");
    expect(el.querySelector('[data-testid="q"]')?.textContent).toBe("hi");
  });

  it("writes a serialized query string via the setter", async () => {
    const el = render();
    await waitFor(() => el.querySelector("button") !== null);
    (el.querySelector("button") as HTMLButtonElement).click();
    await waitFor(
      () => el.querySelector('[data-testid="page"]')?.textContent === "5",
    );
    expect(el.querySelector('[data-testid="page"]')?.textContent).toBe("5");
    expect(el.querySelector('[data-testid="q"]')?.textContent).toBe("next");
  });
});
