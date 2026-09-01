import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { EASE } from '../../lib/motion'
import { RevealText } from './RevealText'

export function PageIntro({
  marker,
  title,
  kicker,
  aside,
}: {
  marker?: string
  title: string
  kicker?: string
  aside?: ReactNode
}) {
  return (
    <section className="shell relative pt-16 sm:pt-24">
      <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
        <div className="min-w-0">
          {marker ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="marker"
            >
              <span className="h-px w-7 bg-gradient-to-r from-transparent to-crimson-500" aria-hidden />
              {marker}
            </motion.div>
          ) : null}

          <h1 className="mt-6 max-w-4xl font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            <RevealText text={title} wordClassName="text-gradient" />
          </h1>

          {kicker ? (
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
              className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/55 sm:text-lg"
            >
              {kicker}
            </motion.p>
          ) : null}
        </div>

        {aside ? (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
            className="min-w-0"
          >
            {aside}
          </motion.div>
        ) : null}
      </div>

      <div className="rule-fade mt-14" />
    </section>
  )
}
