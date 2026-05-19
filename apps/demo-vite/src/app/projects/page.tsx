import { Link } from "react-router";
import { generate as generateOrg } from "virtual:react-router-next/projects/[orgId]";

import { CodeBlock } from "../_components/code-block";
import { Explain } from "../_components/explain";
import { ORGS } from "./_lib/projects";

export default function ProjectsHome() {
  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-wider text-accent-intercept">
          projects/ + feed/@modal/(..)(..)[projectId]
        </p>
        <h1 className="text-xl font-semibold text-slate-900 md:text-2xl dark:text-slate-100">
          Intercept two levels up
        </h1>
      </header>

      <Explain
        title="(..)(..)x pops the slot AND one real folder"
        accent="intercept"
        tag="(..)(..)[id]"
      >
        <p>
          Each org has a <code className="font-mono">feed/</code> page that
          grids its projects. Clicking a project soft-navigates to{" "}
          <code className="font-mono">/projects/:orgId/:projectId</code> — the
          full-page target lives outside{" "}
          <code className="font-mono">feed/</code>, so the interceptor has to
          pop two filesystem levels (the slot, then
          <code className="font-mono">feed/</code>) before descending into{" "}
          <code className="font-mono">[projectId]</code>.
        </p>
        <CodeBlock filename="src/app/projects/[orgId]/">{`[orgId]/
├── page.tsx                              # /projects/:orgId
├── [projectId]/page.tsx                  # /projects/:orgId/:projectId  (target)
└── feed/
    ├── layout.tsx                        # ({ modal }) => <><Outlet />{modal}</>
    ├── page.tsx                          # /projects/:orgId/feed
    └── @modal/
        ├── default.tsx
        └── (..)(..)[projectId]/page.tsx  # intercepts /projects/:orgId/:projectId`}</CodeBlock>
        <p>
          Walk through the pops: start at{" "}
          <code className="font-mono">feed/@modal/</code>, pop one →{" "}
          <code className="font-mono">feed/</code>, pop two →{" "}
          <code className="font-mono">[orgId]/</code>. Then append{" "}
          <code className="font-mono">[projectId]</code>.
        </p>
      </Explain>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ORGS.map((org) => (
          <li key={org.id}>
            <Link
              to={generateOrg({ orgId: org.id })}
              className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                /projects/{org.id}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {org.name}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {org.blurb}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
