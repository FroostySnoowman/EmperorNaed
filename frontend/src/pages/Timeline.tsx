import { useContent } from '../content/useContent'
import type { TimelineEntry } from '../content/schema'
import { Icon } from '../components/ui/Icon'
import { PageIntro } from '../components/ui/PageIntro'
import { Reveal } from '../components/ui/Reveal'

const STATUS_LABEL: Record<TimelineEntry['status'], string> = {
  completed: 'Completed',
  ongoing: 'Ongoing',
  archived: 'Archived',
}

export function Timeline() {
  const { timeline } = useContent()
  const { intro, entries } = timeline

  return (
    <div>
      <PageIntro marker={intro.marker} title={intro.title} kicker={intro.kicker} />

      <section className="shell mt-12">
        {entries.length === 0 ? (
          <p className="text-sm text-white/40">No timeline entries yet.</p>
        ) : (
          <ol className="max-w-3xl divide-y divide-white/10 border-t border-white/10">
            {entries.map((entry, index) => (
              <Reveal key={entry.id || `${entry.title}-${index}`} delay={0} className="py-9">
                <li>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-sm font-medium text-crimson-400">{entry.period}</span>
                    <span className="text-xs text-white/35">{STATUS_LABEL[entry.status]}</span>
                  </div>

                  <h2 className="mt-3 text-lg font-semibold tracking-tight text-white">{entry.title}</h2>
                  {entry.org ? <div className="mt-1 text-sm text-white/45">{entry.org}</div> : null}
                  {entry.summary ? (
                    <p className="mt-3 text-[15px] leading-relaxed text-white/60">{entry.summary}</p>
                  ) : null}

                  {(entry.tags.length > 0 || entry.links.length > 0) && (
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                      {entry.links.map((link) => (
                        <a
                          key={`${link.label}-${link.href}`}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-accent ml-1"
                        >
                          {link.label}
                          <Icon name="arrow-up-right" className="text-[13px]" />
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              </Reveal>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
