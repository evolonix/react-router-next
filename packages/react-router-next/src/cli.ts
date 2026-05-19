#!/usr/bin/env node
import { generateRouteModules, type CodegenResult } from "./plugin/codegen";
import {
  generateRouteTypes,
  type GenerateResult as TypegenResult,
} from "./plugin/typegen";

type ParsedArgs = {
  command: string | undefined;
  flags: Record<string, string | true>;
  rest: string[];
};

function parseArgs(argv: string[]): ParsedArgs {
  const flags: Record<string, string | true> = {};
  const rest: string[] = [];
  let command: string | undefined;
  for (const arg of argv) {
    if (arg.startsWith("--")) {
      const eq = arg.indexOf("=");
      if (eq === -1) {
        flags[arg.slice(2)] = true;
      } else {
        flags[arg.slice(2, eq)] = arg.slice(eq + 1);
      }
    } else if (!command) {
      command = arg;
    } else {
      rest.push(arg);
    }
  }
  return { command, flags, rest };
}

function printHelp(): void {
  console.log(`react-router-next — typed filesystem routing for React Router 7

Usage:
  react-router-next typegen [options]   Write the ambient routes.d.ts shim
  react-router-next codegen [options]   Write physical .js shims + aliases.json
                                        for non-Vite bundlers (webpack/Rspack/…)
  react-router-next gen     [options]   Run typegen + codegen in one shot

Options (apply to every command):
  --app-dir <path>   Source directory of pages/layouts (default: src/app)
  --out-dir <path>   Output directory (default: node_modules/.react-router-next)
  --watch            Keep running; regenerate on route file add/unlink
                     (requires the optional 'chokidar' peer dependency)
  --help, -h         Show this message
`);
}

type Options = { appDir?: string; outDir?: string };

function optionsFromFlags(flags: Record<string, string | true>): Options {
  return {
    appDir: typeof flags["app-dir"] === "string" ? flags["app-dir"] : undefined,
    outDir: typeof flags["out-dir"] === "string" ? flags["out-dir"] : undefined,
  };
}

function logTypegen(result: TypegenResult): void {
  console.log(
    `[react-router-next] typegen: ${result.routeKeys.length} route(s); shim ${
      result.written ? "updated" : "unchanged"
    } at ${result.shimPath}`,
  );
}

function logCodegen(result: CodegenResult): void {
  const summary =
    result.written === 0 && result.removed.length === 0
      ? "unchanged"
      : `${result.written} file(s) written, ${result.removed.length} removed`;
  console.log(
    `[react-router-next] codegen: ${result.routeKeys.length} route(s); ${summary} under ${result.outDir}`,
  );
}

type Runner = () => { appDir: string };

function makeRunner(
  command: "typegen" | "codegen" | "gen",
  options: Options,
): Runner {
  return () => {
    if (command === "typegen") {
      const result = generateRouteTypes(options);
      logTypegen(result);
      return { appDir: result.appDir };
    }
    if (command === "codegen") {
      const result = generateRouteModules(options);
      logCodegen(result);
      return { appDir: result.appDir };
    }
    const typeResult = generateRouteTypes(options);
    logTypegen(typeResult);
    const modResult = generateRouteModules(options);
    logCodegen(modResult);
    return { appDir: modResult.appDir };
  };
}

async function runWithOptionalWatch(
  runner: Runner,
  watch: boolean,
): Promise<void> {
  const { appDir } = runner();
  if (!watch) return;

  const { watchAppDir } = await import("./plugin/watch");
  const handle = await watchAppDir(appDir, () => {
    runner();
  });
  console.log(
    `[react-router-next] watching ${appDir} for route file changes (Ctrl-C to stop)`,
  );

  const stop = async (code: number): Promise<void> => {
    await handle.close();
    process.exit(code);
  };
  process.on("SIGINT", () => void stop(130));
  process.on("SIGTERM", () => void stop(0));
}

async function main(): Promise<void> {
  const { command, flags } = parseArgs(process.argv.slice(2));

  if (flags.help || flags.h || command === "help") {
    printHelp();
    return;
  }

  const options = optionsFromFlags(flags);
  const watch = flags.watch === true;

  switch (command) {
    case "typegen":
    case "codegen":
    case "gen":
      await runWithOptionalWatch(makeRunner(command, options), watch);
      return;
    default:
      if (command) {
        console.error(`[react-router-next] Unknown command: ${command}`);
      }
      printHelp();
      process.exit(command ? 1 : 0);
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
