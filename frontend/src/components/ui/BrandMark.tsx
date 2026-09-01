import { cn } from '../../lib/cn'
import { Sigil } from './Sigil'

export function BrandMark({
  avatar,
  monogram,
  alt = '',
  className,
  glow = false,
}: {
  avatar: string
  monogram: string
  alt?: string
  className?: string
  glow?: boolean
}) {
  if (!avatar.trim()) {
    return <Sigil monogram={monogram} className={className} />
  }

  return (
    <span
      className={cn(
        'relative inline-block shrink-0 rounded-xl bg-gradient-to-br from-crimson-300/80 via-crimson-600/70 to-crimson-950 p-[1.5px] align-middle',
        glow && 'shadow-[0_0_28px_-6px_rgba(222,15,63,0.7)]',
        className,
      )}
    >
      <img src={avatar} alt={alt} loading="lazy" decoding="async" className="h-full w-full rounded-[10px] object-cover" />
      <span className="pointer-events-none absolute inset-[1.5px] rounded-[10px] ring-1 ring-inset ring-white/10" aria-hidden />
    </span>
  )
}
