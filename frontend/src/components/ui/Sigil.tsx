import { cn } from '../../lib/cn'

export function Sigil({ monogram, className }: { monogram: string; className?: string }) {
  return (
    <span className={cn('relative grid place-items-center', className)}>
      <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="sigil-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffc7d0" />
            <stop offset="45%" stopColor="#f22e56" />
            <stop offset="100%" stopColor="#4a0015" />
          </linearGradient>
          <linearGradient id="sigil-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(242,46,86,0.22)" />
            <stop offset="100%" stopColor="rgba(10,8,16,0.9)" />
          </linearGradient>
        </defs>
        <path d="M24 2.5 45.5 24 24 45.5 2.5 24Z" fill="url(#sigil-fill)" stroke="url(#sigil-stroke)" strokeWidth="1.6" />
        <path d="M24 2.5 24 45.5M2.5 24h43" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
        <path d="M24 9.5 38.5 24 24 38.5 9.5 24Z" stroke="rgba(255,255,255,0.14)" strokeWidth="1" fill="none" />
      </svg>
      <span className="absolute font-display text-[0.62em] font-extrabold leading-none tracking-tight text-white">
        {monogram}
      </span>
    </span>
  )
}
