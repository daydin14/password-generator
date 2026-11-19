import Generator from './components/Generator'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const year = new Date().getFullYear()
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#generator"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:btn focus:btn-sm focus:btn-primary"
      >
        Skip to generator
      </a>
      <header className="sticky top-0 z-40 border-b border-base-300/80 bg-base-100/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <KeyMark />
            <h1 className="text-base font-semibold leading-tight tracking-tight sm:text-xl">
              Dave&apos;s <span className="text-primary">Password</span> Generator
            </h1>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm min-h-11"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
            <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:py-10">
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-base-content/75 sm:text-base">
          Cryptographically secure passwords, with an optional split into groups of 3, 4, or 5.
          Length counts characters only. Dashes are separators, and copy keeps exactly what you see.
        </p>
        <Generator />
      </main>
      <footer className="border-t border-base-300/80 bg-base-100/70">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 py-6 text-sm text-base-content/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Created by{' '}
            <a
              className="link link-hover text-primary"
              href="https://github.com/daydin14"
              target="_blank"
              rel="noreferrer noopener"
            >
              David Aydin
            </a>{' '}
            © {year}
          </p>
          <p>daydin14</p>
        </div>
      </footer>
    </div>
  )
}

function KeyMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className="size-8 shrink-0 text-primary">
      <circle cx="10" cy="16" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="10" cy="16" r="1.7" fill="currentColor" />
      <path
        d="M15 16h12M22.5 16v3.4M27 16v3.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path
        d="M15.5 3.8A7.8 7.8 0 1 0 20.2 14 6.2 6.2 0 0 1 15.5 3.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}
