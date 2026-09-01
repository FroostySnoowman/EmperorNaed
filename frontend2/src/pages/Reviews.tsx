import { useContent } from '../content/useContent'
import { PageHead } from '../components/ui/PageHead'
import { Rise } from '../components/ui/Rise'

export function Reviews() {
  const { reviews } = useContent()
  const { intro, items } = reviews

  return (
    <div className="pb-28">
      <PageHead kicker={intro.label} title={intro.title} lede={intro.lede} />

      <section className="page">
        {items.length === 0 ? (
          <p className="copy">No reviews yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((review, index) => (
              <Rise key={review.id || review.author}>
                <figure className={index === 0 ? 'bg-accent p-8 sm:p-12' : 'bg-raised p-8 sm:p-12'}>
                  <blockquote
                    className={
                      index === 0
                        ? 'max-w-4xl text-balance text-[clamp(1.25rem,2.4vw,1.9rem)] font-medium leading-[1.35] tracking-[-0.02em] text-white'
                        : 'max-w-4xl text-balance text-[clamp(1.1rem,1.8vw,1.45rem)] font-medium leading-[1.45] tracking-[-0.015em] text-white'
                    }
                  >
                    {review.quote}
                  </blockquote>

                  <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                    <span className="text-[15px] font-semibold text-white">{review.author}</span>
                    <span className={index === 0 ? 'text-[14px] text-white/75' : 'text-[14px] text-mute'}>
                      {review.role}
                      {review.org ? `, ${review.org}` : ''}
                    </span>
                    {review.date ? (
                      <span
                        className={
                          index === 0
                            ? 'ml-auto text-[12px] font-semibold uppercase tracking-[0.16em] text-white/70'
                            : 'ml-auto text-[12px] font-semibold uppercase tracking-[0.16em] text-dim'
                        }
                      >
                        {review.date}
                      </span>
                    ) : null}
                  </figcaption>
                </figure>
              </Rise>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
