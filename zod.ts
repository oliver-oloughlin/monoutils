import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"

/**
 * Parse search parameters from a url using a zod schema.
 *
 * @param url
 * @param schema
 * @returns
 */
export function safeParseSearchParams<T extends z.ZodObject<z.ZodRawShape>>(
  url: string | URL,
  schema: T,
): z.SafeParseSuccess<T> | { success: false } {
  const searchParams = Object.fromEntries(new URL(url).searchParams.entries())

  const coercedEntries = Object
    .entries(searchParams)
    .map(([key, value]) =>
      [key, safeCoercePrimitive(value, schema.shape[key])] as const
    )
    .map(([key, value]) => [key, value.success ? value.data : null] as const)

  if (coercedEntries.some(([_, value]) => value === null)) {
    return {
      success: false,
    }
  }

  const coercedSearchParams = Object.fromEntries(coercedEntries)

  return schema.safeParse(coercedSearchParams) as z.SafeParseSuccess<T> | {
    success: false
  }
}

/**
 * Coerce and parse a Zod schema of any primitive type.
 *
 * @param value - Value to be coerced and parsed according to schema.
 * @param schema - Primitive Zod schema.
 * @returns A parse result or error.
 */
export function safeCoercePrimitive<
  const T extends number | boolean | bigint | string | Date,
>(
  value: unknown,
  schema: z.ZodType<T>,
): z.SafeParseSuccess<T> | { success: false } {
  // deno-lint-ignore no-explicit-any
  const schemaType = (schema._def as any).typeName

  const coerceSchema = schemaType === "ZodNumber"
    ? z.coerce.number()
    : schemaType === "ZodBoolean"
    ? z.coerce.boolean()
    : schemaType === "ZodBigInt"
    ? z.coerce.bigint()
    : schemaType === "ZodString"
    ? z.coerce.string()
    : schemaType === "ZodDate"
    ? z.coerce.date()
    : null

  // If no coerce schema selected, return error
  if (!coerceSchema) {
    return {
      success: false,
    }
  }

  // Parse using coerce schema
  const coerceParsed = coerceSchema.safeParse(value)

  // Return error if not successful
  if (!coerceParsed.success) {
    return coerceParsed
  }

  // Return parse result of schema on coerced data
  return schema.safeParse(coerceParsed.data)
}
