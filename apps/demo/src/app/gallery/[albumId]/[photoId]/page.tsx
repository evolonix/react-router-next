import { FilePath } from "../../../../components/ui/code";
import { Heading } from "../../../../components/ui/heading";
import { NavLink } from "../../../../components/ui/nav";
import { Stack } from "../../../../components/ui/stack";
import { Text } from "../../../../components/ui/text";
import { generate as generateAlbum } from "virtual:react-router-next/gallery/[albumId]";
import type { RouteProps } from "virtual:react-router-next/gallery/[albumId]/[photoId]";
import { findAlbum } from "../../data";

export default function GalleryPhotoPage({ params }: RouteProps) {
  const album = findAlbum(params.albumId);
  const photo = album?.photos.find((p) => p.id === params.photoId);
  return (
    <Stack gap="md">
      <NavLink
        to={generateAlbum({ albumId: params.albumId })}
        size="sm"
        tone="muted"
      >
        ← {album?.title ?? "Gallery"}
      </NavLink>
      <Heading level={3}>{photo?.title ?? "Unknown photo"}</Heading>
      <div
        aria-hidden
        className="h-72 w-full rounded"
        style={{ background: photo?.color ?? "#888" }}
      />
      <Text size="sm" tone="muted">
        Full-page target —{" "}
        <FilePath>src/app/gallery/[albumId]/[photoId]/page.tsx</FilePath>.
        Soft-navigated from the album grid this is overlaid by{" "}
        <FilePath>@modal/(.)[photoId]</FilePath>. From the feed view it's
        overlaid by <FilePath>@modal/(..)(..)[photoId]</FilePath> after popping
        the slot and the <FilePath>feed/</FilePath> segment.
      </Text>
    </Stack>
  );
}
