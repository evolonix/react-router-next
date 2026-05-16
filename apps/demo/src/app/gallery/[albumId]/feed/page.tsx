import { FilePath } from "../../../../components/ui/code";
import { Heading } from "../../../../components/ui/heading";
import { NavLink } from "../../../../components/ui/nav";
import { Stack } from "../../../../components/ui/stack";
import { Text } from "../../../../components/ui/text";
import { generate as generateAlbum } from "virtual:react-router-next/gallery/[albumId]";
import { generate as generatePhoto } from "virtual:react-router-next/gallery/[albumId]/[photoId]";
import { generate as generateSearch } from "virtual:react-router-next/search";
import type { RouteProps } from "virtual:react-router-next/gallery/[albumId]/feed";
import { findAlbum } from "../../data";

export default function FeedPage({ params }: RouteProps) {
  const album = findAlbum(params.albumId);
  if (!album) {
    return (
      <Stack gap="sm">
        <Heading level={3}>Album not found</Heading>
        <NavLink to="/gallery">← Back to gallery</NavLink>
      </Stack>
    );
  }
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <NavLink
          to={generateAlbum({ albumId: album.id })}
          size="sm"
          tone="muted"
        >
          ← {album.title}
        </NavLink>
        <Heading level={3}>{album.title} — feed view</Heading>
        <Text size="sm" tone="muted">
          One level deeper than the album. The slot at{" "}
          <FilePath>feed/@modal</FilePath> uses{" "}
          <FilePath>(..)(..)[photoId]</FilePath> to pop both the slot and{" "}
          <FilePath>feed/</FilePath> so the modal targets the same photo route
          as the album view. The <FilePath>(...)search</FilePath> entry is
          root-anchored — it intercepts <FilePath>/search</FilePath> from any
          depth.
        </Text>
      </Stack>
      <Stack gap="sm">
        <Heading level={4}>Photos</Heading>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {album.photos.map((p) => (
            <li key={p.id}>
              <NavLink
                to={generatePhoto({ albumId: album.id, photoId: p.id })}
                viewTransition={false}
                className="flex items-center gap-3 rounded border border-border p-2 no-underline hover:bg-muted/40"
              >
                <div
                  aria-hidden
                  className="h-10 w-10 rounded"
                  style={{ background: p.color }}
                />
                <Text size="sm">{p.title}</Text>
              </NavLink>
            </li>
          ))}
        </ul>
      </Stack>
      <Stack gap="sm">
        <Heading level={4}>Global search</Heading>
        <Text size="sm" tone="muted">
          The link below points at <FilePath>/search</FilePath> — outside the
          gallery tree entirely. The feed slot's{" "}
          <FilePath>(...)search</FilePath> interceptor still catches it.
        </Text>
        <div>
          <NavLink to={generateSearch()} viewTransition={false}>
            Open search →
          </NavLink>
        </div>
      </Stack>
    </Stack>
  );
}
