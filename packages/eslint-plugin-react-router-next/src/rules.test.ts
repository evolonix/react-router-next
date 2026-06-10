import { RuleTester } from "eslint";
import { afterAll, describe, it } from "vitest";
import noDuplicateDynamicParams from "./rules/no-duplicate-dynamic-params";
import noSearchParamsExport from "./rules/no-search-params-export";
import validDynamicSegments from "./rules/valid-dynamic-segments";
import type { RuleModule } from "./types";

// Route RuleTester's lifecycle hooks through vitest. (`afterAll` isn't in
// ESLint's static types but is honored at runtime — set them together.)
Object.assign(RuleTester, { afterAll, describe, it, itOnly: it.only });

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2023, sourceType: "module" },
});

// Our rules are structurally valid ESLint rules; bridge to ESLint's stricter
// `RuleModule` type at the call boundary.
type EslintRule = Parameters<typeof ruleTester.run>[1];
const asRule = (rule: RuleModule): EslintRule => rule as unknown as EslintRule;

const f = (p: string) => `/proj/src/app/${p}`;

ruleTester.run("valid-dynamic-segments", asRule(validDynamicSegments), {
  valid: [
    { code: "export {};", filename: f("blog/[slug]/page.tsx") },
    { code: "export {};", filename: f("docs/[...slug]/page.tsx") },
    { code: "export {};", filename: f("search/[[...query]]/page.tsx") },
    { code: "export {};", filename: f("(marketing)/about/page.tsx") },
    // not a route file → ignored
    { code: "export {};", filename: "/proj/src/lib/helper.ts" },
    // route file but outside an `app` dir → ignored
    { code: "export {};", filename: "/proj/src/pages/[]/page.tsx" },
  ],
  invalid: [
    {
      code: "export {};",
      filename: f("[]/page.tsx"),
      errors: [{ messageId: "malformed" }],
    },
    {
      code: "export {};",
      filename: f("docs/[...]/page.tsx"),
      errors: [{ messageId: "malformed" }],
    },
    {
      code: "export {};",
      filename: f("blog/[slug/page.tsx"),
      errors: [{ messageId: "malformed" }],
    },
  ],
});

ruleTester.run(
  "no-duplicate-dynamic-params",
  asRule(noDuplicateDynamicParams),
  {
    valid: [
      {
        code: "export {};",
        filename: f("users/[userId]/posts/[postId]/page.tsx"),
      },
      { code: "export {};", filename: f("blog/[slug]/page.tsx") },
    ],
    invalid: [
      {
        code: "export {};",
        filename: f("a/[id]/b/[id]/page.tsx"),
        errors: [{ messageId: "duplicate" }],
      },
    ],
  },
);

ruleTester.run("no-search-params-export", asRule(noSearchParamsExport), {
  valid: [
    { code: "export const searchSchema = {};", filename: f("posts/page.tsx") },
    // `searchParams` outside a route file is fine
    { code: "export const searchParams = {};", filename: "/proj/src/lib/x.ts" },
  ],
  invalid: [
    {
      code: "export const searchParams = {};",
      filename: f("posts/page.tsx"),
      errors: [{ messageId: "renamed" }],
    },
    {
      code: "const s = {}; export { s as searchParams };",
      filename: f("posts/page.tsx"),
      errors: [{ messageId: "renamed" }],
    },
  ],
});
