import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { isExternal } from '../../lib/utils'
import { Icon } from './Icon'

type Variant = 'fill' | 'outline' | 'onAccent' | 'text'

const VARIANTS: Record<Variant, string> = {
  fill: 'btn btn-fill',
  outline: 'btn btn-outline',
  onAccent: 'btn btn-on-accent',
  text: 'stack-link',
}

export function ActionLink({
  to,
  children,
  variant = 'outline',
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
  const classes = cn(VARIANTS[variant], withArrow && 'group/link', className)
  const inner = (
    <>
      {children}
      {withArrow ? (
        <Icon
          name={external ? 'arrow-out' : 'arrow-right'}
          className="text-[1.1em] transition-transform duration-200 group-hover/link:translate-x-1"
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
