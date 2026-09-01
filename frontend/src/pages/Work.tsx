import { useMemo, useState } from 'react'
import { useContent } from '../content/useContent'
import type { WorkItem } from '../content/schema'
import { cn } from '../lib/cn'
import { pad2, uniqueStrings } from '../lib/utils'
import { useLightbox } from '../lib/useLightbox'
import { Icon } from '../components/ui/Icon'
import { Lightbox } from '../components/ui/Lightbox'
import { PageHead } from '../components/ui/PageHead'
import { Rise } from '../components/ui/Rise'

function Entry({
  item,
  index,
  onOpen,
}: {
  item: WorkItem
  index: number
  onOpen: (images: string[], start: number, title: string) => void
}) {
  const images = useMemo(() => [item.image, ...item.images].filter(Boolean), [item.image, item.images])

  return (
    <Rise>
      <article className="bg-raised p-8 sm:p-12">
        <div className="grid gap-10 lg:grid-cols-[5rem_1fr] lg:gap-14">
          <p className="text-[2.5rem] font-semibold leading-none tabular-nums tracking-[-0.04em] text-accent">
            {pad2(index + 1)}
          </p>

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="kicker">{item.category}</p>
              {item.year ? <p className="kicker-mute">{item.year}</p> : null}
            </div>

            <h2 className="mt-4 max-w-3xl text-balance text-big font-semibold text-white">{item.title}</h2>
            {item.summary ? <p className="copy mt-6 max-w-3xl">{item.summary}</p> : null}

            {images.length > 0 ? (
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {images.slice(0, 4).map((src, imageIndex) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => onOpen(images, imageIndex, item.title)}
                    className="group block overflow-hidden bg-ink"
                    aria-label={`Open image ${imageIndex + 1} for ${item.title}`}
                  >
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </button>
                ))}
              </div>
            ) : null}

            {item.tags.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="chip !bg-ink">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {item.links.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-6">
                {item.links.map((link) => (
                  <a
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="stack-link"
                  >
                    {link.label}
                    <Icon name="arrow-out" className="text-[13px]" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </article>
    </Rise>
  )
}

export function Work() {
  const { work } = useContent()
  const lightbox = useLightbox()
  const [filter, setFilter] = useState('')

  const categories = useMemo(
    () => uniqueStrings(work.items.map((item) => item.category)).sort((a, b) => a.localeCompare(b)),
    [work.items],
  )
  const visible = useMemo(
    () => (filter ? work.items.filter((item) => item.category === filter) : work.items),
    [work.items, filter],
  )

  return (
    <div className="pb-28">
      <PageHead kicker={work.intro.label} title={work.intro.title} lede={work.intro.lede} />

      <section className="page">
        {categories.length > 1 ? (
          <div className="no-bar mb-8 flex gap-2 overflow-x-auto pb-1">
            {[work.allLabel, ...categories].map((label, index) => {
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
          <p className="copy">{work.emptyLabel}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {visible.map((item, index) => (
              <Entry key={item.id || item.title} item={item} index={index} onOpen={lightbox.open} />
            ))}
          </div>
        )}
      </section>

      <Lightbox state={lightbox.state} onClose={lightbox.close} onIndexChange={lightbox.setIndex} />
    </div>
  )
}
