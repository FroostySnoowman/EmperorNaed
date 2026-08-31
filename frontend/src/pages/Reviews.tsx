import { useMemo } from 'react'
import { useContent } from '../content/useContent'
import type { Review } from '../content/schema'
import { cn } from '../lib/cn'
import { useLightbox } from '../lib/useLightbox'
import { Card } from '../components/ui/Card'
import { Lightbox } from '../components/ui/Lightbox'
import { PageIntro } from '../components/ui/PageIntro'
import { Rating } from '../components/ui/Rating'
import { Reveal } from '../components/ui/Reveal'

function Author({ review, size = 'md' }: { review: Review; size?: 'md' | 'lg' }) {
  const dimension = size === 'lg' ? 'h-11 w-11' : 'h-9 w-9'
  return (
    <div className="flex min-w-0 items-center gap-3">
      {review.avatar ? (
        <img
          src={review.avatar}
          alt=""
          loading="lazy"
          decoding="async"
          className={cn('shrink-0 rounded-full border border-white/10 object-cover', dimension)}
        />
      ) : null}
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-white">{review.author}</div>
        <div className="truncate text-xs text-white/40">
          {review.role}
          {review.project ? ` · ${review.project}` : ''}
        </div>
      </div>
    </div>
  )
}

function Images({
  review,
  onOpen,
}: {
  review: Review
  onOpen: (images: string[], index: number, title: string) => void
}) {
  if (review.images.length === 0) return null
  return (
    <div className="mt-5 flex gap-2">
      {review.images.map((url, index) => (
        <button
          key={`${review.id}-${index}`}
          type="button"
          onClick={() => onOpen(review.images, index, review.author)}
          className="h-16 w-24 shrink-0 overflow-hidden rounded-md border border-white/10 bg-ink-850"
          aria-label={`Open image ${index + 1} from ${review.author}`}
        >
          <img src={url} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </button>
      ))}
    </div>
  )
}

export function Reviews() {
  const { reviews } = useContent()
  const lightbox = useLightbox()
  const { intro, summary, items } = reviews

  const average = useMemo(() => {
    if (items.length === 0) return 0
    return items.reduce((total, review) => total + review.rating, 0) / items.length
  }, [items])

  return (
    <div>
      <PageIntro
        marker={intro.marker}
        title={intro.title}
        kicker={intro.kicker}
        aside={
          summary.show && items.length > 0 ? (
            <div className="flex gap-10">
              <div>
                <div className="text-2xl font-semibold tracking-tight text-white">{average.toFixed(1)}</div>
                <div className="mt-1 text-sm text-white/45">{summary.ratingLabel}</div>
              </div>
              <div>
                <div className="text-2xl font-semibold tracking-tight text-white">{items.length}</div>
                <div className="mt-1 text-sm text-white/45">{summary.countLabel}</div>
              </div>
            </div>
          ) : null
        }
      />

      <section className="shell mt-12">
        {items.length === 0 ? <p className="text-sm text-white/40">No reviews yet.</p> : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((review, index) => (
            <Reveal key={review.id || `${review.author}-${index}`} delay={(index % 3) * 0.05}>
              <Card className="h-full" innerClassName="flex h-full flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <Rating value={review.rating} size="sm" />
                  {review.date ? <span className="text-xs text-white/30">{review.date}</span> : null}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-white/65">{review.quote}</blockquote>
                <Images review={review} onOpen={lightbox.open} />
                <div className="mt-6 border-t border-white/[0.07] pt-5">
                  <Author review={review} />
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <Lightbox state={lightbox.state} onClose={lightbox.close} onIndexChange={lightbox.setIndex} />
    </div>
  )
}
