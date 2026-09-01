import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Rise } from './Rise'

export function SectionHead({
  index,
  kicker,
  title,
  lede,
  action,
  onAccent = false,
  className,
}: {
  index?: string
  kicker?: string
  title: string
  lede?: string
  action?: ReactNode
  onAccent?: boolean
  className?: string
}) {
  return (
    <Rise className={cn('grid gap-8 lg:grid-cols-[auto_1fr] lg:gap-14', className)}>
      {index ? (
        <span
          className={cn(
            'text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none tracking-[-0.04em]',
            onAccent ? 'text-white/35' : 'text-accent',
          )}
        >
          {index}
        </span>
      ) : null}

      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          {kicker ? <p className={cn(onAccent ? 'kicker text-white/70' : 'kicker')}>{kicker}</p> : null}
          <h2 className={cn('mt-4 text-balance text-huge font-semibold', onAccent ? 'text-white' : 'text-white')}>
            {title}
          </h2>
          {lede ? (
            <p className={cn('mt-5 max-w-read text-pretty', onAccent ? 'copy-lg text-white/80' : 'copy-lg')}>{lede}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </Rise>
  )
}
