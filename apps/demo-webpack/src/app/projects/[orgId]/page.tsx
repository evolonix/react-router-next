import { notFound } from "@evolonix/react-router-next";
import { Link } from "react-router";
import type { RouteProps } from "virtual:react-router-next/projects/[orgId]";

import { Explain } from "../../_components/explain";
import { getOrg, getProjectsForOrg } from "../_lib/projects";

export default function ProjectsOrgPage({ params }: RouteProps) {
  const org = getOrg(params.orgId);
  if (!org) notFound();
  const projects = getProjectsForOrg(org.id);

  return (
    <div className="space-y-4">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-wider text-accent-intercept">
          /projects/{org.id}
        </p>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {org.name}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{org.blurb}</p>
      </header>

      <Explain title="Two views, same projects" accent="intercept">
        <p>
          This page lives outside <code className="font-mono">feed/</code> — its
          links go straight to each project's full page. The{" "}
          <Link
            to={`/projects/${org.id}/feed`}
            className="font-medium text-accent-intercept hover:underline"
          >
            feed view
          </Link>{" "}
          uses the same data but routes through the{" "}
          <code className="font-mono">(..)(..)</code> interceptor for in-app
          clicks.
        </p>
      </Explain>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {projects.map((project) => (
          <li key={project.id}>
            <Link
              to={`/projects/${org.id}/${project.id}`}
              className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                /projects/{org.id}/{project.id}
              </p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {project.name}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {project.summary}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to="/projects"
        className="inline-flex rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      >
        ← back to all orgs
      </Link>
    </div>
  );
}
