import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useContent } from '../../content/useContent'
import { cn } from '../../lib/cn'
import { ActionLink } from '../ui/ActionLink'
import { BrandMark } from '../ui/BrandMark'
import { Icon } from '../ui/Icon'

export function SiteHeader() {
  const { site } = useContent()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  const [menuPath, setMenuPath] = useState(pathname)
  if (pathname !== menuPath) {
    setMenuPath(pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const { brand, nav, headerCta, socials } = site

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 h-16 border-b transition-colors duration-200',
          scrolled ? 'border-white/10 bg-ink-950/90 backdrop-blur' : 'border-transparent bg-transparent',
        )}
      >
        <div className="shell flex h-full items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-2.5" aria-label={`${brand.name}, back to home`}>
            <BrandMark avatar={brand.avatar} monogram={brand.monogram} className="h-8 w-8" />
            <span className="text-[15px] font-semibold tracking-tight text-white">{brand.name}</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end || item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-sm transition-colors duration-200',
                    isActive ? 'text-white' : 'text-white/55 hover:text-white',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {headerCta.label ? (
              <ActionLink to={headerCta.to} variant="primary" className="hidden !min-h-[36px] !px-4 !text-[13px] sm:inline-flex">
                {headerCta.label}
              </ActionLink>
            ) : null}

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-white/70 transition-colors hover:border-white/30 hover:text-white lg:hidden"
            >
              <span className="flex flex-col gap-[4px]">
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] flex flex-col bg-ink-950 lg:hidden"
          >
            <div className="shell flex h-16 items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <BrandMark avatar={brand.avatar} monogram={brand.monogram} className="h-8 w-8" />
                <span className="text-[15px] font-semibold tracking-tight text-white">{brand.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-white/70 transition-colors hover:border-white/30 hover:text-white"
              >
                <Icon name="close" className="text-[16px]" />
              </button>
            </div>

            <nav className="shell flex flex-1 flex-col py-6" aria-label="Mobile">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end || item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'border-b border-white/[0.07] py-4 text-lg font-medium transition-colors',
                      isActive ? 'text-white' : 'text-white/55',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="mt-8 flex flex-col gap-5">
                {headerCta.label ? (
                  <ActionLink to={headerCta.to} variant="primary" className="w-full">
                    {headerCta.label}
                  </ActionLink>
                ) : null}
                {socials.length > 0 ? (
                  <div className="flex gap-2">
                    {socials.map((social) => (
                      <a
                        key={social.id}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-white/60 transition-colors hover:border-white/30 hover:text-white"
                      >
                        <Icon name={social.icon} className="text-[15px]" />
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
