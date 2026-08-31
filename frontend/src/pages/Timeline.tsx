import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { useContent } from '../content/useContent'
import type { TimelineEntry } from '../content/schema'
import { cn } from '../lib/cn'
import { EASE, inView } from '../lib/motion'
import { Icon } from '../components/ui/Icon'
import { PageIntro } from '../components/ui/PageIntro'

const STATUS_LABEL: Record<TimelineEntry['status'], string> = {
  completed: 'Completed',
  ongoing: 'Ongoing',
  archived: 'Archived',
}

export function Timeline() {
  const { timeline } = useContent()
  const railRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: railRef, offset: ['start 0.72', 'end 0.5'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  const { intro, entries } = timeline

  return (
    <div className="pb-8">
      <PageIntro marker={intro.marker} title={intro.title} kicker={intro.kicker} />

      <section className="shell mt-16">
        {entries.length === 0 ? (
          <p className="text-sm text-white/40">No timeline entries yet.</p>
        ) : (
          <div ref={railRef} className="relative max-w-3xl">
            <div className="absolute bottom-0 left-[7px] top-2 w-px bg-white/[0.08]" aria-hidden />
            <motion.div
              style={{ scaleY: fill, transformOrigin: 'top center' }}
              className="absolute bottom-0 left-[7px] top-2 w-px bg-gradient-to-b from-crimson-400 via-crimson-600 to-transparent shadow-[0_0_16px_rgba(242,46,86,0.6)]"
              aria-hidden
            />

            <ol className="space-y-14">
              {entries.map((entry, index) => (
                <motion.li
                  key={entry.id || `${entry.title}-${index}`}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inView}
                  transition={{ duration: 0.65, ease: EASE }}
                  className="relative pl-10"
                >
                  <span className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center" aria-hidden>
                    <span
                      className={cn(
                        'h-2.5 w-2.5 rotate-45 border',
                        entry.status === 'ongoing'
                          ? 'border-crimson-300 bg-crimson-500 shadow-[0_0_16px_rgba(242,46,86,0.9)]'
                          : 'border-white/25 bg-ink-800',
                      )}
                    />
                  </span>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-crimson-400/90">
                      {entry.period}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
                      {STATUS_LABEL[entry.status]}
                    </span>
                  </div>

                  <h2 className="mt-3 font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                    {entry.title}
                  </h2>
                  {entry.org ? <div className="mt-1 text-sm text-white/40">{entry.org}</div> : null}
                  {entry.summary ? (
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55">{entry.summary}</p>
                  ) : null}

                  {(entry.tags.length > 0 || entry.links.length > 0) && (
                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="font-mono text-[11px] text-white/35">
                          {tag}
                        </span>
                      ))}
                      {entry.links.map((link) => (
                        <a
                          key={`${link.label}-${link.href}`}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link inline-flex items-center gap-1.5 text-[13px] font-semibold text-crimson-300 transition hover:text-crimson-200"
                        >
                          {link.label}
                          <Icon
                            name="arrow-up-right"
                            className="text-[13px] transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </motion.li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </div>
  )
}
