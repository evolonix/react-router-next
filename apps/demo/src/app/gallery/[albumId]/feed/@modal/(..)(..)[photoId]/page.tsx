import { useEffect } from "react";
import { useNavigate } from "react-router";
import { FilePath } from "../../../../../../components/ui/code";
import { Heading } from "../../../../../../components/ui/heading";
import { Stack } from "../../../../../../components/ui/stack";
import { Text } from "../../../../../../components/ui/text";
import { generate as generateFeed } from "virtual:react-router-next/gallery/[albumId]/feed";
import type { RouteProps } from "virtual:react-router-next/gallery/[albumId]/[photoId]";
import { findAlbum } from "../../../../data";

export default function FeedPhotoModal({ params }: RouteProps) {
  const navigate = useNavigate();
  const album = findAlbum(params.albumId);
  const photo = album?.photos.find((p) => p.id === params.photoId);
  const closeTo = generateFeed({ albumId: params.albumId });

  useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      if (e.key === "Escape") navigate(closeTo);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, closeTo]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-30 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={() => navigate(closeTo)}
        className="absolute inset-0 bg-background/80 backdrop-blur"
      />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded border border-border bg-card text-card-foreground shadow-xl">
        <div
          aria-hidden
          className="h-56 w-full"
          style={{ background: photo?.color ?? "#888" }}
        />
        <Stack gap="xs" className="p-4">
          <Heading level={3}>{photo?.title ?? "Unknown photo"}</Heading>
          <Text size="sm" tone="muted">
            Two-level intercept —{" "}
            <FilePath>
              gallery/[albumId]/feed/@modal/(..)(..)[photoId]/page.tsx
            </FilePath>
            . <FilePath>(..)(..)</FilePath> pops the slot and{" "}
            <FilePath>feed/</FilePath>, landing on the same photo route as
            the album view's modal.
          </Text>
        </Stack>
      </div>
    </div>
  );
}
