import { useContent } from '../content/useContent'
import { pad2 } from '../lib/utils'
import { Band } from '../components/ui/Band'
import { PageHead } from '../components/ui/PageHead'
import { Rise } from '../components/ui/Rise'
import { SectionHead } from '../components/ui/SectionHead'

export function Skills() {
  const { skills } = useContent()
  const { intro, groups, toolbox } = skills

  return (
    <div>
      <PageHead kicker={intro.label} title={intro.title} lede={intro.lede} />

      <section className="page pb-24">
        <div className="grid gap-4 lg:grid-cols-2">
          {groups.map((group, index) => (
            <Rise key={group.id || group.title} delay={(index % 2) * 0.05}>
              <div className="h-full bg-raised p-8 sm:p-10">
                <p className="text-[13px] font-semibold tabular-nums text-accent">{pad2(index + 1)}</p>
                <h2 className="mt-4 text-big font-semibold text-white">{group.title}</h2>
                {group.summary ? <p className="copy mt-4">{group.summary}</p> : null}

                <ul className="mt-8 flex flex-col gap-3">
                  {group.items.map((item) => (
                    <li key={item} className="text-[15px] leading-[1.5] text-mute">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Rise>
          ))}
        </div>
      </section>

      {toolbox.rows.length > 0 ? (
        <Band tone="raised">
          <SectionHead kicker={toolbox.label} title={toolbox.title} lede={toolbox.lede} />
          <div className="mt-14 flex flex-col gap-10">
            {toolbox.rows.map((row) => (
              <Rise key={row.id || row.title} className="grid gap-4 sm:grid-cols-[11rem_1fr] sm:gap-10">
                <p className="kicker-mute sm:pt-2">{row.title}</p>
                <div className="flex flex-wrap gap-2">
                  {row.items.map((item) => (
                    <span key={item} className="chip !bg-ink">
                      {item}
                    </span>
                  ))}
                </div>
              </Rise>
            ))}
          </div>
        </Band>
      ) : null}
    </div>
  )
}
