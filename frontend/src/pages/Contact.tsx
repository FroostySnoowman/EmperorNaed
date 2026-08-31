import { AnimatePresence, motion } from 'framer-motion'
import { useId, useState, type FormEvent } from 'react'
import { useContent } from '../content/useContent'
import type { Channel } from '../content/schema'
import { cn } from '../lib/cn'
import { Card } from '../components/ui/Card'
import { CopyButton } from '../components/ui/CopyButton'
import { Icon } from '../components/ui/Icon'
import { PageIntro } from '../components/ui/PageIntro'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'

const FIELD_LIMIT = 1024

function truncate(value: string, limit: number): string {
  return value.length <= limit ? value : `${value.slice(0, limit - 1)}…`
}

type ContactValues = { name: string; contact: string; subject: string; budget: string; message: string }
type ContactLabels = { name: string; contact: string; budget: string; message: string }

function buildFields(values: ContactValues, labels: ContactLabels) {
  const fields = [
    { name: labels.name, value: truncate(values.name || 'Not given', FIELD_LIMIT), inline: true },
    { name: labels.contact, value: truncate(values.contact || 'Not given', FIELD_LIMIT), inline: true },
  ]
  if (values.budget) fields.push({ name: labels.budget, value: truncate(values.budget, FIELD_LIMIT), inline: true })
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
  if (!(response.headers.get('content-type') ?? '').includes('application/json')) return 'unavailable'
  const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null
  if (response.ok && data?.ok) return 'sent'
  if (data?.error === 'not_configured' || data?.error === 'not_found') return 'unavailable'
  return 'failed'
}

async function postToWebhook(webhook: string, values: ContactValues, labels: ContactLabels, brand: string) {
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
            color: 0xbd1f3c,
            timestamp: new Date().toISOString(),
            fields: buildFields(values, labels),
          },
        ],
      }),
    })
    return response.ok
  } catch {
    return false
  }
}

function ChannelCard({ channel }: { channel: Channel }) {
  const body = (
    <>
      <div className="flex items-start gap-4">
        <Icon name={channel.icon} className="mt-0.5 text-[18px] text-crimson-400" />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium uppercase tracking-wider text-white/40">{channel.label}</div>
          <div className="mt-1.5 break-all text-[15px] font-semibold text-white">{channel.value}</div>
          {channel.note ? <p className="mt-2 text-sm leading-relaxed text-white/50">{channel.note}</p> : null}
        </div>
      </div>
      {channel.copyable ? (
        <div className="mt-4 border-t border-white/[0.07] pt-4">
          <CopyButton value={channel.value} />
        </div>
      ) : null}
    </>
  )

  if (channel.href) {
    return (
      <a
        href={channel.href}
        target={/^https?:/i.test(channel.href) ? '_blank' : undefined}
        rel="noopener noreferrer"
        className="block h-full"
      >
        <Card className="h-full" innerClassName="p-6">
          {body}
        </Card>
      </a>
    )
  }
  return (
    <Card className="h-full" innerClassName="p-6">
      {body}
    </Card>
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
    'mt-2 w-full rounded-lg border border-white/12 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-crimson-500/60'
  const labelClass = 'text-sm font-medium text-white/70'

  return (
    <Card hover={false} innerClassName="p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-white">{form.title}</h2>
      {form.note ? <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/55">{form.note}</p> : null}

      <AnimatePresence mode="wait">
        {status === 'sent' ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-8 rounded-lg border border-emerald-400/25 bg-emerald-400/[0.06] p-6"
          >
            <h3 className="text-base font-semibold text-white">{form.successTitle}</h3>
            {form.successBody ? <p className="mt-2 text-sm text-white/60">{form.successBody}</p> : null}
            <button type="button" onClick={reset} className="btn btn-ghost mt-5">
              {form.sendAnother}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-8 space-y-5"
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
                  <select
                    id={`${baseId}-subject`}
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    className={cn(fieldClass, 'appearance-none')}
                  >
                    {form.subjects.map((option) => (
                      <option key={option} value={option} className="bg-ink-850 text-white">
                        {option}
                      </option>
                    ))}
                  </select>
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
              <p role="alert" className="rounded-lg border border-crimson-500/30 bg-crimson-600/10 px-4 py-3 text-sm text-crimson-200">
                {error}
              </p>
            ) : null}

            <div className="pt-1">
              <button type="submit" disabled={status === 'sending'} className="btn btn-primary disabled:opacity-50">
                {status === 'sending' ? form.submitSending : form.submitIdle}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Card>
  )
}

function Faq() {
  const { contact } = useContent()
  const [openId, setOpenId] = useState<string | null>(null)
  if (contact.faq.items.length === 0) return null

  return (
    <section className="shell mt-24">
      <SectionHeading marker={contact.faq.marker} title={contact.faq.title} kicker={contact.faq.kicker} />
      <div className="mt-10 max-w-3xl divide-y divide-white/10 border-y border-white/10">
        {contact.faq.items.map((item, index) => {
          const id = item.id || `faq-${index}`
          const open = openId === id
          return (
            <div key={id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : id)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span className={cn('text-[15px] font-medium transition-colors', open ? 'text-white' : 'text-white/75')}>
                  {item.question}
                </span>
                <Icon
                  name="chevron-down"
                  className={cn('shrink-0 text-[16px] text-white/40 transition-transform duration-200', open && 'rotate-180')}
                />
              </button>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm leading-relaxed text-white/55">{item.answer}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function Contact() {
  const { contact } = useContent()
  const { intro, channels, aside } = contact

  return (
    <div>
      <PageIntro
        marker={intro.marker}
        title={`${intro.title} ${intro.titleAccent}`.trim()}
        kicker={intro.kicker}
        aside={
          aside.points.length > 0 ? (
            <div>
              {aside.title ? (
                <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40">{aside.title}</h2>
              ) : null}
              <ul className="mt-4 space-y-2.5">
                {aside.points.map((point) => (
                  <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-white/55">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-crimson-500" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ) : null
        }
      />

      {channels.length > 0 ? (
        <section className="shell mt-12">
          <div className="grid gap-4 md:grid-cols-3">
            {channels.map((channel, index) => (
              <Reveal key={channel.id || channel.label} delay={index * 0.05}>
                <ChannelCard channel={channel} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {contact.form.enabled ? (
        <section className="shell mt-16">
          <Reveal className="max-w-3xl">
            <ContactForm />
          </Reveal>
        </section>
      ) : null}

      <Faq />
    </div>
  )
}
