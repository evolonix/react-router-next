import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { matchPath, useLocation } from "react-router";
import { cn } from "../../lib/cn";
import {
  CATEGORY_LABEL,
  FEATURE_PARAM,
  findEntryForPath,
  type FeatureEntry,
} from "../../lib/feature-catalog";
import { Code, FilePath } from "./code";
import { SkeletonLine } from "./skeleton";
import { SourceViewer } from "./source-viewer";

const BANNERS_HIDDEN_KEY = "demo-banners-hidden";
const PER_ROUTE_PREFIX = "demo-banner-dismissed:";

function readGlobalHidden(): boolean {
  try {
    return window.localStorage.getItem(BANNERS_HIDDEN_KEY) === "all";
  } catch {
    return false;
  }
}

function readPerRouteDismissed(entryId: string): boolean {
  try {
    return (
      window.sessionStorage.getItem(`${PER_ROUTE_PREFIX}${entryId}`) === "1"
    );
  } catch {
    return false;
  }
}

function writePerRouteDismissed(entryId: string) {
  try {
    window.sessionStorage.setItem(`${PER_ROUTE_PREFIX}${entryId}`, "1");
  } catch {
    /* noop */
  }
}

function writeGlobalHidden() {
  try {
    window.localStorage.setItem(BANNERS_HIDDEN_KEY, "all");
  } catch {
    /* noop */
  }
}

/**
 * Resolves the FeatureEntry for the current URL and renders the explanation
 * banner. Returns null when no entry matches, the global toggle is set, or
 * the user dismissed the banner for this entry in this session.
 *
 * Listens for the "demo:banner-reset" custom event so the sidebar's reset
 * button can re-show banners without a page reload.
 */
export function FeatureCallout({ className }: { className?: string }) {
  const { pathname, search } = useLocation();
  const featureId = new URLSearchParams(search).get(FEATURE_PARAM);
  const entry = useMemo<FeatureEntry | null>(
    () => findEntryForPath(pathname, matchPath, featureId),
    [pathname, featureId],
  );

  const [hidden, setHidden] = useState(() => {
    if (typeof window === "undefined") return false;
    if (readGlobalHidden()) return true;
    return entry ? readPerRouteDismissed(entry.id) : false;
  });

  const [openFile, setOpenFile] = useState<string | null>(null);

  // Re-evaluate dismissal when the route (and thus the entry) changes.
  const currentEntryId = entry?.id ?? null;
  const [processedEntryId, setProcessedEntryId] = useState(currentEntryId);
  if (currentEntryId !== processedEntryId) {
    setProcessedEntryId(currentEntryId);
    if (entry) {
      if (readGlobalHidden() || readPerRouteDismissed(entry.id)) {
        setHidden(true);
      } else {
        setHidden(false);
        setOpenFile(null);
      }
    }
  }

  useEffect(() => {
    function onReset() {
      if (!entry) return;
      setHidden(readGlobalHidden() || readPerRouteDismissed(entry.id));
    }
    window.addEventListener("demo:banner-reset", onReset);
    return () => window.removeEventListener("demo:banner-reset", onReset);
  }, [entry]);

  const handleDismiss = useCallback(() => {
    if (!entry) return;
    writePerRouteDismissed(entry.id);
    setHidden(true);
  }, [entry]);

  const handleHideAll = useCallback(() => {
    writeGlobalHidden();
    setHidden(true);
  }, []);

  if (!entry || hidden) return null;

  return (
    <section
      className={cn(
        "mb-4 rounded border border-border bg-accent/30 p-4 text-sm",
        className,
      )}
      aria-label="Feature explanation"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-wide text-accent-foreground">
            {CATEGORY_LABEL[entry.category]}
          </p>
          <h2 className="m-0 mt-0.5 text-lg font-semibold text-foreground">
            {entry.name}
          </h2>
          <p className="m-0 mt-1">
            <Code variant="plain" className="text-xs">
              {entry.convention}
            </Code>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded border border-border bg-background px-2 py-1 text-xs text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            title="Hide for this route this session"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={handleHideAll}
            className="rounded border border-border bg-background px-2 py-1 text-xs text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            title="Hide on every page (persisted)"
          >
            Hide all
          </button>
        </div>
      </header>

      <p className="mt-3 mb-0 text-foreground">{entry.description}</p>

      {entry.whatToLookFor.length > 0 ? (
        <>
          <p className="mt-3 mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            What to look for
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            {entry.whatToLookFor.map((bullet) => (
              <li key={bullet} className="text-foreground">
                {bullet}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {entry.files.length > 0 ? (
        <>
          <p className="mt-3 mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Source files
          </p>
          <ul className="m-0 list-none space-y-1 p-0">
            {entry.files.map((file) => {
              const active = openFile === file;
              return (
                <li key={file}>
                  <button
                    type="button"
                    onClick={() => setOpenFile(active ? null : file)}
                    className="inline-flex items-center gap-2 rounded px-1 py-0.5 text-left text-xs hover:bg-muted/40"
                    aria-expanded={active}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "inline-block transition-transform",
                        active ? "rotate-90" : "rotate-0",
                      )}
                    >
                      ›
                    </span>
                    <FilePath>{`src/app/${file}`}</FilePath>
                  </button>
                  {active ? (
                    <div className="mt-1">
                      <Suspense
                        fallback={
                          <div className="space-y-2 p-3">
                            <SkeletonLine width="3/4" height="sm" />
                            <SkeletonLine width="2/3" height="sm" />
                            <SkeletonLine width="1/2" height="sm" />
                          </div>
                        }
                      >
                        <SourceViewer path={file} />
                      </Suspense>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </>
      ) : null}
    </section>
  );
}
