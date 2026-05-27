import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";

export default function TransitionsTemplate() {
  const { pathname } = useLocation();
  const [mountedAt] = useState(() => new Date());

  useEffect(() => {
    console.log(
      "template mounted for",
      pathname,
      "at",
      mountedAt.toISOString(),
    );
  }, [pathname, mountedAt]);

  return (
    <div className="template-mount border-accent-routing/40 bg-accent-routing/5 space-y-4 rounded-xl border border-dashed p-4">
      <header className="flex items-center justify-between text-xs">
        <p className="text-accent-routing font-mono tracking-wider uppercase">
          template.tsx
        </p>
        <p className="font-mono text-zinc-600 dark:text-zinc-400">
          mounted at{" "}
          {mountedAt.toLocaleTimeString(undefined, {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
          .{String(mountedAt.getMilliseconds()).padStart(3, "0")}
        </p>
      </header>
      <Outlet />
    </div>
  );
}
