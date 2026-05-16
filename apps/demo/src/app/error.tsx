import { useRouteError } from "@evolonix/react-router-next";
import { generate as generateHome } from "virtual:react-router-next/_root";
import { FilePath } from "../components/ui/code";
import { ErrorPanel } from "../components/ui/error-panel";
import { BackLink } from "../components/ui/nav";
import { Text } from "../components/ui/text";

export default function RootError() {
  const error = useRouteError();
  const message =
    error instanceof Error
      ? error.message
      : error instanceof Response
        ? `${error.status} ${error.statusText || ""}`.trim()
        : String(error);
  return (
    <ErrorPanel
      title="Something went wrong"
      message={message}
      action={<BackLink to={generateHome()}>back to home</BackLink>}
    >
      <Text size="xs" tone="destructive">
        Boundary from <FilePath>src/app/error.tsx</FilePath>. The root layout is
        still rendered — only the page content was replaced.
      </Text>
    </ErrorPanel>
  );
}
