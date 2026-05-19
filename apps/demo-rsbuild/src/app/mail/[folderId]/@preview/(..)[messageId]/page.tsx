import { type RouteProps } from "@evolonix/react-router-next";

import { Dialog } from "../../../../gallery/_components/dialog";
import { getMessage } from "../../../_lib/messages";

export default function MailPreviewPage({
  params,
}: RouteProps<"mail/[folderId]/[messageId]">) {
  const message = getMessage(params.folderId, params.messageId);
  if (!message) return null;
  return (
    <Dialog title={message.subject}>
      <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
        From {message.from}
      </p>
      <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
        {message.body}
      </p>
      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Rendered by{" "}
        <code className="font-mono">
          mail/[folderId]/@preview/(..)[messageId]/page.tsx
        </code>
        . Refresh this URL to see the full-page version instead.
      </p>
    </Dialog>
  );
}
