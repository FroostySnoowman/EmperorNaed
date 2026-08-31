import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useContent } from '../../content/useContent'
import { Backdrop } from './Backdrop'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function RootLayout() {
  const { pathname } = useLocation()
  const { site } = useContent()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const page = site.nav.find((item) => item.to === pathname)
    const home = site.seo.title || site.brand.name
    document.title = page && pathname !== '/' ? `${page.label} · ${site.brand.name}` : home
  }, [pathname, site])

  return (
    <div className="flex min-h-[100svh] flex-col">
      <Backdrop />
      <SiteHeader />
      <main className="flex-1 pt-16">
        <Suspense fallback={<div className="min-h-[70svh]" />}>
          <Outlet />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  )
}
