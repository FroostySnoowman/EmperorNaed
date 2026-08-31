import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Reveal } from './Reveal'

export function SectionHeading({
  marker,
  title,
  kicker,
  action,
  className,
}: {
  marker?: string
  title: string
  kicker?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <Reveal className={cn('flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="max-w-2xl">
        {marker ? <p className="eyebrow">{marker}</p> : null}
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
        {kicker ? <p className="mt-3 text-pretty text-[15px] leading-relaxed text-white/60">{kicker}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </Reveal>
  )
}
