import { cn } from '../../lib/cn'

export function BrandMark({
  avatar,
  monogram,
  alt = '',
  className,
}: {
  avatar: string
  monogram: string
  alt?: string
  className?: string
}) {
  if (!avatar.trim()) {
    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] align-middle text-[0.62em] font-bold text-white',
          className,
        )}
      >
        {monogram}
      </span>
    )
  }

  return (
    <span className={cn('inline-block shrink-0 overflow-hidden rounded-lg border border-white/10 align-middle', className)}>
      <img src={avatar} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
    </span>
  )
}
