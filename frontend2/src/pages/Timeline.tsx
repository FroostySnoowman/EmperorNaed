import { useContent } from '../content/useContent'
import { Icon } from '../components/ui/Icon'
import { PageHead } from '../components/ui/PageHead'
import { Rise } from '../components/ui/Rise'

export function Timeline() {
  const { timeline } = useContent()
  const { intro, entries } = timeline

  return (
    <div className="pb-28">
      <PageHead kicker={intro.label} title={intro.title} lede={intro.lede} />

      <section className="page">
        {entries.length === 0 ? (
          <p className="copy">No entries yet.</p>
        ) : (
          <ol className="flex flex-col gap-4">
            {entries.map((entry, index) => (
              <Rise key={entry.id || `${entry.role}-${index}`}>
                <li className="bg-raised p-8 sm:p-10">
                  <div className="grid gap-8 lg:grid-cols-[12rem_1fr] lg:gap-14">
                    <div>
                      <p className="text-[clamp(2rem,3.5vw,2.75rem)] font-semibold leading-none tracking-[-0.03em] text-accent">
                        {entry.year}
                      </p>
                      <p className="kicker-mute mt-3">{entry.period}</p>
                    </div>

                    <div className="max-w-3xl">
                      <h2 className="text-big font-semibold text-white">{entry.role}</h2>
                      {entry.org ? <p className="mt-2 text-[15px] text-dim">{entry.org}</p> : null}
                      {entry.summary ? <p className="copy mt-5">{entry.summary}</p> : null}

                      {(entry.tags.length > 0 || entry.links.length > 0) && (
                        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                          {entry.tags.map((tag) => (
                            <span key={tag} className="chip !bg-ink">
                              {tag}
                            </span>
                          ))}
                          {entry.links.map((link) => (
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
                      )}
                    </div>
                  </div>
                </li>
              </Rise>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
