interface Env {
  DISCORD_WEBHOOK_URL?: string
}

interface ContactPayload {
  name?: unknown
  contact?: unknown
  subject?: unknown
  budget?: unknown
  message?: unknown
  labels?: Record<string, unknown>
}

const EMBED_COLOUR = 0xde0f3f
const FIELD_LIMIT = 1024
const LABEL_LIMIT = 64
const TITLE_LIMIT = 200
const MAX_BODY_BYTES = 16_000

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })
}

function text(value: unknown, limit: number): string {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  return trimmed.length <= limit ? trimmed : `${trimmed.slice(0, limit - 1)}…`
}

function label(labels: Record<string, unknown> | undefined, key: string, fallback: string): string {
  return text(labels?.[key], LABEL_LIMIT) || fallback
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { allow: 'POST, OPTIONS' } })
  }

  if (request.method !== 'POST') {
    return json({ ok: false, error: 'method_not_allowed' }, 405)
  }

  const webhook = env.DISCORD_WEBHOOK_URL?.trim()
  if (!webhook) {
    return json({ ok: false, error: 'not_configured' }, 503)
  }

  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: 'too_large' }, 413)
  }

  let payload: ContactPayload
  try {
    payload = JSON.parse(raw) as ContactPayload
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400)
  }

  const name = text(payload.name, FIELD_LIMIT)
  const contact = text(payload.contact, FIELD_LIMIT)
  const message = text(payload.message, FIELD_LIMIT)
  const subject = text(payload.subject, TITLE_LIMIT)
  const budget = text(payload.budget, FIELD_LIMIT)

  if (!name || !contact || message.length < 10) {
    return json({ ok: false, error: 'validation' }, 422)
  }

  const labels = payload.labels
  const fields = [
    { name: label(labels, 'name', 'Name'), value: name, inline: true },
    { name: label(labels, 'contact', 'Contact'), value: contact, inline: true },
  ]
  if (budget) {
    fields.push({ name: label(labels, 'budget', 'Budget'), value: budget, inline: true })
  }
  fields.push({ name: label(labels, 'message', 'Message'), value: message, inline: false })

  let upstream: Response
  try {
    upstream = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        username: 'Portfolio contact form',
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: subject || 'New enquiry',
            color: EMBED_COLOUR,
            timestamp: new Date().toISOString(),
            fields,
            footer: { text: 'Sent from the portfolio contact form' },
          },
        ],
      }),
    })
  } catch {
    return json({ ok: false, error: 'upstream_unreachable' }, 502)
  }

  if (!upstream.ok) {
    return json({ ok: false, error: 'upstream_failed' }, 502)
  }

  return json({ ok: true })
}
