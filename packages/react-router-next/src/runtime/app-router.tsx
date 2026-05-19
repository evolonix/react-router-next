import { useMemo, type JSX } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { buildRoutesFromModules, type RouteModuleMap } from "./app-routes";

export interface AppRouterProps {
  /**
   * Eager modules map for the route tree, keyed by `<appDir>/<route>/page.tsx`
   * (and friends). Build this from `import.meta.glob` under Vite, or from
   * `require.context` under webpack/Rspack — see `buildModulesFromContext`.
   */
  modules: RouteModuleMap;
  /**
   * Path prefix stripped from each `modules` key to recover the route path.
   * Must match the prefix used in the map (e.g. `"/src/app"`).
   */
  appDir: string;
  /** Router basename. Defaults to `"/"`. */
  basename?: string;
}

export default function AppRouter(props: AppRouterProps): JSX.Element {
  const { modules, appDir, basename = "/" } = props;
  const router = useMemo(
    () =>
      createBrowserRouter(buildRoutesFromModules(modules, appDir), {
        basename,
      }),
    [modules, appDir, basename],
  );
  return <RouterProvider router={router} />;
}
