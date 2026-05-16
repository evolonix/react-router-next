import { Code } from "../../../components/ui/code";
import { Divider } from "../../../components/ui/divider";
import { Heading } from "../../../components/ui/heading";
import { Stack } from "../../../components/ui/stack";
import { Text } from "../../../components/ui/text";

type FolderConvention = {
  name: string;
  effect: string;
  example: string;
};

const FOLDER_CONVENTIONS: FolderConvention[] = [
  {
    name: "foo/",
    effect: "Static URL segment.",
    example: "posts/page.tsx → /posts",
  },
  {
    name: "(group)/",
    effect: "Route group — folder is invisible in the URL.",
    example: "(marketing)/about/page.tsx → /about",
  },
  {
    name: "[id]/",
    effect: "Dynamic segment. Typed as { id: string } in params.",
    example: "posts/[postId]/page.tsx → /posts/:postId",
  },
  {
    name: "[...slug]/",
    effect: "Catch-all. Typed as { slug: string[] }.",
    example: "docs/[...slug]/page.tsx → /docs/*",
  },
  {
    name: "[[...slug]]/",
    effect: "Optional catch-all. Matches both bare and deep paths.",
    example: "files/[[...slug]]/page.tsx → /files and /files/*",
  },
  {
    name: "@slot/",
    effect:
      "Parallel route slot. Invisible in the URL; surfaces as a named prop on the parent layout.",
    example: "dashboard/@analytics/page.tsx → layout receives { analytics }",
  },
  {
    name: "_private/",
    effect:
      "Skipped by the router. Folder and its descendants are not routed but remain importable.",
    example: "photos/_components/dialog.tsx",
  },
  {
    name: "(.)x/",
    effect: "Intercepts /x at the same URL level (soft nav only).",
    example: "photos/@modal/(.)[id]/page.tsx intercepts /photos/:id",
  },
  {
    name: "(..)x/",
    effect: "Intercepts /x one filesystem level up.",
    example: "Inside a slot, (..)x pops the slot (same target as (.)x).",
  },
  {
    name: "(..)(..)x/",
    effect: "Intercepts /x two filesystem levels up.",
    example:
      "gallery/[albumId]/feed/@modal/(..)(..)[photoId] pops slot + feed.",
  },
  {
    name: "(...)x/",
    effect: "Intercepts /x at the app root, regardless of folder depth.",
    example: "gallery/[albumId]/feed/@modal/(...)search intercepts /search.",
  },
];

export default function FolderConventionsPage() {
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Heading level={2}>Folder conventions</Heading>
        <Text>
          Folder names control URL segments and special routing behavior. The
          router classifies each folder name once at build time, so naming is
          the entire API surface.
        </Text>
      </Stack>

      <Stack as="ul" gap="md" className="m-0 list-none p-0">
        {FOLDER_CONVENTIONS.map((c) => (
          <li
            key={c.name}
            className="grid grid-cols-1 gap-1 rounded border border-border p-3 sm:grid-cols-[10rem_1fr]"
          >
            <Code variant="plain" className="font-semibold text-foreground">
              {c.name}
            </Code>
            <Stack gap="xs">
              <Text size="sm">{c.effect}</Text>
              <Text size="xs" tone="muted">
                {c.example}
              </Text>
            </Stack>
          </li>
        ))}
      </Stack>

      <Divider />

      <Text size="sm" tone="muted">
        Inside an <Code variant="plain">@slot/</Code>, the immediate{" "}
        <Code variant="plain">(.)</Code> and <Code variant="plain">(..)</Code>{" "}
        operators collapse to the same target because the slot is the only
        segment available to pop. Reach for{" "}
        <Code variant="plain">(..)(..)</Code> when you need to escape the slot
        AND a real folder.
      </Text>
    </Stack>
  );
}
