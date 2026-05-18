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
      <Explain title="Shared layout, hidden segment" accent="routing">
        <p>
          The header and footer wrapping this page come from{" "}
          <code className="font-mono">(marketing)/layout.tsx</code>. A group{" "}
          <em>can</em> own a layout — the folder still vanishes from the URL
          while its layout wraps every child.
        </p>
        <CodeBlock filename="src/app/(marketing)/">{`(marketing)/
├── layout.tsx          # shared chrome
├── about/page.tsx      → /about
└── pricing/page.tsx    → /pricing`}</CodeBlock>
        <p>
          Visit{" "}
          <Link
            to="/about"
            className="font-medium text-accent-routing hover:underline"
          >
            /about
          </Link>{" "}
          to see the other group member share the same wrapper.
        </p>
      </Explain>
    </>
  );
}
