function charRange(start: string, length: number) {
  return Array.from({ length }, (_, index) => String.fromCharCode(start.charCodeAt(0) + index)).join('')
}

export const CHARACTER_SETS = {
  lowercase: charRange('a', 26),
  uppercase: charRange('A', 26),
  numbers: charRange('0', 10),
  // Hyphen is reserved for dash grouping, so a "-" on screen is always a separator.
  symbols: '!"#$%&\'()*+,./:;<=>?@[]^_{|}~',
} as const

export type CharacterClass = keyof typeof CHARACTER_SETS

export const GROUP_SIZES = [0, 3, 4, 5] as const
export type GroupSize = (typeof GROUP_SIZES)[number]

export const MIN_LENGTH = 1
export const MAX_LENGTH = 256

const UINT32_RANGE = 2 ** 32
const MAX_SAMPLE_ATTEMPTS = 1024

export type RandomFill = (buffer: Uint32Array) => void

/**
 * Integer in `[0, max)` from `crypto.getRandomValues`, without modulo bias.
 * Values in the incomplete tail of the 2^32 range are discarded and redrawn.
 */
export function secureRandomInt(max: number, fill: RandomFill = fillCrypto): number {
  if (!Number.isInteger(max) || max < 1 || max > UINT32_RANGE) {
    throw new RangeError('max must be an integer from 1 through 2^32.')
  }

  const limit = UINT32_RANGE - (UINT32_RANGE % max)
  const sample = new Uint32Array(1)

  for (let attempt = 0; attempt < MAX_SAMPLE_ATTEMPTS; attempt += 1) {
    fill(sample)
    if (sample[0] < limit) return sample[0] % max
  }

  throw new Error('Could not draw an unbiased random number.')
}

function fillCrypto(buffer: Uint32Array) {
  if (typeof crypto === 'undefined' || typeof crypto.getRandomValues !== 'function') {
    throw new Error('crypto.getRandomValues is not available in this browser.')
  }
  crypto.getRandomValues(buffer)
}

export interface PasswordRequest {
  length: number
  classes: readonly CharacterClass[]
  randomInt?: (max: number) => number
}

/**
 * Builds a password of `length` secret characters.
 * Length never includes dash separators — apply those with `formatPassword`.
 * Every selected character class appears at least once.
 */
export function generatePassword({ length, classes, randomInt }: PasswordRequest): string {
  if (!Number.isInteger(length) || length < MIN_LENGTH || length > MAX_LENGTH) {
    throw new Error(`Length must be an integer from ${MIN_LENGTH} to ${MAX_LENGTH}.`)
  }

  const selected = uniqueClasses(classes)
  if (selected.length === 0) {
    throw new Error('Select at least one character set.')
  }
  if (length < selected.length) {
    throw new Error(
      `Length must be at least ${selected.length} to include every selected character set.`,
    )
  }

  const next = randomInt ?? ((max: number) => secureRandomInt(max))
  const characters: string[] = []

  for (const name of selected) {
    const pool = CHARACTER_SETS[name]
    characters.push(pool[next(pool.length)])
  }

  const combined = selected.map((name) => CHARACTER_SETS[name]).join('')
  while (characters.length < length) {
    characters.push(combined[next(combined.length)])
  }

  shuffle(characters, next)
  return characters.join('')
}

/**
 * Splits a password into groups. `0` leaves it unchanged.
 * A final short group is kept when the length is not a multiple of the group size.
 * A length of 12 with groups of 4 is four groups joined by dashes.
 */
export function formatPassword(password: string, groupSize: GroupSize): string {
  if (!(GROUP_SIZES as readonly number[]).includes(groupSize)) {
    throw new Error('Group size must be off, 3, 4, or 5.')
  }
  if (groupSize === 0 || password.length === 0) return password

  const groups: string[] = []
  for (let index = 0; index < password.length; index += groupSize) {
    groups.push(password.slice(index, index + groupSize))
  }
  return groups.join('-')
}

export function groupingPattern(length: number, groupSize: GroupSize): string {
  const sample = CHARACTER_SETS.lowercase.repeat(Math.ceil(length / 26) || 1).slice(0, length)
  return formatPassword(sample, groupSize)
}

export type StrengthLabel = 'Weak' | 'Fair' | 'Good' | 'Strong'

export interface Strength {
  bits: number
  score: 0 | 1 | 2 | 3 | 4
  label: StrengthLabel
}

/** Entropy of the generator settings. Dashes are separators and add no entropy. */
export function estimateStrength(length: number, classes: readonly CharacterClass[]): Strength {
  const selected = uniqueClasses(classes)
  const charset = selected.reduce((sum, name) => sum + CHARACTER_SETS[name].length, 0)
  const bits = charset > 0 && length > 0 ? Math.round(length * Math.log2(charset)) : 0

  if (bits >= 80) return { bits, score: 4, label: 'Strong' }
  if (bits >= 60) return { bits, score: 3, label: 'Good' }
  if (bits >= 36) return { bits, score: 2, label: 'Fair' }
  if (bits > 0) return { bits, score: 1, label: 'Weak' }
  return { bits: 0, score: 0, label: 'Weak' }
}

function uniqueClasses(classes: readonly CharacterClass[]): CharacterClass[] {
  const seen = new Set<CharacterClass>()
  const selected: CharacterClass[] = []
  for (const name of classes) {
    if (!CHARACTER_SETS[name]) {
      throw new Error(`Unknown character set: ${String(name)}`)
    }
    if (seen.has(name)) continue
    seen.add(name)
    selected.push(name)
  }
  return selected
}

function shuffle(items: string[], next: (max: number) => number) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = next(index + 1)
    const current = items[index]
    items[index] = items[swapIndex]
    items[swapIndex] = current
  }
}
