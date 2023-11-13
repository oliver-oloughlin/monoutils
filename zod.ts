import type {
  SafeParseReturnType,
  TypeOf,
  ZodType,
} from "https://deno.land/x/zod@v3.22.4/mod.ts"

/**
 * Parse search parameters from a url using a zod schema.
 *
 * @param url
 * @param schema
 * @returns
 */
export async function parseSearchParams<const T extends ZodType>(
  url: string | URL,
  schema: T,
): Promise<SafeParseReturnType<TypeOf<T>, TypeOf<T>>> {
  const searchParams = Object.fromEntries(new URL(url).searchParams.entries())

  return await schema.safeParseAsync(searchParams)
}
