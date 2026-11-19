import { describe, expect, it } from 'vitest'
import {
  CHARACTER_SETS,
  estimateStrength,
  formatPassword,
  generatePassword,
  groupingPattern,
  secureRandomInt,
  type CharacterClass,
  type GroupSize,
  type RandomFill,
} from './password'

const ALL_CLASSES: CharacterClass[] = ['lowercase', 'uppercase', 'numbers', 'symbols']

function scriptedFill(draws: number[]): RandomFill {
  let index = 0
  return (buffer) => {
    const next = draws[index]
    if (next === undefined) {
      throw new Error('Random script ran out of draws.')
    }
    index += 1
    buffer[0] = next
  }
}

describe('secureRandomInt', () => {
  it('rejects the biased tail of the 32-bit range', () => {
    const max = 3
    const range = 2 ** 32
    const limit = range - (range % max)
    expect(limit).toBe(0xffffffff)

    // `limit` is not a usable sample. The following draw, 1, is the result.
    // Accepting `limit` would return 0 and fail this assertion.
    expect(secureRandomInt(max, scriptedFill([limit, 1]))).toBe(1)
  })

  it('accepts the last unbiased value', () => {
    const limit = 2 ** 32 - (2 ** 32 % 3)
    expect(secureRandomInt(3, scriptedFill([limit - 1]))).toBe(2)
  })

  it('returns 0 when the range is a single possibility', () => {
    expect(secureRandomInt(1, scriptedFill([123456]))).toBe(0)
  })

  it('stops if every draw falls in the biased tail', () => {
    expect(() => secureRandomInt(3, scriptedFill(Array(2000).fill(0xffffffff)))).toThrow(
      /unbiased/,
    )
  })

  it('rejects a non-positive bound', () => {
    expect(() => secureRandomInt(0)).toThrow(RangeError)
  })
})

describe('generatePassword', () => {
  it('includes every selected class even when the random source always returns zero', () => {
    const password = generatePassword({
      length: 8,
      classes: ALL_CLASSES,
      randomInt: () => 0,
    })

    expect(password).toHaveLength(8)
    expect(password).toContain('a')
    expect(password).toContain('A')
    expect(password).toContain('0')
    expect(password).toContain(CHARACTER_SETS.symbols[0])
  })

  it('uses only the selected classes', () => {
    for (let trial = 0; trial < 20; trial += 1) {
      const password = generatePassword({
        length: 40,
        classes: ['lowercase', 'numbers'],
      })
      expect(password).toMatch(/^[a-z0-9]+$/)
      expect(password).toMatch(/[a-z]/)
      expect(password).toMatch(/[0-9]/)
    }
  })

  it('keeps the hyphen out of the character set so grouping dashes stay unambiguous', () => {
    expect(CHARACTER_SETS.symbols).not.toContain('-')
    const password = generatePassword({ length: 80, classes: ['symbols'] })
    expect(password).not.toContain('-')
    expect(password).toMatch(/^[^a-zA-Z0-9-]+$/)
  })

  it('refuses an empty character selection', () => {
    expect(() => generatePassword({ length: 8, classes: [] })).toThrow(/at least one/i)
  })

  it('refuses a length shorter than the number of selected classes', () => {
    expect(() =>
      generatePassword({
        length: 2,
        classes: ['lowercase', 'uppercase', 'numbers'],
      }),
    ).toThrow(/at least 3/)
  })
})

const letters = CHARACTER_SETS.lowercase

function lettersOf(length: number) {
  return letters.slice(0, length)
}

describe('formatPassword', () => {
  it('groups by 3, 4, and 5 and can turn grouping off', () => {
    const sample = lettersOf(12)
    expect(formatPassword(sample, 3)).toBe('abc-def-ghi-jkl')
    expect(formatPassword(sample, 4)).toBe('abcd-efgh-ijkl')
    expect(formatPassword(sample, 5)).toBe('abcde-fghij-kl')
    expect(formatPassword(sample, 0)).toBe(sample)
  })

  it('keeps a short final group when the length is not a multiple', () => {
    const digits = '0123456789'
    expect(formatPassword(digits, 3)).toBe('012-345-678-9')
    expect(formatPassword(digits, 4)).toBe('0123-4567-89')
    expect(formatPassword(digits, 5)).toBe('01234-56789')
  })

  it('does not add a leading, trailing, or doubled dash', () => {
    for (const groupSize of [3, 4, 5] as const) {
      const formatted = formatPassword(lettersOf(10), groupSize)
      expect(formatted.startsWith('-')).toBe(false)
      expect(formatted.endsWith('-')).toBe(false)
      expect(formatted.includes('--')).toBe(false)
    }
  })

  it('treats length as secret characters and leaves dashes out of that count', () => {
    const cases: { length: number; groupSize: GroupSize }[] = [
      { length: 12, groupSize: 3 },
      { length: 12, groupSize: 4 },
      { length: 12, groupSize: 5 },
      { length: 16, groupSize: 4 },
      { length: 10, groupSize: 3 },
      { length: 10, groupSize: 0 },
    ]

    for (const { length, groupSize } of cases) {
      const raw = generatePassword({ length, classes: ['lowercase', 'uppercase', 'numbers'] })
      const displayed = formatPassword(raw, groupSize)
      const secret = displayed.replaceAll('-', '')

      expect(raw).toHaveLength(length)
      expect(secret).toBe(raw)
      expect(secret).toHaveLength(length)

      if (groupSize === 0) {
        expect(displayed).toBe(raw)
        continue
      }

      const groups = displayed.split('-')
      expect(groups).toHaveLength(Math.ceil(length / groupSize))
      groups.forEach((group, index) => {
        const remaining = length - groupSize * index
        expect(group).toHaveLength(Math.min(groupSize, remaining))
      })
      expect(displayed).toHaveLength(length + groups.length - 1)
    }
  })

  it('builds the readable pattern shown in the interface', () => {
    expect(groupingPattern(12, 4)).toBe('abcd-efgh-ijkl')
    expect(groupingPattern(16, 5)).toBe('abcde-fghij-klmno-p')
    expect(groupingPattern(8, 0)).toBe('abcdefgh')
  })

  it('rejects a group size other than off, 3, 4, or 5', () => {
    expect(() => formatPassword(lettersOf(6), 2 as GroupSize)).toThrow(/group size/i)
  })
})

describe('estimateStrength', () => {
  it('rates longer, wider passwords as stronger and ignores duplicate classes', () => {
    expect(estimateStrength(4, ['numbers']).label).toBe('Weak')
    expect(estimateStrength(16, ['lowercase']).label).toBe('Good')
    expect(estimateStrength(16, ALL_CLASSES).label).toBe('Strong')
    expect(estimateStrength(16, ['lowercase', 'lowercase']).bits).toBe(
      estimateStrength(16, ['lowercase']).bits,
    )
  })
})
