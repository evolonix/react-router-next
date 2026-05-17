import { CodeBlock } from "../_components/code-block";
import { Explain } from "../_components/explain";

export default function BasicsPage() {
  return (
    <>
      <Explain title="page.tsx + layout.tsx" accent="routing">
        <p>
          A folder becomes a route when it contains a{" "}
          <code className="font-mono">page.tsx</code>. Drop a{" "}
          <code className="font-mono">layout.tsx</code> next to it (or in any
          ancestor) and the layout wraps every nested page via{" "}
          <code>{"<Outlet/>"}</code>. Click the two buttons above — the dashed
          banner stays mounted; only the content below the layout swaps.
        </p>
        <CodeBlock filename="src/app/basics/layout.tsx">{`import { Outlet } from "react-router";

export default function BasicsLayout() {
  return (
    <div>
      <header>...this banner stays mounted...</header>
      <Outlet /> {/* basics/page.tsx or basics/nested/page.tsx */}
    </div>
  );
}`}</CodeBlock>
      </Explain>

      <Explain title="Inside this route" accent="routing" tag="page.tsx">
        <p>
          You're looking at <code className="font-mono">basics/page.tsx</code>{" "}
          right now. It's the leaf rendered at <code>/basics</code>. Layouts
          stack: <code className="font-mono">src/app/layout.tsx</code> wraps
          everything, then <code className="font-mono">basics/layout.tsx</code>{" "}
          wraps this leaf.
        </p>
        <CodeBlock filename="src/app/basics/page.tsx">{`export default function BasicsPage() {
  return <p>The body of /basics</p>;
}`}</CodeBlock>
      </Explain>
    </>
  );
}
