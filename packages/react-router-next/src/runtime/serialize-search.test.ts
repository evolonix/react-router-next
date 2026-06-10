import { describe, expect, it } from "vitest";
import { deserializeSearch, serializeSearch } from "./serialize-search";

describe("serializeSearch", () => {
  it("stringifies primitives", () => {
    expect(serializeSearch({ q: "hi", page: 2, active: true }).toString()).toBe(
      "active=true&page=2&q=hi",
    );
  });

  it("expands arrays into repeated keys", () => {
    expect(serializeSearch({ tags: ["a", "b", "c"] }).toString()).toBe(
      "tags=a&tags=b&tags=c",
    );
  });

  it("omits null and undefined values", () => {
    expect(
      serializeSearch({ q: "x", skip: undefined, also: null }).toString(),
    ).toBe("q=x");
  });

  it("omits null/undefined items inside arrays", () => {
    expect(
      serializeSearch({ tags: ["a", undefined, "b", null] }).toString(),
    ).toBe("tags=a&tags=b");
  });

  it("sorts keys for deterministic output regardless of input order", () => {
    const a = serializeSearch({ b: "2", a: "1", c: "3" }).toString();
    const b = serializeSearch({ c: "3", a: "1", b: "2" }).toString();
    expect(a).toBe(b);
    expect(a).toBe("a=1&b=2&c=3");
  });

  it("produces an empty string for an all-empty input", () => {
    expect(serializeSearch({ a: undefined, b: null, c: [] }).toString()).toBe(
      "",
    );
  });
});

describe("deserializeSearch", () => {
  it("collapses a single occurrence to a string", () => {
    expect(deserializeSearch(new URLSearchParams("q=hi"))).toEqual({ q: "hi" });
  });

  it("collapses repeated keys to an array", () => {
    expect(deserializeSearch(new URLSearchParams("tags=a&tags=b"))).toEqual({
      tags: ["a", "b"],
    });
  });

  it("round-trips arrays and primitives through serialize", () => {
    const round = deserializeSearch(
      serializeSearch({ q: "x", tags: ["a", "b"] }),
    );
    expect(round).toEqual({ q: "x", tags: ["a", "b"] });
  });
});
