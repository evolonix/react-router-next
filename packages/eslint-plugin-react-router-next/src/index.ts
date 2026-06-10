import noDuplicateDynamicParams from "./rules/no-duplicate-dynamic-params";
import noSearchParamsExport from "./rules/no-search-params-export";
import validDynamicSegments from "./rules/valid-dynamic-segments";
import type { RuleModule } from "./types";

export const rules: Record<string, RuleModule> = {
  "valid-dynamic-segments": validDynamicSegments,
  "no-duplicate-dynamic-params": noDuplicateDynamicParams,
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
    "react-router-next/no-search-params-export": "warn",
  },
};

export default plugin;
