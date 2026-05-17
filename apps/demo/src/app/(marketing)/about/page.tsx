import { Link } from "react-router";

import { CodeBlock } from "../../_components/code-block";
import { Explain } from "../../_components/explain";

export default function AboutPage() {
  return (
    <>
      <Explain title="Route groups" accent="routing" tag="(group)/">
        <p>
          This page lives at{" "}
          <code className="font-mono">src/app/(marketing)/about/page.tsx</code>{" "}
          — but the URL is just <code>/about</code>. Any folder name wrapped in
          parens is stripped from the path. Use groups to share a layout or
          colocate related routes without inflating the URL.
        </p>
        <CodeBlock filename="src/app/">{`(marketing)/
├── about/page.tsx     → /about
└── pricing/page.tsx   → /pricing`}</CodeBlock>
      </Explain>
      <Explain title="Try the sibling" accent="routing">
        <p>
          <Link
            to="/pricing"
            className="font-medium text-accent-routing hover:underline"
          >
            /pricing
          </Link>{" "}
          is the other route in this group. Notice neither URL mentions{" "}
          <code className="font-mono">(marketing)</code>.
        </p>
      </Explain>
    </>
  );
}
