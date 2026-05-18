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
          parens is stripped from the path. The header and footer around this
          card come from{" "}
          <code className="font-mono">(marketing)/layout.tsx</code>, which wraps
          every member of the group while staying invisible to the URL.
        </p>
        <CodeBlock filename="src/app/">{`(marketing)/
├── layout.tsx         # shared chrome — wraps every child
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
          <code className="font-mono">(marketing)</code>, but the marketing
          wrapper persists across both pages.
        </p>
      </Explain>
    </>
  );
}
