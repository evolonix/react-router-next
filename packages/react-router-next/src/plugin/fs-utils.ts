import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export function writeIfChanged(path: string, contents: string): boolean {
  try {
    const existing = readFileSync(path, "utf8");
    if (existing === contents) return false;
  } catch {
    // file missing — fall through to write
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
  return true;
}
