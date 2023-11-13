/**
 * Clamp a number between a lower and upper limit.
 *
 * @param min - Lower limit.
 * @param n - Number to be clamped.
 * @param max - Upper limit.
 * @returns - A clamped value.
 */
export function clamp(min: number, n: number, max: number) {
  return Math.min(Math.max(min, n), max)
}
