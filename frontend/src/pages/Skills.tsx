import { motion } from 'framer-motion'
import { useContent } from '../content/useContent'
import { EASE, inView } from '../lib/motion'
import { Icon } from '../components/ui/Icon'
import { Meter } from '../components/ui/Meter'
import { PageIntro } from '../components/ui/PageIntro'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { SpotlightCard } from '../components/ui/SpotlightCard'

export function Skills() {
  const { skills } = useContent()
  const { intro, groups, toolbox, approach } = skills

  const totalSkills = groups.reduce((sum, group) => sum + group.skills.length, 0)

  return (
    <div className="pb-8">
      <PageIntro
        marker={intro.marker}
        title={intro.title}
        kicker={intro.kicker}
        aside={
          totalSkills > 0 ? (
            <div className="plate rounded-2xl p-6">
              <div className="font-mono text-[10px] uppercase tracking-marker text-white/35">Disciplines</div>
              <div className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white">
                {String(groups.length).padStart(2, '0')}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-white/40">
                {totalSkills} tracked competencies across configuration and team leadership.
              </p>
            </div>
          ) : null
        }
      />

      <section className="shell mt-16">
        <div className="grid gap-5 lg:grid-cols-2">
          {groups.map((group, index) => (
            <Reveal key={group.id || group.title} delay={index * 0.06}>
              <SpotlightCard className="h-full rounded-2xl" innerClassName="flex h-full flex-col p-7 sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-crimson-500/20 bg-crimson-600/10 text-crimson-300">
                    <Icon name={group.icon} className="text-[21px]" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">{group.title}</h2>
                    {group.summary ? (
                      <p className="mt-2 text-sm leading-relaxed text-white/50">{group.summary}</p>
                    ) : null}
                  </div>
                </div>

                {group.skills.length > 0 ? (
                  <div className="mt-8 space-y-6">
                    {group.skills.map((skill, skillIndex) => (
                      <Meter
                        key={skill.name}
                        label={skill.name}
                        level={skill.level}
                        note={skill.note}
                        delay={skillIndex * 0.06}
                      />
                    ))}
                  </div>
                ) : null}
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {toolbox.groups.length > 0 ? (
        <section className="shell mt-28 sm:mt-36">
          <SectionHeading marker={toolbox.marker} title={toolbox.title} kicker={toolbox.kicker} />

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.05] md:grid-cols-2 xl:grid-cols-3">
            {toolbox.groups.map((group, index) => (
              <motion.div
                key={group.id || group.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.6, delay: index * 0.06, ease: EASE }}
                className="bg-ink-900/80 p-7"
              >
                <h3 className="font-mono text-[10.5px] uppercase tracking-marker text-crimson-400/85">{group.title}</h3>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span key={item} className="chip hover:border-crimson-500/35 hover:text-white">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      ) : null}

      {approach.steps.length > 0 ? (
        <section className="shell mt-28 sm:mt-36">
          <SectionHeading marker={approach.marker} title={approach.title} kicker={approach.kicker} />

          <ol className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {approach.steps.map((step, index) => (
              <Reveal key={step.id || step.title} delay={index * 0.07}>
                <div className="group relative h-full rounded-2xl border border-white/[0.07] bg-ink-900/50 p-7 transition-colors duration-500 hover:border-crimson-500/25">
                  <div className="font-display text-5xl font-extrabold leading-none tracking-tighter text-white/[0.07] transition-colors duration-500 group-hover:text-crimson-600/25">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="mt-5 font-display text-base font-bold tracking-tight text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/50">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  )
}
