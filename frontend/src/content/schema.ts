import { z } from 'zod'

export const iconNameSchema = z
  .enum([
    'discord',
    'github',
    'globe',
    'mail',
    'youtube',
    'twitter',
    'store',
    'server',
    'plugin',
    'shield',
    'users',
    'spark',
    'clock',
    'terminal',
    'layers',
    'gauge',
  ])
  .default('globe')

export const ctaSchema = z.object({
  label: z.string().default('Learn more'),
  to: z.string().default('/'),
})

export const linkSchema = z.object({
  label: z.string().default('Link'),
  href: z.string().default(''),
})

export const metaRowSchema = z.object({
  label: z.string().default(''),
  value: z.string().default(''),
})

export const headingSchema = z.object({
  marker: z.string().default(''),
  title: z.string().default(''),
  kicker: z.string().default(''),
})

export const navItemSchema = z.object({
  label: z.string().default(''),
  to: z.string().default('/'),
  end: z.boolean().default(false),
})

export const socialSchema = z.object({
  id: z.string().default(''),
  label: z.string().default(''),
  handle: z.string().default(''),
  href: z.string().default(''),
  icon: iconNameSchema,
})

export const siteSchema = z.object({
  brand: z.object({
    name: z.string().default('Emperor Naed'),
    monogram: z.string().default('EN'),
    avatar: z.string().default(''),
    role: z.string().default(''),
    tagline: z.string().default(''),
  }).prefault({}),
  seo: z.object({
    siteName: z.string().default(''),
    url: z.string().default(''),
    title: z.string().default(''),
    description: z.string().default(''),
    image: z.string().default('/og.png'),
    imageAlt: z.string().default(''),
    themeColor: z.string().default('#de0f3f'),
  }).prefault({}),
  availability: z.object({
    state: z.enum(['open', 'limited', 'closed']).default('open'),
    label: z.string().default(''),
  }).prefault({}),
  nav: z.array(navItemSchema).default([]),
  headerCta: ctaSchema.prefault({}),
  socials: z.array(socialSchema).default([]),
  footer: z.object({
    blurb: z.string().default(''),
    legal: z.string().default(''),
    columns: z
      .array(
        z.object({
          title: z.string().default(''),
          links: z.array(z.object({ label: z.string().default(''), to: z.string().default('/') })).default([]),
        }),
      )
      .default([]),
  }).prefault({}),
})

export const statSchema = z.object({
  id: z.string().default(''),
  value: z.string().default(''),
  label: z.string().default(''),
})

export const pillarSchema = z.object({
  id: z.string().default(''),
  title: z.string().default(''),
  body: z.string().default(''),
  icon: iconNameSchema,
  tags: z.array(z.string()).default([]),
})

export const previewSchema = headingSchema.extend({
  limit: z.number().int().min(1).max(12).default(3),
  cta: ctaSchema.prefault({}),
})

export const homeSchema = z.object({
  hero: z.object({
    badge: z.string().default(''),
    titleLead: z.string().default(''),
    titleAccent: z.string().default(''),
    intro: z.string().default(''),
    primaryCta: ctaSchema.prefault({}),
    secondaryCta: ctaSchema.prefault({}),
    scrollHint: z.string().default('Scroll'),
    panel: z.object({
      eyebrow: z.string().default(''),
      title: z.string().default(''),
      body: z.string().default(''),
      meta: z.array(metaRowSchema).default([]),
      footnote: z.string().default(''),
    }).prefault({}),
  }).prefault({}),
  stats: z.array(statSchema).default([]),
  marquee: z.object({
    label: z.string().default(''),
    items: z.array(z.string()).default([]),
  }).prefault({}),
  pillars: headingSchema.extend({
    items: z.array(pillarSchema).default([]),
  }).prefault({}),
  timelinePreview: previewSchema.prefault({}),
  workPreview: previewSchema.prefault({}),
  skillsPreview: previewSchema.prefault({}),
  reviewsPreview: previewSchema.prefault({}),
  closing: z.object({
    title: z.string().default(''),
    body: z.string().default(''),
    primaryCta: ctaSchema.prefault({}),
    secondaryCta: ctaSchema.prefault({}),
  }).prefault({}),
})

export const timelineEntrySchema = z.object({
  id: z.string().default(''),
  period: z.string().default(''),
  title: z.string().default(''),
  org: z.string().default(''),
  summary: z.string().default(''),
  status: z.enum(['completed', 'ongoing', 'archived']).default('completed'),
  tags: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  links: z.array(linkSchema).default([]),
})

export const timelineSchema = z.object({
  intro: headingSchema.prefault({}),
  entries: z.array(timelineEntrySchema).default([]),
})

export const activeProjectSchema = z.object({
  id: z.string().default(''),
  name: z.string().default(''),
  summary: z.string().default(''),
  phase: z.string().default(''),
  progress: z.number().min(0).max(100).default(0),
  started: z.string().default(''),
  eta: z.string().default(''),
  stack: z.array(z.string()).default([]),
  nextUp: z.array(z.string()).default([]),
  links: z.array(linkSchema).default([]),
})

export const showcaseItemSchema = z.object({
  id: z.string().default(''),
  title: z.string().default(''),
  category: z.string().default(''),
  year: z.string().default(''),
  summary: z.string().default(''),
  description: z.string().default(''),
  cover: z.string().default(''),
  gallery: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  links: z.array(linkSchema).default([]),
  featured: z.boolean().default(false),
})

export const workSchema = z.object({
  intro: headingSchema.prefault({}),
  active: headingSchema.extend({
    emptyLabel: z.string().default('No active projects right now.'),
    items: z.array(activeProjectSchema).default([]),
  }).prefault({}),
  showcase: headingSchema.extend({
    allLabel: z.string().default('All'),
    emptyLabel: z.string().default('Nothing here yet.'),
    items: z.array(showcaseItemSchema).default([]),
  }).prefault({}),
})

export const skillSchema = z.object({
  name: z.string().default(''),
  level: z.number().min(0).max(100).default(0),
  note: z.string().default(''),
})

export const skillGroupSchema = z.object({
  id: z.string().default(''),
  title: z.string().default(''),
  summary: z.string().default(''),
  icon: iconNameSchema,
  skills: z.array(skillSchema).default([]),
})

export const skillsSchema = z.object({
  intro: headingSchema.prefault({}),
  groups: z.array(skillGroupSchema).default([]),
  toolbox: headingSchema.extend({
    groups: z
      .array(
        z.object({
          id: z.string().default(''),
          title: z.string().default(''),
          items: z.array(z.string()).default([]),
        }),
      )
      .default([]),
  }).prefault({}),
  approach: headingSchema.extend({
    steps: z
      .array(
        z.object({
          id: z.string().default(''),
          title: z.string().default(''),
          body: z.string().default(''),
        }),
      )
      .default([]),
  }).prefault({}),
})

export const reviewSchema = z.object({
  id: z.string().default(''),
  quote: z.string().default(''),
  author: z.string().default(''),
  handle: z.string().default(''),
  role: z.string().default(''),
  platform: z.string().default(''),
  project: z.string().default(''),
  date: z.string().default(''),
  rating: z.number().min(0).max(5).default(5),
  avatar: z.string().default(''),
  images: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
})

export const reviewsSchema = z.object({
  intro: headingSchema.prefault({}),
  summary: z.object({
    show: z.boolean().default(true),
    ratingLabel: z.string().default('Average rating'),
    countLabel: z.string().default('Reviews collected'),
    repeatLabel: z.string().default('Repeat clients'),
    repeatValue: z.string().default(''),
  }).prefault({}),
  items: z.array(reviewSchema).default([]),
})

export const channelSchema = z.object({
  id: z.string().default(''),
  label: z.string().default(''),
  value: z.string().default(''),
  href: z.string().default(''),
  note: z.string().default(''),
  icon: iconNameSchema,
  copyable: z.boolean().default(false),
  primary: z.boolean().default(false),
})

export const contactSchema = z.object({
  intro: headingSchema.extend({
    titleAccent: z.string().default(''),
  }).prefault({}),
  channels: z.array(channelSchema).default([]),
  aside: z.object({
    title: z.string().default(''),
    points: z.array(z.string()).default([]),
  }).prefault({}),
  form: z.object({
    enabled: z.boolean().default(true),
    webhookUrl: z.string().default(''),
    eyebrow: z.string().default(''),
    title: z.string().default(''),
    note: z.string().default(''),
    subjects: z.array(z.string()).default([]),
    labels: z.object({
      name: z.string().default('Name'),
      contact: z.string().default('Contact'),
      subject: z.string().default('Subject'),
      budget: z.string().default('Budget'),
      message: z.string().default('Message'),
    }).prefault({}),
    placeholders: z.object({
      name: z.string().default(''),
      contact: z.string().default(''),
      subject: z.string().default(''),
      budget: z.string().default(''),
      message: z.string().default(''),
    }).prefault({}),
    submitIdle: z.string().default('Send message'),
    submitSending: z.string().default('Sending…'),
    successTitle: z.string().default('Message sent'),
    successBody: z.string().default(''),
    errorGeneric: z.string().default('Something went wrong. Please try again.'),
    errorDisabled: z.string().default('The form is not configured yet.'),
    sendAnother: z.string().default('Send another'),
  }).prefault({}),
  faq: headingSchema.extend({
    items: z
      .array(
        z.object({
          id: z.string().default(''),
          question: z.string().default(''),
          answer: z.string().default(''),
        }),
      )
      .default([]),
  }).prefault({}),
})

export type IconName = z.infer<typeof iconNameSchema>
export type Cta = z.infer<typeof ctaSchema>
export type ContentLink = z.infer<typeof linkSchema>
export type Heading = z.infer<typeof headingSchema>
export type NavItem = z.infer<typeof navItemSchema>
export type Social = z.infer<typeof socialSchema>
export type SiteContent = z.infer<typeof siteSchema>
export type Stat = z.infer<typeof statSchema>
export type Pillar = z.infer<typeof pillarSchema>
export type HomeContent = z.infer<typeof homeSchema>
export type TimelineEntry = z.infer<typeof timelineEntrySchema>
export type TimelineContent = z.infer<typeof timelineSchema>
export type ActiveProject = z.infer<typeof activeProjectSchema>
export type ShowcaseItem = z.infer<typeof showcaseItemSchema>
export type WorkContent = z.infer<typeof workSchema>
export type Skill = z.infer<typeof skillSchema>
export type SkillGroup = z.infer<typeof skillGroupSchema>
export type SkillsContent = z.infer<typeof skillsSchema>
export type Review = z.infer<typeof reviewSchema>
export type ReviewsContent = z.infer<typeof reviewsSchema>
export type Channel = z.infer<typeof channelSchema>
export type ContactContent = z.infer<typeof contactSchema>

export type Content = {
  site: SiteContent
  home: HomeContent
  timeline: TimelineContent
  work: WorkContent
  skills: SkillsContent
  reviews: ReviewsContent
  contact: ContactContent
}
