import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"

/**
 * Parse search parameters from a url using a zod schema.
 *
 * @param url
 * @param schema
 * @returns
 */
export function parseSearchParams<const T extends z.ZodType>(
  url: string | URL,
  schema: T,
): z.SafeParseReturnType<z.infer<T>, z.infer<T>> {
  const searchParams = Object.fromEntries(new URL(url).searchParams.entries())
  return schema.safeParse(searchParams)
}

/**
 * Parse search parameters from a url using a zod schema.
 *
 * @param url
 * @param schema
 * @returns
 */
export async function parseSearchParamsAsync<const T extends z.ZodType>(
  url: string | URL,
  schema: T,
): Promise<z.SafeParseReturnType<z.infer<T>, z.infer<T>>> {
  const searchParams = Object.fromEntries(new URL(url).searchParams.entries())
  return await schema.safeParseAsync(searchParams)
}

/**
 * Coerce and parse a Zod schema of any primitive type.
 *
 * @param value - Value to be coerced and parsed according to schema.
 * @param schema - Primitive Zod schema.
 * @returns A parse result or error.
 */
export function parseCoercedPrimitive<
  const T extends number | boolean | bigint | string | Date,
>(
  value: unknown,
  schema: z.ZodType<T>,
): z.SafeParseSuccess<T> | { success: false } {
  // Get schema type
  const type = typeof schema._type

  // Select appropriate coerce schema
  const coerceSchema = type === "number"
    ? z.coerce.number()
    : type === "boolean"
    ? z.coerce.boolean()
    : type === "bigint"
    ? z.coerce.bigint()
    : type === "string"
    ? z.coerce.string()
    : schema._type instanceof Date
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

/**
 * Coerce and parse a Zod schema of any primitive type.
 *
 * @param value - Value to be coerced and parsed according to schema.
 * @param schema - Primitive Zod schema.
 * @returns A parse result or error.
 */
export async function parseCoercedPrimitiveAsync<
  const T extends number | boolean | bigint | string | Date,
>(
  value: unknown,
  schema: z.ZodType<T>,
): Promise<z.SafeParseSuccess<T> | { success: false }> {
  // Get schema type
  const type = typeof schema._type

  // Select appropriate coerce schema
  const coerceSchema = type === "number"
    ? z.coerce.number()
    : type === "boolean"
    ? z.coerce.boolean()
    : type === "bigint"
    ? z.coerce.bigint()
    : type === "string"
    ? z.coerce.string()
    : schema._type instanceof Date
    ? z.coerce.date()
    : null

  // If no coerce schema selected, return error
  if (!coerceSchema) {
    return {
      success: false,
    }
  }

  // Parse using coerce schema
  const coerceParsed = await coerceSchema.safeParseAsync(value)

  // Return error if not successful
  if (!coerceParsed.success) {
    return coerceParsed
  }

  // Return parse result of schema on coerced data
  return await schema.safeParseAsync(coerceParsed.data)
}
