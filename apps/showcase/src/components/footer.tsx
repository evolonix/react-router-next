import { AppLink } from "./app-link";
import { GitHubIcon, NpmIcon } from "./icons";

const GITHUB_URL = "https://github.com/evolonix/react-router-next";
const NPM_URL = "https://www.npmjs.com/package/@evolonix/react-router-next";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-6 text-sm text-zinc-600 sm:flex-row sm:items-center sm:px-6 dark:text-zinc-400">
        <p>
          &copy; {year}{" "}
          <AppLink href="https://evolonix.com" variant="external">
            Evolonix
          </AppLink>
          . MIT · @evolonix/react-router-next
        </p>
        <div className="flex items-center gap-4">
          <AppLink href={GITHUB_URL} variant="external" icon={<GitHubIcon />}>
            Source
          </AppLink>
          <AppLink href={NPM_URL} variant="external" icon={<NpmIcon />}>
            npm
          </AppLink>
          <AppLink
            href={`${GITHUB_URL}/issues`}
            variant="external"
            icon={<GitHubIcon />}
          >
            Issues
          </AppLink>
        </div>
      </div>
    </footer>
  );
}
