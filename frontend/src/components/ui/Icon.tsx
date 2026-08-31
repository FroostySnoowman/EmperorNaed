import type { ReactElement, SVGProps } from 'react'
import { cn } from '../../lib/cn'

export type IconGlyph =
  | 'discord'
  | 'github'
  | 'globe'
  | 'mail'
  | 'youtube'
  | 'twitter'
  | 'store'
  | 'server'
  | 'plugin'
  | 'shield'
  | 'users'
  | 'spark'
  | 'clock'
  | 'terminal'
  | 'layers'
  | 'gauge'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'check'
  | 'copy'
  | 'close'
  | 'chevron-down'
  | 'star'
  | 'quote'

const FILLED: ReadonlySet<IconGlyph> = new Set(['discord', 'github', 'star', 'quote'])

const PATHS: Record<IconGlyph, ReactElement> = {
  discord: (
    <path d="M19.27 5.33A16.4 16.4 0 0 0 15.16 4l-.28.53a12.6 12.6 0 0 1 3.7 1.85 14.9 14.9 0 0 0-12.9-.48c-.28.12-.45.2-.5.22a12.7 12.7 0 0 1 3.68-1.6L8.84 4a16.4 16.4 0 0 0-4.11 1.33C2.5 8.63 1.9 11.85 2.2 15.03a16.6 16.6 0 0 0 5.03 2.54l1.1-1.5c-.6-.22-1.18-.5-1.72-.83l.42-.31a11.9 11.9 0 0 0 10.15 0l.42.31c-.54.33-1.11.6-1.72.83l1.1 1.5a16.6 16.6 0 0 0 5.03-2.54c.36-3.68-.6-6.87-2.74-9.7ZM9.2 13.4c-.98 0-1.79-.9-1.79-2s.79-2.01 1.79-2.01 1.8.9 1.79 2c0 1.1-.8 2.01-1.79 2.01Zm5.6 0c-.98 0-1.79-.9-1.79-2s.79-2.01 1.79-2.01 1.8.9 1.79 2c0 1.1-.8 2.01-1.79 2.01Z" />
  ),
  github: (
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7.5 7.13 5.05a1.5 1.5 0 0 0 1.74 0L20 7.5" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10.5 9.5 5 2.5-5 2.5z" />
    </>
  ),
  twitter: <path d="M4 4l7.2 9.3L4.4 20h2.2l5.5-5.5L16.3 20H20l-7.4-9.6L19.4 4h-2.2l-5.1 5.1L8 4z" />,
  store: (
    <>
      <path d="M6 3h12l2.5 4.2a2.6 2.6 0 0 1-4.5 2.4 2.6 2.6 0 0 1-4 0 2.6 2.6 0 0 1-4 0 2.6 2.6 0 0 1-4.5-2.4Z" />
      <path d="M5 10.5V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8.5" />
      <path d="M10 21v-5h4v5" />
    </>
  ),
  server: (
    <>
      <rect x="3" y="4" width="18" height="6.5" rx="2" />
      <rect x="3" y="13.5" width="18" height="6.5" rx="2" />
      <path d="M7 7.25h.01M7 16.75h.01" />
    </>
  ),
  plugin: (
    <>
      <path d="M9 3v4M15 3v4" />
      <path d="M6 7h12v5a6 6 0 0 1-12 0Z" />
      <path d="M12 18v3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5.5c0 4.2 2.9 7.6 7 9.5 4.1-1.9 7-5.3 7-9.5V6Z" />
      <path d="m9.2 12 2 2 3.6-3.8" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.3a3.2 3.2 0 0 1 0 5.9M17.5 14.6a5.5 5.5 0 0 1 3 5.4" />
    </>
  ),
  spark: <path d="M12 3l1.9 5.4a3 3 0 0 0 1.7 1.7L21 12l-5.4 1.9a3 3 0 0 0-1.7 1.7L12 21l-1.9-5.4a3 3 0 0 0-1.7-1.7L3 12l5.4-1.9a3 3 0 0 0 1.7-1.7Z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 1.9" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="m7.5 9.5 2.8 2.5-2.8 2.5M13 15h4" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5Z" />
      <path d="m3.5 12.2 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16.6 8.5 4.5 8.5-4.5" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 18a8.5 8.5 0 1 1 16 0" />
      <path d="m14.8 10.6-2.4 3.6a1.6 1.6 0 1 1-1.6-2.4Z" />
    </>
  ),
  'arrow-right': <path d="M4.5 12h14m0 0-5.2-5.2M18.5 12l-5.2 5.2" />,
  'arrow-up-right': <path d="M7 17 17 7m0 0H8.5M17 7v8.5" />,
  check: <path d="m4.8 12.4 4.6 4.6L19.2 7.2" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M15.5 6.2A2.2 2.2 0 0 0 13.3 4H6.2A2.2 2.2 0 0 0 4 6.2v7.1a2.2 2.2 0 0 0 2.2 2.2" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  'chevron-down': <path d="m6 9.5 6 6 6-6" />,
  star: <path d="m12 2.6 2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.44 6.19 20.5l1.11-6.47L2.6 9.45l6.5-.95Z" />,
  quote: <path d="M9.4 5C6.4 6.6 4.6 9.4 4.6 13v6h6.9v-7.1H8.2c0-2 .6-3.5 2.3-4.6Zm10 0c-3 1.6-4.8 4.4-4.8 8v6h6.9v-7.1h-3.3c0-2 .6-3.5 2.3-4.6Z" />,
}

export type IconProps = SVGProps<SVGSVGElement> & {
  name: IconGlyph
  className?: string
}

export function Icon({ name, className, ...rest }: IconProps) {
  const filled = FILLED.has(name)
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      className={cn('h-[1em] w-[1em] shrink-0', className)}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? undefined : 1.6}
      strokeLinecap={filled ? undefined : 'round'}
      strokeLinejoin={filled ? undefined : 'round'}
      {...rest}
    >
      {PATHS[name]}
    </svg>
  )
}
