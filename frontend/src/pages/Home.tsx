import { useContent } from '../content/useContent'
import { ActionLink } from '../components/ui/ActionLink'
import { Card } from '../components/ui/Card'
import { Icon } from '../components/ui/Icon'
import { Rating } from '../components/ui/Rating'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'

function Hero() {
  const { home, site } = useContent()
  const { hero } = home

  return (
    <section className="shell pt-16 sm:pt-24">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div>
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            {hero.titleLead} <span className="text-crimson-400">{hero.titleAccent}</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/60">{hero.intro}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ActionLink to={hero.primaryCta.to} variant="primary">
              {hero.primaryCta.label}
            </ActionLink>
            <ActionLink to={hero.secondaryCta.to} variant="ghost">
              {hero.secondaryCta.label}
            </ActionLink>
          </div>

          {site.socials.length > 0 ? (
            <div className="mt-10 flex items-center gap-2">
              {site.socials.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.handle || social.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-white/55 transition-colors hover:border-white/30 hover:text-white"
                >
                  <Icon name={social.icon} className="text-[15px]" />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <Card hover={false} innerClassName="p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-white">{hero.panel.title}</h2>
            {site.availability.label ? (
              <span className="inline-flex items-center gap-2 text-xs text-white/55">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {site.availability.label}
              </span>
            ) : null}
          </div>

          {hero.panel.body ? <p className="mt-3 text-sm leading-relaxed text-white/55">{hero.panel.body}</p> : null}

          {hero.panel.meta.length > 0 ? (
            <dl className="mt-6 divide-y divide-white/[0.07] border-t border-white/[0.07]">
              {hero.panel.meta.map((row, index) => (
                <div key={`${row.label}-${index}`} className="flex items-center justify-between py-2.5">
                  <dt className="text-sm text-white/45">{row.label}</dt>
                  <dd className="text-sm font-medium text-white/85">{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {hero.panel.footnote ? (
            <p className="mt-5 text-xs leading-relaxed text-white/40">{hero.panel.footnote}</p>
          ) : null}
        </Card>
      </div>
    </section>
  )
}

function Stats() {
  const { home } = useContent()
  if (home.stats.length === 0) return null

  return (
    <section className="shell mt-20">
      <Reveal className="grid grid-cols-2 gap-8 border-y border-white/10 py-8 sm:grid-cols-4">
        {home.stats.map((stat) => (
          <div key={stat.id || stat.label}>
            <div className="text-2xl font-semibold tracking-tight text-white">{stat.value}</div>
            <div className="mt-1 text-sm text-white/45">{stat.label}</div>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

function Pillars() {
  const { home } = useContent()
  const { pillars } = home
  if (pillars.items.length === 0) return null

  return (
    <section className="shell mt-24">
      <SectionHeading marker={pillars.marker} title={pillars.title} kicker={pillars.kicker} />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {pillars.items.map((pillar, index) => (
          <Reveal key={pillar.id || pillar.title} delay={index * 0.05}>
            <Card className="h-full" innerClassName="flex h-full flex-col p-6">
              <Icon name={pillar.icon} className="text-[20px] text-crimson-400" />
              <h3 className="mt-4 text-base font-semibold text-white">{pillar.title}</h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-white/55">{pillar.body}</p>
              {pillar.tags.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {pillar.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function ReviewsPreview() {
  const { home, reviews } = useContent()
  const preview = home.reviewsPreview
  const items = reviews.items.slice(0, preview.limit)
  if (items.length === 0) return null

  return (
    <section className="shell mt-24">
      <SectionHeading
        marker={preview.marker}
        title={preview.title}
        kicker={preview.kicker}
        action={
          <ActionLink to={preview.cta.to} variant="text" withArrow>
            {preview.cta.label}
          </ActionLink>
        }
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {items.map((review, index) => (
          <Reveal key={review.id || review.author} delay={index * 0.05}>
            <Card className="h-full" innerClassName="flex h-full flex-col p-6">
              <Rating value={review.rating} size="sm" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-white/65">{review.quote}</blockquote>
              <div className="mt-6 flex items-center gap-3 border-t border-white/[0.07] pt-5">
                {review.avatar ? (
                  <img
                    src={review.avatar}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-9 w-9 shrink-0 rounded-full border border-white/10 object-cover"
                  />
                ) : null}
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-white">{review.author}</div>
                  <div className="truncate text-xs text-white/40">{review.role}</div>
                </div>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Closing() {
  const { home } = useContent()
  const { closing } = home
  if (!closing.title) return null

  return (
    <section className="shell mt-24">
      <Reveal>
        <Card hover={false} innerClassName="px-6 py-12 text-center sm:px-12 sm:py-14">
          <h2 className="mx-auto max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {closing.title}
          </h2>
          {closing.body ? (
            <p className="mx-auto mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-white/60">{closing.body}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ActionLink to={closing.primaryCta.to} variant="primary">
              {closing.primaryCta.label}
            </ActionLink>
            <ActionLink to={closing.secondaryCta.to} variant="ghost">
              {closing.secondaryCta.label}
            </ActionLink>
          </div>
        </Card>
      </Reveal>
    </section>
  )
}

export function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Pillars />
      <ReviewsPreview />
      <Closing />
    </>
  )
}
