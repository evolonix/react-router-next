import { useLocation } from "react-router";
import { Card } from "../../components/ui/card";
import { FilePath } from "../../components/ui/code";
import { Heading } from "../../components/ui/heading";
import { NavLink } from "../../components/ui/nav";
import { Stack } from "../../components/ui/stack";
import { Text } from "../../components/ui/text";
import { generate as generateInbox } from "virtual:react-router-next/inbox";

export default function InboxNotFound() {
  const location = useLocation();
  return (
    <Card padding="lg" align="center">
      <Stack gap="sm" align="center">
        <Heading level={2}>Message not found</Heading>
        <Text tone="muted">
          No message matches <FilePath>{location.pathname}</FilePath>. This page
          comes from <FilePath>src/app/inbox/not-found.tsx</FilePath> — the
          nearest <FilePath>not-found.tsx</FilePath> wins, so the section nav
          stays mounted.
        </Text>
        <NavLink to={generateInbox()}>Back to inbox</NavLink>
      </Stack>
    </Card>
  );
}
