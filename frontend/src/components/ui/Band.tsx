import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Tone = 'ink' | 'raised' | 'accent'

const TONES: Record<Tone, string> = {
  ink: 'bg-ink text-white',
  raised: 'bg-raised text-white',
  accent: 'bg-accent text-white',
}

export function Band({
  tone = 'ink',
  children,
  className,
  id,
}: {
  tone?: Tone
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={cn(TONES[tone], className)}>
      <div className="page py-20 sm:py-28">{children}</div>
    </section>
  )
}
