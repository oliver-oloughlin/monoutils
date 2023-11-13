/**
 * Get a list of result values from a list of promises.
 * Only returns the values of fulfilled promises.
 *
 * @param values - List of values to be awaited.
 * @returns Successfully awaited values.
 */
export async function allFulfilled<const T>(values: T[]) {
  // Get settled results
  const settled = await Promise.allSettled(values)

  // Return fulfilled values
  return settled.reduce(
    (acc, result) =>
      result.status === "fulfilled" ? [...acc, result.value] : acc,
    [] as Awaited<T>[],
  )
}

/**
 * Perform throttled async tasks.
 *
 * @param values - List of values to be awaited.
 * @param batchSize - Batch size of concurrent asyncronous jobs.
 * @returns Successfully awaited values.
 */
export async function throttle<const T>(values: T[], batchSize = 10) {
  const sliced: T[][] = []
  batchSize = Math.max(1, batchSize)

  for (let i = 0; i < values.length; i += batchSize) {
    sliced.push(values.slice(i, i + batchSize) as T[])
  }

  const results: Awaited<T>[] = []

  for (const batch of sliced) {
    const batchResults = await allFulfilled(batch)
    results.push(...batchResults)
  }

  return results
}
