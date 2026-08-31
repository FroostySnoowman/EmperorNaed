import { Link } from 'react-router-dom'
import { useContent } from '../../content/useContent'
import { BrandMark } from '../ui/BrandMark'
import { Icon } from '../ui/Icon'

export function SiteFooter() {
  const { site } = useContent()
  const { brand, footer, socials } = site

  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="shell py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <BrandMark avatar={brand.avatar} monogram={brand.monogram} alt={brand.name} className="h-8 w-8" />
              <span className="text-[15px] font-semibold tracking-tight text-white">{brand.name}</span>
            </div>
            {footer.blurb ? <p className="mt-4 text-sm leading-relaxed text-white/50">{footer.blurb}</p> : null}
            {socials.length > 0 ? (
              <div className="mt-6 flex gap-2">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-white/55 transition-colors hover:border-white/30 hover:text-white"
                  >
                    <Icon name={social.icon} className="text-[15px]" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.to}-${link.label}`}>
                    {/^(https?:)?\/\/|^mailto:/i.test(link.to) ? (
                      <a
                        href={link.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/55 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.to} className="text-sm text-white/55 transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} {brand.name}
            {footer.legal ? ` · ${footer.legal}` : ''}
          </p>
        </div>
      </div>
    </footer>
  )
}
