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
