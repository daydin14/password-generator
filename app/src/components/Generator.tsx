import { useEffect, useRef, useState } from 'react'
import {
  CHARACTER_SETS,
  estimateStrength,
  formatPassword,
  generatePassword,
  groupingPattern,
  type CharacterClass,
  type GroupSize,
  type StrengthLabel,
} from '../lib/password'

const UI_MIN_LENGTH = 4
const UI_MAX_LENGTH = 64
const DEFAULT_LENGTH = 16

const CLASS_OPTIONS: { id: CharacterClass; label: string; hint: string }[] = [
  { id: 'lowercase', label: 'Lowercase', hint: 'a–z' },
  { id: 'uppercase', label: 'Uppercase', hint: 'A–Z' },
  { id: 'numbers', label: 'Numbers', hint: '0–9' },
  { id: 'symbols', label: 'Symbols', hint: '!@#' },
]

const GROUP_OPTIONS: { value: GroupSize; short: string; label: string }[] = [
  { value: 0, short: 'Off', label: 'No grouping' },
  { value: 3, short: '3', label: 'Groups of 3' },
  { value: 4, short: '4', label: 'Groups of 4' },
  { value: 5, short: '5', label: 'Groups of 5' },
]

const DEFAULT_CLASSES: CharacterClass[] = CLASS_OPTIONS.map((option) => option.id)

type CopyState = 'idle' | 'copied' | 'error'

function flagsFrom(classes: readonly CharacterClass[]): Record<CharacterClass, boolean> {
  return {
    lowercase: classes.includes('lowercase'),
    uppercase: classes.includes('uppercase'),
    numbers: classes.includes('numbers'),
    symbols: classes.includes('symbols'),
  }
}

function selectedFrom(flags: Record<CharacterClass, boolean>): CharacterClass[] {
  return CLASS_OPTIONS.filter((option) => flags[option.id]).map((option) => option.id)
}

function sameClasses(left: readonly CharacterClass[], right: readonly CharacterClass[]) {
  return left.length === right.length && left.every((name, index) => name === right[index])
}

export default function Generator() {
  const [length, setLength] = useState(DEFAULT_LENGTH)
  const [flags, setFlags] = useState(() => flagsFrom(DEFAULT_CLASSES))
  const [groupSize, setGroupSize] = useState<GroupSize>(0)
  const [raw, setRaw] = useState(() =>
    generatePassword({ length: DEFAULT_LENGTH, classes: DEFAULT_CLASSES }),
  )
  const [recipe, setRecipe] = useState({ length: DEFAULT_LENGTH, classes: DEFAULT_CLASSES })
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const [error, setError] = useState('')
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [])

  const selected = selectedFrom(flags)
  const displayed = formatPassword(raw, groupSize)
  const strength = estimateStrength(recipe.length, recipe.classes)
  const stale = length !== recipe.length || !sameClasses(selected, recipe.classes)
  const pattern = groupingPattern(raw.length, groupSize)

  function clearCopyState() {
    if (resetTimer.current) clearTimeout(resetTimer.current)
    setCopyState('idle')
  }

  function flashCopied() {
    setCopyState('copied')
    if (resetTimer.current) clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setCopyState('idle'), 2000)
  }

  function updateLength(value: number) {
    if (!Number.isFinite(value)) return
    setLength(Math.min(UI_MAX_LENGTH, Math.max(UI_MIN_LENGTH, Math.round(value))))
  }

  function toggleClass(id: CharacterClass) {
    setFlags((current) => {
      const next = { ...current, [id]: !current[id] }
      if (!Object.values(next).some(Boolean)) return current
      return next
    })
  }

  function selectGroup(size: GroupSize) {
    setGroupSize(size)
    clearCopyState()
  }

  function onGenerate() {
    try {
      const classes = selectedFrom(flags)
      const next = generatePassword({ length, classes })
      setRaw(next)
      setRecipe({ length, classes })
      setError('')
      clearCopyState()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not generate a password.')
    }
  }

  async function onCopy() {
    try {
      await writeClipboard(displayed)
      flashCopied()
    } catch {
      setCopyState('error')
    }
  }

  return (
    <section id="generator" className="overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-xl" aria-labelledby="generator-title">
      <h2 id="generator-title" className="sr-only">
        Password generator
      </h2>
      <div className="border-b border-base-300 bg-base-200/70 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold tracking-[0.16em] text-base-content/60 uppercase">
              Generated password
            </p>
            <p
              data-testid="password-output"
              aria-live="polite"
              className="mt-2 min-w-0 break-all font-mono text-xl leading-relaxed tracking-wide sm:text-[1.7rem]"
            >
              {displayed.split('-').map((group, index) => (
                <span key={`${index}-${group}`}>
                  {index > 0 ? <span className="text-primary">-</span> : null}
                  {group}
                </span>
              ))}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary min-h-11 w-full sm:w-auto"
            onClick={onCopy}
            aria-label="Copy password"
          >
            {copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Copy failed' : 'Copy'}
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          {copyState === 'copied'
            ? 'Password copied to clipboard.'
            : copyState === 'error'
              ? 'Could not copy the password.'
              : ''}
        </p>
        <div className="mt-5">
          <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
            <p>
              <span className="font-semibold">{strength.label}</span>
              <span className="text-base-content/70"> · {strength.bits} bits</span>
            </p>
            <p className="text-base-content/70">
              {raw.length} characters
              {groupSize > 0 ? ` · groups of ${groupSize}` : ''}
            </p>
          </div>
          <div
            className="flex gap-1.5"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={4}
            aria-valuenow={strength.score}
            aria-label="Password strength"
            aria-valuetext={`${strength.label}, about ${strength.bits} bits of entropy`}
          >
            {[1, 2, 3, 4].map((segment) => (
              <span
                key={segment}
                className={`h-2 flex-1 rounded-full ${
                  segment <= strength.score ? meterClass(strength.label) : 'bg-base-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <form
        className="space-y-6 p-4 sm:p-6"
        onSubmit={(event) => {
          event.preventDefault()
          onGenerate()
        }}
      >
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <label htmlFor="password-length" className="font-medium">
              Length
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={UI_MIN_LENGTH}
              max={UI_MAX_LENGTH}
              value={length}
              aria-label="Password length"
              className="input input-bordered w-20 text-center font-mono"
              onChange={(event) => updateLength(Number(event.target.value))}
            />
          </div>
          <input
            id="password-length"
            type="range"
            min={UI_MIN_LENGTH}
            max={UI_MAX_LENGTH}
            step={1}
            value={length}
            className="range range-primary w-full"
            aria-describedby="length-hint"
            onChange={(event) => updateLength(Number(event.target.value))}
          />
          <div className="mt-1 flex justify-between text-xs text-base-content/55">
            <span>{UI_MIN_LENGTH}</span>
            <span>{UI_MAX_LENGTH}</span>
          </div>
          <p id="length-hint" className="mt-2 text-sm text-base-content/70">
            Counts password characters only. Dashes are not included. Applies when you generate.
          </p>
        </div>

        <fieldset>
          <legend className="mb-3 font-medium">Dash groups</legend>
          <div className="join w-full sm:w-auto">
            {GROUP_OPTIONS.map((option) => {
              const active = groupSize === option.value
              return (
                <label
                  key={option.value}
                  className={`btn relative join-item min-h-11 flex-1 px-4 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary sm:flex-none ${
                    active ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  <input
                    type="radio"
                    name="group-size"
                    value={option.value}
                    checked={active}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={() => selectGroup(option.value)}
                  />
                  <span className="sr-only">{option.label}</span>
                  <span aria-hidden="true">{option.short}</span>
                </label>
              )
            })}
          </div>
          <p id="group-hint" className="mt-3 text-sm text-base-content/70">
            {groupSize === 0
              ? 'Grouping is off. Turn on 3, 4, or 5 to separate the password with dashes.'
              : `Shape: ${pattern}. Copy includes the dashes.`}
          </p>
        </fieldset>

        <fieldset>
          <legend className="mb-3 font-medium">Character sets</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CLASS_OPTIONS.map((option) => {
              const checked = flags[option.id]
              const lastSelected = checked && selected.length === 1
              return (
                <label
                  key={option.id}
                  className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-box border p-3 ${
                    checked ? 'border-primary bg-primary/10' : 'border-base-300'
                  } ${lastSelected ? 'cursor-not-allowed opacity-80' : ''}`}
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm mt-0.5"
                    checked={checked}
                    disabled={lastSelected}
                    aria-describedby={lastSelected ? 'charset-required' : undefined}
                    onChange={() => toggleClass(option.id)}
                  />
                  <span>
                    <span className="block font-medium leading-tight">{option.label}</span>
                    <span className="mt-1 block font-mono text-xs text-base-content/60">{option.hint}</span>
                  </span>
                </label>
              )
            })}
          </div>
          <p id="charset-required" className="mt-3 text-sm text-base-content/70">
            At least one set stays on, and the password includes a character from each set you select.
          </p>
          <details className="mt-3 text-sm text-base-content/70">
            <summary className="cursor-pointer font-medium text-base-content/80">Symbol characters</summary>
            <p className="mt-2 font-mono break-all text-base-content">{CHARACTER_SETS.symbols}</p>
            <p className="mt-1">The hyphen is reserved for grouping, so a dash always marks a group boundary.</p>
          </details>
        </fieldset>

        {stale ? (
          <p role="status" className="text-sm text-warning">
            Length or character sets changed. Generate again to apply them. The password above is unchanged.
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        ) : null}

        <button type="submit" className="btn btn-primary btn-block min-h-11">
          Generate password
        </button>
      </form>
    </section>
  )
}

function meterClass(label: StrengthLabel) {
  if (label === 'Strong') return 'bg-success'
  if (label === 'Good') return 'bg-info'
  if (label === 'Fair') return 'bg-warning'
  return 'bg-error'
}

async function writeClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      return
    } catch {
      // Some browsers reject the async clipboard API without a focused user gesture.
    }
  }
  writeWithTextArea(value)
}

function writeWithTextArea(value: string) {
  const area = document.createElement('textarea')
  area.value = value
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.left = '-9999px'
  document.body.append(area)
  area.select()
  const copied = document.execCommand('copy')
  area.remove()
  if (!copied) throw new Error('Could not copy the password.')
}
