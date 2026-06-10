import type { StandardSchemaV1 } from "@standard-schema/spec";
import { useCallback } from "react";
import {
  useSearchParams as useRouterSearchParams,
  type NavigateOptions,
} from "react-router";
import {
  deserializeSearch,
  serializeSearch,
  type SearchInput,
} from "./serialize-search";

/** The validated, output type a search-params schema produces. */
export type InferSearch<Schema extends StandardSchemaV1> =
  StandardSchemaV1.InferOutput<Schema>;

/**
 * Navigation options forwarded to the search-params setter — React Router's
 * `NavigateOptions`. Pass `{ preventScrollReset: true, replace: true }` for a
 * search-as-you-type field so updating the query string doesn't reset scroll or
 * pile up history entries.
 */
export type SetSearchOptions = NavigateOptions;

/** Setter returned by {@link useSearchParams}. */
export type SetSearch<Schema extends StandardSchemaV1> = (
  next: InferSearch<Schema>,
  opts?: SetSearchOptions,
) => void;

/**
 * Thrown when the current URL's query string fails the route's search-params
 * schema. Like `notFound()`, this surfaces during render, so it is caught by
 * the nearest `error.tsx` boundary (not `not-found.tsx`). Use
 * {@link safeParseSearchParams} if you'd rather branch on the issues yourself.
 */
export class SearchParamsError extends Error {
  readonly issues: readonly StandardSchemaV1.Issue[];

  constructor(issues: readonly StandardSchemaV1.Issue[], route?: string) {
    const where = route ? ` for route "${route}"` : "";
    super(
      `[react-router-next] search params failed validation${where}: ` +
        issues.map((i) => i.message).join("; "),
    );
    this.name = "SearchParamsError";
    this.issues = issues;
  }
}

function validateSync<Schema extends StandardSchemaV1>(
  schema: Schema,
  value: unknown,
): StandardSchemaV1.Result<InferSearch<Schema>> {
  const result = schema["~standard"].validate(value);
  if (result instanceof Promise) {
    throw new TypeError(
      "[react-router-next] async search-param schemas are not supported — " +
        "useSearchParams/parseSearchParams are synchronous.",
    );
  }
  return result as StandardSchemaV1.Result<InferSearch<Schema>>;
}

/**
 * Validate a `URLSearchParams` against `schema`, returning the typed result or
 * throwing {@link SearchParamsError} on failure.
 */
export function parseSearchParams<Schema extends StandardSchemaV1>(
  schema: Schema,
  searchParams: URLSearchParams,
  route?: string,
): InferSearch<Schema> {
  const result = validateSync(schema, deserializeSearch(searchParams));
  if (result.issues) throw new SearchParamsError(result.issues, route);
  return result.value;
}

/**
 * Non-throwing variant of {@link parseSearchParams}. Returns the raw Standard
 * Schema result — inspect `.issues` for failures or `.value` for success.
 */
export function safeParseSearchParams<Schema extends StandardSchemaV1>(
  schema: Schema,
  searchParams: URLSearchParams,
): StandardSchemaV1.Result<InferSearch<Schema>> {
  return validateSync(schema, deserializeSearch(searchParams));
}

/**
 * Typed `useSearchParams` for a route that exports a `searchParams` schema.
 * Returns the validated value plus a setter that serializes a typed object back
 * into the URL. Throws {@link SearchParamsError} during render when the current
 * query string doesn't satisfy the schema.
 *
 * Consumers normally import the route-bound wrapper from
 * `virtual:react-router-next/<route>` rather than calling this directly.
 */
export function useSearchParams<Schema extends StandardSchemaV1>(
  route: string,
  schema: Schema,
): readonly [InferSearch<Schema>, SetSearch<Schema>] {
  const [searchParams, setSearchParams] = useRouterSearchParams();
  const value = parseSearchParams(schema, searchParams, route);
  const setValue = useCallback<SetSearch<Schema>>(
    (next, opts) => {
      setSearchParams(serializeSearch(next as unknown as SearchInput), opts);
    },
    [setSearchParams],
  );
  return [value, setValue] as const;
}
