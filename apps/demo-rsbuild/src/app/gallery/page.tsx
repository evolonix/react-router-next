import { generate } from "@evolonix/react-router-next";
import { Link } from "react-router";

import { CodeBlock } from "../_components/code-block";
import { Explain } from "../_components/explain";
import { PHOTOS } from "./_lib/photos";

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-wider text-accent-intercept">
          gallery/ + @modal/(.)[id]
        </p>
        <h1 className="text-xl font-semibold text-zinc-900 md:text-2xl dark:text-zinc-100">
          Intercepting routes
        </h1>
      </header>

      <Explain
        title="Click a thumbnail to open a modal"
        accent="intercept"
        tag="(.)[id]"
      >
        <p>
          A soft click navigates to <code>/gallery/:id</code>. The{" "}
          <code className="font-mono">@modal/</code> slot matches first via the
          interceptor <code className="font-mono">(.)[id]</code> and shows a
          dialog — the grid below stays mounted. Refresh on that same URL and
          you'll get the full-page{" "}
          <code className="font-mono">[id]/page.tsx</code> instead.
        </p>
        <CodeBlock filename="src/app/gallery/">{`gallery/
├── layout.tsx              # ({ modal }) => <><Outlet />{modal}</>
├── page.tsx                # grid (this file)
├── [id]/
│   ├── page.tsx            # full-page detail (refresh / back)
│   └── template.tsx        # remounts on every nav
└── @modal/
    ├── default.tsx         # null fallback when no photo selected
    └── (.)[id]/page.tsx    # modal — rendered on soft nav`}</CodeBlock>
      </Explain>

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3">
        {PHOTOS.map((photo) => (
          <li key={photo.id}>
            <Link
              to={generate("gallery/[id]", { id: photo.id })}
              className="group block overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div
                aria-hidden
                className="h-24 w-full md:h-28"
                style={{
                  background: `linear-gradient(135deg, oklch(0.82 0.18 ${photo.hue}), oklch(0.55 0.18 ${photo.hue}))`,
                }}
              />
              <div className="p-3">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {photo.title}
                </p>
                <p className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                  /gallery/{photo.id}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
