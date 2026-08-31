import { useContent } from '../content/useContent'
import { Card } from '../components/ui/Card'
import { Icon } from '../components/ui/Icon'
import { PageIntro } from '../components/ui/PageIntro'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'

export function Skills() {
  const { skills } = useContent()
  const { intro, groups, toolbox } = skills

  return (
    <div>
      <PageIntro marker={intro.marker} title={intro.title} kicker={intro.kicker} />

      <section className="shell mt-12">
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group, index) => (
            <Reveal key={group.id || group.title} delay={index * 0.05}>
              <Card className="h-full" innerClassName="p-6">
                <div className="flex items-center gap-3">
                  <Icon name={group.icon} className="text-[18px] text-crimson-400" />
                  <h2 className="text-base font-semibold text-white">{group.title}</h2>
                </div>
                {group.summary ? <p className="mt-2.5 text-sm leading-relaxed text-white/55">{group.summary}</p> : null}

                {group.skills.length > 0 ? (
                  <ul className="mt-5 space-y-2.5 border-t border-white/[0.07] pt-5">
                    {group.skills.map((skill) => (
                      <li key={skill.name} className="flex items-start gap-2.5 text-sm text-white/70">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-crimson-500" aria-hidden />
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {toolbox.groups.length > 0 ? (
        <section className="shell mt-24">
          <SectionHeading marker={toolbox.marker} title={toolbox.title} kicker={toolbox.kicker} />
          <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {toolbox.groups.map((group, index) => (
              <Reveal
                key={group.id || group.title}
                delay={index * 0.04}
                className="flex flex-col gap-3 py-6 sm:flex-row sm:items-baseline sm:gap-10"
              >
                <h3 className="w-44 shrink-0 text-sm font-medium text-white/45">{group.title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span key={item} className="tag">
                      {item}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
