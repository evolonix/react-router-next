import { Code, FilePath } from "../../../components/ui/code";
import { Divider } from "../../../components/ui/divider";
import { Heading } from "../../../components/ui/heading";
import { Stack } from "../../../components/ui/stack";
import { Text } from "../../../components/ui/text";

type FileConvention = {
  name: string;
  purpose: string;
  notes: string;
};

const FILE_CONVENTIONS: FileConvention[] = [
  {
    name: "page.tsx",
    purpose: "Leaf route element; becomes the index when siblings exist.",
    notes:
      "Receives a typed `params` prop via the per-route `RouteProps` type.",
  },
  {
    name: "layout.tsx",
    purpose:
      "Wraps the segment's children via `<Outlet />`; receives slot props for `@slot` siblings.",
    notes: "Persists across navigations within the segment.",
  },
  {
    name: "template.tsx",
    purpose: "Like layout, but remounts on every navigation (keyed by URL).",
    notes:
      "Useful for entry animations, instrumentation, or any per-nav reset.",
  },
  {
    name: "loading.tsx",
    purpose:
      "Renders while React Router transitions OR while a descendant suspends.",
    notes:
      "Acts as both a `useNavigation()`-aware fallback and a React Suspense boundary.",
  },
  {
    name: "error.tsx",
    purpose: "Catches render errors and `notFound()` throws in the subtree.",
    notes:
      "Receives the error via `useRouteError()` from `@evolonix/react-router-next`.",
  },
  {
    name: "not-found.tsx",
    purpose:
      "Owned 404 for the segment. Triggered by `notFound()` or unmatched URLs.",
    notes:
      "Splat fallback is auto-wired so deeper paths fall through to the nearest ancestor.",
  },
  {
    name: "default.tsx",
    purpose:
      "Fallback element inside a `@slot/` when the slot has no match for the current URL.",
    notes: "Only used inside parallel-route slots.",
  },
];

export default function ConventionsPage() {
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Heading level={2}>File conventions</Heading>
        <Text>
          Special filenames inside a route folder are picked up automatically.
          Anything else is ignored by the router and remains importable as a
          regular module.
        </Text>
      </Stack>

      <Stack as="ul" gap="md" className="m-0 list-none p-0">
        {FILE_CONVENTIONS.map((c) => (
          <li
            key={c.name}
            className="grid grid-cols-1 gap-1 rounded border border-border p-3 sm:grid-cols-[8rem_1fr]"
          >
            <Code variant="plain" className="font-semibold text-foreground">
              {c.name}
            </Code>
            <Stack gap="xs">
              <Text size="sm">{c.purpose}</Text>
              <Text size="xs" tone="muted">
                {c.notes}
              </Text>
            </Stack>
          </li>
        ))}
      </Stack>

      <Divider />

      <Text size="sm" tone="muted">
        Folder naming conventions are documented separately at{" "}
        <FilePath>/folders</FilePath>.
      </Text>
    </Stack>
  );
}
