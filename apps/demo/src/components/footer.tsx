const GITHUB_URL = "https://github.com/evolonix/react-router-next";
const NPM_URL = "https://www.npmjs.com/package/@evolonix/react-router-next";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-zinc-200/70 bg-white dark:border-zinc-800/70 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-6 text-sm text-zinc-600 sm:flex-row sm:items-center sm:px-6 dark:text-zinc-400">
        <p>
          &copy; {year}{" "}
          <a
            href="https://evolonix.com"
            className="hover:text-brand-600 dark:hover:text-brand-300 font-medium transition-colors"
          >
            Evolonix
          </a>
          . MIT · @evolonix/react-router-next
        </p>
        <div className="flex items-center gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
          >
            Source
          </a>
          <a
            href={NPM_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
          >
            npm
          </a>
          <a
            href={`${GITHUB_URL}/issues`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
          >
            Issues
          </a>
        </div>
      </div>
    </footer>
  );
}
