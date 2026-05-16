import { useIsRoutePending } from "@evolonix/react-router-next";
import { FilePath } from "../../components/ui/code";
import { Heading } from "../../components/ui/heading";
import { NavLink } from "../../components/ui/nav";
import { Stack } from "../../components/ui/stack";
import { Text } from "../../components/ui/text";
import { generate as generateDelay } from "virtual:react-router-next/pending/[delay]";

const DELAYS = [400, 1200, 2500];

export default function PendingPage() {
  const pending = useIsRoutePending();
  return (
    <Stack gap="md">
      <Text>
        <FilePath>useIsRoutePending()</FilePath> returns{" "}
        <FilePath>true</FilePath> whenever React Router is transitioning to
        another route AND while ancestor Suspense boundaries are pending. The
        global progress bar at the top of the page uses this same hook —{" "}
        <FilePath>src/components/ui/route-progress.tsx</FilePath>.
      </Text>

      <Stack gap="xs">
        <Heading level={4}>Live value</Heading>
        <div
          className="inline-flex w-fit items-center gap-2 rounded border border-border px-3 py-2"
          aria-live="polite"
        >
          <span
            aria-hidden
            className={`inline-block h-2 w-2 rounded-full ${
              pending ? "bg-primary animate-pulse" : "bg-muted"
            }`}
          />
          <Text as="span" size="sm">
            pending = <FilePath>{String(pending)}</FilePath>
          </Text>
        </div>
      </Stack>

      <Stack gap="xs">
        <Heading level={4}>Try a delay</Heading>
        <Text size="sm" tone="muted">
          Each link navigates to a child route that holds the transition open
          for the requested number of milliseconds via a loader.
        </Text>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {DELAYS.map((ms) => (
            <li key={ms}>
              <NavLink
                to={generateDelay({ delay: String(ms) })}
                className="inline-block rounded border border-border px-3 py-1 no-underline hover:bg-muted/40"
              >
                Wait {ms} ms
              </NavLink>
            </li>
          ))}
        </ul>
      </Stack>
    </Stack>
  );
}
