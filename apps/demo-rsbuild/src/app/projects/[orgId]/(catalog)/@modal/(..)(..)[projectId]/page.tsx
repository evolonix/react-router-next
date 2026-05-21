import { type RouteProps } from "@evolonix/react-router-next";

import { Dialog } from "../../../../../gallery/_components/dialog";
import { getProject } from "../../../../_lib/projects";

export default function ProjectsCatalogModalPage({
  params,
}: RouteProps<"projects/[orgId]/[projectId]">) {
  const project = getProject(params.orgId, params.projectId);
  if (!project) return null;
  return (
    <Dialog title={project.name}>
      <div
        aria-hidden
        className="mb-4 h-32 w-full rounded-lg"
        style={{
          background: `linear-gradient(135deg, oklch(0.82 0.18 ${project.hue}), oklch(0.45 0.18 ${project.hue}))`,
        }}
      />
      <p className="text-sm text-zinc-700 dark:text-zinc-300">
        {project.summary}
      </p>
      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
        Status: <span className="capitalize">{project.status}</span>
      </p>
      <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
        Rendered by{" "}
        <code className="font-mono">
          projects/[orgId]/(catalog)/@modal/(..)(..)[projectId]/page.tsx
        </code>
        . Refresh this URL to see the full-page version.
      </p>
    </Dialog>
  );
}
