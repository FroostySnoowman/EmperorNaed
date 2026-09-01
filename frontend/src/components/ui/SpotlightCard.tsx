import { useCallback, useEffect, useRef, useState, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react'
import { cn } from '../../lib/cn'
import { useCanHover } from '../../lib/useCanHover'

export function SpotlightCard({
  children,
  className,
  innerClassName,
}: {
  children: ReactNode
  className?: string
  innerClassName?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLSpanElement>(null)
  const frameRef = useRef(0)
  const pointRef = useRef({ x: 0, y: 0 })
  const [active, setActive] = useState(false)
  const canHover = useCanHover()

  useEffect(
    () => () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    },
    [],
  )

  const handleMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    pointRef.current = { x: event.clientX, y: event.clientY }
    if (frameRef.current) return
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0
      const root = rootRef.current
      const glow = glowRef.current
      if (!root || !glow) return
      const rect = root.getBoundingClientRect()
      const x = pointRef.current.x - rect.left
      const y = pointRef.current.y - rect.top
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`
    })
  }, [])

  const hoverProps = canHover
    ? {
        onPointerMove: handleMove,
        onPointerEnter: () => setActive(true),
        onPointerLeave: () => setActive(false),
      }
    : {}

  return (
    <div ref={rootRef} data-active={active} className={cn('plate spotlight group', className)} {...hoverProps}>
      {canHover ? <span ref={glowRef} className="spotlight__glow" aria-hidden /> : null}
      <div className={cn('relative z-[2]', innerClassName)}>{children}</div>
    </div>
  )
}
