import { cn } from '../../lib/cn'
import { clamp } from '../../lib/utils'
import { Icon } from './Icon'

export function Rating({ value, className, size = 'md' }: { value: number; className?: string; size?: 'sm' | 'md' }) {
  const rating = clamp(value, 0, 5)
  const percent = (rating / 5) * 100
  const starSize = size === 'sm' ? 'text-[12px]' : 'text-[14px]'

  const row = (tone: string) => (
    <div className={cn('flex gap-0.5', starSize, tone)}>
      {Array.from({ length: 5 }, (_, index) => (
        <Icon key={index} name="star" />
      ))}
    </div>
  )

  return (
    <div className={cn('relative inline-flex w-fit', className)} aria-label={`${rating.toFixed(1)} out of 5`} role="img">
      {row('text-white/15')}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${percent}%` }} aria-hidden>
        {row('text-crimson-400')}
      </div>
    </div>
  )
}
