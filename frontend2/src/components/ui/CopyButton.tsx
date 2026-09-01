import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current)
  }, [])

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault()
        void navigator.clipboard
          .writeText(value)
          .then(() => {
            setCopied(true)
            if (timer.current) window.clearTimeout(timer.current)
            timer.current = window.setTimeout(() => setCopied(false), 1800)
          })
          .catch(() => undefined)
      }}
      aria-label={`Copy ${value}`}
      className={cn(
        'inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-paper-faint transition-colors hover:text-paper',
        className,
      )}
    >
      <Icon name={copied ? 'check' : 'copy'} className="text-[13px]" />
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
