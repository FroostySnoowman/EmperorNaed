import { useMemo, useState } from 'react'
import { useContent } from '../content/useContent'
import { cn } from '../lib/cn'
import { uniqueStrings } from '../lib/utils'
import { useLightbox } from '../lib/useLightbox'
import { Lightbox } from '../components/ui/Lightbox'
import { PageIntro } from '../components/ui/PageIntro'
import { Reveal } from '../components/ui/Reveal'

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
    <div>
      <PageIntro marker={gallery.intro.marker} title={gallery.intro.title} kicker={gallery.intro.kicker} />

      <section className="shell mt-12">
        {categories.length > 1 ? (
          <div className="no-bar flex gap-2 overflow-x-auto pb-1">
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
                    'shrink-0 whitespace-nowrap rounded-md border px-3 py-1.5 text-sm transition-colors duration-200',
                    active
                      ? 'border-crimson-500/50 bg-crimson-600/15 text-white'
                      : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white',
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>
        ) : null}

        {visible.length === 0 ? (
          <p className="mt-8 text-sm text-white/40">{gallery.emptyLabel}</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item, index) => (
              <Reveal key={item.id || item.src} delay={(index % 3) * 0.05}>
                <button
                  type="button"
                  onClick={() => lightbox.open(sources, index, item.caption || item.alt || 'Image')}
                  className="card card-hover group block w-full overflow-hidden text-left"
                  aria-label={`Open ${item.caption || item.alt || 'image'}`}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-ink-850">
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  {item.caption ? (
                    <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
                      <span className="truncate text-sm text-white/70">{item.caption}</span>
                      {item.category ? (
                        <span className="shrink-0 text-xs text-white/35">{item.category}</span>
                      ) : null}
                    </div>
                  ) : null}
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <Lightbox state={lightbox.state} onClose={lightbox.close} onIndexChange={lightbox.setIndex} />
    </div>
  )
}
