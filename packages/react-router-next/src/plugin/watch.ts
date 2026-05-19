/**
 * Filesystem watcher for the CLI's --watch mode. Lazy-imports chokidar so the
 * dependency is optional: consumers who never use --watch don't need it
 * installed.
 */

export type WatchHandle = {
  close(): Promise<void>;
};

type ChokidarWatcher = {
  on(event: "add" | "unlink", cb: (path: string) => void): unknown;
  close(): Promise<void>;
};

type ChokidarLike = {
  watch(path: string, opts?: { ignoreInitial?: boolean }): ChokidarWatcher;
};

/**
 * Coalesce re-entrant triggers. If a call arrives while `onChange` is already
 * running, the next run is queued (just once, no matter how many triggers
 * pile up) and dispatched on completion. Exported for unit-testing without
 * touching the filesystem.
 */
export function createTrigger(
  onChange: () => void | Promise<void>,
): () => Promise<void> {
  let running = false;
  let pending = false;

  const trigger = async (): Promise<void> => {
    if (running) {
      pending = true;
      return;
    }
    running = true;
    pending = false;
    try {
      await onChange();
    } finally {
      running = false;
      if (pending) await trigger();
    }
  };

  return trigger;
}

async function loadChokidar(): Promise<ChokidarLike> {
  let mod: unknown;
  try {
    mod = await import("chokidar");
  } catch (err) {
    throw new Error(
      "[react-router-next] --watch requires the 'chokidar' package. " +
        "Install it as a devDependency: npm i -D chokidar\n" +
        `(${(err as Error).message})`,
    );
  }
  const candidate = mod as { watch?: unknown; default?: { watch?: unknown } };
  const watch = candidate.watch ?? candidate.default?.watch;
  if (typeof watch !== "function") {
    throw new Error(
      "[react-router-next] chokidar is installed but does not expose a `watch` function.",
    );
  }
  return { watch: watch as ChokidarLike["watch"] };
}

/**
 * Watch `appDir` for routing-relevant add/unlink events. Content edits don't
 * change the route map, so we don't subscribe to `change`. Returns a handle
 * the caller can close (CLI does so on SIGINT/SIGTERM).
 */
export async function watchAppDir(
  appDir: string,
  onChange: () => void | Promise<void>,
): Promise<WatchHandle> {
  const chokidar = await loadChokidar();
  const trigger = createTrigger(onChange);
  const watcher = chokidar.watch(appDir, { ignoreInitial: true });
  watcher.on("add", () => {
    void trigger();
  });
  watcher.on("unlink", () => {
    void trigger();
  });
  return {
    async close() {
      await watcher.close();
    },
  };
}
