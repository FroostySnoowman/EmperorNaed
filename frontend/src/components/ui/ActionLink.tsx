import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { isExternal } from '../../lib/utils'
import { Icon } from './Icon'

type Variant = 'primary' | 'ghost' | 'text'

const VARIANTS: Record<Variant, string> = {
  primary: 'btn btn-primary btn-sheen',
  ghost: 'btn btn-ghost btn-sheen',
  text: 'group/link inline-flex items-center gap-2 text-sm font-semibold text-crimson-300 transition hover:text-crimson-200',
}

export function ActionLink({
  to,
  children,
  variant = 'ghost',
  className,
  withArrow = false,
  onClick,
}: {
  to: string
  children: ReactNode
  variant?: Variant
  className?: string
  withArrow?: boolean
  onClick?: () => void
}) {
  const external = isExternal(to)
  const classes = cn(VARIANTS[variant], className)

  const inner = (
    <>
      <span className="relative z-[1]">{children}</span>
      {withArrow ? (
        <Icon
          name={external ? 'arrow-up-right' : 'arrow-right'}
          className={cn(
            'relative z-[1] text-[1.05em] transition-transform duration-300',
            variant === 'text' ? 'group-hover/link:translate-x-1' : 'group-hover:translate-x-0.5',
          )}
        />
      ) : null}
    </>
  )

  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={classes} onClick={onClick}>
        {inner}
      </a>
    )
  }

  return (
    <Link to={to} className={classes} onClick={onClick}>
      {inner}
    </Link>
  )
}
