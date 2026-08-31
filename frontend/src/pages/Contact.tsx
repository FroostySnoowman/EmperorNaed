import { AnimatePresence, motion } from 'framer-motion'
import { useId, useState, type FormEvent } from 'react'
import { useContent } from '../content/useContent'
import type { Channel } from '../content/schema'
import { cn } from '../lib/cn'
import { EASE, inView } from '../lib/motion'
import { BrandMark } from '../components/ui/BrandMark'
import { CopyButton } from '../components/ui/CopyButton'
import { Icon } from '../components/ui/Icon'
import { Reveal } from '../components/ui/Reveal'
import { RevealText } from '../components/ui/RevealText'
import { SectionHeading } from '../components/ui/SectionHeading'
import { SpotlightCard } from '../components/ui/SpotlightCard'

const FIELD_LIMIT = 1024

function truncate(value: string, limit: number): string {
  return value.length <= limit ? value : `${value.slice(0, limit - 1)}…`
}

type ContactValues = {
  name: string
  contact: string
  subject: string
  budget: string
  message: string
}

type ContactLabels = {
  name: string
  contact: string
  budget: string
  message: string
}

function buildFields(values: ContactValues, labels: ContactLabels) {
  const fields = [
    { name: labels.name, value: truncate(values.name || 'Not given', FIELD_LIMIT), inline: true },
    { name: labels.contact, value: truncate(values.contact || 'Not given', FIELD_LIMIT), inline: true },
  ]
  if (values.budget) {
    fields.push({ name: labels.budget, value: truncate(values.budget, FIELD_LIMIT), inline: true })
  }
  fields.push({ name: labels.message, value: truncate(values.message || 'Not given', FIELD_LIMIT), inline: false })
  return fields
}

async function postToWorker(values: ContactValues, labels: ContactLabels): Promise<'sent' | 'unavailable' | 'failed'> {
  let response: Response
  try {
    response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, labels }),
    })
  } catch {
    return 'unavailable'
  }

  if (!(response.headers.get('content-type') ?? '').includes('application/json')) {
    return 'unavailable'
  }

  const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null

  if (response.ok && data?.ok) return 'sent'
  if (data?.error === 'not_configured' || data?.error === 'not_found') return 'unavailable'
  return 'failed'
}

async function postToWebhook(
  webhook: string,
  values: ContactValues,
  labels: ContactLabels,
  brand: string,
): Promise<boolean> {
  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `${brand} · Portfolio`,
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: truncate(values.subject || 'New enquiry', 256),
            color: 0xde0f3f,
            timestamp: new Date().toISOString(),
            fields: buildFields(values, labels),
            footer: { text: 'Sent from the portfolio contact form' },
          },
        ],
      }),
    })
    return response.ok
  } catch {
    return false
  }
}

function ChannelCard({ channel, primary }: { channel: Channel; primary: boolean }) {
  const body = (
    <>
      <div className="flex items-start gap-4">
        <span
          className={cn(
            'inline-flex shrink-0 items-center justify-center rounded-xl border transition',
            primary
              ? 'h-14 w-14 border-crimson-500/30 bg-crimson-600/15 text-crimson-200'
              : 'h-12 w-12 border-white/[0.08] bg-white/[0.03] text-white/70',
          )}
        >
          <Icon name={channel.icon} className={primary ? 'text-[24px]' : 'text-[19px]'} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] uppercase tracking-marker text-white/35">{channel.label}</div>
          <div
            className={cn(
              'mt-1.5 break-all font-display font-bold tracking-tight text-white',
              primary ? 'text-lg sm:text-2xl' : 'text-base',
            )}
          >
            {channel.value}
          </div>
          {channel.note ? <p className="mt-2.5 text-sm leading-relaxed text-white/45">{channel.note}</p> : null}
        </div>

        {channel.href ? (
          <Icon
            name="arrow-up-right"
            className="mt-1 shrink-0 text-[16px] text-white/25 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-crimson-300"
          />
        ) : null}
      </div>

      {channel.copyable ? (
        <div className="mt-5 border-t border-white/[0.06] pt-4">
          <CopyButton value={channel.value} />
        </div>
      ) : null}
    </>
  )

  const className = cn('h-full rounded-2xl', primary && 'shadow-crest')
  const inner = cn(primary ? 'p-7 sm:p-8' : 'p-6')

  if (channel.href) {
    return (
      <a href={channel.href} target={/^https?:/i.test(channel.href) ? '_blank' : undefined} rel="noopener noreferrer" className="block h-full">
        <SpotlightCard className={className} innerClassName={inner}>
          {body}
        </SpotlightCard>
      </a>
    )
  }

  return (
    <SpotlightCard className={className} innerClassName={inner}>
      {body}
    </SpotlightCard>
  )
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

function ContactForm() {
  const { contact, site } = useContent()
  const form = contact.form
  const baseId = useId()

  const [name, setName] = useState('')
  const [contactValue, setContactValue] = useState('')
  const [subject, setSubject] = useState(form.subjects[0] ?? '')
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const fallbackWebhook = String(import.meta.env.VITE_DISCORD_WEBHOOK_URL ?? '').trim() || form.webhookUrl.trim()

  const reset = () => {
    setName('')
    setContactValue('')
    setSubject(form.subjects[0] ?? '')
    setBudget('')
    setMessage('')
    setStatus('idle')
    setError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (honeypot) {
      setStatus('sent')
      return
    }

    setStatus('sending')

    const values = {
      name: name.trim(),
      contact: contactValue.trim(),
      subject: subject.trim(),
      budget: budget.trim(),
      message: message.trim(),
    }

    const viaWorker = await postToWorker(values, form.labels)

    if (viaWorker === 'sent') {
      setStatus('sent')
      return
    }

    if (viaWorker === 'failed') {
      setStatus('error')
      setError(form.errorGeneric)
      return
    }

    if (!fallbackWebhook) {
      setStatus('error')
      setError(form.errorDisabled)
      return
    }

    const sent = await postToWebhook(fallbackWebhook, values, form.labels, site.brand.name)
    if (sent) {
      setStatus('sent')
    } else {
      setStatus('error')
      setError(form.errorGeneric)
    }
  }

  const fieldClass =
    'mt-2 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-crimson-500/45 focus:bg-white/[0.05]'
  const labelClass = 'font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/40'

  return (
    <SpotlightCard className="rounded-[1.4rem]" innerClassName="p-7 sm:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(222,15,63,0.14),transparent_55%)]" aria-hidden />

      <div className="relative">
        <div className="flex items-center gap-4">
          <BrandMark
            avatar={site.brand.avatar}
            monogram={site.brand.monogram}
            alt={site.brand.name}
            className="h-12 w-12"
          />
          <div className="min-w-0">
            {form.eyebrow ? <div className="marker">{form.eyebrow}</div> : null}
            <div className="mt-1.5 truncate text-sm text-white/45">
              Goes straight to {site.brand.name}
            </div>
          </div>
        </div>
        <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{form.title}</h2>
        {form.note ? <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/50">{form.note}</p> : null}

        <AnimatePresence mode="wait">
          {status === 'sent' ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="mt-10 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.07] p-7 text-center"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-emerald-400/35 bg-emerald-400/10 text-emerald-300">
                <Icon name="check" className="text-[20px]" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-white">{form.successTitle}</h3>
              {form.successBody ? <p className="mt-2 text-sm text-white/55">{form.successBody}</p> : null}
              <button type="button" onClick={reset} className="btn btn-ghost btn-sheen mt-7">
                <span className="relative z-[1]">{form.sendAnother}</span>
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-9 space-y-5"
            >
              <div className="absolute -left-[9999px]" aria-hidden>
                <label htmlFor={`${baseId}-company`}>Company</label>
                <input
                  id={`${baseId}-company`}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${baseId}-name`} className={labelClass}>
                    {form.labels.name}
                  </label>
                  <input
                    id={`${baseId}-name`}
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={form.placeholders.name}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor={`${baseId}-contact`} className={labelClass}>
                    {form.labels.contact}
                  </label>
                  <input
                    id={`${baseId}-contact`}
                    type="text"
                    required
                    value={contactValue}
                    onChange={(event) => setContactValue(event.target.value)}
                    placeholder={form.placeholders.contact}
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${baseId}-subject`} className={labelClass}>
                    {form.labels.subject}
                  </label>
                  {form.subjects.length > 0 ? (
                    <div className="relative">
                      <select
                        id={`${baseId}-subject`}
                        value={subject}
                        onChange={(event) => setSubject(event.target.value)}
                        className={cn(fieldClass, 'appearance-none pr-10')}
                      >
                        {form.subjects.map((option) => (
                          <option key={option} value={option} className="bg-ink-850 text-white">
                            {option}
                          </option>
                        ))}
                      </select>
                      <Icon
                        name="chevron-down"
                        className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-[15px] text-white/35"
                      />
                    </div>
                  ) : (
                    <input
                      id={`${baseId}-subject`}
                      type="text"
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                      placeholder={form.placeholders.subject}
                      className={fieldClass}
                    />
                  )}
                </div>

                <div>
                  <label htmlFor={`${baseId}-budget`} className={labelClass}>
                    {form.labels.budget}
                  </label>
                  <input
                    id={`${baseId}-budget`}
                    type="text"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    placeholder={form.placeholders.budget}
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`${baseId}-message`} className={labelClass}>
                  {form.labels.message}
                </label>
                <textarea
                  id={`${baseId}-message`}
                  required
                  minLength={10}
                  rows={6}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={form.placeholders.message}
                  className={cn(fieldClass, 'resize-y leading-relaxed')}
                />
              </div>

              {status === 'error' && error ? (
                <p
                  role="alert"
                  className="rounded-xl border border-crimson-500/30 bg-crimson-600/10 px-4 py-3 text-sm text-crimson-100"
                >
                  {error}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/25">
                  Delivered straight to Discord
                </p>
                <button type="submit" disabled={status === 'sending'} className="btn btn-primary btn-sheen disabled:opacity-50">
                  <span className="relative z-[1]">{status === 'sending' ? form.submitSending : form.submitIdle}</span>
                  {status === 'sending' ? null : <Icon name="arrow-right" className="relative z-[1] text-[15px]" />}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </SpotlightCard>
  )
}

function Faq() {
  const { contact } = useContent()
  const [openId, setOpenId] = useState<string | null>(null)

  if (contact.faq.items.length === 0) return null

  return (
    <section className="shell mt-28 sm:mt-36">
      <SectionHeading marker={contact.faq.marker} title={contact.faq.title} kicker={contact.faq.kicker} />

      <div className="mt-12 divide-y divide-white/[0.06] border-y border-white/[0.06]">
        {contact.faq.items.map((item, index) => {
          const id = item.id || `faq-${index}`
          const open = openId === id
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : id)}
                aria-expanded={open}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span
                  className={cn(
                    'font-display text-base font-semibold tracking-tight transition-colors sm:text-lg',
                    open ? 'text-white' : 'text-white/70 group-hover:text-white',
                  )}
                >
                  {item.question}
                </span>
                <span
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300',
                    open
                      ? 'rotate-180 border-crimson-500/40 bg-crimson-600/15 text-crimson-300'
                      : 'border-white/10 text-white/40 group-hover:border-crimson-500/30',
                  )}
                >
                  <Icon name="chevron-down" className="text-[14px]" />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.34, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-3xl pb-7 text-sm leading-relaxed text-white/55">{item.answer}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export function Contact() {
  const { contact } = useContent()
  const { intro, channels, aside } = contact

  const primary = channels.find((channel) => channel.primary) ?? null
  const secondary = channels.filter((channel) => channel !== primary)

  return (
    <div className="pb-8">
      <section className="shell relative pt-16 sm:pt-24">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div className="min-w-0">
            {intro.marker ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="marker"
              >
                <span className="h-px w-7 bg-gradient-to-r from-transparent to-crimson-500" aria-hidden />
                {intro.marker}
              </motion.div>
            ) : null}

            <h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              <RevealText text={intro.title} wordClassName="text-gradient" />{' '}
              {intro.titleAccent ? (
                <RevealText text={intro.titleAccent} delay={0.14} wordClassName="text-gradient-crimson" />
              ) : null}
            </h1>

            {intro.kicker ? (
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
                className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/55 sm:text-lg"
              >
                {intro.kicker}
              </motion.p>
            ) : null}
          </div>

          {aside.points.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.26, ease: EASE }}
              className="plate rounded-2xl p-6"
            >
              {aside.title ? (
                <div className="font-mono text-[10px] uppercase tracking-marker text-white/35">{aside.title}</div>
              ) : null}
              <ul className="mt-5 space-y-4">
                {aside.points.map((point, index) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed text-white/60">
                    <span
                      className={cn(
                        'mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45',
                        index === 0 ? 'bg-crimson-500 shadow-[0_0_10px_rgba(242,46,86,0.8)]' : 'bg-white/25',
                      )}
                      aria-hidden
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : null}
        </div>

        <div className="rule-fade mt-14" />
      </section>

      {channels.length > 0 ? (
        <section className="shell mt-16">
          <div className="grid gap-5">
            {primary ? (
              <Reveal className="group">
                <ChannelCard channel={primary} primary />
              </Reveal>
            ) : null}

            {secondary.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {secondary.map((channel, index) => (
                  <Reveal key={channel.id || channel.label} delay={index * 0.07} className="group h-full">
                    <ChannelCard channel={channel} primary={false} />
                  </Reveal>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {contact.form.enabled ? (
        <section className="shell mt-20">
          <Reveal>
            <ContactForm />
          </Reveal>
        </section>
      ) : null}

      <Faq />
    </div>
  )
}
