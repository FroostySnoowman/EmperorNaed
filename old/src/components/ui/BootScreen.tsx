import { motion } from 'framer-motion'
import { BOOT_AVATAR, BOOT_MONOGRAM } from '../../content/bootBrand'
import { EASE } from '../../lib/motion'
import { BrandMark } from './BrandMark'

export function BootScreen() {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(222,15,63,0.18),rgba(222,15,63,0.04)_42%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-hatch opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative flex flex-col items-center gap-7"
      >
        <div className="relative grid place-items-center">
          <motion.span
            aria-hidden
            initial={{ opacity: 0.5, scale: 1 }}
            animate={{ opacity: [0.45, 0.1, 0.45], scale: [1, 1.28, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute h-20 w-20 rounded-2xl border border-crimson-500/45"
          />
          <motion.div
            initial={{ scale: 0.92 }}
            animate={{ scale: [1, 1.035, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BrandMark
              avatar={BOOT_AVATAR}
              monogram={BOOT_MONOGRAM}
              alt="Emperor Naed"
              glow
              className="h-20 w-20"
            />
          </motion.div>
        </div>

        <div className="relative h-px w-40 overflow-hidden bg-white/10">
          <span className="absolute inset-y-0 w-1/2 animate-boot-scan bg-gradient-to-r from-transparent via-crimson-500 to-transparent" />
        </div>

        <p className="font-mono text-[11px] uppercase tracking-marker text-white/35">Loading</p>
      </motion.div>
    </div>
  )
}
