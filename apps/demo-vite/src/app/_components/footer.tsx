import type { ReactNode } from "react";

const GITHUB_URL = "https://github.com/evolonix/react-router-next";
const NPM_URL = "https://www.npmjs.com/package/@evolonix/react-router-next";

/**
 * Full-width footer shared with the marketing site. This is the home for the
 * outbound source/package links — the GitHub link used to live in the header
 * and sidebar, but chrome at the top is reserved for navigation and theming.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="sticky bottom-0 z-40 border-t border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="px-safe-lg pb-safe mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 pt-6 text-sm text-zinc-600 sm:flex-row sm:items-center dark:text-zinc-400">
        <p>
          &copy; {year}{" "}
          <FooterLink href="https://evolonix.com">Evolonix</FooterLink>. MIT ·
          @evolonix/react-router-next
        </p>
        <div className="flex items-center gap-4">
          <FooterLink href={GITHUB_URL} icon={<GitHubIcon />}>
            Source
          </FooterLink>
          <FooterLink href={NPM_URL} icon={<NpmIcon />}>
            npm
          </FooterLink>
          <FooterLink href={`${GITHUB_URL}/issues`} icon={<GitHubIcon />}>
            Issues
          </FooterLink>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand-700 dark:text-brand-300 inline-flex min-h-6 items-center gap-1.5"
    >
      {icon ? (
        <span aria-hidden className="shrink-0">
          {icon}
        </span>
      ) : null}
      <span className="underline decoration-1 underline-offset-2 hover:no-underline">
        {children}
      </span>
    </a>
  );
}

function GitHubIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="currentColor"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

function NpmIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
    >
      <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
    </svg>
  );
}
