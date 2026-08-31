import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

export function PageIntro({
  marker,
  title,
  kicker,
  aside,
}: {
  marker?: string
  title: string
  kicker?: string
  aside?: ReactNode
}) {
  return (
    <section className="shell pt-14 sm:pt-20">
      <Reveal className="grid gap-10 lg:grid-cols-[1.6fr_0.9fr] lg:items-end">
        <div>
          {marker ? <p className="eyebrow">{marker}</p> : null}
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          {kicker ? (
            <p className="mt-4 max-w-2xl text-pretty text-[15px] leading-relaxed text-white/60">{kicker}</p>
          ) : null}
        </div>
        {aside ? <div>{aside}</div> : null}
      </Reveal>
      <div className="rule mt-12" />
    </section>
  )
}
