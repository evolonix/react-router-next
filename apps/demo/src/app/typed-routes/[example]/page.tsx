import { useParams } from "react-router";
import { parseRouteParams, useRouteParams } from "@evolonix/react-router-next";
import { Code, FilePath } from "../../../components/ui/code";
import { Divider } from "../../../components/ui/divider";
import { Heading } from "../../../components/ui/heading";
import { NavLink } from "../../../components/ui/nav";
import { Stack } from "../../../components/ui/stack";
import { Text } from "../../../components/ui/text";
import {
  generate as generateExample,
  type RouteProps,
} from "virtual:react-router-next/typed-routes/[example]";

export default function TypedRouteExample({ params }: RouteProps) {
  // params is { example: string } via the virtual module — no string literal needed.
  const generic = useRouteParams<"typed-routes/[example]">();
  const functional = parseRouteParams(
    "typed-routes/[example]",
    useParams(),
  );

  return (
    <Stack gap="md">
      <Heading level={3}>params.example = "{params.example}"</Heading>

      <Stack gap="sm">
        <Heading level={4}>Generated RouteProps (per-route)</Heading>
        <Text size="sm" tone="muted">
          Importing <FilePath>RouteProps</FilePath> from{" "}
          <FilePath>virtual:react-router-next/typed-routes/[example]</FilePath>{" "}
          gives a component prop type inferred from the URL pattern. No
          generic argument required.
        </Text>
        <Code variant="plain" className="block whitespace-pre">
          {`function Page({ params }: RouteProps) {
  params.example; // typed as string
}`}
        </Code>
      </Stack>

      <Divider />

      <Stack gap="sm">
        <Heading level={4}>useRouteParams (generic form)</Heading>
        <Text size="sm" tone="muted">
          When you need params away from a page component, pass the route
          literal as the generic. The string lookup mirrors the filesystem
          path.
        </Text>
        <Code variant="plain" className="block">
          {`useRouteParams<"typed-routes/[example]">() = ${JSON.stringify(generic)}`}
        </Code>
      </Stack>

      <Stack gap="sm">
        <Heading level={4}>parseRouteParams (functional form)</Heading>
        <Text size="sm" tone="muted">
          Useful inside loaders, where hooks aren't available. Pass the route
          literal plus React Router's raw <FilePath>useParams()</FilePath>{" "}
          output.
        </Text>
        <Code variant="plain" className="block">
          {`parseRouteParams("typed-routes/[example]", useParams()) = ${JSON.stringify(functional)}`}
        </Code>
      </Stack>

      <Stack gap="sm">
        <Heading level={4}>generate() URL builder</Heading>
        <Text size="sm" tone="muted">
          Same virtual module exports a type-checked URL builder. Missing or
          mistyped params fail at compile time.
        </Text>
        <NavLink to={generateExample({ example: "another-value" })}>
          → {generateExample({ example: "another-value" })}
        </NavLink>
      </Stack>
    </Stack>
  );
}
