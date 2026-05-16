import type { LoaderFunctionArgs } from "react-router";

export async function loader({ params }: LoaderFunctionArgs) {
  const ms = Number.parseInt(params.delay ?? "0", 10);
  await new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));
  return { ms };
}
