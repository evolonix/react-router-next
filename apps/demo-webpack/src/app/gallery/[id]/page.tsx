import { notFound, type RouteProps } from "@evolonix/react-router-next";
import { Link } from "react-router";

import { CodeBlock } from "../../_components/code-block";
import { Explain } from "../../_components/explain";
import { getPhoto } from "../_lib/photos";

export default function GalleryItemPage({
  params,
}: RouteProps<"gallery/[id]">) {
  const photo = getPhoto(params.id);
  if (!photo) notFound();
  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-wider text-accent-intercept">
          gallery/[id]/page.tsx
        </p>
        <h1 className="text-xl font-semibold text-slate-900 md:text-2xl dark:text-slate-100">
          {photo.title}
        </h1>
      </header>

      <Explain title="Full-page (no intercept)" accent="intercept">
        <p>
          You're seeing this page because you arrived via a hard load — refresh,
          back/forward, or a direct visit — so the{" "}
          <code className="font-mono">@modal/</code> slot fell back to{" "}
          <code className="font-mono">default.tsx</code> and the main outlet
          rendered the full-page detail.
        </p>
        <CodeBlock filename="src/app/gallery/[id]/template.tsx">{`import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

export default function GalleryItemTemplate() {
  const { pathname } = useLocation();
  useEffect(() => {
    console.log("template mounted for", pathname);
  }, [pathname]);
  return <Outlet />;
}`}</CodeBlock>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          <code className="font-mono">template.tsx</code> wraps this page and
          remounts on every nav — open the console and click between photos to
          watch the mount/unmount messages.
        </p>
      </Explain>

      <div
        aria-hidden
        className="h-64 w-full rounded-xl"
        style={{
          background: `linear-gradient(135deg, oklch(0.82 0.18 ${photo.hue}), oklch(0.45 0.18 ${photo.hue}))`,
        }}
      />
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {photo.caption}
      </p>

      <Link
        to="/gallery"
        className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
      >
        ← back to gallery
      </Link>
    </div>
  );
}
