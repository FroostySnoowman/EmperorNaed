import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { z } from 'zod'
import { ContentContext, type ContentIssue, type ContentState } from './ContentContext'
import {
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
  work: { file: 'content/work.json', schema: workSchema },
  gallery: { file: 'content/gallery.json', schema: gallerySchema },
  skills: { file: 'content/skills.json', schema: skillsSchema },
  reviews: { file: 'content/reviews.json', schema: reviewsSchema },
  contact: { file: 'content/contact.json', schema: contactSchema },
} as const satisfies Record<string, { file: string; schema: z.ZodType }>

type SourceKey = keyof typeof SOURCES

function issuesFromZod(file: string, error: z.ZodError): ContentIssue[] {
  return error.issues.slice(0, 12).map((issue) => ({
    file,
    path: issue.path.join('.'),
    message: issue.message,
  }))
}

async function loadSource(key: SourceKey): Promise<{ key: SourceKey; value: unknown } | ContentIssue[]> {
  const { file, schema } = SOURCES[key]
  const url = `${import.meta.env.BASE_URL}${file}`

  let raw: string
  try {
    const res = await fetch(url, { cache: 'no-cache' })
    if (!res.ok) {
      return [{ file, path: '', message: `Could not load the file (HTTP ${res.status}). Check that it exists in public/.` }]
    }
    raw = await res.text()
  } catch {
    return [{ file, path: '', message: 'Could not load the file. Check your network or the file path.' }]
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch (err) {
    const detail = err instanceof Error ? err.message : 'Unknown parse error'
    return [{ file, path: '', message: `Not valid JSON. ${detail}. A stray comma or a missing quote is usually the culprit.` }]
  }

  const result = schema.safeParse(parsed)
  if (!result.success) return issuesFromZod(file, result.error)
  return { key, value: result.data }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ContentState>({ status: 'loading', content: null, issues: [] })

  useEffect(() => {
    let cancelled = false

    void (async () => {
      const keys = Object.keys(SOURCES) as SourceKey[]
      const settled = await Promise.all(keys.map((key) => loadSource(key)))
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

  const value = useMemo(() => state, [state])
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}
