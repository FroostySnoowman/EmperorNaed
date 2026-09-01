import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { Fragment, useMemo } from 'react'
import { cn } from '../../lib/cn'
import { EASE, inView } from '../../lib/motion'

const word: Variants = {
  hidden: { y: '110%', opacity: 0 },
  show: { y: '0%', opacity: 1, transition: { duration: 0.78, ease: EASE } },
}

export function RevealText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.055,
}: {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  stagger?: number
}) {
  const reduce = useReducedMotion()
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text])

  if (reduce || words.length === 0) {
    return <span className={cn(className, wordClassName)}>{text}</span>
  }

  return (
    <motion.span
      className={cn('inline', className)}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={{ hidden: {}, show: { transition: { delayChildren: delay, staggerChildren: stagger } } }}
    >
      {words.map((value, index) => (
        <Fragment key={`${value}-${index}`}>
          <span className="inline-block overflow-hidden pb-[0.14em] align-bottom">
            <motion.span variants={word} className={cn('inline-block', wordClassName)}>
              {value}
            </motion.span>
          </span>
          {index < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </motion.span>
  )
}
