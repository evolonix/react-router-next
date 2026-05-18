import { CodeBlock } from "../../_components/code-block";
import { Explain } from "../../_components/explain";

export default function NestedPage() {
  return (
    <Explain title="A child of basics/" accent="neutral" tag="page.tsx">
      <p>
        You're at <code>/basics/nested</code>. Notice that the dashed banner
        above didn't unmount — it lives in{" "}
        <code className="font-mono">basics/layout.tsx</code>, which wraps every
        page in this folder.
      </p>
      <CodeBlock filename="src/app/basics/nested/page.tsx">{`export default function NestedPage() {
  return <p>The body of /basics/nested</p>;
}`}</CodeBlock>
    </Explain>
  );
}
