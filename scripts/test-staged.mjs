#!/usr/bin/env node
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const rootPkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));

const workspaces = (rootPkg.workspaces ?? []).flatMap((pattern) => {
  const match = pattern.match(/^(.+)\/\*$/);
  if (!match) return [pattern];
  const dir = resolve(root, match[1]);
  try {
    return readdirSync(dir)
      .map((name) => `${match[1]}/${name}`)
      .filter((rel) => statSync(resolve(root, rel)).isDirectory());
  } catch {
    return [];
  }
});

const testablePackages = workspaces
  .map((rel) => {
    try {
      const pkg = JSON.parse(
        readFileSync(resolve(root, rel, "package.json"), "utf8"),
      );
      return pkg.scripts?.test ? { rel, name: pkg.name } : null;
    } catch {
      return null;
    }
  })
  .filter(Boolean);

const staged = execFileSync(
  "git",
  ["diff", "--cached", "--name-only", "--diff-filter=ACMR"],
  {
    encoding: "utf8",
  },
)
  .split("\n")
  .filter(Boolean);

const affected = testablePackages.filter(({ rel }) =>
  staged.some((file) => file === rel || file.startsWith(`${rel}/`)),
);

if (affected.length === 0) {
  console.log(
    "test-staged: no testable workspaces have staged changes — skipping.",
  );
  process.exit(0);
}

for (const { name } of affected) {
  console.log(`\ntest-staged: running tests in ${name}`);
  const result = spawnSync("npm", ["test", "-w", name], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
