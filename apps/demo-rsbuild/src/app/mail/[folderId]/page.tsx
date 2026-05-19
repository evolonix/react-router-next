import {
  generateUrl,
  notFound,
  type RouteProps,
} from "@evolonix/react-router-next";
import { Link } from "react-router";

import { Explain } from "../../_components/explain";
import { getFolder, getMessagesInFolder } from "../_lib/messages";

export default function MailFolderPage({
  params,
}: RouteProps<"mail/[folderId]">) {
  const folder = getFolder(params.folderId);
  if (!folder) notFound();
  const messages = getMessagesInFolder(folder.id);

  return (
    <div className="space-y-4">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-wider text-accent-intercept">
          /mail/{folder.id}
        </p>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {folder.name}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
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

      <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
        {messages.length === 0 ? (
          <li className="p-4 text-sm text-slate-500 dark:text-slate-400">
            No messages in this folder.
          </li>
        ) : (
          messages.map((message) => (
            <li key={message.id}>
              <Link
                to={generateUrl("mail/[folderId]/[messageId]", {
                  folderId: folder.id,
                  messageId: message.id,
                })}
                className="flex flex-col gap-1 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {message.subject}
                  </p>
                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {message.from}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {message.preview}
                </p>
              </Link>
            </li>
          ))
        )}
      </ul>

      <Link
        to="/mail"
        className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
      >
        ← back to folders
      </Link>
    </div>
  );
}
