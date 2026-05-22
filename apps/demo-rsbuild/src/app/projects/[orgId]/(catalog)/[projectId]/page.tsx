import { notFound, type RouteProps } from "@evolonix/react-router-next";
import { Link } from "react-router";

import { CodeBlock } from "../../../../_components/code-block";
import { Explain } from "../../../../_components/explain";
import { getProject } from "../../../_lib/projects";

export default function ProjectsProjectPage({
  params,
}: RouteProps<"projects/[orgId]/[projectId]">) {
  const project = getProject(params.orgId, params.projectId);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-wider text-accent-intercept">
          projects/[orgId]/(catalog)/[projectId]/page.tsx
        </p>
        <h1 className="text-xl font-semibold text-zinc-900 md:text-2xl dark:text-zinc-100">
          {project.name}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {project.summary}
        </p>
      </header>

      <Explain title="Full-page (no intercept)" accent="intercept">
        <p>
          You arrived without going through the org's{" "}
          <code className="font-mono">feed/</code> view — so the{" "}
          <code className="font-mono">(..)(..)</code> interceptor doesn't apply
          and the main outlet rendered this page directly.
        </p>
        <CodeBlock filename="src/app/projects/[orgId]/(catalog)/@modal/(..)(..)[projectId]/page.tsx">{`import { type RouteProps } from "@evolonix/react-router-next";

export default function ProjectModal({ params }: RouteProps<"projects/[orgId]/[projectId]">) {
  // …same route key as this page; rendered inside a Dialog…
}`}</CodeBlock>
        <p>
          Visit{" "}
          <Link
            to={`/projects/${project.orgId}/feed`}
            className="font-medium text-accent-intercept hover:underline"
          >
            /projects/{project.orgId}/feed
          </Link>{" "}
          and click this card to see the interceptor fire.
        </p>
      </Explain>

      <div
        aria-hidden
        className="h-32 w-full rounded-xl"
        style={{
          background: `linear-gradient(135deg, oklch(0.82 0.18 ${project.hue}), oklch(0.45 0.18 ${project.hue}))`,
        }}
      />

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
          <dt className="font-mono text-[11px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Status
          </dt>
          <dd className="mt-1 font-medium text-zinc-900 capitalize dark:text-zinc-100">
            {project.status}
          </dd>
        </div>
        <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
          <dt className="font-mono text-[11px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Org
          </dt>
          <dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">
            {project.orgId}
          </dd>
        </div>
      </dl>

      <Link
        to={`/projects/${project.orgId}`}
        className="inline-flex rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      >
        ← back to {project.orgId}
      </Link>
    </div>
  );
}
