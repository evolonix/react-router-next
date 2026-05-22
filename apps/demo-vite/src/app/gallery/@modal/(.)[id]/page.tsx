import type { RouteProps } from "virtual:react-router-next/gallery/[id]";

import { Dialog } from "../../_components/dialog";
import { getPhoto } from "../../_lib/photos";

export default function GalleryModalPage({ params }: RouteProps) {
  const photo = getPhoto(params.id);
  if (!photo) return null;
  return (
    <Dialog title={photo.title} closeTo="/gallery">
      <div
        aria-hidden
        className="mb-4 h-48 w-full rounded-lg"
        style={{
          background: `linear-gradient(135deg, oklch(0.82 0.18 ${photo.hue}), oklch(0.45 0.18 ${photo.hue}))`,
        }}
      />
      <p className="text-sm text-zinc-700 dark:text-zinc-300">
        {photo.caption}
      </p>
      <p className="mt-4 text-xs text-zinc-600 dark:text-zinc-400">
        Rendered by{" "}
        <code className="font-mono">gallery/@modal/(.)[id]/page.tsx</code>.
        Refresh this URL to see the full-page version instead.
      </p>
    </Dialog>
  );
}
