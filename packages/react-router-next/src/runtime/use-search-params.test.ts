import type { StandardSchemaV1 } from "@standard-schema/spec";
import { describe, expect, it } from "vitest";
import {
  parseSearchParams,
  safeParseSearchParams,
  SearchParamsError,
} from "./use-search-params";

type Parsed = { q?: string; page: number };

/**
 * Hand-rolled Standard Schema fixture — deliberately not Zod/Valibot, to prove
 * the runtime depends only on the spec's `~standard.validate` contract.
 * Coerces `page` to a number (default 1) and requires `q` to be a string.
 */
function searchSchema(): StandardSchemaV1<unknown, Parsed> {
  return {
    "~standard": {
      version: 1,
      vendor: "test",
      validate(value) {
        const v = (value ?? {}) as Record<string, unknown>;
        const issues: StandardSchemaV1.Issue[] = [];
        const out: Parsed = { page: 1 };
        if (v.q !== undefined) {
          if (typeof v.q !== "string") {
            issues.push({ message: "q must be a string", path: ["q"] });
          } else {
            out.q = v.q;
          }
        }
        if (v.page !== undefined) {
          const n = Number(v.page);
          if (Number.isNaN(n)) {
            issues.push({ message: "page must be a number", path: ["page"] });
          } else {
            out.page = n;
          }
        }
        return issues.length ? { issues } : { value: out };
      },
    },
  };
}

function asyncSchema(): StandardSchemaV1<unknown, Parsed> {
  return {
    "~standard": {
      version: 1,
      vendor: "test",
      validate: () => Promise.resolve({ value: { page: 1 } }),
    },
  };
}

describe("parseSearchParams", () => {
  it("validates and coerces from the query string", () => {
    expect(
      parseSearchParams(searchSchema(), new URLSearchParams("q=hello&page=3")),
    ).toEqual({ q: "hello", page: 3 });
  });

  it("applies schema defaults for absent params", () => {
    expect(parseSearchParams(searchSchema(), new URLSearchParams())).toEqual({
      page: 1,
    });
  });

  it("throws SearchParamsError with the issues on invalid input", () => {
    try {
      parseSearchParams(searchSchema(), new URLSearchParams("page=notnum"));
      expect.unreachable("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(SearchParamsError);
      expect((err as SearchParamsError).issues).toHaveLength(1);
      expect((err as SearchParamsError).issues[0].message).toContain("page");
    }
  });

  it("includes the route in the error message when given", () => {
    try {
      parseSearchParams(
        searchSchema(),
        new URLSearchParams("page=notnum"),
        "posts",
      );
      expect.unreachable("should have thrown");
    } catch (err) {
      expect((err as Error).message).toContain('route "posts"');
    }
  });

  it("throws a TypeError for async schemas", () => {
    expect(() =>
      parseSearchParams(asyncSchema(), new URLSearchParams()),
    ).toThrow(TypeError);
  });
});

describe("safeParseSearchParams", () => {
  it("returns the value on success without throwing", () => {
    const result = safeParseSearchParams(
      searchSchema(),
      new URLSearchParams("q=x"),
    );
    expect(result.issues).toBeUndefined();
    if (!result.issues) {
      expect(result.value).toEqual({ q: "x", page: 1 });
    }
  });

  it("returns the issues on failure without throwing", () => {
    const result = safeParseSearchParams(
      searchSchema(),
      new URLSearchParams("page=nope"),
    );
    expect(result.issues).toBeDefined();
    expect(result.issues?.[0].message).toContain("page");
  });
});
