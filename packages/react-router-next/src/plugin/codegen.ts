import { existsSync, readdirSync, rmdirSync, unlinkSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { writeIfChanged } from "./fs-utils";
import {
  renderAliasMap,
  renderAppTreeModule,
  renderRuntimeModule,
  type AppTreeEntry,
} from "./render";
import {
  buildRouteSchemaMap,
  routeKeyFor,
  scanAppDir,
  scanRouteFiles,
  toPosix,
} from "./scan";

export type CodegenOptions = {
  /** Project root used to resolve relative paths. Defaults to `process.cwd()`. */
  root?: string;
  /** Source-of-truth directory containing `page.tsx`/`layout.tsx`. Defaults to `src/app`. */
  appDir?: string;
  /** Where the codegen output is written. Defaults to `<root>/node_modules/.react-router-next`. */
  outDir?: string;
};

export type CodegenResult = {
  appDir: string;
  outDir: string;
  routeKeys: string[];
  /** Absolute paths of every file written or kept this run. */
  files: string[];
  /** Absolute paths of stale files removed this run. */
  removed: string[];
  written: number;
};

function resolveAgainst(root: string, p: string): string {
  return isAbsolute(p) ? p : resolve(root, p);
}

function routeFilePath(outDir: string, routeKey: string): string {
  const slug = routeKey === "" ? "_root" : routeKey;
  return join(outDir, "routes", `${slug}.js`);
}

function listExistingRouteFiles(routesDir: string): string[] {
  if (!existsSync(routesDir)) return [];
  let entries;
  try {
    entries = readdirSync(routesDir, { recursive: true, withFileTypes: true });
  } catch {
    return [];
  }
  const out: string[] = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".js")) continue;
    const dir =
      (entry as unknown as { parentPath?: string; path?: string }).parentPath ??
      (entry as unknown as { path?: string }).path ??
      routesDir;
    out.push(join(dir, entry.name));
  }
  return out;
}

function pruneEmptyDirs(root: string): void {
  if (!existsSync(root)) return;
  let entries;
  try {
    entries = readdirSync(root, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    pruneEmptyDirs(join(root, entry.name));
  }
  let remaining;
  try {
    remaining = readdirSync(root);
  } catch {
    return;
  }
  if (remaining.length === 0) {
    try {
      rmdirSync(root);
    } catch {
      // race or permissions — ignore
    }
  }
}

/**
 * Emit physical `.js` shims for every `virtual:react-router-next/...` module
 * the Vite plugin would resolve, plus an `aliases.json` that maps those
 * specifiers to the emitted files. Run before a non-Vite bundler's build/dev
 * step to get the same `virtual:` import experience under webpack/Rspack/etc.
 */
export function generateRouteModules(opts: CodegenOptions = {}): CodegenResult {
  const root = opts.root ?? process.cwd();
  const appDir = resolveAgainst(root, opts.appDir ?? "src/app");
  const outDir = resolveAgainst(
    root,
    opts.outDir ?? "node_modules/.react-router-next",
  );

  const { routeDirs } = scanAppDir(appDir);
  const routeKeys = [
    ...new Set(routeDirs.map((dir) => routeKeyFor(appDir, dir))),
  ].sort((a, b) => a.localeCompare(b));

  const appDirRootRelative =
    "/" + toPosix(relative(root, appDir)).replace(/^\/+/, "");

  const routeFiles = scanRouteFiles(appDir);
  const entries: AppTreeEntry[] = routeFiles.map((file) => {
    const rel = toPosix(relative(outDir, file));
    // Node-style relative paths start with "../" or are bare segments. Bundlers
    // need the leading "./" to recognize a bare path as relative rather than
    // a package specifier — prepend it when missing.
    const importSpecifier = rel.startsWith(".") ? rel : `./${rel}`;
    const relInAppDir = toPosix(relative(appDir, file));
    const moduleKey = `${appDirRootRelative}/${relInAppDir}`;
    return { importSpecifier, moduleKey };
  });

  const writtenFiles: string[] = [];
  const files: string[] = [];
  let written = 0;

  const appTreePath = join(outDir, "app-tree.js");
  if (
    writeIfChanged(
      appTreePath,
      renderAppTreeModule({ appDirRootRelative, entries }),
    )
  ) {
    writtenFiles.push(appTreePath);
    written++;
  }
  files.push(appTreePath);

  const aliasesPath = join(outDir, "aliases.json");
  if (writeIfChanged(aliasesPath, renderAliasMap({ outDir }))) {
    writtenFiles.push(aliasesPath);
    written++;
  }
  files.push(aliasesPath);

  const schemaMap = buildRouteSchemaMap(appDir);
  const expectedRouteFiles = new Set<string>();
  for (const routeKey of routeKeys) {
    const dest = routeFilePath(outDir, routeKey);
    expectedRouteFiles.add(dest);
    files.push(dest);
    const schemaFile = schemaMap.get(routeKey);
    // Specifier is relative to the emitted route file's directory (route keys
    // can nest under `routes/`), and keeps its extension to match the
    // app-tree imports webpack/Rspack already resolve.
    let searchSpecifier: string | undefined;
    if (schemaFile) {
      const rel = toPosix(relative(dirname(dest), schemaFile));
      searchSpecifier = rel.startsWith(".") ? rel : `./${rel}`;
    }
    if (writeIfChanged(dest, renderRuntimeModule(routeKey, searchSpecifier))) {
      writtenFiles.push(dest);
      written++;
    }
  }

  const routesDir = join(outDir, "routes");
  const existingRouteFiles = listExistingRouteFiles(routesDir);
  const removed: string[] = [];
  for (const file of existingRouteFiles) {
    if (expectedRouteFiles.has(file)) continue;
    try {
      unlinkSync(file);
      removed.push(file);
    } catch {
      // ignore — best-effort prune
    }
  }
  if (removed.length > 0) pruneEmptyDirs(routesDir);

  return { appDir, outDir, routeKeys, files, removed, written };
}
