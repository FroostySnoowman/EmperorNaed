import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useContent } from '../content/useContent'
import type { Review } from '../content/schema'
import { cn } from '../lib/cn'
import { EASE, inView } from '../lib/motion'
import { useLightbox } from '../lib/useLightbox'
import { Icon } from '../components/ui/Icon'
import { Lightbox } from '../components/ui/Lightbox'
import { PageIntro } from '../components/ui/PageIntro'
import { Rating } from '../components/ui/Rating'
import { Reveal } from '../components/ui/Reveal'
import { SpotlightCard } from '../components/ui/SpotlightCard'

function Author({ review, size = 'md' }: { review: Review; size?: 'md' | 'lg' }) {
  const dimension = size === 'lg' ? 'h-14 w-14' : 'h-11 w-11'

  return (
    <div className="flex min-w-0 items-center gap-3.5">
      {review.avatar ? (
        <img
          src={review.avatar}
          alt=""
          loading="lazy" decoding="async"
          referrerPolicy="no-referrer"
          className={cn('shrink-0 rounded-xl border border-white/10 object-cover', dimension)}
        />
      ) : (
        <span
          className={cn(
            'grid shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] font-display text-sm font-bold text-white/70',
            dimension,
          )}
        >
          {review.author.slice(0, 2).toUpperCase()}
        </span>
      )}
      <div className="min-w-0">
        <div className={cn('truncate font-semibold text-white', size === 'lg' ? 'text-base' : 'text-sm')}>
          {review.author}
        </div>
        {review.handle ? <div className="truncate font-mono text-[11px] text-crimson-300/85">{review.handle}</div> : null}
        {review.role ? <div className="truncate text-xs text-white/35">{review.role}</div> : null}
      </div>
    </div>
  )
}

function ImageStrip({
  review,
  onOpen,
  height = 'h-24',
}: {
  review: Review
  onOpen: (images: string[], index: number, title: string) => void
  height?: string
}) {
  if (review.images.length === 0) return null

  return (
    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {review.images.map((url, index) => (
        <button
          key={`${review.id}-${index}`}
          type="button"
          onClick={() => onOpen(review.images, index, `${review.author} — ${review.project || 'Review'}`)}
          className={cn(
            'group/img overflow-hidden rounded-lg border border-white/[0.08] bg-ink-850',
            height,
          )}
          aria-label={`Open image ${index + 1} from ${review.author}`}
        >
          <img
            src={url}
            alt=""
            loading="lazy" decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover/img:scale-110"
          />
        </button>
      ))}
    </div>
  )
}

export function Reviews() {
  const { reviews } = useContent()
  const lightbox = useLightbox()
  const { intro, summary, items } = reviews

  const featured = useMemo(() => items.find((review) => review.featured) ?? null, [items])
  const rest = useMemo(() => items.filter((review) => review !== featured), [items, featured])

  const average = useMemo(() => {
    if (items.length === 0) return 0
    return items.reduce((total, review) => total + review.rating, 0) / items.length
  }, [items])

  return (
    <div className="pb-8">
      <PageIntro
        marker={intro.marker}
        title={intro.title}
        kicker={intro.kicker}
        aside={
          summary.show && items.length > 0 ? (
            <div className="plate rounded-2xl p-6">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold tracking-tight text-white">
                  {average.toFixed(1)}
                </span>
                <span className="font-mono text-sm text-white/30">/ 5</span>
              </div>
              <Rating value={average} className="mt-3" />
              <dl className="mt-6 space-y-2.5 border-t border-white/[0.06] pt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/30">
                    {summary.countLabel}
                  </dt>
                  <dd className="font-mono text-sm font-medium text-white/80">{items.length}</dd>
                </div>
                {summary.repeatValue ? (
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/30">
                      {summary.repeatLabel}
                    </dt>
                    <dd className="font-mono text-sm font-medium text-white/80">{summary.repeatValue}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          ) : null
        }
      />

      <section className="shell mt-16">
        {items.length === 0 ? <p className="text-sm text-white/40">No reviews yet.</p> : null}

        {featured ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.75, ease: EASE }}
            className="mb-5"
          >
            <SpotlightCard className="rounded-[1.4rem]" innerClassName="p-8 sm:p-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(222,15,63,0.16),transparent_55%)]" aria-hidden />

              <div className="relative grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
                <div className="min-w-0">
                  <Icon name="quote" className="text-[30px] text-crimson-600/50" />
                  <blockquote className="mt-6 text-pretty font-display text-xl font-semibold leading-[1.5] tracking-tight text-white/90 sm:text-2xl">
                    {featured.quote}
                  </blockquote>
                  <ImageStrip review={featured} onOpen={lightbox.open} height="h-28" />
                </div>

                <div className="min-w-0 lg:border-l lg:border-white/[0.07] lg:pl-10">
                  <Rating value={featured.rating} />
                  <div className="mt-6">
                    <Author review={featured} size="lg" />
                  </div>
                  <dl className="mt-7 space-y-3 border-t border-white/[0.06] pt-6">
                    {featured.project ? (
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">Project</dt>
                        <dd className="mt-1 text-sm text-white/70">{featured.project}</dd>
                      </div>
                    ) : null}
                    {featured.platform ? (
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">Platform</dt>
                        <dd className="mt-1 text-sm text-white/70">{featured.platform}</dd>
                      </div>
                    ) : null}
                    {featured.date ? (
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">Date</dt>
                        <dd className="mt-1 text-sm text-white/70">{featured.date}</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((review, index) => (
            <Reveal key={review.id || `${review.author}-${index}`} delay={(index % 3) * 0.07}>
              <SpotlightCard className="h-full rounded-2xl" innerClassName="flex h-full flex-col p-7">
                <div className="flex items-start justify-between gap-4">
                  <Rating value={review.rating} size="sm" />
                  {review.platform ? (
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/25">
                      {review.platform}
                    </span>
                  ) : null}
                </div>

                <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-white/65">{review.quote}</blockquote>

                <ImageStrip review={review} onOpen={lightbox.open} />

                <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/[0.06] pt-5">
                  <Author review={review} />
                  {review.date ? (
                    <span className="shrink-0 font-mono text-[10px] text-white/25">{review.date}</span>
                  ) : null}
                </div>

                {review.project ? (
                  <div className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-crimson-400/70">
                    {review.project}
                  </div>
                ) : null}
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      <Lightbox state={lightbox.state} onClose={lightbox.close} onIndexChange={lightbox.setIndex} />
    </div>
  )
}
