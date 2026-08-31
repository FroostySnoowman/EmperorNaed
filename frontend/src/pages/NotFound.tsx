import { motion } from 'framer-motion'
import { useContent } from '../content/useContent'
import { EASE } from '../lib/motion'
import { ActionLink } from '../components/ui/ActionLink'
import { BrandMark } from '../components/ui/BrandMark'

export function NotFound() {
  const { site } = useContent()

  return (
    <div className="shell flex min-h-[68svh] flex-col items-center justify-center py-24 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <BrandMark avatar={site.brand.avatar} monogram={site.brand.monogram} alt={site.brand.name} glow className="h-16 w-16" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
      >
        <div className="marker mt-9 justify-center">Error 404</div>
        <h1 className="mt-5 font-display text-5xl font-extrabold tracking-[-0.03em] text-gradient sm:text-7xl">
          Off the map
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/50">
          That page does not exist — it may have been renamed or moved. Everything else is still where you left it.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ActionLink to="/" variant="primary" withArrow>
            Back home
          </ActionLink>
          <ActionLink to="/work" variant="ghost">
            See my work
          </ActionLink>
        </div>
      </motion.div>
    </div>
  )
}
