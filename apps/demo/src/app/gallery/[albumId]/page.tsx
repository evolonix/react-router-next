import { FilePath } from "../../../components/ui/code";
import { Heading } from "../../../components/ui/heading";
import { NavLink } from "../../../components/ui/nav";
import { Stack } from "../../../components/ui/stack";
import { Text } from "../../../components/ui/text";
import { generate as generateGallery } from "virtual:react-router-next/gallery";
import { generate as generateFeed } from "virtual:react-router-next/gallery/[albumId]/feed";
import { generate as generatePhoto } from "virtual:react-router-next/gallery/[albumId]/[photoId]";
import type { RouteProps } from "virtual:react-router-next/gallery/[albumId]";
import { findAlbum } from "../data";

export default function AlbumPage({ params }: RouteProps) {
  const album = findAlbum(params.albumId);
  if (!album) {
    return (
      <Stack gap="sm">
        <Heading level={3}>Album not found</Heading>
        <NavLink to={generateGallery()}>← Back to gallery</NavLink>
      </Stack>
    );
  }
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <NavLink to={generateGallery()} size="sm" tone="muted">
          ← Gallery
        </NavLink>
        <Heading level={3}>{album.title}</Heading>
        <Text size="sm" tone="muted">
          Click a photo. The album's <FilePath>@modal</FilePath> slot pairs with
          the <FilePath>(.)[photoId]</FilePath> interceptor to overlay the
          photo without unmounting the grid. Or visit the{" "}
          <NavLink to={generateFeed({ albumId: album.id })} size="sm">
            feed view
          </NavLink>{" "}
          for deeper interceptor examples.
        </Text>
      </Stack>
      <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4">
        {album.photos.map((p) => (
          <li key={p.id}>
            <NavLink
              to={generatePhoto({ albumId: album.id, photoId: p.id })}
              viewTransition={false}
              className="block overflow-hidden rounded border border-border no-underline"
            >
              <div
                aria-hidden
                className="h-28 w-full"
                style={{ background: p.color }}
              />
              <div className="px-2 py-1">
                <Text size="sm">{p.title}</Text>
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
    </Stack>
  );
}
