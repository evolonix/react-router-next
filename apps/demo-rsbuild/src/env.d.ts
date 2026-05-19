declare module "*.css";

// Rspack replaces `process.env.NODE_ENV` with a string literal at build time;
// declare it here so TypeScript stops worrying about the Node global.
declare const process: {
  env: { readonly NODE_ENV?: "development" | "production" | "test" };
};
