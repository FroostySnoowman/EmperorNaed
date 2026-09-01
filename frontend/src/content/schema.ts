import { z } from 'zod'

const str = (fallback = '') => z.string().default(fallback)

export const iconNameSchema = z
  .enum(['discord', 'github', 'store', 'youtube', 'mail', 'globe'])
  .default('globe')

export const ctaSchema = z.object({ label: str('Learn more'), to: str('/') })
export const linkSchema = z.object({ label: str('Link'), href: str('') })
export const introSchema = z.object({ label: str(''), title: str(''), lede: str('') })

export const siteSchema = z.object({
  brand: z
    .object({
      name: str('Emperor Naed'),
      initials: str('EN'),
      role: str(''),
      summary: str(''),
    })
    .prefault({}),
  seo: z
    .object({
      siteName: str(''),
      url: str(''),
      title: str(''),
      description: str(''),
      image: str('/og.png'),
      imageAlt: str(''),
      themeColor: str('#e11d2e'),
    })
    .prefault({}),
  nav: z.array(z.object({ label: str(''), to: str('/'), end: z.boolean().default(false) })).default([]),
  headerCta: ctaSchema.prefault({}),
  socials: z
    .array(z.object({ id: str(''), label: str(''), handle: str(''), href: str(''), icon: iconNameSchema }))
    .default([]),
  footer: z
    .object({
      note: str(''),
      legal: str(''),
      columns: z
        .array(z.object({ title: str(''), links: z.array(z.object({ label: str(''), to: str('/') })).default([]) }))
        .default([]),
    })
    .prefault({}),
})

export const homeSchema = z.object({
  hero: z
    .object({
      role: str(''),
      statementLead: str(''),
      statementAccent: str(''),
      statementTail: str(''),
      intro: str(''),
      primaryCta: ctaSchema.prefault({}),
      secondaryCta: ctaSchema.prefault({}),
    })
    .prefault({}),
  figures: z.array(z.object({ id: str(''), value: str(''), label: str('') })).default([]),
  disciplines: introSchema
    .extend({
      items: z
        .array(z.object({ id: str(''), title: str(''), body: str(''), items: z.array(z.string()).default([]) }))
        .default([]),
    })
    .prefault({}),
  closing: z
    .object({ title: str(''), body: str(''), primaryCta: ctaSchema.prefault({}), secondaryCta: ctaSchema.prefault({}) })
    .prefault({}),
})

export const timelineSchema = z.object({
  intro: introSchema.prefault({}),
  entries: z
    .array(
      z.object({
        id: str(''),
        year: str(''),
        period: str(''),
        role: str(''),
        org: str(''),
        summary: str(''),
        tags: z.array(z.string()).default([]),
        links: z.array(linkSchema).default([]),
      }),
    )
    .default([]),
})

export const activeSchema = z.object({
  intro: introSchema.prefault({}),
  emptyLabel: str('Nothing in progress right now.'),
  items: z
    .array(
      z.object({
        id: str(''),
        name: str(''),
        client: str(''),
        phase: str(''),
        progress: z.number().min(0).max(100).default(0),
        started: str(''),
        target: str(''),
        summary: str(''),
        stack: z.array(z.string()).default([]),
      }),
    )
    .default([]),
})

export const workSchema = z.object({
  intro: introSchema.prefault({}),
  allLabel: str('All'),
  emptyLabel: str('Nothing here yet.'),
  items: z
    .array(
      z.object({
        id: str(''),
        title: str(''),
        category: str(''),
        year: str(''),
        summary: str(''),
        image: str(''),
        images: z.array(z.string()).default([]),
        tags: z.array(z.string()).default([]),
        links: z.array(linkSchema).default([]),
      }),
    )
    .default([]),
})

export const skillsSchema = z.object({
  intro: introSchema.prefault({}),
  groups: z
    .array(z.object({ id: str(''), title: str(''), summary: str(''), items: z.array(z.string()).default([]) }))
    .default([]),
  toolbox: introSchema
    .extend({
      rows: z.array(z.object({ id: str(''), title: str(''), items: z.array(z.string()).default([]) })).default([]),
    })
    .prefault({}),
})

export const galleryItemSchema = z.object({
  id: str(''),
  src: str(''),
  alt: str(''),
  caption: str(''),
  category: str(''),
})

export const gallerySchema = z.object({
  intro: introSchema.prefault({}),
  allLabel: str('All'),
  emptyLabel: str('Nothing here yet.'),
  emptyCta: ctaSchema.prefault({}),
  items: z.array(galleryItemSchema).default([]),
})

export const reviewsSchema = z.object({
  intro: introSchema.prefault({}),
  items: z
    .array(
      z.object({
        id: str(''),
        quote: str(''),
        author: str(''),
        role: str(''),
        org: str(''),
        date: str(''),
      }),
    )
    .default([]),
})

export const contactSchema = z.object({
  intro: introSchema.prefault({}),
  channels: z
    .array(z.object({ id: str(''), label: str(''), value: str(''), href: str(''), note: str(''), icon: iconNameSchema }))
    .default([]),
})

export type IconName = z.infer<typeof iconNameSchema>
export type Cta = z.infer<typeof ctaSchema>
export type ContentLink = z.infer<typeof linkSchema>
export type SiteContent = z.infer<typeof siteSchema>
export type HomeContent = z.infer<typeof homeSchema>
export type TimelineContent = z.infer<typeof timelineSchema>
export type TimelineEntry = TimelineContent['entries'][number]
export type ActiveContent = z.infer<typeof activeSchema>
export type ActiveItem = ActiveContent['items'][number]
export type WorkContent = z.infer<typeof workSchema>
export type WorkItem = WorkContent['items'][number]
export type SkillsContent = z.infer<typeof skillsSchema>
export type GalleryItem = z.infer<typeof galleryItemSchema>
export type GalleryContent = z.infer<typeof gallerySchema>
export type ReviewsContent = z.infer<typeof reviewsSchema>
export type ContactContent = z.infer<typeof contactSchema>
export type Channel = ContactContent['channels'][number]

export type Content = {
  site: SiteContent
  home: HomeContent
  timeline: TimelineContent
  active: ActiveContent
  work: WorkContent
  gallery: GalleryContent
  skills: SkillsContent
  reviews: ReviewsContent
  contact: ContactContent
}
