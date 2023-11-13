// Types
export type TimeUnit = "ms" | "s" | "m" | "hr" | "d" | "w"

export type MsRelativeMap = {
  [K in TimeUnit]: number
}

// Time units' relative multiplier comapred to milliseconds
const msRelativeMap: MsRelativeMap = {
  ms: 1,
  s: 1_000,
  m: 1_000 * 60,
  hr: 1_000 * 60 * 60,
  d: 1_000 * 60 * 60 * 24,
  w: 1_000 * 60 * 60 * 24 * 7,
}

/**
 * Sleep for a given amount of milliseocnds.
 *
 * @param ms
 * @returns
 */
export async function sleep(ms: number) {
  return await new Promise((r) => setTimeout(r, ms))
}

/**
 * Convert a time value from one unit to another.
 *
 * @param value
 * @param from
 * @param to
 * @returns
 */
export function convert(value: number, from: TimeUnit, to: TimeUnit) {
  const msRelativeFrom = msRelativeMap[from]
  const msRelativeTo = msRelativeMap[to]
  const fromMs = value * msRelativeFrom
  return fromMs / msRelativeTo
}
