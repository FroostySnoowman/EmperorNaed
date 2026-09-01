import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { EASE } from '../../lib/motion'

function split(value: string): { prefix: string; number: number | null; suffix: string } {
  const match = value.match(/^([^\d-]*)(-?\d+(?:\.\d+)?)(.*)$/)
  if (!match) return { prefix: value, number: null, suffix: '' }
  return { prefix: match[1] ?? '', number: Number(match[2]), suffix: match[3] ?? '' }
}

export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const numberRef = useRef<HTMLSpanElement>(null)
  const visible = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()
  const { prefix, number, suffix } = split(value)
  const decimals = number !== null && Number.isInteger(number) ? 0 : 1

  useEffect(() => {
    if (!visible || number === null || reduce) return
    const node = numberRef.current
    if (!node) return
    const controls = animate(0, number, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (latest) => {
        node.textContent = latest.toFixed(decimals)
      },
    })
    return () => controls.stop()
  }, [visible, number, reduce, decimals])

  if (number === null) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    )
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      <span ref={numberRef} className="tabular-nums">
        {reduce ? number.toFixed(decimals) : (0).toFixed(decimals)}
      </span>
      {suffix}
    </span>
  )
}
