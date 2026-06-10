import { isAbsolute, relative, resolve } from "node:path";
import type { Plugin } from "vite";
import { ROUTE_FILE_NAMES } from "../runtime/route-files";
import { renderRuntimeModule } from "./render";
import {
  buildRouteSchemaMap,
  ROUTE_FILE_RE,
  routeKeyFor,
  scanAppDir,
  toPosix,
} from "./scan";
import { generateRouteTypes } from "./typegen";

export type ReactRouterNextOptions = {
  /** Source-of-truth directory containing `page.tsx`/`layout.tsx`. Defaults to `src/app`. */
  appDir?: string;
  /** Where the ambient `routes.d.ts` shim is written. Defaults to `<root>/node_modules/.react-router-next`. */
  outDir?: string;
};

/**
 * @deprecated Use {@link ReactRouterNextOptions} instead. This alias will be
 * removed in a future release.
 */
export type RouteTypegenOptions = ReactRouterNextOptions;

const VIRTUAL_PREFIX = "virtual:react-router-next/";
const APP_TREE_ID = `${VIRTUAL_PREFIX}app-tree`;

const RESOLVED_PREFIX = "\0";

function isOurVirtual(id: string): boolean {
  return id.startsWith(VIRTUAL_PREFIX);
}

function resolveOpt(root: string, p: string): string {
  return isAbsolute(p) ? p : resolve(root, p);
}

export function reactRouterNext(options: ReactRouterNextOptions = {}): Plugin {
  let root = process.cwd();
  let appDir = "";
  let outDir = "";
  let routeKeys = new Set<string>();
  // route key -> absolute leaf file that exports a `searchParams` schema
  let routeSchemas = new Map<string, string>();

  function resolvePaths(viteRoot: string): void {
    root = viteRoot;
    appDir = resolveOpt(root, options.appDir ?? "src/app");
    outDir = resolveOpt(
      root,
      options.outDir ?? "node_modules/.react-router-next",
    );
  }

  function regenerate(): void {
    const result = generateRouteTypes({ root, appDir, outDir });
    routeKeys = new Set(result.routeKeys);
    routeSchemas = buildRouteSchemaMap(appDir);
  }

  function refreshKnownKeys(): void {
    const { routeDirs } = scanAppDir(appDir);
    routeKeys = new Set(routeDirs.map((d) => routeKeyFor(appDir, d)));
    routeSchemas = buildRouteSchemaMap(appDir);
  }

  return {
    name: "react-router-next:typegen",
    enforce: "pre",

    configResolved(config) {
      resolvePaths(config.root);
      refreshKnownKeys();
    },

    buildStart() {
      regenerate();
    },

    configureServer(server) {
      const onStructural = (file: string): void => {
        if (ROUTE_FILE_RE.test(file)) regenerate();
      };
      server.watcher.on("add", onStructural);
      server.watcher.on("unlink", onStructural);

      // A `searchParams` export can be added to (or removed from) an existing
      // file with no add/unlink event. Re-detect schemas on content changes and,
      // only when a route's schema presence actually flips, regenerate types and
      // invalidate that route's virtual module so `load()` re-emits the new
      // shape. Unchanged routes fall through to normal HMR.
      server.watcher.on("change", (file: string): void => {
        if (!ROUTE_FILE_RE.test(file)) return;
        const before = routeSchemas;
        const after = buildRouteSchemaMap(appDir);
        const changed: string[] = [];
        for (const key of new Set([...before.keys(), ...after.keys()])) {
          if ((before.get(key) ?? "") !== (after.get(key) ?? "")) {
            changed.push(key);
          }
        }
        if (changed.length === 0) return;
        regenerate();
        for (const key of changed) {
          const id =
            RESOLVED_PREFIX + VIRTUAL_PREFIX + (key === "" ? "_root" : key);
          const mod = server.moduleGraph.getModuleById(id);
          if (mod) server.moduleGraph.invalidateModule(mod);
        }
        server.ws.send({ type: "full-reload" });
      });
    },

    resolveId(id) {
      if (id === APP_TREE_ID) return RESOLVED_PREFIX + APP_TREE_ID;
      if (isOurVirtual(id)) return RESOLVED_PREFIX + id;
      return null;
    },

    load(id) {
      if (!id.startsWith(RESOLVED_PREFIX)) return null;
      const realId = id.slice(RESOLVED_PREFIX.length);

      if (realId === APP_TREE_ID) {
        // Vite resolves `import.meta.glob` patterns relative to the project
        // root when they begin with `/`. Virtual modules have no importer
        // path, so absolute filesystem paths or `./` patterns won't match —
        // root-relative is the only form that works here. The keys Vite
        // returns are also root-relative (e.g. "/src/app/page.tsx"), so we
        // export a matching `appDir` for the tree builder to strip.
        const rootRelative =
          "/" + toPosix(relative(root, appDir)).replace(/^\/+/, "");
        const pattern = `${rootRelative}/**/{${ROUTE_FILE_NAMES.join(",")}}.{tsx,jsx,ts,js}`;
        return `\
const modules = import.meta.glob(${JSON.stringify(pattern)}, { eager: true });
const appDir = ${JSON.stringify(rootRelative)};
export { modules, appDir };
`;
      }

      if (!isOurVirtual(realId)) return null;
      const slug = realId.slice(VIRTUAL_PREFIX.length);
      const routeKey = slug === "_root" ? "" : slug;
      if (!routeKeys.has(routeKey)) {
        // Refresh in case a new page was just added before the watcher fired.
        refreshKnownKeys();
        if (!routeKeys.has(routeKey)) {
          this.error(
            `[react-router-next] Unknown route "${routeKey}". ` +
              `Expected a page.tsx or layout.tsx under ${appDir}.`,
          );
        }
      }
      const schemaFile = routeSchemas.get(routeKey);
      // Virtual modules have no importer path; root-relative (with extension,
      // matching the app-tree glob keys) is the form Vite resolves here.
      const searchSpecifier = schemaFile
        ? "/" + toPosix(relative(root, schemaFile)).replace(/^\/+/, "")
        : undefined;
      return renderRuntimeModule(routeKey, searchSpecifier);
    },
  };
}

/**
 * @deprecated Use {@link reactRouterNext} instead. This alias will be removed
 * in a future release.
 */
export const routeTypegen = reactRouterNext;
