import { isObject } from "./object.ts"

export type JSONError = {
  message: string
  name: string
  cause?: unknown
  stack?: string
}

export enum TypeKey {
  Undefined = "__undefined__",
  BigInt = "__bigint__",
  KvU64 = "__kvu64__",
  Int8Array = "__int8array__",
  Int16Array = "__int16array__",
  Int32Array = "__int32array__",
  BigInt64Array = "__bigint64array__",
  Uint8Array = "__uint8array__",
  Uint16Array = "__uint16array__",
  Uint32Array = "__uint32array__",
  BigUint64Array = "__biguint64array__",
  Uint8ClampedArray = "__uint8clampedarray__",
  Float32Array = "__float32array__",
  Float64Array = "__float64array__",
  ArrayBuffer = "__arraybuffer__",
  Date = "__date__",
  Set = "__set__",
  Map = "__map__",
  RegExp = "__regexp__",
  DataView = "__dataview__",
  Error = "__error__",
  NaN = "__nan__",
}

/**
 * Serialize a value to Uint8Array.
 *
 * @param value . Value to be serialized.
 * @returns Serialized value.
 */
export function serialize(value: unknown) {
  const str = stringify(value)
  return new TextEncoder().encode(str)
}

/**
 * Deserialize a value encoded as Uint8Array.
 *
 * @param value - Value to be deserialize.
 * @returns Deserialized value.
 */
export function deserialize<T>(value: Uint8Array) {
  const str = new TextDecoder().decode(value)
  return parse<T>(str)
}

/**
 * Convert a value to a JSON string.
 *
 * @param value - Value to be stringified.
 * @param space
 * @returns
 */
export function stringify(value: unknown, space?: number | string) {
  return JSON.stringify(_replacer(value), replacer, space)
}

/**
 * Parse a value from a JSON string.
 *
 * @param value - JSON string to be parsed.
 * @returns
 */
export function parse<T>(value: string) {
  return postReviver(JSON.parse(value, reviver)) as T
}

/**
 * Outer replacer function.
 *
 * @param _key
 * @param value
 * @returns
 */
function replacer(_key: string, value: unknown) {
  return _replacer(value)
}

/**
 * Outer reviver function.
 *
 * @param _key
 * @param value
 * @returns
 */
function reviver(_key: string, value: unknown) {
  return _reviver(value)
}

/**
 * Inner replacer function.
 *
 * @param value
 * @returns
 */
function _replacer(value: unknown): unknown {
  // Return value if primitive, function or symbol
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "function" ||
    typeof value === "symbol"
  ) {
    return value
  }

  // Undefined
  if (value === undefined) {
    return {
      [TypeKey.Undefined]: false,
    }
  }

  // NaN
  if (Number.isNaN(value)) {
    return {
      [TypeKey.NaN]: false,
    }
  }

  // bigint
  if (typeof value === "bigint") {
    return {
      [TypeKey.BigInt]: value.toString(),
    }
  }

  // KvU64
  if (value instanceof Deno.KvU64) {
    return {
      [TypeKey.KvU64]: value.value.toString(),
    }
  }

  // Date
  if (value instanceof Date) {
    return {
      [TypeKey.Date]: value.toISOString(),
    }
  }

  // Set
  if (value instanceof Set) {
    const mappedValues: unknown[] = []
    value.forEach((v) => mappedValues.push(_replacer(v)))
    return {
      [TypeKey.Set]: mappedValues,
    }
  }

  // Map
  if (value instanceof Map) {
    const mappedEntries = []
    for (const [k, v] of value.entries()) {
      mappedEntries.push([k, _replacer(v)])
    }
    return {
      [TypeKey.Map]: mappedEntries,
    }
  }

  // RegExp
  if (value instanceof RegExp) {
    return {
      [TypeKey.RegExp]: value.source,
    }
  }

  // Error
  if (value instanceof Error) {
    const jsonError: JSONError = {
      message: value.message,
      name: value.name,
      stack: value.stack,
      cause: value.cause,
    }
    return {
      [TypeKey.Error]: jsonError,
    }
  }

  // Int8Array
  if (value instanceof Int8Array) {
    return {
      [TypeKey.Int8Array]: Array.from(value),
    }
  }

  // Int16Array
  if (value instanceof Int16Array) {
    return {
      [TypeKey.Int16Array]: Array.from(value),
    }
  }

  // Int32Array
  if (value instanceof Int32Array) {
    return {
      [TypeKey.Int32Array]: Array.from(value),
    }
  }

  // BigInt64Array
  if (value instanceof BigInt64Array) {
    return {
      [TypeKey.BigInt64Array]: Array.from(value),
    }
  }

  // Uint8Array
  if (value instanceof Uint8Array) {
    return {
      [TypeKey.Uint8Array]: Array.from(value),
    }
  }

  // Uint16Array
  if (value instanceof Uint16Array) {
    return {
      [TypeKey.Uint16Array]: Array.from(value),
    }
  }

  // Uint32Array
  if (value instanceof Uint32Array) {
    return {
      [TypeKey.Uint32Array]: Array.from(value),
    }
  }

  // BigUint64Array
  if (value instanceof BigUint64Array) {
    return {
      [TypeKey.BigUint64Array]: Array.from(value),
    }
  }

  // Uint8ClampedArray
  if (value instanceof Uint8ClampedArray) {
    return {
      [TypeKey.Uint8ClampedArray]: Array.from(value),
    }
  }

  // Float32Array
  if (value instanceof Float32Array) {
    return {
      [TypeKey.Float32Array]: Array.from(value),
    }
  }

  // Float64Array
  if (value instanceof Float64Array) {
    return {
      [TypeKey.Float64Array]: Array.from(value),
    }
  }

  // ArrayBuffer
  if (value instanceof ArrayBuffer) {
    return {
      [TypeKey.ArrayBuffer]: Array.from(new Uint8Array(value)),
    }
  }

  // DataView
  if (value instanceof DataView) {
    return {
      [TypeKey.DataView]: Array.from(new Uint8Array(value.buffer)),
    }
  }

  // Clone value to handle special cases
  const clone = structuredClone(value) as Record<string, unknown>
  for (const [k, v] of Object.entries(value)) {
    if (v instanceof Date) {
      clone[k] = _replacer(v)
    }

    if (v instanceof Deno.KvU64) {
      clone[k] = _replacer(v)
    }
  }

  // Return clone
  return clone
}

/**
 * Inner reviver function.
 *
 * @param value
 * @returns
 */
function _reviver(value: unknown): unknown {
  // Return if nullish or not an object
  if (
    value === null ||
    value === undefined ||
    typeof value !== "object"
  ) {
    return value
  }

  // NaN
  if (TypeKey.NaN in value) {
    return NaN
  }

  // bigint
  if (TypeKey.BigInt in value) {
    return BigInt(mapValue(TypeKey.BigInt, value))
  }

  // KvU64
  if (TypeKey.KvU64 in value) {
    return new Deno.KvU64(BigInt(mapValue(TypeKey.KvU64, value)))
  }

  // Date
  if (TypeKey.Date in value) {
    return new Date(mapValue<string>(TypeKey.Date, value))
  }

  // Set
  if (TypeKey.Set in value) {
    const mappedValues = mapValue<unknown[]>(TypeKey.Set, value)
    return new Set(mappedValues.map((v) => _reviver(v)))
  }

  // Map
  if (TypeKey.Map in value) {
    const mappedEntries = mapValue<[string, unknown][]>(TypeKey.Map, value)
    return new Map(mappedEntries.map(([k, v]) => [k, _reviver(v)]))
  }

  // RegExp
  if (TypeKey.RegExp in value) {
    return new RegExp(mapValue(TypeKey.RegExp, value))
  }

  // Error
  if (TypeKey.Error in value) {
    const jsonError = mapValue<JSONError>(TypeKey.Error, value)
    const error = new Error(jsonError.message, { ...jsonError })
    error.stack = jsonError.stack
    return error
  }

  // Int8Array
  if (TypeKey.Int8Array in value) {
    return Int8Array.from(mapValue(TypeKey.Int8Array, value))
  }

  // Int16Array
  if (TypeKey.Int16Array in value) {
    return Int16Array.from(mapValue(TypeKey.Int16Array, value))
  }

  // Int32Array
  if (TypeKey.Int32Array in value) {
    return Int32Array.from(mapValue(TypeKey.Int32Array, value))
  }

  // BigInt64Array
  if (TypeKey.BigInt64Array in value) {
    return BigInt64Array.from(mapValue(TypeKey.BigInt64Array, value))
  }

  // Uint8Array
  if (TypeKey.Uint8Array in value) {
    return Uint8Array.from(mapValue(TypeKey.Uint8Array, value))
  }

  // Uint16Array
  if (TypeKey.Uint16Array in value) {
    return Uint16Array.from(mapValue(TypeKey.Uint16Array, value))
  }

  // Uint32Array
  if (TypeKey.Uint32Array in value) {
    return Uint32Array.from(mapValue(TypeKey.Uint32Array, value))
  }

  // BigUint64Array
  if (TypeKey.BigUint64Array in value) {
    return BigUint64Array.from(mapValue(TypeKey.BigUint64Array, value))
  }

  // Uint8ClampedArray
  if (TypeKey.Uint8ClampedArray in value) {
    return Uint8ClampedArray.from(mapValue(TypeKey.Uint8ClampedArray, value))
  }

  // Float32Array
  if (TypeKey.Float32Array in value) {
    return Float32Array.from(mapValue(TypeKey.Float32Array, value))
  }

  // Float64Array
  if (TypeKey.Float64Array in value) {
    return Float64Array.from(mapValue(TypeKey.Float64Array, value))
  }

  // ArrayBuffer
  if (TypeKey.ArrayBuffer in value) {
    const uint8array = Uint8Array.from(mapValue(TypeKey.ArrayBuffer, value))
    return uint8array.buffer
  }

  // DataView
  if (TypeKey.DataView in value) {
    const uint8array = Uint8Array.from(mapValue(TypeKey.DataView, value))
    return new DataView(uint8array.buffer)
  }

  // Return value
  return value
}

/**
 * Reviver post-parse.
 *
 * @param value
 * @returns
 */
function postReviver(value: unknown): unknown {
  if (
    value === undefined ||
    value === null ||
    typeof value !== "object"
  ) {
    return value
  }

  if (TypeKey.Undefined in value) {
    return undefined
  }

  if (Array.isArray(value)) {
    return value.map((v) => postReviver(v))
  }

  if (isObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, postReviver(v)]),
    )
  }

  return value
}

/**
 * Map from special type entry to value.
 *
 * @param key - Type key.
 * @param value - JSON value to map from.
 * @returns Mapped value.
 */
function mapValue<T>(key: string, value: unknown) {
  return (value as Record<string, T>)[key]
}
