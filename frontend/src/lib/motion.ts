import type { Variants } from 'framer-motion'

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
}

export const inView = { once: true, amount: 0.2, margin: '0px 0px -60px 0px' } as const
