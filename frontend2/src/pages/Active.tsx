import { motion } from 'framer-motion'
import { useContent } from '../content/useContent'
import { EASE, inView } from '../lib/motion'
import { pad2 } from '../lib/utils'
import { PageHead } from '../components/ui/PageHead'
import { Rise } from '../components/ui/Rise'

export function Active() {
  const { active } = useContent()
  const { intro, items } = active

  return (
    <div className="pb-28">
      <PageHead
        kicker={intro.label}
        title={intro.title}
        lede={intro.lede}
        aside={
          items.length > 0 ? (
            <div className="bg-accent px-8 py-6">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/80">In progress</p>
              <p className="mt-2 text-[3rem] font-semibold leading-none tabular-nums text-white">{pad2(items.length)}</p>
            </div>
          ) : null
        }
      />

      <section className="page">
        {items.length === 0 ? (
          <p className="copy">{active.emptyLabel}</p>
        ) : (
          <ol className="flex flex-col gap-4">
            {items.map((item) => (
              <Rise key={item.id || item.name}>
                <li className="bg-raised p-8 sm:p-10">
                  <div className="flex flex-wrap items-start justify-between gap-6">
                    <div className="min-w-0">
                      <p className="kicker">{item.phase}</p>
                      <h2 className="mt-3 text-big font-semibold text-white">{item.name}</h2>
                      {item.client ? <p className="mt-2 text-[15px] text-dim">{item.client}</p> : null}
                    </div>
                    <p className="text-[2.5rem] font-semibold leading-none tabular-nums tracking-[-0.03em] text-white">
                      {item.progress}
                      <span className="text-[1.25rem] text-dim">%</span>
                    </p>
                  </div>

                  <div className="mt-8 h-2 w-full bg-ink">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: item.progress / 100 }}
                      viewport={inView}
                      transition={{ duration: 0.8, ease: EASE }}
                      className="h-full w-full origin-left bg-accent"
                    />
                  </div>

                  {item.summary ? <p className="copy mt-8 max-w-3xl">{item.summary}</p> : null}

                  <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-5">
                    {item.started ? (
                      <div>
                        <p className="kicker-mute">Started</p>
                        <p className="mt-1.5 text-[15px] font-medium text-white">{item.started}</p>
                      </div>
                    ) : null}
                    {item.target ? (
                      <div>
                        <p className="kicker-mute">Target</p>
                        <p className="mt-1.5 text-[15px] font-medium text-white">{item.target}</p>
                      </div>
                    ) : null}
                    {item.stack.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {item.stack.map((tech) => (
                          <span key={tech} className="chip !bg-ink">
                            {tech}
                          </span>
                        ))}
                      </div>
                    ) : null}
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
