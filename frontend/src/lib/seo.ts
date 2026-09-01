import type { Content } from '../content/schema'

const PAGE_KEYS = {
  '/timeline': 'timeline',
  '/active': 'active',
  '/work': 'work',
  '/gallery': 'gallery',
  '/skills': 'skills',
  '/reviews': 'reviews',
  '/contact': 'contact',
} as const

export type RouteMeta = {
  title: string
  description: string
  canonical: string
  indexable: boolean
}

function trimTitle(value: string): string {
  return value.trim().replace(/\.$/, '')
}

export function routeMeta(content: Content, pathname: string): RouteMeta {
  const { site } = content
  const base = (site.seo.url ?? '').replace(/\/+$/, '')
  const canonical = base ? `${base}${pathname === '/' ? '/' : pathname}` : ''
  const fallbackTitle = site.seo.title || site.brand.name

  if (pathname === '/') {
    return { title: fallbackTitle, description: site.seo.description, canonical, indexable: true }
  }

  const key = PAGE_KEYS[pathname as keyof typeof PAGE_KEYS]
  if (!key) {
    return {
      title: `Page not found | ${site.brand.name}`,
      description: 'That page does not exist.',
      canonical: '',
      indexable: false,
    }
  }

  const intro = content[key].intro
  const title = trimTitle(intro.title ?? '')
  return {
    title: title ? `${title} | ${site.brand.name}` : fallbackTitle,
    description: intro.lede || site.seo.description,
    canonical,
    indexable: true,
  }
}

function setMeta(attr: 'name' | 'property', key: string, value: string): void {
  if (!value) return
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', value)
}

export function applyRouteMeta(meta: RouteMeta): void {
  document.title = meta.title
  setMeta('name', 'description', meta.description)
  setMeta('property', 'og:title', meta.title)
  setMeta('property', 'og:description', meta.description)
  setMeta('name', 'twitter:title', meta.title)
  setMeta('name', 'twitter:description', meta.description)
  setMeta(
    'name',
    'robots',
    meta.indexable ? 'index, follow, max-image-preview:large, max-snippet:-1' : 'noindex, follow',
  )

  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (meta.canonical) {
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = meta.canonical
    setMeta('property', 'og:url', meta.canonical)
  } else if (link) {
    link.remove()
  }
}
