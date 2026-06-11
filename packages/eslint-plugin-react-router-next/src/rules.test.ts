import { RuleTester } from "eslint";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterAll, describe, it } from "vitest";
import catchAllMustBeLast from "./rules/catch-all-must-be-last";
import noConflictingRoutes from "./rules/no-conflicting-routes";
import noDuplicateDynamicParams from "./rules/no-duplicate-dynamic-params";
import noInterceptorLayout from "./rules/no-interceptor-layout";
import noSearchParamsExport from "./rules/no-search-params-export";
import requireInterceptorTarget from "./rules/require-interceptor-target";
import slotNeedsLayout from "./rules/slot-needs-layout";
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

ruleTester.run("catch-all-must-be-last", asRule(catchAllMustBeLast), {
  valid: [
    { code: "export {};", filename: f("docs/[...slug]/page.tsx") },
    { code: "export {};", filename: f("search/[[...query]]/page.tsx") },
    { code: "export {};", filename: f("blog/[slug]/page.tsx") },
    // not a route file → ignored
    { code: "export {};", filename: "/proj/src/lib/helper.ts" },
  ],
  invalid: [
    {
      code: "export {};",
      filename: f("docs/[...slug]/more/page.tsx"),
      errors: [{ messageId: "notLast" }],
    },
    {
      code: "export {};",
      filename: f("docs/[...slug]/[id]/page.tsx"),
      errors: [{ messageId: "notLast" }],
    },
    {
      code: "export {};",
      filename: f("search/[[...query]]/results/page.tsx"),
      errors: [{ messageId: "notLast" }],
    },
  ],
});

// `no-conflicting-routes` scans the filesystem (route collisions are a project
// property, not a single-file one), so its fixtures live on real disk.
const conflictRoot = mkdtempSync(join(tmpdir(), "rrn-eslint-"));
const appRoot = join(conflictRoot, "src", "app");
const write = (rel: string): string => {
  const full = join(appRoot, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, "export {};");
  return full;
};
// Route groups: `(marketing)/about` and `about` both resolve to `/about`.
const marketingAbout = write("(marketing)/about/page.tsx");
const plainAbout = write("about/page.tsx");
// Same dynamic position, different param name: `/:id` vs `/:slug` — React
// Router ranks them identically, so they match the same URLs.
const shopById = write("shop/[id]/page.tsx");
const shopBySlug = write("(promo)/shop/[slug]/page.tsx");
// Optional catch-all also matches its parent path → collides with the index.
const docsIndex = write("docs/page.tsx");
const docsOptional = write("docs/[[...path]]/page.tsx");
// Unique URL → no conflict.
const blog = write("blog/page.tsx");
// Intercepting page: intentionally mirrors its target's URL → excluded.
const intercepted = write("feed/(.)photos/page.tsx");
afterAll(() => rmSync(conflictRoot, { recursive: true, force: true }));

ruleTester.run("no-conflicting-routes", asRule(noConflictingRoutes), {
  valid: [
    { code: "export {};", filename: blog },
    { code: "export {};", filename: intercepted },
    // not a route file → ignored
    { code: "export {};", filename: join(appRoot, "lib/helper.ts") },
    // route file outside an `app` dir → ignored
    { code: "export {};", filename: "/proj/src/pages/about/page.tsx" },
  ],
  invalid: [
    {
      code: "export {};",
      filename: marketingAbout,
      errors: [{ messageId: "conflict" }],
    },
    {
      code: "export {};",
      filename: plainAbout,
      errors: [{ messageId: "conflict" }],
    },
    {
      code: "export {};",
      filename: shopById,
      errors: [{ messageId: "conflict" }],
    },
    {
      code: "export {};",
      filename: shopBySlug,
      errors: [{ messageId: "conflict" }],
    },
    {
      code: "export {};",
      filename: docsIndex,
      errors: [{ messageId: "conflict" }],
    },
    {
      code: "export {};",
      filename: docsOptional,
      errors: [{ messageId: "conflict" }],
    },
  ],
});

ruleTester.run("no-interceptor-layout", asRule(noInterceptorLayout), {
  valid: [
    { code: "export {};", filename: f("(marketing)/about/layout.tsx") },
    // a page inside an interceptor is fine — only layouts are dropped
    { code: "export {};", filename: f("feed/(.)photos/page.tsx") },
    { code: "export {};", filename: "/proj/src/lib/helper.ts" },
  ],
  invalid: [
    {
      code: "export {};",
      filename: f("feed/(.)photos/layout.tsx"),
      errors: [{ messageId: "ignored" }],
    },
    {
      code: "export {};",
      filename: f("photos/(..)preview/layout.tsx"),
      errors: [{ messageId: "ignored" }],
    },
  ],
});

// `require-interceptor-target` and `slot-needs-layout` are folder-level checks,
// so their fixtures live on real disk too.
const folderRoot = mkdtempSync(join(tmpdir(), "rrn-eslint-"));
const folderApp = join(folderRoot, "src", "app");
const writeFolder = (rel: string): string => {
  const full = join(folderApp, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, "export {};");
  return full;
};
// Interceptor with an existing target page → ok.
const previewTarget = writeFolder("gallery/preview/page.tsx");
const previewInterceptor = writeFolder("gallery/(.)preview/page.tsx");
// Interceptor whose target page doesn't exist → error.
const orphanInterceptor = writeFolder("orphan/(.)missing/page.tsx");
// Slot with an owning layout → ok; slot without one → error.
const slotWithLayout = writeFolder("dashboard/@team/page.tsx");
writeFolder("dashboard/layout.tsx");
const slotNoLayout = writeFolder("widgets/@chart/page.tsx");
afterAll(() => rmSync(folderRoot, { recursive: true, force: true }));

ruleTester.run("require-interceptor-target", asRule(requireInterceptorTarget), {
  valid: [
    { code: "export {};", filename: previewInterceptor },
    { code: "export {};", filename: previewTarget },
    // not an interceptor → ignored
    { code: "export {};", filename: slotWithLayout },
  ],
  invalid: [
    {
      code: "export {};",
      filename: orphanInterceptor,
      errors: [{ messageId: "missing" }],
    },
  ],
});

ruleTester.run("slot-needs-layout", asRule(slotNeedsLayout), {
  valid: [
    { code: "export {};", filename: slotWithLayout },
    // no slot segment → ignored
    { code: "export {};", filename: previewTarget },
  ],
  invalid: [
    {
      code: "export {};",
      filename: slotNoLayout,
      errors: [{ messageId: "missing" }],
    },
  ],
});

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
