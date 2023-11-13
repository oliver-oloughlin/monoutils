const ENCODER = new TextEncoder()
const SALT_DIVIDER = "__::__"
const DEFAULT_ALGORITHM: AlgorithmIdentifier = "SHA-256"

/**
 * Create hash from plaintext.
 *
 * @param plaintext
 * @param salt
 * @param algorithm
 * @returns
 */
export async function hash(
  plaintext: string,
  salt?: string,
  algorithm = DEFAULT_ALGORITHM,
) {
  const str = `${plaintext}${salt ?? ""}`
  const data = ENCODER.encode(str)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  const tail = salt ? `${SALT_DIVIDER}${salt}` : ""
  return `${hashHex}${tail}`
}

/**
 * Compare plaintext against text.
 *
 * @param plaintext
 * @param hashed
 * @param algorithm
 * @returns
 */
export async function compare(
  plaintext: string,
  hashed: string,
  algorithm = DEFAULT_ALGORITHM,
) {
  const [_, salt] = hashed.split(SALT_DIVIDER)

  const newHash = await hash(plaintext, salt, algorithm)
  return newHash === hashed
}
