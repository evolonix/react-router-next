// Ambient declaration for the `app-tree` virtual module the Vite plugin
// serves. Mirrors what `renderRouteShim` writes into a consumer's generated
// `routes.d.ts`, so this file lets the package itself typecheck without a
// `@ts-expect-error` on the import in `vite-client.tsx`.
declare module "virtual:react-router-next/app-tree" {
  import type { RouteModuleMap } from "./runtime/app-routes";

  export const modules: RouteModuleMap;
  export const appDir: string;
}
