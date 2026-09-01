import type { ReactNode } from 'react'
import { Rise } from './Rise'

export function PageHead({
  kicker,
  title,
  lede,
  aside,
}: {
  kicker?: string
  title: string
  lede?: string
  aside?: ReactNode
}) {
  return (
    <header className="page pb-16 pt-24 sm:pb-20 sm:pt-32">
      <Rise>
        {kicker ? <p className="kicker">{kicker}</p> : null}
        <h1 className="mt-6 max-w-4xl text-balance text-mega font-semibold text-white">{title}</h1>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          {lede ? <p className="copy-lg max-w-read text-pretty">{lede}</p> : <span />}
          {aside ? <div>{aside}</div> : null}
        </div>
      </Rise>
    </header>
  )
}
