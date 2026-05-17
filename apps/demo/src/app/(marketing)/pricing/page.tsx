import { Link } from "react-router";

import { CodeBlock } from "../../_components/code-block";
import { Explain } from "../../_components/explain";

export default function PricingPage() {
  return (
    <>
      <Explain title="Also in (marketing)" accent="routing" tag="(group)/">
        <p>
          <code className="font-mono">/pricing</code> renders this file, which
          lives next to <code className="font-mono">about/</code> inside the
          same <code className="font-mono">(marketing)</code> group.
        </p>
        <CodeBlock filename="src/app/(marketing)/pricing/page.tsx">{`export default function PricingPage() {
  return <article>Pricing details...</article>;
}`}</CodeBlock>
      </Explain>
      <Explain title="Group, but no shared layout — yet" accent="routing">
        <p>
          A group <em>can</em> have its own{" "}
          <code className="font-mono">layout.tsx</code>; this demo skips that to
          keep the URL the only thing changing. Visit{" "}
          <Link
            to="/about"
            className="font-medium text-accent-routing hover:underline"
          >
            /about
          </Link>{" "}
          to see the other group member.
        </p>
      </Explain>
    </>
  );
}
