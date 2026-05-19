import type { JSX } from "react";
import {
  modules as virtualModules,
  appDir as virtualAppDir,
} from "virtual:react-router-next/app-tree";
import CoreAppRouter, {
  type AppRouterProps as CoreAppRouterProps,
} from "./runtime/app-router";

export interface AppRouterProps extends Partial<CoreAppRouterProps> {}

/**
 * Vite-wired `<AppRouter />`. Reads `modules` and `appDir` from the Vite
 * plugin's `virtual:react-router-next/app-tree` module, and defaults
 * `basename` to `import.meta.env.BASE_URL`. Props override the defaults.
 */
export default function AppRouter(props: AppRouterProps = {}): JSX.Element {
  const modules = props.modules ?? virtualModules;
  const appDir = props.appDir ?? virtualAppDir;
  const basename =
    props.basename ??
    ((import.meta.env.BASE_URL ?? "/").replace(/\/$/, "") || "/");
  return (
    <CoreAppRouter modules={modules} appDir={appDir} basename={basename} />
  );
}

export { AppRouter };
