import { Link } from 'react-router-dom'
import { useContent } from '../../content/useContent'
import { useLenisRef } from '../../lib/lenis-context'
import { Icon } from '../ui/Icon'
import { BrandMark } from '../ui/BrandMark'

export function SiteFooter() {
  const { site } = useContent()
  const lenisRef = useLenisRef()
  const { brand, footer, socials } = site

  const scrollToTop = () => {
    const lenis = lenisRef.current
    if (lenis) lenis.scrollTo(0, { duration: 1.2 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative mt-32 border-t border-white/[0.07] bg-ink-950/60">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden" aria-hidden>
        <div className="translate-y-[28%] text-center font-display text-[18vw] font-extrabold leading-none tracking-tighter text-white/[0.022]">
          {brand.name}
        </div>
      </div>

      <div className="shell relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <BrandMark avatar={brand.avatar} monogram={brand.monogram} alt={brand.name} className="h-10 w-10" />
              <div>
                <div className="font-display text-base font-bold tracking-tight text-white">{brand.name}</div>
                {brand.role ? (
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">{brand.role}</div>
                ) : null}
              </div>
            </div>

            {footer.blurb ? <p className="mt-5 text-sm leading-relaxed text-white/50">{footer.blurb}</p> : null}

            {socials.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.handle || social.label}
                    aria-label={social.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/60 transition hover:-translate-y-0.5 hover:border-crimson-500/40 hover:text-white"
                  >
                    <Icon name={social.icon} className="text-[16px]" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-mono text-[10.5px] uppercase tracking-marker text-white/35">{column.title}</h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.to}-${link.label}`}>
                    {/^(https?:)?\/\/|^mailto:/i.test(link.to) ? (
                      <a
                        href={link.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-sm text-white/55 transition hover:text-white"
                      >
                        {link.label}
                        <Icon name="arrow-up-right" className="text-[12px] opacity-0 transition group-hover:opacity-70" />
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="group inline-flex items-center gap-1.5 text-sm text-white/55 transition hover:text-white"
                      >
                        {link.label}
                        <Icon name="arrow-right" className="text-[12px] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-70" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-5 border-t border-white/[0.06] pt-7 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] text-white/30">
            © {new Date().getFullYear()} {brand.name}
            {footer.legal ? ` · ${footer.legal}` : ''}
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/45 transition hover:text-white"
          >
            Back to top
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 transition group-hover:-translate-y-0.5 group-hover:border-crimson-500/45">
              <Icon name="arrow-right" className="-rotate-90 text-[12px]" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}
