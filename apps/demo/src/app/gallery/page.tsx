import { FilePath } from "../../components/ui/code";
import { Heading } from "../../components/ui/heading";
import { NavLink } from "../../components/ui/nav";
import { Stack } from "../../components/ui/stack";
import { Text } from "../../components/ui/text";
import { generate as generateAlbum } from "virtual:react-router-next/gallery/[albumId]";
import { ALBUMS } from "./data";

export default function GalleryPage() {
  return (
    <Stack gap="md">
      <Text>
        The gallery section stages all three multi-level interceptor depths in a
        single navigable flow. Each album owns its own modal slot; the deeper{" "}
        <FilePath>feed/</FilePath> view stacks another slot that uses{" "}
        <FilePath>(..)(..)</FilePath> and <FilePath>(...)</FilePath>
        operators to reach photos and the global search target.
      </Text>
      <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
        {ALBUMS.map((a) => (
          <li key={a.id}>
            <NavLink
              to={generateAlbum({ albumId: a.id })}
              tone="default"
              className="block rounded border border-border p-3 no-underline hover:bg-muted/40"
            >
              <Stack gap="xs">
                <Heading level={4}>{a.title}</Heading>
                <Text size="sm" tone="muted">
                  {a.blurb}
                </Text>
              </Stack>
            </NavLink>
          </li>
        ))}
      </ul>
    </Stack>
  );
}
