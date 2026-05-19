import { notFound } from "@evolonix/react-router-next";
import { Link } from "react-router";
import type { RouteProps } from "virtual:react-router-next/mail/[folderId]/[messageId]";

import { CodeBlock } from "../../../_components/code-block";
import { Explain } from "../../../_components/explain";
import { getMessage } from "../../_lib/messages";

export default function MailMessagePage({ params }: RouteProps) {
  const message = getMessage(params.folderId, params.messageId);
  if (!message) notFound();

  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-wider text-accent-intercept">
          mail/[folderId]/[messageId]/page.tsx
        </p>
        <h1 className="text-xl font-semibold text-slate-900 md:text-2xl dark:text-slate-100">
          {message.subject}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          From <span className="font-medium">{message.from}</span>
        </p>
      </header>

      <Explain title="Full-page (no intercept)" accent="intercept">
        <p>
          You arrived via a hard load — refresh, back/forward, or a direct visit
          — so the <code className="font-mono">@preview/</code> slot fell back
          to <code className="font-mono">default.tsx</code> and the main outlet
          rendered this page. Both URLs are the same; only the entry path
          differs.
        </p>
        <CodeBlock filename="src/app/mail/[folderId]/@preview/(..)[messageId]/page.tsx">{`import type { RouteProps } from "virtual:react-router-next/mail/[folderId]/[messageId]";

// Same params type as the full-page route — both share the route key.
export default function MailPreview({ params }: RouteProps) {
  // …render the message inside a Dialog…
}`}</CodeBlock>
      </Explain>

      <article className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {message.body}
        </p>
      </article>

      <Link
        to={`/mail/${message.folderId}`}
        className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
      >
        ← back to {message.folderId}
      </Link>
    </div>
  );
}
