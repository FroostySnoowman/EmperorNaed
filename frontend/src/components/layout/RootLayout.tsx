import { motion } from 'framer-motion'
import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useContent } from '../../content/useContent'
import { useLenisRef } from '../../lib/lenis-context'
import { EASE } from '../../lib/motion'
import { Backdrop } from './Backdrop'
import { ScrollProgress } from './ScrollProgress'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function RootLayout() {
  const { pathname } = useLocation()
  const lenisRef = useLenisRef()
  const { site } = useContent()

  useEffect(() => {
    const lenis = lenisRef.current
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname, lenisRef])

  useEffect(() => {
    const page = site.nav.find((item) => item.to === pathname)
    document.title = page && pathname !== '/' ? `${page.label} · ${site.brand.name}` : site.brand.name
  }, [pathname, site])

  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-x-clip">
      <Backdrop />
      <ScrollProgress />
      <SiteHeader />
      <main className="flex-1 pt-[4.6rem]">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <Suspense fallback={<div className="min-h-[70svh]" />}>
            <Outlet />
          </Suspense>
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  )
}
