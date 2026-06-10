/**
 * Search-param (de)serialization. Standard Schema only *validates* — it has no
 * opinion on how a typed object maps to/from a query string — so the package
 * owns this contract. Kept intentionally small for v1:
 *
 * - arrays serialize to repeated keys (`?tags=a&tags=b`), the only shape that
 *   round-trips through `URLSearchParams` without a bespoke encoding;
 * - `number`/`boolean` are stringified on the way out (coercion on the way back
 *   in is the schema's job, e.g. `z.coerce.number()`), keeping us
 *   validator-agnostic;
 * - `null`/`undefined` values are omitted entirely;
 * - keys are sorted so a given object always produces the same query string.
 */

export type SearchPrimitive = string | number | boolean;

/**
 * The untyped query-string record a page receives as its `searchParams` prop
 * when the route declares no `searchSchema` — mirrors Next.js's page
 * `searchParams` prop shape.
 */
export type SearchParamsRecord = Record<string, string | string[] | undefined>;

/** Shape `generate({ search })` and the `useSearchParams` setter accept. */
export type SearchInput = Record<
  string,
  | SearchPrimitive
  | null
  | undefined
  | ReadonlyArray<SearchPrimitive | null | undefined>
>;

/** Serialize a plain object into a deterministic `URLSearchParams`. */
export function serializeSearch(input: SearchInput): URLSearchParams {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item === undefined || item === null) continue;
        sp.append(key, String(item));
      }
    } else {
      sp.append(key, String(value));
    }
  }
  sp.sort();
  return sp;
}

/**
 * Collapse a `URLSearchParams` into a plain record, mirroring the serialize
 * contract: a key seen once becomes a string, a key seen more than once becomes
 * a string array. This is the value handed to the schema for validation.
 */
export function deserializeSearch(
  sp: URLSearchParams,
): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  for (const key of new Set(sp.keys())) {
    const all = sp.getAll(key);
    out[key] = all.length > 1 ? all : all[0];
  }
  return out;
}
