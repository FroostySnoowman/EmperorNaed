import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useContent } from '../../content/useContent'
import { cn } from '../../lib/cn'
import { EASE } from '../../lib/motion'
import { ActionLink } from '../ui/ActionLink'
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
    const onScroll = () => setScrolled(window.scrollY > 12)
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
          'fixed inset-x-0 top-0 z-50 h-[4.5rem] transition-colors duration-200',
          scrolled ? 'bg-ink/95 backdrop-blur-sm' : 'bg-transparent',
        )}
      >
        <div className="page flex h-full items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-3" aria-label={`${brand.name}, home`}>
            <img src="/media/emperor-naed.png" alt="" className="h-9 w-9 shrink-0 object-cover" />
            <span className="text-[16px] font-semibold tracking-[-0.02em] text-white">{brand.name}</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end || item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors duration-150',
                    isActive ? 'text-accent' : 'text-mute hover:text-white',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {headerCta.label ? (
              <ActionLink to={headerCta.to} variant="fill" className="hidden !min-h-[40px] !px-5 !text-[12px] sm:inline-flex">
                {headerCta.label}
              </ActionLink>
            ) : null}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="inline-flex h-10 w-10 items-center justify-center bg-raised text-white transition-colors hover:bg-accent lg:hidden"
            >
              <span className="flex flex-col gap-[5px]">
                <span className="block h-[2px] w-4 bg-current" />
                <span className="block h-[2px] w-4 bg-current" />
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
            transition={{ duration: 0.18, ease: EASE }}
            className="fixed inset-0 z-[60] flex flex-col bg-ink lg:hidden"
          >
            <div className="page flex h-[4.5rem] items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/media/emperor-naed.png" alt="" className="h-9 w-9 object-cover" />
                <span className="text-[16px] font-semibold tracking-[-0.02em] text-white">{brand.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center bg-raised text-white transition-colors hover:bg-accent"
              >
                <Icon name="close" className="text-[17px]" />
              </button>
            </div>

            <nav className="page flex flex-1 flex-col justify-center gap-2 pb-16" aria-label="Mobile">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end || item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'text-big font-semibold transition-colors',
                      isActive ? 'text-accent' : 'text-white hover:text-accent',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="mt-10 flex flex-col gap-5">
                {headerCta.label ? (
                  <ActionLink to={headerCta.to} variant="fill" className="w-full">
                    {headerCta.label}
                  </ActionLink>
                ) : null}
                {socials.length > 0 ? (
                  <div className="flex gap-3">
                    {socials.map((social) => (
                      <a
                        key={social.id}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="inline-flex h-10 w-10 items-center justify-center bg-raised text-mute transition-colors hover:bg-accent hover:text-white"
                      >
                        <Icon name={social.icon} className="text-[16px]" />
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
