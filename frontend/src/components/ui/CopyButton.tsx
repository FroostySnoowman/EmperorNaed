import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export function CopyButton({ value, label = 'Copy', className }: { value: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current)
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      return
    }
    setCopied(true)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault()
        void handleCopy()
      }}
      aria-label={`${label} ${value}`}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-white/12 px-2.5 py-1.5 text-xs text-white/55 transition-colors hover:border-white/25 hover:text-white',
        className,
      )}
    >
      <Icon name={copied ? 'check' : 'copy'} className="text-[13px]" />
      {copied ? 'Copied' : label}
    </button>
  )
}
