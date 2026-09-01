import { cn } from '../../lib/cn'

export function Marquee({
  items,
  className,
  speed = 3.2,
}: {
  items: string[]
  className?: string
  speed?: number
}) {
  if (items.length === 0) return null
  const duration = Math.max(18, items.length * speed)

  return (
    <div className={cn('edge-fade group relative overflow-hidden', className)}>
      <div
        className="flex w-max animate-ticker items-center group-hover:[animation-play-state:paused]"
        style={{ ['--ticker-duration' as string]: `${duration}s` }}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {items.map((item, index) => (
              <li key={`${copy}-${item}-${index}`} className="flex items-center whitespace-nowrap">
                <span className="px-6 font-mono text-[12.5px] uppercase tracking-[0.2em] text-white/45 transition-colors duration-300 hover:text-white/80">
                  {item}
                </span>
                <span className="h-1 w-1 rotate-45 bg-crimson-600/70" aria-hidden />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
