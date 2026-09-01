import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useContent } from '../content/useContent'
import { cn } from '../lib/cn'
import { EASE } from '../lib/motion'
import { uniqueStrings } from '../lib/utils'
import { useLightbox } from '../lib/useLightbox'
import { Lightbox } from '../components/ui/Lightbox'
import { PageIntro } from '../components/ui/PageIntro'

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
    <div className="pb-8">
      <PageIntro marker={gallery.intro.marker} title={gallery.intro.title} kicker={gallery.intro.kicker} />

      <section className="shell mt-14">
        {categories.length > 1 ? (
          <div className="no-bar overflow-x-auto pb-1">
            <div className="inline-flex w-max items-center gap-1 rounded-full border border-white/[0.07] bg-ink-900/80 p-1.5">
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
                      'relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300',
                      active ? 'text-white' : 'text-white/45 hover:text-white/80',
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="gallery-filter"
                        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                        className="absolute inset-0 rounded-full border border-crimson-500/35 bg-crimson-600/15"
                      />
                    ) : null}
                    <span className="relative">{label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}

        {visible.length === 0 ? (
          <p className="mt-10 text-sm text-white/40">{gallery.emptyLabel}</p>
        ) : (
          <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {visible.map((item, index) => (
              <motion.button
                key={item.id || item.src}
                type="button"
                onClick={() => lightbox.open(sources, index, item.caption || item.alt || 'Image')}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15, margin: '0px 0px -60px 0px' }}
                transition={{ duration: 0.55, delay: (index % 3) * 0.06, ease: EASE }}
                className="group block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-900/70 text-left"
                aria-label={`Open ${item.caption || item.alt || 'image'}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                {item.caption ? (
                  <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                    <span className="truncate text-sm text-white/70">{item.caption}</span>
                    {item.category ? (
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
                        {item.category}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </motion.button>
            ))}
          </div>
        )}
      </section>

      <Lightbox state={lightbox.state} onClose={lightbox.close} onIndexChange={lightbox.setIndex} />
    </div>
  )
}
