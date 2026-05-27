import { generate } from "@evolonix/react-router-next";
import { Link } from "react-router";

import { CodeBlock } from "../_components/code-block";
import { Explain } from "../_components/explain";
import { FOLDERS } from "./_lib/messages";

export default function MailHome() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-accent-intercept font-mono text-[11px] tracking-wider uppercase">
          mail/ + @preview/(..)[messageId]
        </p>
        <h1 className="text-xl font-semibold text-zinc-900 md:text-2xl dark:text-zinc-100">
          Intercept one level up
        </h1>
      </header>

      <Explain
        title="(..)x pops one filesystem level"
        accent="intercept"
        tag="(..)[id]"
      >
        <p>
          Pick a folder, then click a message. The URL changes to{" "}
          <code className="font-mono">/mail/:folderId/:messageId</code> and the{" "}
          <code className="font-mono">@preview/</code> slot matches the
          interceptor — the message opens as a dialog while the list stays
          mounted underneath. Refresh that same URL to render the full message
          view.
        </p>
        <CodeBlock filename="src/app/mail/[folderId]/">{`[folderId]/
├── layout.tsx                    # ({ preview }) => <><Outlet />{preview}</>
├── page.tsx                      # /mail/:folderId — message list
├── [messageId]/page.tsx          # /mail/:folderId/:messageId — full view
└── @preview/
    ├── default.tsx               # null fallback when no message selected
    └── (..)[messageId]/page.tsx  # modal — rendered on soft nav`}</CodeBlock>
        <p>
          <code className="font-mono">(..)[messageId]</code> pops one filesystem
          level above <code className="font-mono">@preview/</code>. The slot
          adds no URL segment, so the pop lands us back at{" "}
          <code className="font-mono">mail/[folderId]/</code> — ready to descend
          into <code className="font-mono">[messageId]</code>. It resolves to
          the same URL as <code className="font-mono">(.)</code> would here;
          both forms are valid.
        </p>
      </Explain>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {FOLDERS.map((folder) => (
          <li key={folder.id}>
            <Link
              to={generate("mail/[folderId]", { folderId: folder.id })}
              className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="font-mono text-[11px] tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                /mail/{folder.id}
              </p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {folder.name}
              </p>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                {folder.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
