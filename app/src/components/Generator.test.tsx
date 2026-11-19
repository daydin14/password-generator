// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'
import '@testing-library/jest-dom/vitest'
import App from '../App'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

function expectGroups(displayed: string, raw: string, groupSize: number) {
  expect(displayed.replaceAll('-', '')).toBe(raw)
  if (groupSize === 0) {
    expect(displayed).toBe(raw)
    return
  }
  const parts = displayed.split('-')
  expect(parts).toHaveLength(Math.ceil(raw.length / groupSize))
  parts.forEach((part, index) => {
    const remaining = raw.length - groupSize * index
    expect(part).toHaveLength(Math.min(groupSize, remaining))
  })
}

it('formats groups of 3, 4, and 5 and copies the password exactly as displayed', async () => {
  const user = userEvent.setup()
  render(<App />)

  const output = () => screen.getByTestId('password-output').textContent ?? ''
  const raw = output()
  expect(raw).toHaveLength(16)
  expect(raw.includes('-')).toBe(false)

  await user.click(screen.getByRole('radio', { name: 'Groups of 4' }))
  expectGroups(output(), raw, 4)

  await user.click(screen.getByRole('radio', { name: 'Groups of 3' }))
  expectGroups(output(), raw, 3)

  await user.click(screen.getByRole('radio', { name: 'Groups of 5' }))
  expectGroups(output(), raw, 5)

  const displayed = output()
  await user.click(screen.getByRole('button', { name: 'Copy password' }))
  expect(await navigator.clipboard.readText()).toBe(displayed)
  expect(await screen.findByText('Copied')).toBeInTheDocument()

  await user.click(screen.getByRole('radio', { name: 'No grouping' }))
  expect(output()).toBe(raw)
})
