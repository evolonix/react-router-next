import { describe, expect, it } from "vitest";
import { generate } from "./generate";

describe("generate", () => {
  it("renders a static route", () => {
    expect(generate("about", {})).toBe("/about");
  });

  it("renders the root for an empty route", () => {
    expect(generate("", {})).toBe("/");
  });

  it("substitutes a required [id] param", () => {
    expect(generate("posts/[id]", { id: "1" })).toBe("/posts/1");
  });

  it("expands a [...slug] rest param", () => {
    expect(generate("docs/[...slug]", { slug: ["a", "b", "c"] })).toBe(
      "/docs/a/b/c",
    );
  });

  it("expands an empty rest param to just the prefix", () => {
    expect(generate("docs/[...slug]", { slug: [] })).toBe("/docs");
  });

  it("includes an optional rest [[...slug]] only when populated", () => {
    expect(generate("docs/[[...slug]]", { slug: ["x", "y"] })).toBe(
      "/docs/x/y",
    );
    expect(generate("docs/[[...slug]]", { slug: [] })).toBe("/docs");
    expect(generate("docs/[[...slug]]", {})).toBe("/docs");
  });

  it("skips @slot segments", () => {
    expect(generate("dashboard/@modal/settings", {})).toBe(
      "/dashboard/settings",
    );
  });

  it("skips (group) segments", () => {
    expect(generate("(marketing)/about", {})).toBe("/about");
  });

  it("renders a mix of group, static, and required/optional params", () => {
    expect(
      generate("(shop)/products/[category]/[[...filters]]", {
        category: "shoes",
        filters: ["red", "size-10"],
      }),
    ).toBe("/products/shoes/red/size-10");
  });

  it("appends a query string from opts.search", () => {
    expect(generate("posts", {}, { search: { page: 2, q: "hi" } })).toBe(
      "/posts?page=2&q=hi",
    );
  });

  it("combines path params and search", () => {
    expect(
      generate("posts/[id]", { id: "1" }, { search: { tab: "comments" } }),
    ).toBe("/posts/1?tab=comments");
  });

  it("composes catch-all params with search", () => {
    expect(
      generate("docs/[...slug]", { slug: ["a", "b"] }, { search: { v: 2 } }),
    ).toBe("/docs/a/b?v=2");
  });

  it("omits the ? when search serializes to empty", () => {
    expect(generate("posts", {}, { search: { q: undefined } })).toBe("/posts");
    expect(generate("posts", {}, {})).toBe("/posts");
  });
});
