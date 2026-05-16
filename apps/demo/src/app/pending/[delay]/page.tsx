import { useLoaderData } from "react-router";
import { FilePath } from "../../../components/ui/code";
import { Heading } from "../../../components/ui/heading";
import { NavLink } from "../../../components/ui/nav";
import { Stack } from "../../../components/ui/stack";
import { Text } from "../../../components/ui/text";
import { generate as generatePending } from "virtual:react-router-next/pending";

export default function DelayPage() {
  const { ms } = useLoaderData() as { ms: number };
  return (
    <Stack gap="md">
      <NavLink to={generatePending()} size="sm" tone="muted">
        ← Back to pending demo
      </NavLink>
      <Heading level={3}>Loaded after {ms} ms</Heading>
      <Text size="sm" tone="muted">
        The loader at <FilePath>pending/[delay]/loader.ts</FilePath> held the
        transition open for {ms} milliseconds. While it ran,{" "}
        <FilePath>useIsRoutePending()</FilePath> returned{" "}
        <FilePath>true</FilePath> for every subscriber.
      </Text>
    </Stack>
  );
}
