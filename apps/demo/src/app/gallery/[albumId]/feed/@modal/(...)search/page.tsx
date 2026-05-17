import { useEffect } from "react";
import { useNavigate } from "react-router";
import { FilePath } from "../../../../../../components/ui/code";
import { Heading } from "../../../../../../components/ui/heading";
import { Stack } from "../../../../../../components/ui/stack";
import { Text } from "../../../../../../components/ui/text";
import { generate as generateFeed } from "virtual:react-router-next/gallery/[albumId]/feed";
import type { RouteProps } from "virtual:react-router-next/gallery/[albumId]/feed";

export default function GlobalSearchModal({ params }: RouteProps) {
  const navigate = useNavigate();
  const closeTo = generateFeed({ albumId: params.albumId });

  useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      if (e.key === "Escape") navigate(closeTo);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, closeTo]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-30 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={() => navigate(closeTo)}
        className="absolute inset-0 bg-background/80 backdrop-blur"
      />
      <div className="relative z-10 w-full max-w-lg rounded border border-border bg-card text-card-foreground shadow-xl">
        <Stack gap="sm" className="p-4">
          <Heading level={3}>Global search</Heading>
          <input
            type="search"
            placeholder="Search…"
            className="w-full rounded border border-border bg-background px-3 py-2 text-foreground"
            autoFocus
          />
          <Text size="sm" tone="muted">
            Root-anchored intercept —{" "}
            <FilePath>
              gallery/[albumId]/feed/@modal/(...)search/page.tsx
            </FilePath>
            . <FilePath>(...)</FilePath> resets to root, so the modal target is{" "}
            <FilePath>/search</FilePath> regardless of how deep the slot is.
            Refresh to see the full search page.
          </Text>
        </Stack>
      </div>
    </div>
  );
}
