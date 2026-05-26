import { GitHubIcon } from "./icons";

const REPO_URL = "https://github.com/evolonix/react-router-next";

export function GitHubLink() {
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="View source on GitHub"
      title="View source on GitHub"
      className="hover:text-brand-700 dark:hover:text-brand-300 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-700 ring-1 ring-zinc-200 transition-colors hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-800"
    >
      <GitHubIcon className="h-4 w-4" />
    </a>
  );
}
