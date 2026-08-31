import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { useContent } from '../content/useContent'
import { cn } from '../lib/cn'
import { EASE, inView } from '../lib/motion'
import { Icon } from '../components/ui/Icon'
import { PageIntro } from '../components/ui/PageIntro'
import { SpotlightCard } from '../components/ui/SpotlightCard'
import type { TimelineEntry } from '../content/schema'

const STATUS_LABEL: Record<TimelineEntry['status'], string> = {
  completed: 'Completed',
  ongoing: 'Ongoing',
  archived: 'Archived',
}

const STATUS_STYLE: Record<TimelineEntry['status'], string> = {
  completed: 'border-white/[0.12] bg-white/[0.04] text-white/50',
  ongoing: 'border-crimson-500/35 bg-crimson-600/[0.12] text-crimson-200',
  archived: 'border-white/[0.08] bg-white/[0.02] text-white/30',
}

function EntryCard({ entry }: { entry: TimelineEntry }) {
  return (
    <SpotlightCard className="rounded-2xl" innerClassName="p-6 sm:p-7">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-crimson-400/90">{entry.period}</span>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]',
            STATUS_STYLE[entry.status],
          )}
        >
          {entry.status === 'ongoing' ? (
            <span className="relative flex h-1 w-1">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-crimson-400" />
              <span className="relative inline-flex h-1 w-1 rounded-full bg-crimson-400" />
            </span>
          ) : null}
          {STATUS_LABEL[entry.status]}
        </span>
      </div>

      <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-white sm:text-2xl">{entry.title}</h3>
      {entry.org ? <div className="mt-1.5 text-sm text-white/40">{entry.org}</div> : null}
      {entry.summary ? <p className="mt-4 text-sm leading-relaxed text-white/55">{entry.summary}</p> : null}

      {entry.highlights.length > 0 ? (
        <ul className="mt-5 space-y-2.5">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3 text-sm leading-relaxed text-white/50">
              <span className="mt-[7px] h-1 w-1 shrink-0 rotate-45 bg-crimson-500/80" aria-hidden />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {entry.tags.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      {entry.links.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-4 border-t border-white/[0.06] pt-5">
          {entry.links.map((link) => (
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
    </SpotlightCard>
  )
}

export function Timeline() {
  const { timeline } = useContent()
  const railRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: railRef, offset: ['start 0.72', 'end 0.45'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  const { intro, entries } = timeline

  return (
    <div className="pb-8">
      <PageIntro
        marker={intro.marker}
        title={intro.title}
        kicker={intro.kicker}
        aside={
          entries.length > 0 ? (
            <div className="plate rounded-2xl p-6">
              <div className="font-mono text-[10px] uppercase tracking-marker text-white/35">Entries</div>
              <div className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white">
                {String(entries.length).padStart(2, '0')}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-white/40">
                Every engagement, newest first — from first brief to handover.
              </p>
            </div>
          ) : null
        }
      />

      <section className="shell mt-16">
        {entries.length === 0 ? (
          <p className="text-sm text-white/40">No timeline entries yet.</p>
        ) : (
          <div ref={railRef} className="relative">
            <div className="absolute bottom-0 left-[7px] top-2 w-px bg-white/[0.08] lg:left-1/2 lg:-translate-x-1/2" aria-hidden />
            <motion.div
              style={{ scaleY: fill, transformOrigin: 'top center' }}
              className="absolute bottom-0 left-[7px] top-2 w-px bg-gradient-to-b from-crimson-400 via-crimson-600 to-transparent shadow-[0_0_16px_rgba(242,46,86,0.6)] lg:left-1/2 lg:-translate-x-1/2"
              aria-hidden
            />

            <ol className="space-y-12 lg:space-y-16">
              {entries.map((entry, index) => {
                const alignRight = index % 2 === 1
                return (
                  <li
                    key={entry.id || `${entry.title}-${index}`}
                    className="relative pl-9 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:gap-10 lg:pl-0"
                  >
                    <span
                      className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center lg:relative lg:left-auto lg:top-2 lg:order-2 lg:h-4 lg:w-4"
                      aria-hidden
                    >
                      <motion.span
                        initial={{ scale: 0, rotate: 0 }}
                        whileInView={{ scale: 1, rotate: 45 }}
                        viewport={inView}
                        transition={{ duration: 0.5, ease: EASE }}
                        className={cn(
                          'h-2.5 w-2.5 border',
                          entry.status === 'ongoing'
                            ? 'border-crimson-300 bg-crimson-500 shadow-[0_0_16px_rgba(242,46,86,0.9)]'
                            : 'border-white/25 bg-ink-800',
                        )}
                      />
                    </span>

                    <motion.div
                      initial={{ opacity: 0, y: 26 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={inView}
                      transition={{ duration: 0.7, ease: EASE }}
                      className={cn(
                        'mt-0 min-w-0',
                        alignRight ? 'lg:order-3' : 'lg:order-1 lg:col-start-1',
                      )}
                    >
                      <EntryCard entry={entry} />
                    </motion.div>

                    <span className={cn('hidden lg:block', alignRight ? 'lg:order-1' : 'lg:order-3')} aria-hidden />
                  </li>
                )
              })}
            </ol>
          </div>
        )}
      </section>
    </div>
  )
}
