import { FilePath } from "../../components/ui/code";
import { Heading } from "../../components/ui/heading";
import { Stack } from "../../components/ui/stack";
import { Text } from "../../components/ui/text";

export default function SearchPage() {
  return (
    <Stack gap="md">
      <Heading level={3}>Global search</Heading>
      <input
        type="search"
        placeholder="Search…"
        className="w-full max-w-lg rounded border border-border bg-background px-3 py-2 text-foreground"
        autoFocus
      />
      <Text size="sm" tone="muted">
        Full-page target —{" "}
        <FilePath>src/app/search/page.tsx</FilePath>. The gallery feed's{" "}
        <FilePath>(...)search</FilePath> intercept overlays this on soft nav;
        a direct visit or refresh lands here.
      </Text>
    </Stack>
  );
}
