import { motion } from 'framer-motion'
import { EASE, inView } from '../../lib/motion'
import { clamp } from '../../lib/utils'

export function Meter({ label, level, delay = 0 }: { label: string; level: number; delay?: number }) {
  const value = clamp(level, 0, 100)

  return (
    <div>
      <span className="text-sm font-medium text-white/85">{label}</span>
      <div className="relative mt-2.5 h-[3px] overflow-hidden rounded-full bg-white/[0.07]">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: value / 100 }}
          viewport={inView}
          transition={{ duration: 1.05, delay, ease: EASE }}
          style={{ transformOrigin: 'left center' }}
          className="h-full w-full rounded-full bg-gradient-to-r from-crimson-700 via-crimson-500 to-crimson-300 shadow-[0_0_14px_rgba(242,46,86,0.55)]"
        />
      </div>
    </div>
  )
}
