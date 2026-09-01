import { useMemo, useState } from 'react'
import { useContent } from '../content/useContent'
import { cn } from '../lib/cn'
import { uniqueStrings } from '../lib/utils'
import { useLightbox } from '../lib/useLightbox'
import { ActionLink } from '../components/ui/ActionLink'
import { Lightbox } from '../components/ui/Lightbox'
import { PageHead } from '../components/ui/PageHead'
import { Rise } from '../components/ui/Rise'
import { Stagger, StaggerItem } from '../components/ui/Stagger'

export function Gallery() {
  const { gallery } = useContent()
  const lightbox = useLightbox()
  const [filter, setFilter] = useState('')

  const categories = useMemo(
    () => uniqueStrings(gallery.items.map((item) => item.category)).sort((a, b) => a.localeCompare(b)),
    [gallery.items],
  )
  const visible = useMemo(
    () => (filter ? gallery.items.filter((item) => item.category === filter) : gallery.items),
    [gallery.items, filter],
  )
  const sources = useMemo(() => visible.map((item) => item.src), [visible])

  return (
    <div className="pb-28">
      <PageHead kicker={gallery.intro.label} title={gallery.intro.title} lede={gallery.intro.lede} />

      <section className="page">
        {categories.length > 1 ? (
          <div className="no-bar mb-8 flex gap-2 overflow-x-auto pb-1">
            {[gallery.allLabel, ...categories].map((label, index) => {
              const value = index === 0 ? '' : label
              const active = filter === value
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setFilter(value)}
                  aria-pressed={active}
                  className={cn(
                    'shrink-0 whitespace-nowrap px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors',
                    active ? 'bg-accent text-white' : 'bg-raised text-mute hover:text-white',
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>
        ) : null}

        {visible.length === 0 ? (
          <Rise className="bg-raised px-8 py-20 sm:px-16 sm:py-24">
            <p className="kicker">Nothing here yet</p>
            <p className="copy-lg mt-6 max-w-read">{gallery.emptyLabel}</p>
            {gallery.emptyCta.label ? (
              <ActionLink to={gallery.emptyCta.to} variant="outline" className="mt-10">
                {gallery.emptyCta.label}
              </ActionLink>
            ) : null}
          </Rise>
        ) : (
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" gap={0.07}>
            {visible.map((item, index) => (
              <StaggerItem key={item.id || item.src}>
                <button
                  type="button"
                  onClick={() => lightbox.open(sources, index, item.caption || item.alt || 'Screenshot')}
                  className="group block w-full bg-raised text-left block-hover"
                  aria-label={`Open ${item.caption || item.alt || 'screenshot'}`}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-ink">
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  {item.caption ? (
                    <div className="flex items-baseline justify-between gap-4 p-5">
                      <span className="text-[15px] font-medium text-white">{item.caption}</span>
                      {item.category ? <span className="kicker-mute shrink-0">{item.category}</span> : null}
                    </div>
                  ) : null}
                </button>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>

      <Lightbox state={lightbox.state} onClose={lightbox.close} onIndexChange={lightbox.setIndex} />
    </div>
  )
}
