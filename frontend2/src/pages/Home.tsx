import { motion } from 'framer-motion'
import { useContent } from '../content/useContent'
import { EASE } from '../lib/motion'
import { pad2 } from '../lib/utils'
import { ActionLink } from '../components/ui/ActionLink'
import { Band } from '../components/ui/Band'
import { Rise } from '../components/ui/Rise'
import { SectionHead } from '../components/ui/SectionHead'

function Hero() {
  const { home, site } = useContent()
  const { hero } = home

  return (
    <section className="page pb-24 pt-20 sm:pb-32 sm:pt-28">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="kicker"
      >
        {hero.role || site.brand.role}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
        className="mt-8 max-w-5xl text-balance text-mega font-semibold text-white"
      >
        {hero.statementLead} <span className="text-accent">{hero.statementAccent}</span> {hero.statementTail}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        className="mt-14 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-16"
      >
        <div>
          <p className="copy-lg max-w-read text-pretty">{hero.intro}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ActionLink to={hero.primaryCta.to} variant="fill">
              {hero.primaryCta.label}
            </ActionLink>
            <ActionLink to={hero.secondaryCta.to} variant="outline">
              {hero.secondaryCta.label}
            </ActionLink>
          </div>
        </div>

        <div className="hidden shrink-0 bg-raised p-5 lg:block">
          <img src="/media/emperor-naed.png" alt={site.brand.name} className="h-44 w-44 object-cover" />
          <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-mute">{site.brand.name}</p>
        </div>
      </motion.div>
    </section>
  )
}

function Figures() {
  const { home } = useContent()
  if (home.figures.length === 0) return null

  return (
    <Band tone="raised" className="!py-0">
      <dl className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
        {home.figures.map((figure, index) => (
          <Rise key={figure.id || figure.label} delay={index * 0.05}>
            <dd className="stat-num">{figure.value}</dd>
            <dt className="kicker-mute mt-3">{figure.label}</dt>
          </Rise>
        ))}
      </dl>
    </Band>
  )
}

function Disciplines() {
  const { home } = useContent()
  const { disciplines } = home
  if (disciplines.items.length === 0) return null

  return (
    <Band tone="ink">
      <SectionHead index="01" kicker={disciplines.label} title={disciplines.title} lede={disciplines.lede} />

      <div className="mt-20 grid gap-14 lg:grid-cols-3 lg:gap-10">
        {disciplines.items.map((item, index) => (
          <Rise key={item.id || item.title} delay={index * 0.07}>
            <p className="text-[13px] font-semibold tabular-nums text-accent">{pad2(index + 1)}</p>
            <h3 className="mt-5 text-big font-semibold text-white">{item.title}</h3>
            <p className="copy mt-5">{item.body}</p>
            {item.items.length > 0 ? (
              <ul className="mt-7 flex flex-wrap gap-2">
                {item.items.map((line) => (
                  <li key={line} className="chip">
                    {line}
                  </li>
                ))}
              </ul>
            ) : null}
          </Rise>
        ))}
      </div>
    </Band>
  )
}

function Closing() {
  const { home } = useContent()
  const { closing } = home
  if (!closing.title) return null

  return (
    <Band tone="accent">
      <Rise className="grid gap-12 lg:grid-cols-[1.4fr_auto] lg:items-end">
        <div>
          <h2 className="max-w-3xl text-balance text-huge font-semibold text-white">{closing.title}</h2>
          {closing.body ? <p className="mt-6 max-w-read text-[18px] leading-[1.6] text-white/85">{closing.body}</p> : null}
        </div>
        <div className="flex flex-wrap gap-4">
          <ActionLink to={closing.primaryCta.to} variant="onAccent">
            {closing.primaryCta.label}
          </ActionLink>
          <ActionLink
            to={closing.secondaryCta.to}
            variant="outline"
            className="!border-white/50 hover:!bg-white hover:!text-accent"
          >
            {closing.secondaryCta.label}
          </ActionLink>
        </div>
      </Rise>
    </Band>
  )
}

export function Home() {
  return (
    <>
      <Hero />
      <Figures />
      <Disciplines />
      <Closing />
    </>
  )
}
