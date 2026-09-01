import { Link } from 'react-router-dom'
import { useContent } from '../../content/useContent'
import { Icon } from '../ui/Icon'

export function SiteFooter() {
  const { site } = useContent()
  const { brand, footer, socials } = site

  return (
    <footer className="bg-raised">
      <div className="page py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <img src="/media/emperor-naed.png" alt="" className="h-10 w-10 object-cover" />
              <div>
                <p className="text-[16px] font-semibold text-white">{brand.name}</p>
                <p className="kicker-mute mt-0.5">{brand.role}</p>
              </div>
            </div>
            {footer.note ? <p className="copy mt-6 text-[15px]">{footer.note}</p> : null}
            {socials.length > 0 ? (
              <div className="mt-8 flex gap-3">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.handle || social.label}
                    className="inline-flex h-10 w-10 items-center justify-center bg-ink text-mute transition-colors hover:bg-accent hover:text-white"
                  >
                    <Icon name={social.icon} className="text-[16px]" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="kicker-mute">{column.title}</p>
              <ul className="mt-6 space-y-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.to}-${link.label}`}>
                    {/^(https?:)?\/\/|^mailto:/i.test(link.to) ? (
                      <a
                        href={link.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[15px] text-mute transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.to} className="text-[15px] text-mute transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[13px] text-dim">
            © {new Date().getFullYear()} {brand.name}
          </p>
          {footer.legal ? <p className="text-[13px] text-dim">{footer.legal}</p> : null}
        </div>
      </div>
    </footer>
  )
}
