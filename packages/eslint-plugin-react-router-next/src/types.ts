// Minimal structural types for an ESLint rule, so the plugin builds without a
// hard dependency on ESLint's type packages. The shapes match what RuleTester
// and ESLint expect at runtime.

export type ReportDescriptor = {
  messageId: string;
  data?: Record<string, string>;
  // Either a node (with a `loc`) or an explicit location is required by ESLint.
  node?: unknown;
  loc?: { line: number; column: number };
};

export type RuleContext = {
  filename: string;
  options: readonly unknown[];
  report(descriptor: ReportDescriptor): void;
};

// Visitor nodes are loosely typed; rules cast to the AST shape they need.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RuleListener = Record<string, (node: any) => void>;

export type RuleModule = {
  meta: {
    type: "problem" | "suggestion" | "layout";
    docs: { description: string; url?: string };
    schema: readonly unknown[];
    messages: Record<string, string>;
  };
  create(context: RuleContext): RuleListener;
};

export function appDirOption(options: readonly unknown[]): string {
  const opt = options[0] as { appDir?: string } | undefined;
  return opt?.appDir ?? "app";
}

const APP_DIR_SCHEMA = {
  type: "object",
  properties: { appDir: { type: "string" } },
  additionalProperties: false,
} as const;

export const appDirSchema = [APP_DIR_SCHEMA];
