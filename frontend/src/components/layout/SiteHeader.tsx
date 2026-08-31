import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useContent } from '../../content/useContent'
import { cn } from '../../lib/cn'
import { useLenisRef } from '../../lib/lenis-context'
import { EASE } from '../../lib/motion'
import { ActionLink } from '../ui/ActionLink'
import { Icon } from '../ui/Icon'
import { BrandMark } from '../ui/BrandMark'

const AVAILABILITY_TONE: Record<string, string> = {
  open: 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]',
  limited: 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]',
  closed: 'bg-white/40',
}

export function SiteHeader() {
  const { site } = useContent()
  const { scrollY } = useScroll()
  const [condensed, setCondensed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const lenisRef = useLenisRef()

  useMotionValueEvent(scrollY, 'change', (latest) => setCondensed(latest > 24))

  const [menuPath, setMenuPath] = useState(pathname)
  if (pathname !== menuPath) {
    setMenuPath(pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    if (!menuOpen) return
    const lenis = lenisRef.current
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lenis?.stop()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previous
      lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen, lenisRef])

  const { brand, nav, availability, headerCta, socials } = site

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[60] transition-all duration-500',
          condensed
            ? 'border-b border-white/[0.06] bg-ink-950/[0.88] backdrop-blur-md'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div
          className={cn(
            'shell flex items-center justify-between gap-6 transition-all duration-500',
            condensed ? 'h-[3.85rem]' : 'h-[4.6rem]',
          )}
        >
          <Link to="/" className="group flex min-w-0 items-center gap-3" aria-label={`${brand.name} — home`}>
            <BrandMark
              avatar={brand.avatar}
              monogram={brand.monogram}
              className={cn(
                'transition-all duration-500 group-hover:brightness-110',
                condensed ? 'h-8 w-8' : 'h-9 w-9',
              )}
            />
            <span className="min-w-0">
              <span className="block truncate font-display text-[15px] font-bold leading-tight tracking-tight text-white">
                {brand.name}
              </span>
              {brand.role ? (
                <span className="hidden truncate font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 sm:block">
                  {brand.role}
                </span>
              ) : null}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {nav.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end || item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'group relative px-3.5 py-2 font-mono text-[11.5px] uppercase tracking-[0.16em] transition-colors duration-300',
                    isActive ? 'text-white' : 'text-white/45 hover:text-white/80',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="mr-1.5 text-crimson-500/70">{String(index + 1).padStart(2, '0')}</span>
                    {item.label}
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-crimson-400 to-transparent"
                      />
                    ) : null}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            {availability.label ? (
              <span className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 xl:inline-flex">
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className={cn(
                      'absolute inline-flex h-full w-full animate-pulse-ring rounded-full',
                      AVAILABILITY_TONE[availability.state],
                    )}
                  />
                  <span className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', AVAILABILITY_TONE[availability.state])} />
                </span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/60">
                  {availability.label}
                </span>
              </span>
            ) : null}

            {headerCta.label ? (
              <ActionLink to={headerCta.to} variant="primary" className="hidden !min-h-[38px] !px-5 !text-[13px] md:inline-flex">
                {headerCta.label}
              </ActionLink>
            ) : null}

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/75 transition hover:border-crimson-500/40 hover:text-white lg:hidden"
            >
              <span className="flex flex-col gap-[5px]">
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-2.5 bg-current" />
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
            transition={{ duration: 0.28, ease: EASE }}
            className="fixed inset-0 z-[80] flex flex-col bg-ink-950 lg:hidden"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_10%,rgba(222,15,63,0.18),transparent_58%)]" />
            <div className="pointer-events-none absolute inset-0 bg-hatch opacity-50" />

            <div className="shell relative flex h-[4.6rem] items-center justify-between">
              <div className="flex items-center gap-3">
                <BrandMark avatar={brand.avatar} monogram={brand.monogram} className="h-8 w-8" />
                <span className="font-display text-[15px] font-bold tracking-tight text-white">{brand.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/75 transition hover:border-crimson-500/40 hover:text-white"
              >
                <Icon name="close" className="text-[17px]" />
              </button>
            </div>

            <nav className="shell relative flex flex-1 flex-col justify-center gap-1 pb-10" aria-label="Mobile">
              {nav.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.06 + index * 0.06, ease: EASE }}
                >
                  <NavLink
                    to={item.to}
                    end={item.end || item.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-baseline gap-4 border-b border-white/[0.06] py-4 font-display text-3xl font-bold tracking-tight transition-colors sm:text-4xl',
                        isActive ? 'text-white' : 'text-white/45',
                      )
                    }
                  >
                    <span className="font-mono text-[11px] tracking-[0.2em] text-crimson-500/80">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + nav.length * 0.06, ease: EASE }}
                className="mt-8 flex flex-col gap-4"
              >
                {headerCta.label ? (
                  <ActionLink to={headerCta.to} variant="primary" withArrow className="w-full">
                    {headerCta.label}
                  </ActionLink>
                ) : null}

                {socials.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {socials.map((social) => (
                      <a
                        key={social.id}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chip gap-2 py-2 hover:border-crimson-500/40 hover:text-white"
                      >
                        <Icon name={social.icon} className="text-[14px]" />
                        {social.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
