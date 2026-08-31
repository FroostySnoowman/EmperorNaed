import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useContent } from '../content/useContent'
import type { ActiveProject, ShowcaseItem } from '../content/schema'
import { cn } from '../lib/cn'
import { EASE, inView } from '../lib/motion'
import { uniqueStrings } from '../lib/utils'
import { useLightbox } from '../lib/useLightbox'
import { Icon } from '../components/ui/Icon'
import { Lightbox } from '../components/ui/Lightbox'
import { PageIntro } from '../components/ui/PageIntro'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { SpotlightCard } from '../components/ui/SpotlightCard'

function ActiveCard({ project, index }: { project: ActiveProject; index: number }) {
  return (
    <Reveal delay={index * 0.08}>
      <SpotlightCard className="h-full rounded-2xl" innerClassName="flex h-full flex-col p-7 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-crimson-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-crimson-400" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-crimson-400" />
              </span>
              {project.phase || 'In progress'}
            </span>
            <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-white sm:text-2xl">{project.name}</h3>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-display text-3xl font-extrabold tabular-nums tracking-tight text-white">
              {project.progress}
              <span className="text-lg text-white/35">%</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">Complete</div>
          </div>
        </div>

        <div className="mt-5 h-[3px] overflow-hidden rounded-full bg-white/[0.07]">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: project.progress / 100 }}
            viewport={inView}
            transition={{ duration: 1.15, delay: 0.12, ease: EASE }}
            style={{ transformOrigin: 'left center' }}
            className="h-full w-full rounded-full bg-gradient-to-r from-crimson-700 via-crimson-500 to-crimson-300 shadow-[0_0_14px_rgba(242,46,86,0.5)]"
          />
        </div>

        {project.summary ? <p className="mt-6 text-sm leading-relaxed text-white/55">{project.summary}</p> : null}

        <div className="mt-auto pt-7">
          {project.stack.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <span key={tech} className="chip">
                  {tech}
                </span>
              ))}
            </div>
          ) : null}

          {project.links.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-4 border-t border-white/[0.06] pt-5">
              {project.links.map((link) => (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-center gap-1.5 text-[13px] font-semibold text-crimson-300 transition hover:text-crimson-200"
                >
                  {link.label}
                  <Icon name="arrow-up-right" className="text-[13px] transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </SpotlightCard>
    </Reveal>
  )
}

function ShowcaseCard({
  item,
  onOpenGallery,
}: {
  item: ShowcaseItem
  onOpenGallery: (images: string[], index: number, title: string) => void
}) {
  const images = useMemo(() => [item.cover, ...item.gallery].filter(Boolean), [item.cover, item.gallery])

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="min-w-0"
    >
      <SpotlightCard className="h-full rounded-2xl" innerClassName="flex h-full flex-col">
        {images.length > 0 ? (
          <button
            type="button"
            onClick={() => onOpenGallery(images, 0, item.title)}
            className="group/cover relative block w-full overflow-hidden"
            aria-label={`Open gallery for ${item.title}`}
          >
            <div className="aspect-[16/10] overflow-hidden bg-ink-850">
              <img
                src={item.cover || images[0]}
                alt=""
                loading="lazy" decoding="async"
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover/cover:scale-[1.06]"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/10 to-transparent" />

            {images.length > 1 ? (
              <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-ink-950/90 px-2.5 py-1 font-mono text-[10px] text-white/70">
                <Icon name="layers" className="text-[11px]" />
                {images.length}
              </span>
            ) : null}
          </button>
        ) : null}

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-2.5">
            {item.category ? <span className="chip chip-accent">{item.category}</span> : null}
            {item.year ? <span className="font-mono text-[11px] text-white/30">{item.year}</span> : null}
          </div>

          <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-white sm:text-xl">{item.title}</h3>
          {item.summary ? <p className="mt-2.5 text-sm leading-relaxed text-white/55">{item.summary}</p> : null}

          <div className="mt-auto pt-6">
            {item.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {item.links.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-4 border-t border-white/[0.06] pt-5">
                {item.links.map((link) => (
                  <a
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-1.5 text-[13px] font-semibold text-crimson-300 transition hover:text-crimson-200"
                  >
                    {link.label}
                    <Icon name="arrow-up-right" className="text-[13px] transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </SpotlightCard>
    </motion.article>
  )
}

export function Work() {
  const { work } = useContent()
  const lightbox = useLightbox()
  const [filter, setFilter] = useState('')

  const categories = useMemo(
    () => uniqueStrings(work.showcase.items.map((item) => item.category)).sort((a, b) => a.localeCompare(b)),
    [work.showcase.items],
  )

  const visible = useMemo(
    () => (filter ? work.showcase.items.filter((item) => item.category === filter) : work.showcase.items),
    [work.showcase.items, filter],
  )

  return (
    <div className="pb-8">
      <PageIntro marker={work.intro.marker} title={work.intro.title} kicker={work.intro.kicker} />

      <section className="shell mt-16">
        <SectionHeading marker={work.active.marker} title={work.active.title} kicker={work.active.kicker} />

        {work.active.items.length === 0 ? (
          <p className="mt-10 text-sm text-white/40">{work.active.emptyLabel}</p>
        ) : (
          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {work.active.items.map((project, index) => (
              <ActiveCard key={project.id || project.name} project={project} index={index} />
            ))}
          </div>
        )}
      </section>

      <section className="shell mt-28 sm:mt-36">
        <SectionHeading marker={work.showcase.marker} title={work.showcase.title} kicker={work.showcase.kicker} />

        {categories.length > 1 ? (
          <div className="no-bar mt-10 overflow-x-auto pb-1">
            <div className="inline-flex w-max items-center gap-1 rounded-full border border-white/[0.07] bg-ink-900/80 p-1.5">
              {[work.showcase.allLabel, ...categories].map((label, index) => {
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
                        layoutId="work-filter"
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
          <p className="mt-10 text-sm text-white/40">{work.showcase.emptyLabel}</p>
        ) : (
          <motion.div layout className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((item) => (
                <ShowcaseCard key={item.id || item.title} item={item} onOpenGallery={lightbox.open} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <Lightbox state={lightbox.state} onClose={lightbox.close} onIndexChange={lightbox.setIndex} />
    </div>
  )
}
