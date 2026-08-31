import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { isExternal } from '../../lib/utils'
import { Icon } from './Icon'

type Variant = 'primary' | 'ghost' | 'text'

const VARIANTS: Record<Variant, string> = {
  primary: 'btn btn-primary',
  ghost: 'btn btn-ghost',
  text: 'link-accent',
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
      {children}
      {withArrow ? <Icon name={external ? 'arrow-up-right' : 'arrow-right'} className="text-[1.05em]" /> : null}
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
