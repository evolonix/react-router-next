import parser from "@typescript-eslint/parser";
import reactRouterNext from "eslint-plugin-react-router-next";

export default [
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser,
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: "module" },
    },
  },
  // Lints the filesystem-routing conventions under src/app.
  reactRouterNext.configs.recommended,
];
