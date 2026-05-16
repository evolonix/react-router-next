import { FilePath } from "../../components/ui/code";
import { Heading } from "../../components/ui/heading";
import { NavLink } from "../../components/ui/nav";
import { Stack } from "../../components/ui/stack";
import { Text } from "../../components/ui/text";
import { generate as generateExample } from "virtual:react-router-next/typed-routes/[example]";

const EXAMPLES = ["hello", "world", "react-router-next"];

export default function TypedRoutesPage() {
  return (
    <Stack gap="md">
      <Text>
        Three URL-building tools ship per route via Vite-generated virtual
        modules. Click an example to land on a page that demonstrates the
        typed <FilePath>params</FilePath>, the <FilePath>RouteProps</FilePath>{" "}
        prop type, and the <FilePath>generate()</FilePath> URL builder all
        bound to the same route literal.
      </Text>
      <Stack gap="xs">
        <Heading level={4}>Try a value</Heading>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {EXAMPLES.map((value) => (
            <li key={value}>
              <NavLink
                to={generateExample({ example: value })}
                className="inline-block rounded border border-border px-3 py-1 no-underline hover:bg-muted/40"
              >
                {generateExample({ example: value })}
              </NavLink>
            </li>
          ))}
        </ul>
      </Stack>
    </Stack>
  );
}
