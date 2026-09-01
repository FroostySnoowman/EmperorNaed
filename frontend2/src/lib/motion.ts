import type { Variants } from 'framer-motion'

export const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1]

export const rise: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

export const inView = { once: true, amount: 0.2, margin: '0px 0px -80px 0px' } as const
