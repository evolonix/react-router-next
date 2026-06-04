import { notFound } from "@evolonix/react-router-next";
import { Link } from "react-router";
import type { RouteProps } from "virtual:react-router-next/projects/[orgId]";
import { generate as generateProject } from "virtual:react-router-next/projects/[orgId]/[projectId]";

import { Explain } from "../../../../_components/explain";
import { getOrg, getProjectsForOrg } from "../../../_lib/projects";

export default function ProjectsFeedPage({ params }: RouteProps) {
  const org = getOrg(params.orgId);
  if (!org) notFound();
  const projects = getProjectsForOrg(org.id);

  return (
    <div className="space-y-4">
      <header>
        <p className="text-accent-intercept font-mono text-[11px] tracking-wider uppercase">
          /projects/{org.id}/feed
        </p>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {org.name} — feed
        </h2>
      </header>

      <Explain title="Click a card to open it as a dialog" accent="intercept">
        <p>
          Each card links to{" "}
          <code className="font-mono">/projects/{org.id}/:projectId</code>. The{" "}
          <code className="font-mono">(..)(..)</code> interceptor sits inside
          this org's <code className="font-mono">@modal/</code> slot, so the
          soft nav opens a dialog while the main outlet "freezes" to the org
          layout's page. Refresh on the same URL to render the full-page project
          view instead.
        </p>
      </Explain>

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3">
        {projects.map((project) => (
          <li key={project.id}>
            <Link
              to={generateProject({
                orgId: org.id,
                projectId: project.id,
              })}
              preventScrollReset
              className="group block overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div
                aria-hidden
                className="h-20 w-full md:h-24"
                style={{
                  background: `linear-gradient(135deg, oklch(0.82 0.18 ${project.hue}), oklch(0.55 0.18 ${project.hue}))`,
                }}
              />
              <div className="p-3">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {project.name}
                </p>
                <p className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                  /projects/{org.id}/{project.id}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to={`/projects/${org.id}`}
        className="inline-flex rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      >
        ← back to {org.name}
      </Link>
    </div>
  );
}
