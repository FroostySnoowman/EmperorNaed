import { useEffect, useState, type ReactNode } from 'react'
import type { z } from 'zod'
import { ContentContext, type ContentIssue, type ContentState } from './ContentContext'
import {
  activeSchema,
  contactSchema,
  gallerySchema,
  homeSchema,
  reviewsSchema,
  siteSchema,
  skillsSchema,
  timelineSchema,
  workSchema,
  type Content,
} from './schema'

const SOURCES = {
  site: { file: 'content/site.json', schema: siteSchema },
  home: { file: 'content/home.json', schema: homeSchema },
  timeline: { file: 'content/timeline.json', schema: timelineSchema },
  active: { file: 'content/active.json', schema: activeSchema },
  work: { file: 'content/work.json', schema: workSchema },
  gallery: { file: 'content/gallery.json', schema: gallerySchema },
  skills: { file: 'content/skills.json', schema: skillsSchema },
  reviews: { file: 'content/reviews.json', schema: reviewsSchema },
  contact: { file: 'content/contact.json', schema: contactSchema },
} as const satisfies Record<string, { file: string; schema: z.ZodType }>

type SourceKey = keyof typeof SOURCES

async function load(key: SourceKey): Promise<{ key: SourceKey; value: unknown } | ContentIssue[]> {
  const { file, schema } = SOURCES[key]
  let raw: string
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}${file}`, { cache: 'no-cache' })
    if (!res.ok) return [{ file, path: '', message: `Could not load the file (HTTP ${res.status}).` }]
    raw = await res.text()
  } catch {
    return [{ file, path: '', message: 'Could not load the file.' }]
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch (err) {
    const detail = err instanceof Error ? err.message : 'unknown error'
    return [{ file, path: '', message: `Not valid JSON. ${detail}` }]
  }

  const result = schema.safeParse(parsed)
  if (!result.success) {
    return result.error.issues.slice(0, 10).map((issue) => ({
      file,
      path: issue.path.join('.'),
      message: issue.message,
    }))
  }
  return { key, value: result.data }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ContentState>({ status: 'loading', content: null, issues: [] })

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const keys = Object.keys(SOURCES) as SourceKey[]
      const settled = await Promise.all(keys.map(load))
      if (cancelled) return

      const issues = settled.flatMap((entry) => (Array.isArray(entry) ? entry : []))
      if (issues.length > 0) {
        setState({ status: 'error', content: null, issues })
        return
      }

      const content = Object.fromEntries(
        settled.map((entry) => {
          const ok = entry as { key: SourceKey; value: unknown }
          return [ok.key, ok.value]
        }),
      ) as Content

      setState({ status: 'ready', content, issues: [] })
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>
}
