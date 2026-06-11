import catchAllMustBeLast from "./rules/catch-all-must-be-last";
import noConflictingRoutes from "./rules/no-conflicting-routes";
import noDuplicateDynamicParams from "./rules/no-duplicate-dynamic-params";
import noInterceptorLayout from "./rules/no-interceptor-layout";
import noSearchParamsExport from "./rules/no-search-params-export";
import requireInterceptorTarget from "./rules/require-interceptor-target";
import slotNeedsLayout from "./rules/slot-needs-layout";
import validDynamicSegments from "./rules/valid-dynamic-segments";
import type { RuleModule } from "./types";

export const rules: Record<string, RuleModule> = {
  "valid-dynamic-segments": validDynamicSegments,
  "no-duplicate-dynamic-params": noDuplicateDynamicParams,
  "catch-all-must-be-last": catchAllMustBeLast,
  "no-conflicting-routes": noConflictingRoutes,
  "require-interceptor-target": requireInterceptorTarget,
  "no-interceptor-layout": noInterceptorLayout,
  "slot-needs-layout": slotNeedsLayout,
  "no-search-params-export": noSearchParamsExport,
};

// ESLint flat-config plugin object. `configs.recommended` is a ready-to-spread
// flat config that registers this plugin under the `react-router-next` prefix.
const plugin: {
  meta: { name: string; version: string };
  rules: Record<string, RuleModule>;
  configs: Record<string, unknown>;
} = {
  meta: { name: "eslint-plugin-react-router-next", version: "0.0.0" },
  rules,
  configs: {},
};

plugin.configs.recommended = {
  plugins: { "react-router-next": plugin },
  rules: {
    "react-router-next/valid-dynamic-segments": "error",
    "react-router-next/no-duplicate-dynamic-params": "error",
    "react-router-next/catch-all-must-be-last": "error",
    "react-router-next/no-conflicting-routes": "error",
    "react-router-next/require-interceptor-target": "error",
    "react-router-next/no-interceptor-layout": "warn",
    "react-router-next/slot-needs-layout": "warn",
    "react-router-next/no-search-params-export": "warn",
  },
};

export default plugin;
