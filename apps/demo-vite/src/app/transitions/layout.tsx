import { NavLink, Outlet } from "react-router";

import { CodeBlock } from "../_components/code-block";
import { Explain } from "../_components/explain";

export default function TransitionsLayout() {
  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-wider text-accent-routing">
          transitions/
        </p>
        <h1 className="text-xl font-semibold text-zinc-900 md:text-2xl dark:text-zinc-100">
          Per-navigation template.tsx
        </h1>
      </header>

      <Explain
        title="layout.tsx persists, template.tsx remounts"
        accent="routing"
        tag="template.tsx"
      >
        <p>
          <code className="font-mono">layout.tsx</code> wraps its children and{" "}
          <em>stays mounted</em> as you move between siblings. Drop a{" "}
          <code className="font-mono">template.tsx</code> next to it and you get
          the same wrapper shape — but it remounts on every navigation, because
          the framework keys it on{" "}
          <code className="font-mono">useLocation().pathname</code>.
        </p>
        <CodeBlock filename="src/app/transitions/template.tsx">{`import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

export default function TransitionsTemplate() {
  const { pathname } = useLocation();
  useEffect(() => {
    console.log("template mounted", pathname);
  }, [pathname]);
  return (
    <div className="template-mount">
      <Outlet />
    </div>
  );
}`}</CodeBlock>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          The wrapper below is the template — click between the four pages and
          watch the fade-in replay, plus the mount counter reset. Open the
          devtools console to see the mount log.
        </p>
      </Explain>

      <nav className="flex flex-wrap gap-2 text-sm">
        <TabLink to="/transitions" end>
          /transitions
        </TabLink>
        <TabLink to="/transitions/a">/transitions/a</TabLink>
        <TabLink to="/transitions/b">/transitions/b</TabLink>
        <TabLink to="/transitions/c">/transitions/c</TabLink>
      </nav>

      <Outlet />
    </div>
  );
}

function TabLink({
  to,
  end,
  children,
}: {
  to: string;
  end?: boolean;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      preventScrollReset
      className={({ isActive }) =>
        `rounded-md border px-3 py-1.5 transition ${
          isActive
            ? "border-accent-routing/40 bg-accent-routing/10 text-accent-routing"
            : "border-zinc-200 bg-white hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
