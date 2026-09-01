import { motion } from 'framer-motion'
import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useContent } from '../../content/useContent'
import { EASE } from '../../lib/motion'
import { applyRouteMeta, routeMeta } from '../../lib/seo'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function RootLayout() {
  const { pathname } = useLocation()
  const content = useContent()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    applyRouteMeta(routeMeta(content, pathname))
  }, [pathname, content])

  return (
    <div className="flex min-h-[100svh] flex-col">
      <SiteHeader />
      <main className="flex-1 pt-[4.5rem]">
        <Suspense fallback={<div className="min-h-[70svh]" />}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: EASE }}
          >
            <Outlet />
          </motion.div>
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  )
}
