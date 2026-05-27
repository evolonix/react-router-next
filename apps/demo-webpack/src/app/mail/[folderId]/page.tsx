import { notFound } from "@evolonix/react-router-next";
import { Link } from "react-router";
import type { RouteProps } from "virtual:react-router-next/mail/[folderId]";
import { generate as generateMessage } from "virtual:react-router-next/mail/[folderId]/[messageId]";

import { Explain } from "../../_components/explain";
import { getFolder, getMessagesInFolder } from "../_lib/messages";

export default function MailFolderPage({ params }: RouteProps) {
  const folder = getFolder(params.folderId);
  if (!folder) notFound();
  const messages = getMessagesInFolder(folder.id);

  return (
    <div className="space-y-4">
      <header>
        <p className="text-accent-intercept font-mono text-[11px] tracking-wider uppercase">
          /mail/{folder.id}
        </p>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {folder.name}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {folder.description}
        </p>
      </header>

      <Explain title="Soft nav opens a preview" accent="intercept">
        <p>
          Each row links to{" "}
          <code className="font-mono">/mail/{folder.id}/:messageId</code>. On a
          click that stays in the app, the{" "}
          <code className="font-mono">@preview/</code> slot serves the
          interceptor as a dialog. Refresh the same URL to drop the slot back to{" "}
          <code className="font-mono">default.tsx</code> and render the
          full-page message view instead.
        </p>
      </Explain>

      <ul className="divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
        {messages.length === 0 ? (
          <li className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
            No messages in this folder.
          </li>
        ) : (
          messages.map((message) => (
            <li key={message.id}>
              <Link
                to={generateMessage({
                  folderId: folder.id,
                  messageId: message.id,
                })}
                className="flex flex-col gap-1 p-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {message.subject}
                  </p>
                  <span className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                    {message.from}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  {message.preview}
                </p>
              </Link>
            </li>
          ))
        )}
      </ul>

      <Link
        to="/mail"
        className="inline-flex rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      >
        ← back to folders
      </Link>
    </div>
  );
}
