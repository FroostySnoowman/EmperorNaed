import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function Card({
  children,
  className,
  innerClassName,
  hover = true,
}: {
  children: ReactNode
  className?: string
  innerClassName?: string
  hover?: boolean
}) {
  return (
    <div className={cn('card', hover && 'card-hover', className)}>
      <div className={innerClassName}>{children}</div>
    </div>
  )
}
