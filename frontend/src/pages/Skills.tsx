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
  const { intro, groups, toolbox } = skills

  return (
    <div className="pb-8">
      <PageIntro marker={intro.marker} title={intro.title} kicker={intro.kicker} />

      <section className="shell mt-16">
        <div className="grid gap-5 lg:grid-cols-2">
          {groups.map((group, index) => (
            <Reveal key={group.id || group.title} delay={index * 0.06}>
              <SpotlightCard className="h-full rounded-2xl" innerClassName="flex h-full flex-col p-7 sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-crimson-500/20 bg-crimson-600/10 text-crimson-300">
                    <Icon name={group.icon} className="text-[19px]" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-display text-lg font-bold tracking-tight text-white">{group.title}</h2>
                    {group.summary ? <p className="mt-1.5 text-sm leading-relaxed text-white/50">{group.summary}</p> : null}
                  </div>
                </div>

                {group.skills.length > 0 ? (
                  <div className="mt-8 space-y-5">
                    {group.skills.map((skill, skillIndex) => (
                      <Meter key={skill.name} label={skill.name} level={skill.level} delay={skillIndex * 0.06} />
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

          <div className="mt-14 space-y-8">
            {toolbox.groups.map((group, index) => (
              <motion.div
                key={group.id || group.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.55, delay: index * 0.05, ease: EASE }}
                className="flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-baseline sm:gap-10"
              >
                <h3 className="w-40 shrink-0 font-mono text-[10.5px] uppercase tracking-marker text-crimson-400/85">
                  {group.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
