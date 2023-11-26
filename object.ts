/**
 * Remove null and undefined entries from an object.
 *
 * If input value is null or undefined, the value is returned as is.
 *
 * @param value
 * @returns
 */
export function removeNullish<T>(value: T): NonNullable<T> {
  if (typeof value !== "object") {
    return value!
  }

  if (Array.isArray(value)) {
    return value
      .filter((val) => val !== null && val !== undefined)
      .map((val) => removeNullish(val)) as NonNullable<T>
  }

  return Object.fromEntries(
    Object.entries(value as object)
      .filter(([_, val]) => val !== null && val !== undefined)
      .map(([key, val]) => [key, removeNullish(val)]),
  ) as NonNullable<T>
}

/**
 * Check if value is a basic JS object.
 *
 * @param value
 * @returns
 */
export function isObject(value: unknown) {
  // If value is null or undefined, return false
  if (value === null || value === undefined) {
    return false
  }

  // If value is not an object, return false
  if (typeof value !== "object") {
    return false
  }

  // If value is an instance of other KvValue objects, return false
  if (
    value instanceof Deno.KvU64 ||
    value instanceof Array ||
    value instanceof Int8Array ||
    value instanceof Int16Array ||
    value instanceof Int32Array ||
    value instanceof BigInt64Array ||
    value instanceof Uint8Array ||
    value instanceof Uint16Array ||
    value instanceof Uint32Array ||
    value instanceof BigUint64Array ||
    value instanceof Uint8ClampedArray ||
    value instanceof Float32Array ||
    value instanceof Float64Array ||
    value instanceof ArrayBuffer ||
    value instanceof Date ||
    value instanceof Set ||
    value instanceof Map ||
    value instanceof RegExp ||
    value instanceof DataView ||
    value instanceof Error
  ) {
    return false
  }

  // Return true after performing all checks
  return true
}
