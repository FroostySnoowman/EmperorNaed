import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { EASE, inView } from '../../lib/motion'
import { RevealText } from './RevealText'

export function SectionHeading({
  marker,
  title,
  kicker,
  align = 'left',
  size = 'lg',
  action,
  className,
}: {
  marker?: string
  title: string
  kicker?: string
  align?: 'left' | 'center'
  size?: 'lg' | 'xl'
  action?: ReactNode
  className?: string
}) {
  const centered = align === 'center'

  return (
    <div
      className={cn(
        'flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between',
        centered && 'lg:flex-col lg:items-center',
        className,
      )}
    >
      <div className={cn('min-w-0 max-w-3xl', centered && 'text-center')}>
        {marker ? (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={inView}
            transition={{ duration: 0.5, ease: EASE }}
            className={cn('marker', centered && 'justify-center')}
          >
            <span className="h-px w-7 bg-gradient-to-r from-transparent to-crimson-500" aria-hidden />
            {marker}
          </motion.div>
        ) : null}

        <h2
          className={cn(
            'mt-5 font-display font-bold leading-[1.04] tracking-[-0.02em]',
            size === 'xl' ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-3xl sm:text-4xl lg:text-[2.9rem]',
          )}
        >
          <RevealText text={title} wordClassName="text-gradient" />
        </h2>

        {kicker ? (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
            className={cn('mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/55 sm:text-lg', centered && 'mx-auto')}
          >
            {kicker}
          </motion.p>
        ) : null}
      </div>

      {action ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.55, delay: 0.18, ease: EASE }}
          className="shrink-0"
        >
          {action}
        </motion.div>
      ) : null}
    </div>
  )
}
