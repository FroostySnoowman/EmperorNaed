import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useContent } from '../content/useContent'
import { cn } from '../lib/cn'
import { EASE, inView } from '../lib/motion'
import { ActionLink } from '../components/ui/ActionLink'
import { BrandMark } from '../components/ui/BrandMark'
import { Icon } from '../components/ui/Icon'
import { Marquee } from '../components/ui/Marquee'
import { Rating } from '../components/ui/Rating'
import { Reveal } from '../components/ui/Reveal'
import { RevealText } from '../components/ui/RevealText'
import { SectionHeading } from '../components/ui/SectionHeading'
import { SpotlightCard } from '../components/ui/SpotlightCard'
import { StatCounter } from '../components/ui/StatCounter'

function Hero() {
  const { home, site } = useContent()
  const { hero } = home
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const haloY = useTransform(scrollYProgress, [0, 1], ['0%', '38%'])
  const haloOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.15])
  const panelY = useTransform(scrollYProgress, [0, 1], [0, -46])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0])

  return (
    <section ref={ref} className="relative overflow-hidden pb-20 pt-14 sm:pb-28 sm:pt-20 lg:pt-24">
      <motion.div
        aria-hidden
        style={{ y: haloY, opacity: haloOpacity }}
        className="pointer-events-none absolute left-1/2 top-0 h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(222,15,63,0.26),rgba(222,15,63,0.07)_38%,transparent_70%)] will-change-transform"
      />

      <div className="shell relative grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12">
        <div className="min-w-0">
          {hero.badge ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex items-center gap-2.5 rounded-full border border-crimson-500/25 bg-crimson-600/10 py-1.5 pl-2.5 pr-4"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-crimson-400" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-crimson-400" />
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-crimson-200/90">{hero.badge}</span>
            </motion.div>
          ) : null}

          <h1
            className={cn(
              'font-display text-[2.6rem] font-extrabold leading-[0.95] tracking-[-0.035em] min-[420px]:text-6xl sm:text-7xl lg:text-[5.1rem]',
              hero.badge && 'mt-7',
            )}
          >
            <span className="block">
              <RevealText text={hero.titleLead} stagger={0.06} wordClassName="text-gradient" />
            </span>
            <span className="mt-1 block">
              <RevealText text={hero.titleAccent} delay={0.18} stagger={0.06} wordClassName="text-gradient-crimson" />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42, ease: EASE }}
            className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-white/55 sm:text-lg"
          >
            {hero.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.52, ease: EASE }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <ActionLink to={hero.primaryCta.to} variant="primary" withArrow>
              {hero.primaryCta.label}
            </ActionLink>
            <ActionLink to={hero.secondaryCta.to} variant="ghost">
              {hero.secondaryCta.label}
            </ActionLink>
          </motion.div>

          {site.socials.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.66 }}
              className="mt-10 flex items-center gap-3"
            >
              <span className="font-mono text-[10px] uppercase tracking-marker text-white/25">Find me</span>
              <span className="h-px w-6 bg-white/[0.12]" aria-hidden />
              <div className="flex gap-2">
                {site.socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.handle || social.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/50 transition hover:-translate-y-0.5 hover:border-crimson-500/40 hover:text-white"
                  >
                    <Icon name={social.icon} className="text-[15px]" />
                  </a>
                ))}
              </div>
            </motion.div>
          ) : null}
        </div>

        <motion.div
          style={{ y: panelY }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.3, ease: EASE }}
          className="min-w-0"
        >
          <SpotlightCard className="rounded-[1.4rem]">
            <div className="flex items-center gap-2 border-b border-white/[0.07] px-5 py-3.5">
              <span className="h-2 w-2 rounded-full bg-crimson-500/80" />
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                {hero.panel.eyebrow}
              </span>
            </div>

            <div className="flex items-center gap-4 border-b border-white/[0.07] px-6 py-5">
              <BrandMark
                avatar={site.brand.avatar}
                monogram={site.brand.monogram}
                alt={site.brand.name}
                glow
                className="h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]"
              />
              <div className="min-w-0">
                <div className="truncate font-display text-lg font-bold tracking-tight text-white">
                  {site.brand.name}
                </div>
                {site.brand.role ? (
                  <div className="mt-0.5 truncate font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/40">
                    {site.brand.role}
                  </div>
                ) : null}
                {site.availability.label ? (
                  <div className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
                      {site.availability.label}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="p-6 sm:p-7">
              <h2 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">{hero.panel.title}</h2>
              {hero.panel.body ? (
                <p className="mt-3 text-sm leading-relaxed text-white/55">{hero.panel.body}</p>
              ) : null}

              {hero.panel.meta.length > 0 ? (
                <dl className="mt-7 space-y-3.5">
                  {hero.panel.meta.map((row, index) => (
                    <motion.div
                      key={`${row.label}-${index}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.08, ease: EASE }}
                      className="flex items-baseline gap-3"
                    >
                      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/35">{row.label}</dt>
                      <span className="h-px min-w-4 flex-1 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.16)_0_2px,transparent_2px_6px)]" />
                      <dd className="font-mono text-[12.5px] font-medium text-crimson-200">{row.value}</dd>
                    </motion.div>
                  ))}
                </dl>
              ) : null}

              {hero.panel.footnote ? (
                <p className="mt-7 border-t border-white/[0.06] pt-5 text-xs leading-relaxed text-white/35">
                  {hero.panel.footnote}
                </p>
              ) : null}
            </div>
          </SpotlightCard>
        </motion.div>
      </div>

      {hero.scrollHint ? (
        <motion.div
          style={{ opacity: cueOpacity }}
          className="pointer-events-none mt-16 hidden items-center justify-center gap-3 lg:flex"
          aria-hidden
        >
          <span className="font-mono text-[10px] uppercase tracking-marker text-white/25">{hero.scrollHint}</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="h-8 w-px bg-gradient-to-b from-crimson-500/70 to-transparent"
          />
        </motion.div>
      ) : null}
    </section>
  )
}

function StatsStrip() {
  const { home } = useContent()
  if (home.stats.length === 0) return null

  return (
    <section className="shell">
      <div className="plate grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/[0.05] lg:grid-cols-4">
        {home.stats.map((stat, index) => (
          <motion.div
            key={stat.id || stat.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.6, delay: index * 0.07, ease: EASE }}
            className="group bg-ink-900/80 px-6 py-8 transition-colors duration-300 hover:bg-ink-850/80"
          >
            <div className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <StatCounter value={stat.value} />
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="h-px w-4 bg-crimson-600/60 transition-all duration-300 group-hover:w-7" aria-hidden />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/40">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function TickerStrip() {
  const { home } = useContent()
  if (home.marquee.items.length === 0) return null

  return (
    <section className="mt-6 border-y border-white/[0.06] bg-ink-900/40 py-5">
      <div className="flex items-center gap-6">
        {home.marquee.label ? (
          <span className="shrink-0 pl-5 font-mono text-[10px] uppercase tracking-marker text-crimson-400/80 sm:pl-8">
            {home.marquee.label}
          </span>
        ) : null}
        <Marquee items={home.marquee.items} className="flex-1" />
      </div>
    </section>
  )
}

function Pillars() {
  const { home } = useContent()
  const { pillars } = home
  if (pillars.items.length === 0) return null

  return (
    <section className="shell mt-28 sm:mt-36">
      <SectionHeading marker={pillars.marker} title={pillars.title} kicker={pillars.kicker} />

      <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {pillars.items.map((pillar, index) => (
          <Reveal key={pillar.id || pillar.title} delay={index * 0.07}>
            <SpotlightCard className="h-full rounded-2xl" innerClassName="flex h-full flex-col p-7">
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-crimson-500/20 bg-crimson-600/10 text-crimson-300 transition-transform duration-500 group-hover:scale-105">
                  <Icon name={pillar.icon} className="text-[21px]" />
                </span>
                <span className="font-mono text-[11px] tracking-[0.18em] text-white/15">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-white">{pillar.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">{pillar.body}</p>

              {pillar.tags.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {pillar.tags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </SpotlightCard>
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
    <section className="shell mt-28 sm:mt-36">
      <SectionHeading
        marker={preview.marker}
        title={preview.title}
        kicker={preview.kicker}
        action={
          <ActionLink to={preview.cta.to} variant="ghost" withArrow>
            {preview.cta.label}
          </ActionLink>
        }
      />

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {items.map((review, index) => (
          <Reveal key={review.id || review.author} delay={index * 0.07}>
            <SpotlightCard className="h-full rounded-2xl" innerClassName="flex h-full flex-col p-7">
              <Icon name="quote" className="text-[22px] text-crimson-600/45" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-white/65">{review.quote}</blockquote>

              <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5">
                {review.avatar ? (
                  <img
                    src={review.avatar}
                    alt=""
                    loading="lazy" decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 shrink-0 rounded-lg border border-white/10 object-cover"
                  />
                ) : (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] font-display text-xs font-bold text-white/70">
                    {review.author.slice(0, 2).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white">{review.author}</div>
                  <div className="truncate font-mono text-[11px] text-white/35">{review.handle || review.role}</div>
                </div>
                <Rating value={review.rating} size="sm" className="ml-auto shrink-0" />
              </div>
            </SpotlightCard>
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
    <section className="shell mt-32 sm:mt-40">
      <Reveal>
        <div className="relative overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-ink-900/70 px-7 py-14 text-center shadow-crest sm:px-14 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(222,15,63,0.24),transparent_62%)]" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-hatch opacity-50" aria-hidden />

          <div className="relative">
            <h2 className="mx-auto max-w-3xl font-display text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
              <RevealText text={closing.title} wordClassName="text-gradient" />
            </h2>
            {closing.body ? (
              <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/55">{closing.body}</p>
            ) : null}

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ActionLink to={closing.primaryCta.to} variant="primary" withArrow>
                {closing.primaryCta.label}
              </ActionLink>
              <ActionLink to={closing.secondaryCta.to} variant="ghost">
                {closing.secondaryCta.label}
              </ActionLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <TickerStrip />
      <Pillars />
      <ReviewsPreview />
      <Closing />
    </>
  )
}
