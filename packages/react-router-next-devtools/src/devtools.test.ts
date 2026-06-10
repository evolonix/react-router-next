import type { RouteObject } from "react-router";
import { describe, expect, it } from "vitest";
import { flattenRoutes } from "./devtools";

describe("flattenRoutes", () => {
  const routes: RouteObject[] = [
    {
      path: "",
      children: [
        { index: true },
        { path: "about" },
        { path: "blog", children: [{ path: ":slug" }] },
      ],
    },
  ];

  it("flattens depth-first with depth annotations", () => {
    const flat = flattenRoutes(routes);
    expect(flat.map((n) => [n.depth, n.label])).toEqual([
      [0, "▢ layout"],
      [1, "index"],
      [1, "about"],
      [1, "blog"],
      [2, ":slug"],
    ]);
  });

  it("preserves the route reference for identity matching", () => {
    const flat = flattenRoutes(routes);
    expect(flat[0].route).toBe(routes[0]);
    expect(flat[4].route).toBe(routes[0].children![2].children![0]);
  });

  it("labels an index route", () => {
    expect(flattenRoutes([{ index: true }])[0].label).toBe("index");
  });
});
